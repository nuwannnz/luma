<script lang="ts">
	import DashboardShell from '$lib/dashboard/DashboardShell.svelte';
	import Card from '$lib/ui/Card.svelte';
	import type { SidebarItemType } from '$lib/ui/types';
	import type { Project, Task } from '$lib/types';
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { dataStore } from '$lib/stores/dataStore.svelte';

	let userEmail = $state('');
	let showCreateProject = $state(false);
	let newProjectName = $state('');
	let newProjectDescription = $state('');
	let selectedProject = $state<Project | null>(null);
	let showAddTask = $state(false);
	let newTaskTitle = $state('');
	let newTaskDescription = $state('');

	onMount(() => {
		userEmail = authService.getStoredUserEmail() || 'User';
	});

	const navItems: SidebarItemType[] = [
		{ id: 'week', label: 'My Week', icon: '📅', href: '/me/week' },
		{ id: 'projects', label: 'Projects', icon: '📁', href: '/me/projects' },
		{ id: 'notes', label: 'Notes', icon: '📝', href: '/me/notes' }
	];

	function handleLogout() {
		authService.signOut();
		goto('/auth');
	}

	function handleCreateProject() {
		showCreateProject = true;
	}

	function handleSaveProject() {
		if (newProjectName.trim()) {
			dataStore.createProject(newProjectName.trim(), newProjectDescription.trim());
			newProjectName = '';
			newProjectDescription = '';
			showCreateProject = false;
		}
	}

	function handleCancelCreate() {
		newProjectName = '';
		newProjectDescription = '';
		showCreateProject = false;
	}

	function handleSelectProject(project: Project) {
		selectedProject = project;
	}

	function handleBackToList() {
		selectedProject = null;
		showAddTask = false;
	}

	function handleAddTask() {
		showAddTask = true;
	}

	function handleSaveTask() {
		if (newTaskTitle.trim() && selectedProject) {
			dataStore.createTask(
				newTaskTitle.trim(),
				newTaskDescription.trim(),
				undefined,
				selectedProject.id
			);
			newTaskTitle = '';
			newTaskDescription = '';
			showAddTask = false;
		}
	}

	function handleCancelAddTask() {
		newTaskTitle = '';
		newTaskDescription = '';
		showAddTask = false;
	}

	function handleDeleteProject(projectId: string) {
		if (confirm('Are you sure you want to delete this project?')) {
			dataStore.deleteProject(projectId);
			if (selectedProject?.id === projectId) {
				selectedProject = null;
			}
		}
	}

	function handleDeleteTask(taskId: string) {
		if (confirm('Are you sure you want to delete this task?')) {
			dataStore.deleteTask(taskId);
		}
	}

	function getProjectTasks(projectId: string): Task[] {
		return dataStore.getTasksByProject(projectId);
	}
</script>

<DashboardShell
	{navItems}
	title="Projects"
	subtitle={selectedProject ? selectedProject.name : 'Manage your projects'}
	userName={userEmail}
	defaultActiveId="projects"
>
	{#snippet headerActions()}
		<div class="flex items-center gap-2">
			{#if selectedProject}
				<button
					type="button"
					onclick={handleBackToList}
					class="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--accent)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
				>
					◀ Back
				</button>
			{/if}
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

	{#if selectedProject}
		<!-- Project Detail View -->
		<div class="space-y-6">
			<Card>
				<div class="space-y-4">
					<div>
						<h3 class="text-lg font-semibold text-[var(--text)]">{selectedProject.name}</h3>
						<p class="text-sm text-[var(--text-muted)] mt-1">{selectedProject.description}</p>
					</div>
					<button
						type="button"
						onclick={() => selectedProject && handleDeleteProject(selectedProject.id)}
						class="text-sm text-red-600 hover:text-red-800"
					>
						Delete Project
					</button>
				</div>
			</Card>

			<Card title="Tasks">
				<div class="space-y-4">
					<button
						type="button"
						onclick={handleAddTask}
						class="w-full px-4 py-2 text-sm rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
					>
						+ Add Task
					</button>

					{#if showAddTask}
						<div class="card-surface p-4 space-y-3">
							<input
								type="text"
								bind:value={newTaskTitle}
								class="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
								placeholder="Task title"
								autofocus
							/>
							<textarea
								bind:value={newTaskDescription}
								rows="3"
								class="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
								placeholder="Description"
							></textarea>
							<div class="flex gap-2 justify-end">
								<button
									type="button"
									onclick={handleCancelAddTask}
									class="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
								>
									Cancel
								</button>
								<button
									type="button"
									onclick={handleSaveTask}
									class="px-3 py-2 text-sm rounded bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-strong)]"
								>
									Add Task
								</button>
							</div>
						</div>
					{/if}

					{#each getProjectTasks(selectedProject.id) as task (task.id)}
						<div class="card-surface p-4">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1">
									<h4 class="font-medium text-[var(--text)]">{task.title}</h4>
									{#if task.description}
										<p class="text-sm text-[var(--text-muted)] mt-1">{task.description}</p>
									{/if}
									{#if task.date}
										<p class="text-xs text-[var(--text-muted)] mt-2">
											Scheduled: {task.date}
										</p>
									{/if}
								</div>
								<button
									type="button"
									onclick={() => handleDeleteTask(task.id)}
									class="p-1 text-xs rounded hover:bg-[var(--muted)]"
									title="Delete"
								>
									🗑️
								</button>
							</div>
						</div>
					{:else}
						<p class="text-sm text-[var(--text-muted)] text-center py-4">No tasks yet</p>
					{/each}
				</div>
			</Card>
		</div>
	{:else}
		<!-- Projects List View -->
		<div class="space-y-4">
			<button
				type="button"
				onclick={handleCreateProject}
				class="w-full px-4 py-3 text-sm rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
			>
				+ Create New Project
			</button>

			{#if showCreateProject}
				<Card>
					<div class="space-y-3">
						<input
							type="text"
							bind:value={newProjectName}
							class="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
							placeholder="Project name"
							autofocus
						/>
						<textarea
							bind:value={newProjectDescription}
							rows="3"
							class="w-full px-3 py-2 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
							placeholder="Project description"
						></textarea>
						<div class="flex gap-2 justify-end">
							<button
								type="button"
								onclick={handleCancelCreate}
								class="px-3 py-2 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
							>
								Cancel
							</button>
							<button
								type="button"
								onclick={handleSaveProject}
								class="px-3 py-2 text-sm rounded bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-strong)]"
							>
								Create Project
							</button>
						</div>
					</div>
				</Card>
			{/if}

			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each dataStore.projects as project (project.id)}
					<Card>
						<button
							type="button"
							onclick={() => handleSelectProject(project)}
							class="w-full text-left space-y-2 hover:bg-[var(--muted)]/30 -m-6 p-6 rounded-xl transition-colors"
						>
							<h3 class="font-semibold text-[var(--text)]">{project.name}</h3>
							<p class="text-sm text-[var(--text-muted)] line-clamp-2">{project.description}</p>
							<p class="text-xs text-[var(--text-muted)] mt-2">
								{getProjectTasks(project.id).length} tasks
							</p>
						</button>
					</Card>
				{:else}
					<p class="text-sm text-[var(--text-muted)] col-span-full text-center py-8">
						No projects yet. Create your first project to get started!
					</p>
				{/each}
			</div>
		</div>
	{/if}
</DashboardShell>
