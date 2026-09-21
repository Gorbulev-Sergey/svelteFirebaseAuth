<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import { auth } from '$lib/db/firebase';
	import { getIdToken, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="sticky-top w-100 bg-white px-3 py-2">
	<div class="d-flex align-items-center">
		<a class="btn btn-light text-dark border-0 bg-white" href="/">
			<b class=" text-uppercase">Firebase Auth</b>
		</a>
		<div class="flex-grow-1 d-flex justify-content-end gap-1">
			<a class="btn btn-sm btn-light text-dark" href="/">Главная</a>
			{#if !data.user}
				<button
					class="btn btn-sm btn-dark text-light"
					onclick={async () => {
						const result = await signInWithPopup(auth, new GoogleAuthProvider());
						const idToken = await getIdToken(result.user);

						await fetch('/api/session', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ idToken })
						});
						invalidateAll();
					}}>Войти с помощью Google</button
				>
			{:else}
				<a class="btn btn-sm btn-light text-dark" href="/admin">Admin</a>
				<button
					class="btn btn-sm btn-dark text-light"
					onclick={() => {
						auth.signOut().then(async (result) => {
							await fetch('/api/logout', {
								method: 'POST',
								credentials: 'include'
							});
							invalidateAll();
						});
					}}>Выйти</button
				>
			{/if}
		</div>
	</div>
</div>
<div class="container my-4">
	{@render children()}
</div>
