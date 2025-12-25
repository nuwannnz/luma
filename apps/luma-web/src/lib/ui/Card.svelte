<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = null,
		subtitle = null,
		children
	}: {
		title?: string | null;
		subtitle?: string | null;
		children?: Snippet;
	} = $props();
</script>

<section class="card-surface p-4 md:p-6">
	{#if title || subtitle}
		<header class="mb-3 flex items-baseline justify-between gap-2">
			{#if title}
				<h2 class="text-lg font-semibold text-[var(--text)]">{title}</h2>
			{/if}
			{#if subtitle}
				<p class="text-sm text-[var(--text-muted)]">{subtitle}</p>
			{/if}
		</header>
	{/if}
	<div class="text-[var(--text)] text-sm leading-relaxed">
		{@render children?.()}
	</div>
</section>
