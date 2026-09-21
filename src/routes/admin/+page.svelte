<script lang="ts">
	import { enhance } from '$app/forms';
	import Column from '$lib/components/Column.svelte';

	let { data } = $props();
	let newRole = $state('');
</script>

<Column>
	<h4>Панель администратора <b>{data?.user?.name}</b></h4>
	<div class="bg-light text-dark p-3 rounded-1">
		<img class="img-fluid rounded-1" src={data.user?.picture} alt="" />
		<div>Пользователь: <b>{data.user?.name}</b></div>
		<div>uid: <b>{data.user?.uid}</b></div>
		<div>email: <b>{data.user?.email}</b></div>
		<div>роль: <b>{data.user?.role}</b></div>
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
