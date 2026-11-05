// One place for uploading to Firebase Storage, so every upload fails fast with a message that
// says what to do. Without this, the SDK retries silently for up to ten minutes when Storage is
// not set up, and the screen just sits on "Saving".
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '$lib/firebase.js';

storage.maxUploadRetryTime = 20000;
storage.maxOperationRetryTime = 20000;

/** Uploads and returns { url, path }. Throws an Error whose message is fit to show an admin. */
export async function uploadToStorage(path, data, contentType) {
	const fileRef = ref(storage, path);
	try {
		await uploadBytes(fileRef, data, { contentType });
		return { url: await getDownloadURL(fileRef), path };
	} catch (err) {
		throw new Error(storageMessage(err));
	}
}

export function storageMessage(err) {
	const code = err?.code ?? '';
	if (code === 'storage/unauthorized' || code === 'storage/unauthenticated') {
		return 'Firebase Storage refused the upload. Its rules need to let admins write to ce-audio/ and ce-images/.';
	}
	if (code === 'storage/retry-limit-exceeded' || code === 'storage/unknown' || code === 'storage/bucket-not-found' || code === 'storage/project-not-found') {
		return 'Could not reach Firebase Storage. It may not be set up for this project yet: in the Firebase console open Build, then Storage, and click Get started (a new bucket can need the Blaze plan). Then deploy the storage rules.';
	}
	if (code === 'storage/quota-exceeded') return 'The Firebase Storage quota was exceeded.';
	return err?.message ?? 'The upload failed.';
}
