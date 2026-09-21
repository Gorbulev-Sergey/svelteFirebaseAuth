<script lang="ts">
	let { children } = $props();
</script>

<div class="d-flex flex-column gap-2">
	{@render children?.()}
</div>
