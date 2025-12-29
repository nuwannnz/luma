<script lang="ts">
	let {
		value = $bindable(''),
		placeholder = 'Write your note...'
	}: {
		value?: string;
		placeholder?: string;
	} = $props();

	let mode = $state<'edit' | 'preview'>('edit');

	// Basic markdown to HTML conversion (simplified)
	function renderMarkdown(text: string): string {
		let html = text;

		// Headers
		html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
		html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
		html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

		// Bold
		html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

		// Italic
		html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

		// Links
		html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

		// Lists
		html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
		html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

		// Line breaks
		html = html.replace(/\n\n/g, '</p><p>');
		html = html.replace(/\n/g, '<br>');

		return `<p>${html}</p>`;
	}

	const previewHtml = $derived(renderMarkdown(value));
</script>

<div class="space-y-2">
	<div class="flex gap-2 border-b border-[var(--border)] pb-2">
		<button
			type="button"
			onclick={() => (mode = 'edit')}
			class="px-3 py-1 text-sm rounded {mode === 'edit'
				? 'bg-[var(--accent)] text-[var(--text)]'
				: 'text-[var(--text-muted)] hover:text-[var(--text)]'}"
		>
			Edit
		</button>
		<button
			type="button"
			onclick={() => (mode = 'preview')}
			class="px-3 py-1 text-sm rounded {mode === 'preview'
				? 'bg-[var(--accent)] text-[var(--text)]'
				: 'text-[var(--text-muted)] hover:text-[var(--text)]'}"
		>
			Preview
		</button>
	</div>

	{#if mode === 'edit'}
		<textarea
			bind:value
			{placeholder}
			rows="15"
			class="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y font-mono"
		></textarea>
		<div class="text-xs text-[var(--text-muted)] space-y-1">
			<p>Markdown formatting:</p>
			<p># Heading 1, ## Heading 2, ### Heading 3</p>
			<p>**bold**, *italic*, [link](url), * list item</p>
		</div>
	{:else}
		<div
			class="w-full min-h-[300px] px-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] prose prose-sm max-w-none"
		>
			{@html previewHtml}
		</div>
	{/if}
</div>

<style>
	:global(.prose h1) {
		@apply text-2xl font-bold mt-4 mb-2;
	}
	:global(.prose h2) {
		@apply text-xl font-bold mt-3 mb-2;
	}
	:global(.prose h3) {
		@apply text-lg font-bold mt-2 mb-1;
	}
	:global(.prose p) {
		@apply my-2;
	}
	:global(.prose ul) {
		@apply list-disc list-inside my-2;
	}
	:global(.prose li) {
		@apply ml-4;
	}
	:global(.prose strong) {
		@apply font-bold;
	}
	:global(.prose em) {
		@apply italic;
	}
	:global(.prose a) {
		@apply text-[var(--accent-strong)] hover:underline;
	}
</style>
