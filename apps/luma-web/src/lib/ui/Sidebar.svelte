<script lang="ts">
	import SidebarItem from './SidebarItem.svelte';
	import type { SidebarItemType } from './types';

	let {
		items = [],
		collapsed = false,
		activeId = null,
		select
	}: {
		items?: SidebarItemType[];
		collapsed?: boolean;
		activeId?: string | null;
		select?: (id: string) => void;
	} = $props();

	const handleSelect = (id: string) => select?.(id);
</script>

<aside
	class={`flex flex-col bg-[var(--card)] text-[var(--text)] border-r border-[var(--border)] transition-[width] duration-200 shadow-sm ${
		collapsed ? 'w-20' : 'w-64'
	}`}
	aria-label="Sidebar navigation"
>
	<div class="flex items-center justify-between px-3 py-4 gap-2">
		<div class={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
			<div
				class="h-9 w-9 rounded-xl bg-[var(--accent)]/30 border border-[var(--border)] flex items-center justify-center text-[var(--text)] font-semibold"
			>
				L
			</div>
			{#if !collapsed}
				<div>
					<p class="text-sm font-semibold">Luma</p>
					<p class="text-xs text-[var(--text-muted)]">Control Center</p>
				</div>
			{/if}
		</div>
		<!-- <button
			type="button"
			class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
			onclick={handleToggle}
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			aria-pressed={!collapsed}
		>
			<span aria-hidden="true">{collapsed ? '⮞' : '⮜'}</span>
		</button> -->
	</div>

	<nav aria-label="Primary">
		<ul class="px-2 space-y-1">
			{#if items.length === 0}
				<li class="text-xs text-[var(--text-muted)] px-3 py-2">No sections</li>
			{:else}
				{#each items as item (item.id)}
					<SidebarItem {item} {collapsed} active={item.id === activeId} select={handleSelect} />
				{/each}
			{/if}
		</ul>
	</nav>
</aside>
