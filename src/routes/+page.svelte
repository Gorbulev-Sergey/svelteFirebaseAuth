<script lang="ts">
	import Column from '$lib/components/Column.svelte';
	import { db } from '$lib/db/firebase';
	import { type IComment, Comment } from '$lib/models/IComment.js';
	import { Like } from '$lib/models/ILike.js';
	import { Post, type IPost } from '$lib/models/IPost.js';
	import { onValue, push, ref, remove, set } from 'firebase/database';
	import { onMount } from 'svelte';

	let selectedPost = $state();
	let newPost = $state<IPost>(Post());
	let posts = $state<Record<string, IPost>>({});

	let newComment = $state<IComment>(Comment());

	let { data } = $props();

	onMount(async () => {
		onValue(ref(db, '/posts'), (p) => {
			if (p.exists()) posts = p.val();
		});
	});
</script>

<Column>
	<div class="mb-3">
		<h4>Добро пожаловать в SvelteKit{data.user ? ', ' : ''} <b>{data.user?.name}</b></h4>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>
		{#if data.user}
			<div class="d-flex align-items-center gap-2">
				<input
					class="form-control form-control-sm"
					bind:value={newPost.title}
					placeholder="заголовок поста"
				/>
				<button
					class="btn btn-sm btn-light text-dark text-nowrap"
					onclick={async () => {
						if (newPost.title.trim() != '') {
							newPost.created = Date.now();
							newPost.userUid = data.user?.uid;
							newPost.userName = data.user?.name;
							push(ref(db, '/posts'), newPost).then((_) => (newPost = Post()));
						}
					}}>Создать пост</button
				>
			</div>
		{/if}
	</div>
	<div>
		<h4>Список постов:</h4>
		<div class="d-flex flex-column gap-1">
			{#each Object.entries(posts) as [uid, post], i}
				<div class="d-flex align-posts-center gap-1">
					<b>{i + 1}</b>.
					{post.title},
					{new Date(post.created).toLocaleDateString()}
					{post.userName ? ', автор: ' : ''}<b>{post.userName}</b>
					<button class="btn btn-sm btn-light text-dark" onclick={() => (selectedPost = uid)}>
						<span>комментарии</span>
						<b class="badge bg-dark text-light rounded-1 px-1"
							>{post.comments ? Object.values(post.comments).length : ''}
						</b>
					</button>
					<button
						class="btn btn-sm btn-light text-dark"
						onclick={() => {
							let l = post.likes
								? Object.entries(post.likes).find((l) => l[1].userUid == data.user?.uid)
								: undefined;
							if (l) {
								remove(ref(db, `/posts/${uid}/likes/${l[0]}`));
							} else {
								let newLike = Like();
								newLike.userUid = data.user?.uid;
								newLike.userName = data.user?.name;
								push(ref(db, `/posts/${uid}/likes`), newLike);
							}
						}}
					>
						<span>лайки</span>
						<b class="badge bg-dark text-light rounded-1 px-1"
							>{post.likes ? Object.values(post.likes).length : ''}
						</b>
					</button>
				</div>
				{#if selectedPost === uid}
					<div class="d-flex flex-column gap-1 bg-light rounded-1 ms-5 p-2 w-50">
						{#if post.comments}
							{#each Object.entries(post.comments) as [u, com], j}
								<div>
									{j + 1}.
									{com.text}
									<b class="badge bg-dark text-light">{com.userName}</b>
								</div>
							{/each}
						{/if}
						{#if data.user}
							<div class="d-flex align-items-center gap-1 mt-1">
								<input
									class="form-control form-control-sm"
									bind:value={newComment.text}
									placeholder="новый комментарий"
								/>
								<button
									class="btn btn-sm btn-light text-dark text-nowrap"
									onclick={async () => {
										if (newComment.text.trim() != '') {
											newComment.created = Date.now();
											newComment.userUid = data.user?.uid;
											newComment.userName = data.user?.name;
											push(ref(db, `/posts/${uid}/comments`), newComment).then(
												(_) => (newComment = Comment())
											);
											//push(ref(db, '/comments'), newComment).then((_) => (newComment = Comment()));
										}
									}}>Добавить</button
								>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</Column>
