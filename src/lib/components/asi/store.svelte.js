// All ASI-5 form state and composite score calculations

export let form = $state({
	mode: 'full', // 'full' | 'scoring'
	currentSection: 0,

	g: {
		g1: '', g4: '', g5: '', g6: '', g7h: '', g7m: '',
		g8: null, g9: null, g10: null, g99: '', g11: '', g12: null,
		g14y: null, g14m: null, g15: null, g16: '', g17: null,
		g18: null, g19: null, g20: null,
		comments: '',
	},

	m: {
		m1: null, m2y: null, m2m: null, m3: null, m4: null, m5: null,
		m6: null,  // COMPOSITE: days medical problems past 30
		m7: null,  // COMPOSITE: troubled by medical (0-4)
		m8: null,  // COMPOSITE: importance of treatment (0-4)
		m9: null, m10: null, m11: null,
		comments: '',
	},

	e: {
		e1y: null, e1m: null, e2: null, e3: null, e3spec: '',
		e4: null,  // COMPOSITE: driver's license (0/1)
		e5: null,  // COMPOSITE: auto available (0/1)
		e6y: null, e6m: null, e7: null, e7spec: '', e8: null, e9: null, e10: null,
		e11: null, // COMPOSITE: days paid work past 30
		e12: null, // COMPOSITE: employment income past 30
		e13: null, e14: null, e15: null, e16: null,
		e17: null, // COMPOSITE (Legal): illegal income past 30
		e18: null, e19: null, e20: null, e21: null, e22: null, e23: null, e24: null,
		comments: '',
	},

	d: {
		// Grid cols: a=past30, b=lifetimeYrs, c=route
		d1a: null, d1b: null,
		d2a: null, d2b: null,
		d3a: null, d3b: null, d3c: null,
		d4a: null, d4b: null, d4c: null,
		d5a: null, d5b: null, d5c: null,
		d6a: null, d6b: null, d6c: null,
		d7a: null, d7b: null, d7c: null,
		d8a: null, d8b: null, d8c: null,
		d9a: null, d9b: null, d9c: null,
		d10a: null, d10b: null, d10c: null,
		d11a: null, d11b: null, d11c: null,
		d12a: null, d12b: null, d12c: null,
		d13a: null, d13b: null,
		d14a: null, d14b: null,
		d15: null, d16: null, d17: null, d18: null,
		d19: null, d20: null, d21: null, d22: null,
		d23: null, // COMPOSITE: money on alcohol past 30
		d24: null,
		d25: null,
		d26: null, // COMPOSITE: days alcohol problems past 30
		d27: null, // COMPOSITE: days drug problems past 30
		d28: null, // COMPOSITE: troubled by alcohol (0-4)
		d29: null, // COMPOSITE: troubled by drugs (0-4)
		d30: null, // COMPOSITE: importance alcohol treatment (0-4)
		d31: null, // COMPOSITE: importance drug treatment (0-4)
		d32: null, d33: null, d34: null, d35: null,
		comments: '',
	},

	l: {
		l1: null, l2: null,
		l3: null, l4: null, l5: null, l6: null, l7: null, l8: null,
		l9: null, l10: null, l11: null, l12: null, l13: null, l14: null,
		l15: null, l16: null, l17: null, l18: null, l19: null, l20: null,
		l21: null, l22: null, l23: null,
		l24: null, // COMPOSITE: awaiting charges (0/1)
		l25: null,
		l26: null,
		l27: null, // COMPOSITE: days illegal activities past 30
		l28: null, // COMPOSITE: seriousness of legal problems (0-4)
		l29: null, // COMPOSITE: importance of counseling (0-4)
		l30: null, l31: null, l32: null,
		comments: '',
	},

	// Family History grid — values: 0, 1, -9 (uncertain), -8 (no relative)
	h: {
		h1alc: null, h1drug: null, h1psych: null,
		h2alc: null, h2drug: null, h2psych: null,
		h3alc: null, h3drug: null, h3psych: null,
		h4alc: null, h4drug: null, h4psych: null,
		h5alc: null, h5drug: null, h5psych: null,
		h6alc: null, h6drug: null, h6psych: null,
		h7alc: null, h7drug: null, h7psych: null,
		h8alc: null, h8drug: null, h8psych: null,
		h9alc: null, h9drug: null, h9psych: null,
		h10alc: null, h10drug: null, h10psych: null,
		h11alc: null, h11drug: null, h11psych: null,
		h12alc: null, h12drug: null, h12psych: null,
		comments: '',
	},

	f: {
		f1: null, f2y: null, f2m: null,
		f3: null,  // COMPOSITE: satisfied with marital status (0=No, 2=Yes) — reversed
		f4: null, f5: null,
		// F18a-F26a: problems with relationships past 30 — values: 0=No, 1=Yes, -8=No contact
		f18a: null, // COMPOSITE: mother
		f19a: null, // COMPOSITE: father
		f20a: null, // COMPOSITE: brothers/sisters
		f21a: null, // COMPOSITE: sexual partner/spouse
		f22a: null, // COMPOSITE: children
		f23a: null, // COMPOSITE: other significant family
		f24a: null, // COMPOSITE: close friends
		f25a: null, // COMPOSITE: neighbors
		f26a: null, // COMPOSITE: co-workers
		// Importance of counseling for each relationship (0-4)
		f18b: null, f19b: null, f20b: null, f21b: null, f22b: null,
		f23b: null, f24b: null, f25b: null, f26b: null,
		f27: null,
		f30: null, // COMPOSITE: days family problems past 30
		f32: null, // COMPOSITE: troubled by family (0-4)
		f34: null, // COMPOSITE: importance of treatment (0-4)
		f28: null, f29: null,
		comments: '',
	},

	p: {
		p1: null, p2: null, p3: null,
		// Past 30 days symptoms (0/1) — all COMPOSITE
		p4a: null,  // serious depression
		p5a: null,  // anxiety/tension
		p6a: null,  // hallucinations
		p7a: null,  // trouble concentrating
		p8a: null,  // trouble controlling violent behavior
		p9a: null,  // serious thoughts of suicide
		p10a: null, // attempted suicide
		p11a: null, // prescribed medication for psych problems
		p12: null,  // COMPOSITE: days psych problems past 30
		p13: null,  // COMPOSITE: troubled by psych (0-4)
		p14: null,  // COMPOSITE: importance of treatment (0-4)
		p15: null, p16: null, p17: null,
		comments: '',
	},
});

