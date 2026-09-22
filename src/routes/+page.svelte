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
							newPost.user.uid = data.user?.uid;
							newPost.user.name = data.user?.name;
							push(ref(db, '/posts'), newPost).then((_) => (newPost = Post()));
						}
					}}>Создать пост</button
				>
			</div>
		{/if}
	</div>

	<div>
		<h4>Список постов:</h4>
		<div class="row row-cols-1 row-cols-md-2 g-3">
			{#each Object.entries(posts).sort((a, b) => a[1].created - b[1].created) as [uid, post], i}
				<div class="col h-100 d-flex flex-column">
					<div
						class="d-flex align-items-center justify-content-between bg-light bg-opacity-50 rounded-top px-3 py-2"
					>
						<b class="text-uppercase">{i + 1}. {post.title}</b>
						<div class="small">автор: <b>{post.user?.name}</b></div>
					</div>
					{#if post.title}
						<div class="px-3 py-0 bg-light bg-opacity-50">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique optio dignissimos
							facilis ducimus iste. Culpa, consectetur aspernatur quisquam repellat blanditiis
							similique! Odit animi hic quos distinctio eligendi suscipit praesentium mollitia!
						</div>
					{/if}
					<div class="d-flex flex-column bg-light bg-opacity-50 rounded-bottom">
						<div class="d-flex align-items-center justify-content-between px-3 py-2">
							<div class="small">
								дата:
								<b
									>{new Date(post.created).getTime() == post.created
										? 'сегодня'
										: new Date(post.created).toLocaleDateString()}</b
								>
							</div>
							<div>
								<button class="btn btn-sm btn-light text-dark" onclick={() => (selectedPost = uid)}>
									<span>комментарии</span>
									<b class="badge bg-dark text-light rounded-1 px-1"
										>{post.comments ? Object.values(post.comments).length : ''}
									</b>
								</button>
								<button
									class="btn btn-sm btn-light text-dark"
									onclick={() => {
										if (data.user) {
											let l = post.likes
												? Object.entries(post.likes).find((l) => l[1].user.uid == data.user?.uid)
												: undefined;
											if (l) {
												remove(ref(db, `/posts/${uid}/likes/${l[0]}`));
											} else {
												let newLike = Like();
												newLike.user.uid = data.user?.uid;
												newLike.user.name = data.user?.name;
												push(ref(db, `/posts/${uid}/likes`), newLike);
											}
										}
									}}
								>
									<span>лайки</span>
									<b class="badge bg-dark text-light rounded-1 px-1"
										>{post.likes ? Object.values(post.likes).length : ''}
									</b>
								</button>
							</div>
						</div>
						{#if selectedPost === uid}
							<div
								class="d-flex flex-column bg-secondary bg-opacity-10 rounded-bottom gap-1 px-3 pt-2 pb-3"
							>
								{#if post.comments}
									{#each Object.entries(post.comments) as [u, com], j}
										<div>
											{j + 1}.
											{com.text}
											<b class="badge bg-dark text-light">{com.user.name}</b>
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
											class="btn btn-sm btn-dark text-light text-nowrap"
											onclick={async () => {
												if (newComment.text.trim() != '') {
													newComment.created = Date.now();
													newComment.user.uid = data.user?.uid;
													newComment.user.name = data.user?.name;
													push(ref(db, `/posts/${uid}/comments`), newComment).then(
														(_) => (newComment = Comment())
													);
												}
											}}>Добавить</button
										>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<!-- <div class="d-flex flex-column gap-2">
			{#each Object.entries(posts).sort((a, b) => a[1].created - b[1].created) as [uid, post], i}
				<div class="d-flex flex-column w-50">
					<div
						class="d-flex align-items-center justify-content-between bg-light bg-opacity-50 rounded-top px-3 py-2"
					>
						<b class="text-uppercase">{i + 1}. {post.title}</b>
						<div class="small">автор: <b>{post.user?.name}</b></div>
					</div>
					{#if post.title}
						<div class="px-3 py-0 bg-light bg-opacity-50">{post.title}</div>
					{/if}
					<div class="d-flex flex-column bg-light bg-opacity-50 rounded-bottom">
						<div class="d-flex align-items-center justify-content-between px-3 py-2">
							<div class="small">
								дата:
								<b
									>{new Date(post.created).getTime() == post.created
										? 'сегодня'
										: new Date(post.created).toLocaleDateString()}</b
								>
							</div>
							<div>
								<button class="btn btn-sm btn-light text-dark" onclick={() => (selectedPost = uid)}>
									<span>комментарии</span>
									<b class="badge bg-dark text-light rounded-1 px-1"
										>{post.comments ? Object.values(post.comments).length : ''}
									</b>
								</button>
								<button
									class="btn btn-sm btn-light text-dark"
									onclick={() => {
										if (data.user) {
											let l = post.likes
												? Object.entries(post.likes).find((l) => l[1].user.uid == data.user?.uid)
												: undefined;
											if (l) {
												remove(ref(db, `/posts/${uid}/likes/${l[0]}`));
											} else {
												let newLike = Like();
												newLike.user.uid = data.user?.uid;
												newLike.user.name = data.user?.name;
												push(ref(db, `/posts/${uid}/likes`), newLike);
											}
										}
									}}
								>
									<span>лайки</span>
									<b class="badge bg-dark text-light rounded-1 px-1"
										>{post.likes ? Object.values(post.likes).length : ''}
									</b>
								</button>
							</div>
						</div>
						{#if selectedPost === uid}
							<div class="d-flex flex-column gap-1 px-3 pb-3">
								<hr class="mt-0 mb-1" />
								{#if post.comments}
									{#each Object.entries(post.comments) as [u, com], j}
										<div>
											{j + 1}.
											{com.text}
											<b class="badge bg-dark text-light">{com.user.name}</b>
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
											class="btn btn-sm btn-dark text-light text-nowrap"
											onclick={async () => {
												if (newComment.text.trim() != '') {
													newComment.created = Date.now();
													newComment.user.uid = data.user?.uid;
													newComment.user.name = data.user?.name;
													push(ref(db, `/posts/${uid}/comments`), newComment).then(
														(_) => (newComment = Comment())
													);
												}
											}}>Добавить</button
										>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div> -->
	</div>
</Column>
