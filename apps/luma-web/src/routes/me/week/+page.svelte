<script lang="ts">
	import DashboardShell from '$lib/dashboard/DashboardShell.svelte';
	import DayColumn from '$lib/components/DayColumn.svelte';
	import type { SidebarItemType } from '$lib/ui/types';
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		getWeekStart,
		getWeekEnd,
		getWeekDates,
		addWeeks,
		formatWeekRange
	} from '$lib/utils/dateUtils';

	let userEmail = $state('');
	let currentWeekStart = $state(getWeekStart());
	let weekDates = $state<Date[]>(getWeekDates(getWeekStart()));
	let weekRange = $state(formatWeekRange(getWeekStart(), getWeekEnd(getWeekStart())));

	onMount(() => {
		userEmail = authService.getStoredUserEmail() || 'User';
		updateWeek();
	});

	function updateWeek() {
		weekDates = getWeekDates(currentWeekStart);
		const weekEnd = getWeekEnd(currentWeekStart);
		weekRange = formatWeekRange(currentWeekStart, weekEnd);
	}

	function handlePreviousWeek() {
		currentWeekStart = addWeeks(currentWeekStart, -1);
		updateWeek();
	}

	function handleNextWeek() {
		currentWeekStart = addWeeks(currentWeekStart, 1);
		updateWeek();
	}

	function handleThisWeek() {
		currentWeekStart = getWeekStart();
		updateWeek();
	}

	const MONDAY_INDEX = 1;
	const FRIDAY_END_INDEX = 6;
	const SATURDAY_INDEX = 6;
	const SUNDAY_INDEX = 0;

	const navItems: SidebarItemType[] = [
		{ id: 'week', label: 'My Week', icon: '📅', href: '/me/week' },
		{ id: 'projects', label: 'Projects', icon: '📁', href: '/me/projects' },
		{ id: 'notes', label: 'Notes', icon: '📝', href: '/me/notes' }
	];

	function handleLogout() {
		authService.signOut();
		goto('/auth');
	}
</script>

<DashboardShell {navItems} title="My Week" subtitle={weekRange} userName={userEmail} defaultActiveId="week">
	{#snippet headerActions()}
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={handlePreviousWeek}
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
			>
				◀
			</button>
			<button
				type="button"
				onclick={handleThisWeek}
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
			>
				Today
			</button>
			<button
				type="button"
				onclick={handleNextWeek}
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
			>
				▶
			</button>
			<button
				type="button"
				onclick={handleLogout}
				class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
			>
				<span aria-hidden="true">🚪</span>
				<span>Logout</span>
			</button>
		</div>
	{/snippet}

	<div class="grid grid-cols-1 md:grid-cols-6 gap-4">
		<!-- Monday through Friday -->
		{#each weekDates.slice(MONDAY_INDEX, FRIDAY_END_INDEX) as date (date.toISOString())}
			<DayColumn {date} />
		{/each}

		<!-- Combined Saturday/Sunday column -->
		<div class="flex flex-col gap-4">
			<DayColumn date={weekDates[SATURDAY_INDEX]} isCombined={true} />
			<DayColumn date={weekDates[SUNDAY_INDEX]} isCombined={true} />
		</div>
	</div>
</DashboardShell>
