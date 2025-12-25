<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Theme, ThemeId } from '$lib/config';

	let {
		title = 'Dashboard',
		subtitle = '',
		userName = null,
		collapsed = false,
		themeId,
		themes = [],
		ready = false,
		toggleSidebar,
		themeToggle,
		themeChange,
		children
	}: {
		title?: string;
		subtitle?: string;
		userName?: string | null;
		collapsed?: boolean;
		themeId: ThemeId;
		themes?: Theme[];
		ready?: boolean;
		toggleSidebar?: () => void;
		themeToggle?: () => void;
		themeChange?: (themeId: ThemeId) => void;
		children?: Snippet;
	} = $props();
</script>

<header
	class="sticky top-0 z-10 bg-[var(--surface)]/90 backdrop-blur border-b border-[var(--border)]"
>
	<div class="flex items-center justify-between px-4 py-3 md:px-6">
		<div class="flex items-center gap-3">
			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
				onclick={() => toggleSidebar?.()}
				aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			>
				<span aria-hidden="true">☰</span>
			</button>
			<div>
				<p class="text-sm text-[var(--text-muted)]">{subtitle}</p>
				<h1 class="text-xl md:text-2xl font-semibold text-[var(--text)]">{title}</h1>
			</div>
		</div>

		<div class="flex items-center gap-3">
			{#if themes.length > 0}
				<label class="hidden" for="theme-select">Theme</label>
				<select
					id="theme-select"
					class="border border-[var(--border)] bg-[var(--card)] text-[var(--text)] rounded-lg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
					onchange={(event) => themeChange?.(event.currentTarget.value as ThemeId)}
					aria-label="Select theme"
				>
					{#each themes as theme (theme.id)}
						<option value={theme.id} selected={theme.id === themeId}>{theme.label}</option>
					{/each}
				</select>
			{/if}
			<button
				type="button"
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
				onclick={() => themeToggle?.()}
				aria-pressed={ready ? themeId === 'pastel-dark' : undefined}
				aria-label="Toggle dark mode"
			>
				<span aria-hidden="true">{themeId === 'pastel-dark' ? '🌙' : '🌞'}</span>
				<span class="hidden md:inline text-sm font-medium"
					>{themeId === 'pastel-dark' ? 'Dark' : 'Light'}</span
				>
			</button>
			<div class="hidden md:flex flex-col text-right">
				<p class="text-sm font-semibold text-[var(--text)]">{userName ?? 'Guest'}</p>
				<p class="text-xs text-[var(--text-muted)]">Logged in</p>
			</div>
			{@render children?.()}
		</div>
	</div>
</header>
