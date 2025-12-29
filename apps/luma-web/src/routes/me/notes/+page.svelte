<script lang="ts">
	import DashboardShell from '$lib/dashboard/DashboardShell.svelte';
	import Card from '$lib/ui/Card.svelte';
	import MarkdownEditor from '$lib/components/MarkdownEditor.svelte';
	import type { SidebarItemType } from '$lib/ui/types';
	import type { Note } from '$lib/types';
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { dataStore } from '$lib/stores/dataStore.svelte';

	let userEmail = $state('');
	let showCreateNote = $state(false);
	let selectedNote = $state<Note | null>(null);
	let newNoteTitle = $state('');
	let newNoteBody = $state('');
	let editNoteTitle = $state('');
	let editNoteBody = $state('');
	let isEditing = $state(false);
	let showTagging = $state(false);

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

	function handleCreateNote() {
		showCreateNote = true;
	}

	function handleSaveNote() {
		if (newNoteTitle.trim()) {
			dataStore.createNote(newNoteTitle.trim(), newNoteBody);
			newNoteTitle = '';
			newNoteBody = '';
			showCreateNote = false;
		}
	}

	function handleCancelCreate() {
		newNoteTitle = '';
		newNoteBody = '';
		showCreateNote = false;
	}

	function handleSelectNote(note: Note) {
		selectedNote = note;
		editNoteTitle = note.title;
		editNoteBody = note.body;
		isEditing = false;
	}

	function handleBackToList() {
		selectedNote = null;
		isEditing = false;
		showTagging = false;
	}

	function handleEditNote() {
		isEditing = true;
	}

	function handleSaveEdit() {
		if (selectedNote && editNoteTitle.trim()) {
			dataStore.updateNote(selectedNote.id, {
				title: editNoteTitle.trim(),
				body: editNoteBody
			});
			selectedNote = { ...selectedNote, title: editNoteTitle.trim(), body: editNoteBody };
			isEditing = false;
		}
	}

	function handleCancelEdit() {
		if (selectedNote) {
			editNoteTitle = selectedNote.title;
			editNoteBody = selectedNote.body;
		}
		isEditing = false;
	}

	function handleDeleteNote(noteId: string) {
		if (confirm('Are you sure you want to delete this note?')) {
			dataStore.deleteNote(noteId);
			if (selectedNote?.id === noteId) {
				selectedNote = null;
			}
		}
	}

	function handleToggleTagging() {
		showTagging = !showTagging;
	}

	function handleToggleProjectTag(projectId: string) {
		if (!selectedNote) return;
		
		if (selectedNote.projectIds.includes(projectId)) {
			dataStore.untagNoteFromProject(selectedNote.id, projectId);
			selectedNote = {
				...selectedNote,
				projectIds: selectedNote.projectIds.filter((id) => id !== projectId)
			};
		} else {
			dataStore.tagNoteToProject(selectedNote.id, projectId);
			selectedNote = {
				...selectedNote,
				projectIds: [...selectedNote.projectIds, projectId]
			};
		}
	}

	function getProjectName(projectId: string): string {
		const project = dataStore.getProjectById(projectId);
		return project?.name || 'Unknown Project';
	}

	function renderMarkdownPreview(text: string): string {
		let html = text;
		html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-2 mb-1">$1</h3>');
		html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>');
		html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');
		html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
		html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
		html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[var(--accent-strong)] hover:underline">$1</a>');
		html = html.replace(/\n\n/g, '</p><p class="my-2">');
		html = html.replace(/\n/g, '<br>');
		return `<p class="my-2">${html}</p>`;
	}
</script>

<DashboardShell
	{navItems}
	title="Notes"
	subtitle={selectedNote ? selectedNote.title : 'Manage your notes'}
	userName={userEmail}
	defaultActiveId="notes"
