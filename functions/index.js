const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

admin.initializeApp();

const db = admin.firestore();

exports.generateCertificate = onDocumentCreated(
  'examAttempts/{attemptId}',
  async (event) => {
    const attempt = event.data.data();
    if (!attempt.passed) return;

    const { userId, courseId, score, attemptedAt } = attempt;

    // Idempotency — skip if already generated
    const certRef = db.doc(`certificates/${userId}_${courseId}`);
    if ((await certRef.get()).exists) return;

    const [courseSnap, userSnap] = await Promise.all([
      db.doc(`courses/${courseId}`).get(),
      db.doc(`users/${userId}`).get()
    ]);

    if (!courseSnap.exists || !userSnap.exists) {
      console.error('Course or user not found', { courseId, userId });
      return;
    }

    const course = courseSnap.data();
    const user = userSnap.data();
    const completionDate = attemptedAt?.toDate() ?? new Date();
    const verificationCode = buildVerificationCode(userId, courseId);

    const pdfBytes = await buildCertificate({
      studentName: user.name || 'Participant',
      courseTitle: course.title,
      creditHours: course.creditHours ?? 1,
      creditType: course.creditType ?? '',
      licenseType: user.licenseType ?? '',
      licenseNumber: user.licenseNumber ?? '',
      licenseState: user.licenseState ?? '',
      completionDate,
      score: Math.round(score),
      verificationCode,
      providerApprovalNumber: course.providerApprovalNumber ?? ''
    });

    // Upload PDF to Storage
    const bucket = admin.storage().bucket();
    const filePath = `certificates/${userId}/${courseId}.pdf`;
    const file = bucket.file(filePath);
    await file.save(Buffer.from(pdfBytes), {
      metadata: { contentType: 'application/pdf' }
    });
    await file.makePublic();
    const pdfUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    // Write Firestore record (only Cloud Functions write here — enforced by rules)
    await certRef.set({
      userId,
      courseId,
      courseName: course.title,
      creditHours: course.creditHours ?? 1,
      creditType: course.creditType ?? '',
      score,
      issuedAt: admin.firestore.FieldValue.serverTimestamp(),
      verificationCode,
      pdfUrl,
      providerApprovalNumber: course.providerApprovalNumber ?? ''
    });

    console.log(`Certificate issued: ${verificationCode}`);
  }
);

function buildVerificationCode(userId, courseId) {
  const ts = Date.now().toString(36).toUpperCase();
  const u = userId.slice(0, 5).toUpperCase();
  const c = courseId.slice(0, 5).toUpperCase();
  return `PYR-${u}-${c}-${ts}`;
}

// ── PDF generation ────────────────────────────────────────────────────────────

const GREEN   = rgb(0.451, 0.875, 0.569);  // #73DF91
const DARK    = rgb(0.267, 0.267, 0.267);  // #444
const MUTED   = rgb(0.533, 0.533, 0.533);  // #888
const WHITE   = rgb(1, 1, 1);
const W = 792;  // landscape letter
const H = 612;

