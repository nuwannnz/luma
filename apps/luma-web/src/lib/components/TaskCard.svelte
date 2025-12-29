<script lang="ts">
	import type { Task } from '$lib/types';
	import { dataStore } from '$lib/stores/dataStore.svelte';

	let {
		task,
		onDelete
	}: {
		task: Task;
		onDelete?: (id: string) => void;
	} = $props();

	let isEditing = $state(false);
	let editTitle = $state(task.title);
	let editDescription = $state(task.description);

	const projectName = $derived(() => {
		if (!task.projectId) return null;
		const project = dataStore.getProjectById(task.projectId);
		return project?.name || null;
	});

	function handleToggleComplete() {
		dataStore.updateTask(task.id, { completed: !task.completed });
	}

	function handleEdit() {
		editTitle = task.title;
		editDescription = task.description;
		isEditing = true;
	}

	function handleSave() {
		if (editTitle.trim()) {
			dataStore.updateTask(task.id, {
				title: editTitle.trim(),
				description: editDescription.trim()
			});
		}
		isEditing = false;
	}

	function handleCancel() {
		isEditing = false;
	}

	function handleDelete() {
		if (confirm('Are you sure you want to delete this task?')) {
			dataStore.deleteTask(task.id);
			onDelete?.(task.id);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && event.ctrlKey) {
			handleSave();
		} else if (event.key === 'Escape') {
			handleCancel();
		}
	}
</script>

{#if isEditing}
	<div class="card-surface p-3 space-y-2">
		<input
			type="text"
			bind:value={editTitle}
			onkeydown={handleKeydown}
			class="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
			placeholder="Task title"
			autofocus
		/>
		<textarea
			bind:value={editDescription}
			onkeydown={handleKeydown}
			rows="3"
			class="w-full px-2 py-1 text-sm border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none"
			placeholder="Description"
		></textarea>
		<div class="flex gap-2 justify-end">
			<button
				type="button"
				onclick={handleCancel}
				class="px-2 py-1 text-xs rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={handleSave}
				class="px-2 py-1 text-xs rounded bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-strong)]"
			>
				Save
			</button>
		</div>
	</div>
{:else}
	<div
		class="card-surface p-3 hover:shadow-md transition-shadow cursor-pointer group"
		draggable="true"
		role="button"
		tabindex="0"
	>
		<div class="flex items-start gap-2">
			<input
				type="checkbox"
				checked={task.completed}
				onchange={handleToggleComplete}
				class="mt-0.5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
			/>
			<div class="flex-1 min-w-0">
				<h3
					class="text-sm font-medium text-[var(--text)] {task.completed
						? 'line-through opacity-60'
						: ''}"
				>
					{task.title}
				</h3>
				{#if task.description}
					<p
						class="text-xs text-[var(--text-muted)] mt-1 line-clamp-2 {task.completed
							? 'line-through opacity-60'
							: ''}"
					>
						{task.description}
					</p>
				{/if}
				{#if projectName()}
					<span
						class="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--text)]"
					>
						{projectName()}
					</span>
				{/if}
			</div>
			<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
				<button
					type="button"
					onclick={handleEdit}
					class="p-1 text-xs rounded hover:bg-[var(--muted)]"
					title="Edit"
				>
					✏️
				</button>
				<button
					type="button"
					onclick={handleDelete}
					class="p-1 text-xs rounded hover:bg-[var(--muted)]"
					title="Delete"
				>
					🗑️
				</button>
			</div>
		</div>
	</div>
{/if}
