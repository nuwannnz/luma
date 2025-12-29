<script lang="ts">
	import type { Task } from '$lib/types';
	import { dataStore } from '$lib/stores/dataStore.svelte';
	import TaskCard from './TaskCard.svelte';
	import { formatDate, getDayName, getDayAndMonth, isToday } from '$lib/utils/dateUtils';

	let {
		date,
		isCombined = false,
		label = null
	}: {
		date: Date;
		isCombined?: boolean;
		label?: string | null;
	} = $props();

	let showAddTask = $state(false);
	let newTaskTitle = $state('');
	let newTaskDescription = $state('');
	let selectedProject = $state<string>('');

	const dateStr = $derived(formatDate(date));
	const dayTasks = $derived(dataStore.tasks.filter((task) => task.date === dateStr));
	const dayName = $derived(label || getDayName(date));
	const dayDate = $derived(getDayAndMonth(date));
	const isCurrentDay = $derived(isToday(date));

	function handleAddTask() {
		showAddTask = true;
	}

	function handleSaveTask() {
		if (newTaskTitle.trim()) {
			dataStore.createTask(
				newTaskTitle.trim(),
				newTaskDescription.trim(),
				dateStr,
				selectedProject || undefined
			);
			newTaskTitle = '';
			newTaskDescription = '';
			selectedProject = '';
			showAddTask = false;
		}
	}

	function handleCancelAdd() {
		newTaskTitle = '';
		newTaskDescription = '';
		selectedProject = '';
		showAddTask = false;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		// Drag and drop functionality can be enhanced later
	}
</script>

<div
	class="flex flex-col bg-[var(--muted)] rounded-lg p-3 min-h-[300px] {isCombined
		? 'flex-1'
		: 'w-full'}"
	ondragover={handleDragOver}
	ondrop={handleDrop}
>
	<div class="flex items-center justify-between mb-3">
		<div>
			<h3
				class="font-semibold text-sm text-[var(--text)] {isCurrentDay
					? 'text-[var(--accent-strong)]'
					: ''}"
			>
				{dayName}
			</h3>
			<p class="text-xs text-[var(--text-muted)]">{dayDate}</p>
		</div>
		<button
			type="button"
			onclick={handleAddTask}
			class="p-1 rounded hover:bg-[var(--accent)]/30 text-[var(--text)]"
			title="Add task"
		>
			➕
		</button>
	</div>

	<div class="flex-1 space-y-2 overflow-y-auto">
		{#if showAddTask}
			<div class="card-surface p-3 space-y-2">
				<input
					type="text"
					bind:value={newTaskTitle}
					class="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
					placeholder="Task title"
					autofocus
				/>
				<textarea
					bind:value={newTaskDescription}
					rows="3"
					class="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
					placeholder="Description"
				></textarea>
				<select
					bind:value={selectedProject}
					class="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
				>
					<option value="">No Project</option>
					{#each dataStore.projects as project (project.id)}
						<option value={project.id}>{project.name}</option>
					{/each}
				</select>
				<div class="flex gap-2 justify-end">
					<button
						type="button"
						onclick={handleCancelAdd}
						class="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
					>
						Cancel
					</button>
					<button
						type="button"
						onclick={handleSaveTask}
						class="px-2 py-1 text-xs rounded bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-strong)]"
					>
						Add Task
					</button>
				</div>
			</div>
		{/if}

		{#each dayTasks as task (task.id)}
			<TaskCard {task} />
		{/each}

		{#if dayTasks.length === 0 && !showAddTask}
			<p class="text-xs text-[var(--text-muted)] text-center py-4">No tasks</p>
		{/if}
	</div>
</div>
