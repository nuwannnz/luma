import type { Task, Project, Note } from '$lib/types';
import { browser } from '$app/environment';

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
	if (!browser) return defaultValue;
	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch {
		return defaultValue;
	}
}

function saveToStorage<T>(key: string, value: T): void {
	if (!browser) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error('Failed to save to localStorage:', error);
	}
}

class DataStore {
	tasks = $state<Task[]>([]);
	projects = $state<Project[]>([]);
	notes = $state<Note[]>([]);

	constructor() {
		this.load();
	}

	load() {
		this.tasks = loadFromStorage('luma-tasks', []);
		this.projects = loadFromStorage('luma-projects', []);
		this.notes = loadFromStorage('luma-notes', []);
	}

	private saveTasks() {
		saveToStorage('luma-tasks', this.tasks);
	}

	private saveProjects() {
		saveToStorage('luma-projects', this.projects);
	}

	private saveNotes() {
		saveToStorage('luma-notes', this.notes);
	}

	// Task operations
	createTask(
		title: string,
		description: string,
		date?: string,
		projectId?: string
	): Task {
		const now = new Date().toISOString();
		const task: Task = {
			id: generateId(),
			title,
			description,
			projectId,
			date,
			completed: false,
			createdAt: now,
			updatedAt: now
		};
		this.tasks = [...this.tasks, task];
		this.saveTasks();
		return task;
	}

	updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
		this.tasks = this.tasks.map((task) =>
			task.id === id
				? { ...task, ...updates, updatedAt: new Date().toISOString() }
				: task
		);
		this.saveTasks();
	}

	deleteTask(id: string): void {
		this.tasks = this.tasks.filter((task) => task.id !== id);
		this.saveTasks();
	}

	getTasksByDate(date: string): Task[] {
		return this.tasks.filter((task) => task.date === date);
	}

	getTasksByProject(projectId: string): Task[] {
		return this.tasks.filter((task) => task.projectId === projectId);
	}

	// Project operations
	createProject(name: string, description: string): Project {
		const now = new Date().toISOString();
		const project: Project = {
			id: generateId(),
			name,
			description,
			tasks: [],
			createdAt: now,
			updatedAt: now
		};
		this.projects = [...this.projects, project];
		this.saveProjects();
		return project;
	}

	updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'tasks'>>): void {
		this.projects = this.projects.map((project) =>
			project.id === id
				? { ...project, ...updates, updatedAt: new Date().toISOString() }
				: project
		);
		this.saveProjects();
	}

	deleteProject(id: string): void {
		this.projects = this.projects.filter((project) => project.id !== id);
		// Remove project reference from tasks
		this.tasks = this.tasks.map((task) =>
			task.projectId === id ? { ...task, projectId: undefined } : task
		);
		this.saveProjects();
		this.saveTasks();
	}

	getProjectById(id: string): Project | undefined {
		return this.projects.find((project) => project.id === id);
	}

	// Note operations
	createNote(title: string, body: string): Note {
		const now = new Date().toISOString();
		const note: Note = {
			id: generateId(),
			title,
			body,
			projectIds: [],
			taskIds: [],
			createdAt: now,
			updatedAt: now
		};
		this.notes = [...this.notes, note];
		this.saveNotes();
		return note;
	}

	updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): void {
		this.notes = this.notes.map((note) =>
			note.id === id
				? { ...note, ...updates, updatedAt: new Date().toISOString() }
				: note
		);
		this.saveNotes();
	}

	deleteNote(id: string): void {
		this.notes = this.notes.filter((note) => note.id !== id);
		this.saveNotes();
	}

	tagNoteToProject(noteId: string, projectId: string): void {
		this.notes = this.notes.map((note) => {
			if (note.id === noteId && !note.projectIds.includes(projectId)) {
				return {
					...note,
					projectIds: [...note.projectIds, projectId],
					updatedAt: new Date().toISOString()
				};
			}
			return note;
		});
		this.saveNotes();
	}

	untagNoteFromProject(noteId: string, projectId: string): void {
		this.notes = this.notes.map((note) => {
			if (note.id === noteId) {
				return {
					...note,
					projectIds: note.projectIds.filter((id) => id !== projectId),
					updatedAt: new Date().toISOString()
				};
			}
			return note;
		});
		this.saveNotes();
	}

	tagNoteToTask(noteId: string, taskId: string): void {
		this.notes = this.notes.map((note) => {
			if (note.id === noteId && !note.taskIds.includes(taskId)) {
				return {
					...note,
					taskIds: [...note.taskIds, taskId],
					updatedAt: new Date().toISOString()
				};
			}
			return note;
		});
		this.saveNotes();
	}

	untagNoteFromTask(noteId: string, taskId: string): void {
		this.notes = this.notes.map((note) => {
			if (note.id === noteId) {
				return {
					...note,
					taskIds: note.taskIds.filter((id) => id !== taskId),
					updatedAt: new Date().toISOString()
				};
			}
			return note;
		});
		this.saveNotes();
	}
}

export const dataStore = new DataStore();
