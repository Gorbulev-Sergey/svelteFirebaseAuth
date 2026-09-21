<script lang="ts">
	import Column from '$lib/components/Column.svelte';
	import { db } from '$lib/db/firebase';
	import { onValue, push, ref } from 'firebase/database';
	import { onMount } from 'svelte';

	interface IPosts {
		title: string;
		content?: string;
		userName?: string;
	}

	let post = $state<IPosts>({ title: '' });
	let posts = $state<IPosts[]>([]);
	let { data } = $props();

	onMount(async () => {
		onValue(ref(db, '/posts'), (p) => {
			if (p.exists()) posts = Object.values(p.val());
		});
	});
</script>

<Column>
	<div class="mb-3">
		<h4>Welcome to SvelteKit{data.user ? ', ' + data.user?.name : ''}</h4>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>
		{#if data.user}
			<div class="d-flex align-items-center gap-2">
				<input
					class="form-control form-control-sm"
					bind:value={post.title}
					placeholder="заголовок поста"
				/>
				<button
					class="btn btn-sm btn-light text-dark text-nowrap"
					onclick={async () => {
						if (post.title.trim() != '') {
							post.userName = data.user?.name || '';
							push(ref(db, '/posts'), post).then((_) => (post = { title: '' }));
						}
					}}>Создать пост</button
				>
			</div>
		{/if}
	</div>
	<div>
		<h4>Список постов:</h4>
		<div class="d-flex flex-column gap-1">
			{#each posts as item, i}
				<div>
					<b>{i + 1}</b>.
					{item.title}
					{item.userName ? ', автор: ' : ''}<b>{item.userName}</b>
				</div>
			{/each}
		</div>
	</div>
</Column>