/** @param {number | null | undefined} v */
function n(v) {
	if (v === null || v === undefined || Number(v) < 0) return 0;
	return Number(v);
}

const _composites = $derived.by(() => {
	const { m, e, d, l, f, p } = form;

	// Medical: (m6/90) + (m7/12) + (m8/12)
	const medcomp = (n(m.m6) / 90) + (n(m.m7) / 12) + (n(m.m8) / 12);

	// Employment: 1 - ((e4/4) + (e5/4) + (e11/120) + (log(e12)/36))
	const e5val = n(e.e4) === 0 ? 0 : n(e.e5);
	let logEmp = 0;
	if (e.e12 !== null && Number(e.e12) > 0) logEmp = Math.log(Number(e.e12));
	if (logEmp > 9) logEmp = 9;
	const empcomp = 1 - ((n(e.e4) / 4) + (e5val / 4) + (n(e.e11) / 120) + (logEmp / 36));

	// Alcohol: (d1a/180) + (d2a/180) + (d26/180) + (d28/24) + (d30/24) + (log(d23)/44)
	let logAlc = 0;
	if (d.d23 !== null && Number(d.d23) > 0) logAlc = Math.log(Number(d.d23));
	if (logAlc > 7.3) logAlc = 7.3;
	const alccomp = (n(d.d1a) / 180) + (n(d.d2a) / 180) + (n(d.d26) / 180) +
		(n(d.d28) / 24) + (n(d.d30) / 24) + (logAlc / 44);

	// Drug: sum of 10 substances past30 / 390 + problem days/390 + troubled/52 + importance/52
	const drgcomp =
		(n(d.d3a) + n(d.d4a) + n(d.d5a) + n(d.d6a) + n(d.d7a) +
			n(d.d8a) + n(d.d9a) + n(d.d10a) + n(d.d11a) + n(d.d13a)) / 390 +
		(n(d.d27) / 390) + (n(d.d29) / 52) + (n(d.d31) / 52);

	// Legal: (l24/5) + (l27/150) + (l28/20) + (l29/20) + (log(e17)/46)
	let logLeg = 0;
	if (e.e17 !== null && Number(e.e17) > 0) logLeg = Math.log(Number(e.e17));
	if (logLeg > 9.2) logLeg = 9.2;
	const legcomp = (n(l.l24) / 5) + (n(l.l27) / 150) + (n(l.l28) / 20) +
		(n(l.l29) / 20) + (logLeg / 46);

	// Family/Social (complex missing-value logic)
	const relItems = [f.f18a, f.f19a, f.f20a, f.f21a, f.f22a, f.f23a, f.f24a, f.f25a, f.f26a];
	const fammiss = relItems.some((v) => v === null);
	const famcon = relItems.filter((v) => v === -8 || v === -98).length;
	const fNumer = relItems.filter((v) => v === 1).length;
	const fDenom = relItems.filter((v) => v === 0 || v === 1).length;
	let ratio = 0;
	if (famcon !== 9 && fDenom !== 0) ratio = fNumer / fDenom;
	const f3rev = f.f3 === 0 ? 2 : 0; // No=2, Yes=0
	const famcomp = fammiss
		? null
		: (f3rev / 10) + (n(f.f30) / 150) + (n(f.f32) / 20) + (n(f.f34) / 20) + (ratio / 5);

	// Psychiatric: ((sum of 8 symptom items)/11) + (p12/330) + (p13/44) + (p14/44)
	const psycomp =
		(n(p.p4a) + n(p.p5a) + n(p.p6a) + n(p.p7a) +
			n(p.p8a) + n(p.p9a) + n(p.p10a) + n(p.p11a)) / 11 +
		(n(p.p12) / 330) + (n(p.p13) / 44) + (n(p.p14) / 44);

	return { medcomp, empcomp, alccomp, drgcomp, legcomp, famcomp, psycomp };
});

export function getComposites() { return _composites; }

export const SECTIONS = [
	{ id: 'general',        label: 'General Information' },
	{ id: 'medical',        label: 'Medical Status' },
	{ id: 'employment',     label: 'Employment / Support' },
	{ id: 'drugs',          label: 'Alcohol & Drugs' },
	{ id: 'legal',          label: 'Legal Status' },
	{ id: 'familyHistory',  label: 'Family History' },
	{ id: 'familySocial',   label: 'Family & Social' },
	{ id: 'psychiatric',    label: 'Psychiatric' },
	{ id: 'results',        label: 'Results' },
];
