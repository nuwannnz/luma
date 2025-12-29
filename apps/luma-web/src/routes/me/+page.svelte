<script lang="ts">
	import DashboardShell from '$lib/dashboard/DashboardShell.svelte';
	import Card from '$lib/ui/Card.svelte';
	import type { SidebarItemType } from '$lib/ui/types';
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let userEmail = $state('');

	onMount(() => {
		userEmail = authService.getStoredUserEmail() || 'User';
	});

	const navItems: SidebarItemType[] = [
		{ id: 'overview', label: 'Overview', icon: '🏠' },
		{ id: 'performance', label: 'Performance', icon: '📈', badge: 'Live' },
		{ id: 'users', label: 'Users', icon: '👥' },
		{ id: 'billing', label: 'Billing', icon: '💳' },
		{ id: 'settings', label: 'Settings', icon: '⚙️' }
	];

	const quickStats = [
		{ title: 'New Signups', value: '1,204', change: '+12.4%' },
		{ title: 'Active Sessions', value: '328', change: '+4.1%' },
		{ title: 'Support Tickets', value: '18', change: '-8.2%' }
	];

	function handleLogout() {
		authService.signOut();
		goto('/auth');
	}
</script>

<DashboardShell {navItems} title="Luma Dashboard" subtitle="Today" userName={userEmail}>
	{#snippet headerActions()}
		<button
			type="button"
			onclick={handleLogout}
			class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
		>
			<span aria-hidden="true">🚪</span>
			<span>Logout</span>
		</button>
	{/snippet}

	<div class="grid gap-4 md:gap-6 md:grid-cols-3">
		{#each quickStats as stat (stat.title)}
			<Card title={stat.title} subtitle={stat.change}>
				<p class="text-3xl font-semibold">{stat.value}</p>
			</Card>
		{/each}
	</div>

	<div class="mt-6 grid gap-4 md:grid-cols-3">
		<div class="md:col-span-2">
			<Card title="Traffic" subtitle="Last 24 hours">
				<p>Integrate charts here once the API is wired.</p>
			</Card>
		</div>
		<Card title="Tasks" subtitle="Today">
			<ul class="space-y-2">
				<li class="flex items-center justify-between">
					<span>Review onboarding flow</span>
					<span class="text-xs text-[var(--text-muted)]">Due in 3h</span>
				</li>
				<li class="flex items-center justify-between">
					<span>Prep billing report</span>
					<span class="text-xs text-[var(--text-muted)]">Due tomorrow</span>
				</li>
				<li class="flex items-center justify-between">
					<span>Reply to support</span>
					<span class="text-xs text-[var(--text-muted)]">5 pending</span>
				</li>
			</ul>
		</Card>
	</div>
</DashboardShell>
