<script lang="ts">
	import { enhance } from '$app/forms';
	import Column from '$lib/components/Column.svelte';
	import { db } from '$lib/db/firebase.js';
	import type { IPost } from '$lib/models/IPost.js';
	import { onValue, ref } from 'firebase/database';
	import { onMount } from 'svelte';

	let newRole = $state('');
	let posts = $state<Record<string, IPost>>({});

	let { data } = $props();

	onMount(() => {
		onValue(ref(db, '/posts'), (p) => {
			if (p.exists()) posts = p.val();
		});
	});
</script>

<Column>
	<h4>Панель администратора <b>{data?.user?.name}</b></h4>
	<div class="bg-light text-dark p-3 rounded-1">
		<img class="img-fluid rounded-1 mb-1" src={data.user?.picture} alt="" />
		<div>Пользователь: <b>{data.user?.name}</b></div>
		<div>uid: <b>{data.user?.uid}</b></div>
		<div>email: <b>{data.user?.email}</b></div>
		<div>роль: <b>{data.user?.role}</b></div>
		<hr class="border-0 bg-secondary mt-3 mb-2" style="height: .1px;" />
		<div>
			публикаций:
			<b>{Object.entries(posts).filter((p) => p[1].user.uid == data.user?.uid).length}</b>
		</div>
		<div>
			комментариев:
			<b>
				{Object.values(posts)
					.flatMap((p) =>
						!p.comments || typeof p.comments !== 'object' ? [] : Object.values(p.comments)
					)
					.filter((c) => c.user.uid === data.user?.uid).length}
			</b>
		</div>
		<div>
			лайков:
			<b>
				{Object.values(posts)
					.flatMap((p) => (!p.likes || typeof p.likes !== 'object' ? [] : Object.values(p.likes)))
					.filter((l) => l.user.uid === data.user?.uid).length}
			</b>
		</div>
	</div>

	<form method="POST" action="?/setRole" use:enhance>
		<div class="d-flex align-items-center gap-1 p-1">
			<div class="text-nowrap pe-1">Сменить роль:</div>
			<input hidden name="uid" value={data.user?.uid} />
			<input
				class="form-control form-control-sm"
				name="role"
				bind:value={newRole}
				placeholder="роль"
			/>
			<button class="btn btn-sm btn-light text-dark text-nowrap" type="submit">Добавить роль</button
			>
		</div>
	</form>
</Column>
