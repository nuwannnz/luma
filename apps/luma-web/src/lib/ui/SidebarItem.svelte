<script lang="ts">
	import type { SidebarItemType } from './types';

	let { item, active = false, collapsed = false, select }: {
		item: SidebarItemType;
		active?: boolean;
		collapsed?: boolean;
		select?: (id: string) => void;
	} = $props();
</script>

<li>
	<a
		href={item.href ?? '#'}
		class={`group flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-[var(--surface)] ${
			active
				? 'bg-[var(--accent)]/30 text-[var(--text)] border-[var(--border)]'
				: 'text-[var(--text)] hover:bg-[var(--muted)]'
		}
		${collapsed ? ' justify-center' : ''}`}
		onclick={() => select?.(item.id)}
		aria-current={active ? 'page' : undefined}
	>
		{#if item.icon}
			<span class="text-lg" aria-hidden="true">{item.icon}</span>
		{/if}
		<span class={`${collapsed ? 'sr-only' : 'text-sm font-medium truncate'}`}>{item.label}</span>
		{#if item.badge && !collapsed}
			<span class="ml-auto inline-flex items-center rounded-full bg-[var(--accent)]/40 text-[var(--text)] px-2 py-0.5 text-xs font-semibold">
				{item.badge}
			</span>
		{/if}
	</a>
</li>
