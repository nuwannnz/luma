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

		// Convert list items to proper HTML structure
		const lines = html.split('\n');
		let inList = false;
		const processedLines: string[] = [];
		
		for (const line of lines) {
			if (/^\* (.*)/.test(line)) {
				if (!inList) {
					processedLines.push('<ul>');
					inList = true;
				}
				processedLines.push(line.replace(/^\* (.*)/, '<li>$1</li>'));
			} else {
				if (inList) {
					processedLines.push('</ul>');
					inList = false;
				}
				processedLines.push(line);
			}
		}
		if (inList) {
			processedLines.push('</ul>');
		}
		html = processedLines.join('\n');

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
		font-size: 1.5rem;
		font-weight: bold;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose h2) {
		font-size: 1.25rem;
		font-weight: bold;
		margin-top: 0.75rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose h3) {
		font-size: 1.125rem;
		font-weight: bold;
		margin-top: 0.5rem;
		margin-bottom: 0.25rem;
	}
	:global(.prose p) {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose ul) {
		list-style-type: disc;
		list-style-position: inside;
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose li) {
		margin-left: 1rem;
	}
	:global(.prose strong) {
		font-weight: bold;
	}
	:global(.prose em) {
		font-style: italic;
	}
	:global(.prose a) {
		color: var(--accent-strong);
	}
	:global(.prose a:hover) {
		text-decoration: underline;
	}
</style>
