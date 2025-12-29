<script lang="ts">
	interface ButtonProps {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'outline';
		disabled?: boolean;
		fullWidth?: boolean;
		onclick?: () => void;
		children?: any;
	}

	let {
		type = 'button',
		variant = 'primary',
		disabled = false,
		fullWidth = false,
		onclick,
		children
	}: ButtonProps = $props();

	const baseStyles =
		'py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-all';

	const variantStyles = {
		primary:
			'bg-[var(--accent)] text-white hover:opacity-90 focus:ring-[var(--accent)] shadow-sm',
		secondary:
			'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--accent)]/10 focus:ring-[var(--accent)]',
		outline:
			'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface)] focus:ring-[var(--accent)]'
	};

	const widthStyles = $derived(fullWidth ? 'w-full' : '');
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="{baseStyles} {variantStyles[variant]} {widthStyles}"
>
	{@render children?.()}
</button>
