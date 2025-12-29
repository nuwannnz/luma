<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to auth page on initial load
		goto('/auth');
	});
</script>

<div class="min-h-screen flex items-center justify-center">
	<p class="text-[var(--text-muted)]">Redirecting...</p>
</div>
