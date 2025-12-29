<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		// Redirect to My Week page
		goto('/me/week');
	});
</script>

<div>Redirecting to My Week...</div>
