<script>
	import { goto } from '$app/navigation';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { db } from '$lib/firebase.js';

	async function createCourse() {
		const ref = await addDoc(collection(db, 'courses'), {
			title: '',
			slug: '',
			description: '',
			creditHours: 1,
			creditType: '',
			passingScore: 80,
			published: false,
			modules: [],
			createdAt: serverTimestamp()
		});
		goto(`/ce/admin/courses/${ref.id}`, { replaceState: true });
	}

	createCourse();
</script>

<div style="display:flex;justify-content:center;align-items:center;min-height:40vh">
	<div style="width:32px;height:32px;border:3px solid #eee;border-top-color:#73DF91;border-radius:50%;animation:spin .7s linear infinite"></div>
</div>

<style>
	@keyframes spin { to { transform: rotate(360deg); } }
</style>
