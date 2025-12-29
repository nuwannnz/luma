<script lang="ts">
	interface InputProps {
		id: string;
		type?: 'text' | 'email' | 'password';
		label?: string;
		placeholder?: string;
		value: string;
		disabled?: boolean;
		required?: boolean;
		error?: string;
		onchange?: (value: string) => void;
	}

	let {
		id,
		type = 'text',
		label,
		placeholder,
		value = $bindable(''),
		disabled = false,
		required = false,
		error
	}: InputProps = $props();
</script>

<div class="space-y-2">
	{#if label}
		<label for={id} class="block text-sm font-medium text-[var(--text)]">
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
	<input
		{id}
		{type}
		bind:value
		{required}
		{disabled}
		{placeholder}
		class="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		class:border-red-500={error}
	/>
	{#if error}
		<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
	{/if}
</div>
