<script lang="ts">
	import Column from '$lib/components/Column.svelte';
	import { onMount } from 'svelte';

	let videos = $state([]);
	let selectedVideo = $state();
	let isVideoShow = $state(false);

	onMount(async () => {
		let r = await fetch('/api/video');
		let v = await r.json();
		videos = v;
		console.log(videos);
	});
</script>

<Column>
	<h4>Видео</h4>
	<div class="row row-cols-3 g-3">
		{#each videos as video}
			<div class="col h-100">
				{#if isVideoShow && selectedVideo === video.id}
					<div class="embed-responsive embed-responsive-16by9 w-100 border-0 p-0">
						<iframe
							title=""
							class="embed-responsive-item rounded-1 w-100 border-0"
							style="min-height: 12em"
							src={video.embed_url}
							allowfullscreen
						></iframe>
					</div>
				{:else}
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="rounded-1 position-relative"
						style="background-image: url({video.thumbnail_url}); background-repeat: no-repeat; background-position: center; background-size: cover; width:100%; min-height: 12em"
						onmouseenter={() => {
							selectedVideo = video.id;
							isVideoShow = true;
						}}
						onmouseleave={() => {
							selectedVideo = null;
							isVideoShow = false;
						}}
					>
						<div
							class="position-absolute fixed-bottom bg-light bg-opacity-50 rounded-bottom w-100 px-3 py-2"
						>
							<b>{video.title}</b>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</Column>
