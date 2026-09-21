<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { auth } from '$lib/db/firebase';
	import { getIdToken, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
</script>

<div class="container my-4">
	<div class="d-flex align-items-center justify-content-between">
		<button
			class="btn btn-dark text-light"
			onclick={async () => {
				const result = await signInWithPopup(auth, new GoogleAuthProvider());
				const idToken = await getIdToken(result.user);

				await fetch('/api/session', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ idToken })
				}).then((_) => goto('/'));
			}}>Войти с помощью Google</button
		>
		<button
			class="btn btn-dark text-light"
			onclick={() => {
				auth.signOut().then(async (result) => {
					await fetch('/api/logout', {
						method: 'POST',
						credentials: 'include'
					});
					invalidateAll().then((_) => goto('/'));
				});
			}}>Выйти</button
		>
	</div>
</div>
