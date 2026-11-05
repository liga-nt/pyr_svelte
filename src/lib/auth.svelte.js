import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

export const authState = $state({
	user: null,
	loading: true,
	isAdmin: false
});

if (browser) {
	onAuthStateChanged(auth, async (user) => {
		authState.user = user;
		if (user) {
			try {
				const snap = await getDoc(doc(db, 'users', user.uid));
				authState.isAdmin = snap.exists() && !!snap.data().isAdmin;
				console.log('[auth] isAdmin check:', { uid: user.uid, exists: snap.exists(), data: snap.data(), isAdmin: authState.isAdmin });
			} catch (err) {
				// Never leave the spinner running forever because of a Firestore hiccup
				// (stale rules, offline, network error) — surface it and fail closed.
				console.error('[auth] failed to load user doc:', err);
				authState.isAdmin = false;
			}
		} else {
			authState.isAdmin = false;
		}
		authState.loading = false;
	});
}