async function buildCertificate(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([W, H]);

  const bold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italic  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { drawText, drawLine, drawRect } = makeDrawHelpers(page);

  // ── Outer border ──
  drawRect(18, 18, W - 36, H - 36, { borderColor: GREEN, borderWidth: 3, fill: false });
  drawRect(24, 24, W - 48, H - 48, { borderColor: GREEN, borderWidth: 0.75, fill: false });

  // ── Green header band ──
  drawRect(18, H - 100, W - 36, 82, { fill: true, fillColor: GREEN });

  // ── Org name in header ──
  drawText('PLAN YOUR RECOVERY', bold, 11, W / 2, H - 52, { color: DARK, center: true, tracking: 3 });
  drawText('Continuing Education', regular, 9, W / 2, H - 67, { color: DARK, center: true, tracking: 1 });

  // ── Certificate title ──
  drawText('CERTIFICATE OF COMPLETION', bold, 22, W / 2, H - 136, { color: DARK, center: true, tracking: 2 });

  // ── Thin rule ──
  drawLine(100, H - 148, W - 100, H - 148, { color: GREEN, width: 1 });

  // ── Preamble ──
  drawText('This certifies that', italic, 11, W / 2, H - 178, { color: MUTED, center: true });

  // ── Student name ──
  const nameY = H - 230;
  const nameWidth = bold.widthOfTextAtSize(data.studentName, 30);
  drawText(data.studentName, bold, 30, W / 2, nameY, { color: DARK, center: true });
  drawLine(W / 2 - nameWidth / 2 - 20, nameY - 8, W / 2 + nameWidth / 2 + 20, nameY - 8, { color: GREEN, width: 1.5 });

  // ── License info under name ──
  if (data.licenseType) {
    const licParts = [data.licenseType, data.licenseNumber, data.licenseState].filter(Boolean).join('  ·  ');
    drawText(licParts, regular, 9, W / 2, nameY - 24, { color: MUTED, center: true });
  }

  // ── Completion text ──
  drawText('has successfully completed', italic, 11, W / 2, H - 278, { color: MUTED, center: true });

  // ── Course title ──
  drawText(data.courseTitle, bold, 15, W / 2, H - 308, { color: DARK, center: true });

  // ── Credit hours ──
  const creditLine = `${data.creditHours} Continuing Education Hour${data.creditHours !== 1 ? 's' : ''}  ·  ${data.creditType}`;
  drawText(creditLine, regular, 10, W / 2, H - 330, { color: MUTED, center: true });

  // ── Score ──
  drawText(`Exam score: ${data.score}%`, regular, 9, W / 2, H - 348, { color: MUTED, center: true });

  // ── Bottom rule ──
  drawLine(100, 130, W - 100, 130, { color: GREEN, width: 0.75 });

  // ── Footer row ──
  const dateStr = data.completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Left: date
  drawText('DATE COMPLETED', bold, 7, 108, 118, { color: MUTED, tracking: 1.5 });
  drawText(dateStr, regular, 9, 108, 104, { color: DARK });

  // Center: provider
  drawText('PROVIDER', bold, 7, W / 2, 118, { color: MUTED, tracking: 1.5, center: true });
  drawText('Plan Your Recovery', regular, 9, W / 2, 104, { color: DARK, center: true });
  if (data.providerApprovalNumber) {
    drawText(`Approval #${data.providerApprovalNumber}`, regular, 8, W / 2, 91, { color: MUTED, center: true });
  }

  // Right: verification code
  drawText('VERIFICATION CODE', bold, 7, W - 108, 118, { color: MUTED, tracking: 1.5, right: true });
  drawText(data.verificationCode, regular, 9, W - 108, 104, { color: DARK, right: true });

  return pdfDoc.save();
}

function makeDrawHelpers(page) {
  function drawText(text, font, size, x, y, opts = {}) {
    const { color = DARK, center = false, right = false, tracking = 0 } = opts;

    let drawX = x;
    if (center || right) {
      const textWidth = tracking
        ? font.widthOfTextAtSize(text, size) + tracking * (text.length - 1)
        : font.widthOfTextAtSize(text, size);
      if (center) drawX = x - textWidth / 2;
      if (right)  drawX = x - textWidth;
    }

    if (tracking) {
      let curX = drawX;
      for (const char of text) {
        page.drawText(char, { x: curX, y, size, font, color });
        curX += font.widthOfTextAtSize(char, size) + tracking;
      }
    } else {
      page.drawText(text, { x: drawX, y, size, font, color });
    }
  }

  function drawLine(x1, y1, x2, y2, { color = DARK, width = 1 } = {}) {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: width, color });
  }

  function drawRect(x, y, w, h, { fill = false, fillColor = WHITE, borderColor = DARK, borderWidth = 1 } = {}) {
    page.drawRectangle({
      x, y, width: w, height: h,
      color: fill ? fillColor : undefined,
      borderColor,
      borderWidth
    });
  }

  return { drawText, drawLine, drawRect };
}
