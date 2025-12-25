<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import HeaderBar from '$lib/ui/HeaderBar.svelte';
	import Sidebar from '$lib/ui/Sidebar.svelte';
	import { ThemeConfig, type Theme, type ThemeId } from '../config';
	import type { SidebarItemType } from '$lib/ui/types';

	let {
		navItems = [],
		title = 'Dashboard',
		subtitle = 'Overview',
		userName = null,
		defaultActiveId = null,
		headerActions,
		children
	}: {
		navItems?: SidebarItemType[];
		title?: string;
		subtitle?: string;
		userName?: string | null;
		defaultActiveId?: string | null;
		headerActions?: Snippet;
		children?: Snippet;
	} = $props();

	const themes = ThemeConfig.getAvailableThemes();
	let theme = $state<Theme>(themes[0]);
	let sidebarCollapsed = $state(false);
	let activeId = $state<string | null>(null);
	let ready = $state(false);

	$effect(() => {
		activeId = defaultActiveId;
	});

	const setResponsiveSidebar = () => {
		if (!browser) return;
		const isDesktop = window.matchMedia('(min-width: 768px)').matches;
		sidebarCollapsed = !isDesktop;
	};

	const setTheme = (id: ThemeId) => {
		const next = ThemeConfig.getThemeById(id) ?? theme;
		theme = next;
		ThemeConfig.applyTheme(theme);
	};

	onMount(() => {
		const initial = ThemeConfig.resolveInitialTheme();
		setTheme(initial.id);
		setResponsiveSidebar();
		ready = true;
	});

	const handleToggleSidebar = () => {
		sidebarCollapsed = !sidebarCollapsed;
	};

	const handleThemeChange = (id: ThemeId) => {
		setTheme(id);
	};

	const handleThemeToggle = () => {
		const next = ThemeConfig.getNextThemeId(theme.id);
		handleThemeChange(next);
	};

	const handleSelect = (id: string) => {
		activeId = id;
	};
</script>

<div class="min-h-screen bg-[var(--surface)] text-[var(--text)] transition-colors duration-200">
	<div class="flex min-h-screen">
		<Sidebar items={navItems} collapsed={sidebarCollapsed} {activeId} select={handleSelect} />

		<div class="flex-1 flex flex-col min-h-screen">
			<HeaderBar
				{title}
				{subtitle}
				{userName}
				collapsed={sidebarCollapsed}
				themeId={theme.id}
				{themes}
				{ready}
				toggleSidebar={handleToggleSidebar}
				themeChange={handleThemeChange}
				themeToggle={handleThemeToggle}
				children={headerActions}
			/>

			<main class="flex-1 bg-[var(--surface)] px-4 py-6 md:px-8">
				{@render children?.()}
			</main>
		</div>
	</div>
</div>