>
	{#snippet headerActions()}
		<div class="flex items-center gap-2">
			{#if selectedNote}
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

	{#if selectedNote}
		<!-- Note Detail View -->
		<div class="space-y-6">
			<Card>
				{#if isEditing}
					<div class="space-y-4">
						<input
							type="text"
							bind:value={editNoteTitle}
							class="w-full px-3 py-2 text-lg font-semibold border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
							placeholder="Note title"
							autofocus
						/>
						<MarkdownEditor bind:value={editNoteBody} />
						<div class="flex gap-2 justify-end">
							<button
								type="button"
								onclick={handleCancelEdit}
								class="px-4 py-2 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
							>
								Cancel
							</button>
							<button
								type="button"
								onclick={handleSaveEdit}
								class="px-4 py-2 text-sm rounded bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-strong)]"
							>
								Save
							</button>
						</div>
					</div>
				{:else}
					<div class="space-y-4">
						<div class="flex justify-between items-start">
							<h3 class="text-xl font-semibold text-[var(--text)]">{selectedNote.title}</h3>
							<div class="flex gap-2">
								<button
									type="button"
									onclick={handleToggleTagging}
									class="px-3 py-1 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
								>
									🏷️ Tags
								</button>
								<button
									type="button"
									onclick={handleEditNote}
									class="px-3 py-1 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
								>
									✏️ Edit
								</button>
								<button
									type="button"
									onclick={() => selectedNote && handleDeleteNote(selectedNote.id)}
									class="px-3 py-1 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-red-600 hover:bg-red-100"
								>
									🗑️ Delete
								</button>
							</div>
						</div>

						{#if showTagging}
							<div class="border-t border-[var(--border)] pt-4">
								<h4 class="text-sm font-medium text-[var(--text)] mb-2">Tag Projects</h4>
								<div class="space-y-2">
									{#each dataStore.projects as project (project.id)}
										<label class="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												checked={selectedNote.projectIds.includes(project.id)}
												onchange={() => handleToggleProjectTag(project.id)}
												class="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
											/>
											<span class="text-sm text-[var(--text)]">{project.name}</span>
										</label>
									{:else}
										<p class="text-sm text-[var(--text-muted)]">
											No projects available. Create a project first.
										</p>
									{/each}
								</div>
							</div>
						{/if}

						{#if selectedNote.projectIds.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each selectedNote.projectIds as projectId (projectId)}
									<span
										class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--text)]"
									>
										📁 {getProjectName(projectId)}
									</span>
								{/each}
							</div>
						{/if}

						<div class="prose prose-sm max-w-none mt-4">
							{@html renderMarkdownPreview(selectedNote.body)}
						</div>
					</div>
				{/if}
			</Card>
		</div>
	{:else}
		<!-- Notes List View -->
		<div class="space-y-4">
			<button
				type="button"
				onclick={handleCreateNote}
				class="w-full px-4 py-3 text-sm rounded-lg border-2 border-dashed border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
			>
				+ Create New Note
			</button>

			{#if showCreateNote}
				<Card>
					<div class="space-y-4">
						<input
							type="text"
							bind:value={newNoteTitle}
							class="w-full px-3 py-2 text-lg font-semibold border border-[var(--border)] rounded bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
							placeholder="Note title"
							autofocus
						/>
						<MarkdownEditor bind:value={newNoteBody} />
						<div class="flex gap-2 justify-end">
							<button
								type="button"
								onclick={handleCancelCreate}
								class="px-4 py-2 text-sm rounded border border-[var(--border)] bg-[var(--muted)] text-[var(--text)] hover:bg-[var(--accent)]/30"
							>
								Cancel
							</button>
							<button
								type="button"
								onclick={handleSaveNote}
								class="px-4 py-2 text-sm rounded bg-[var(--accent)] text-[var(--text)] hover:bg-[var(--accent-strong)]"
							>
								Create Note
							</button>
						</div>
					</div>
				</Card>
			{/if}

			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each dataStore.notes as note (note.id)}
					<Card>
						<button
							type="button"
							onclick={() => handleSelectNote(note)}
							class="w-full text-left space-y-2 hover:bg-[var(--muted)]/30 -m-6 p-6 rounded-xl transition-colors"
						>
							<h3 class="font-semibold text-[var(--text)]">{note.title}</h3>
							<p class="text-sm text-[var(--text-muted)] line-clamp-3">
								{note.body.substring(0, 150)}...
							</p>
							{#if note.projectIds.length > 0}
								<div class="flex flex-wrap gap-1 mt-2">
									{#each note.projectIds.slice(0, 2) as projectId (projectId)}
										<span
											class="inline-block px-2 py-0.5 text-xs rounded-full bg-[var(--accent)]/20 text-[var(--text)]"
										>
											{getProjectName(projectId)}
										</span>
									{/each}
									{#if note.projectIds.length > 2}
										<span class="text-xs text-[var(--text-muted)]">
											+{note.projectIds.length - 2} more
										</span>
									{/if}
								</div>
							{/if}
						</button>
					</Card>
				{:else}
					<p class="text-sm text-[var(--text-muted)] col-span-full text-center py-8">
						No notes yet. Create your first note to get started!
					</p>
				{/each}
			</div>
		</div>
	{/if}
</DashboardShell>
