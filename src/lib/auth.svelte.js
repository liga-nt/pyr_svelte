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
			const snap = await getDoc(doc(db, 'users', user.uid));
			authState.isAdmin = snap.exists() && !!snap.data().isAdmin;
		} else {
			authState.isAdmin = false;
		}
		authState.loading = false;
	});
}
