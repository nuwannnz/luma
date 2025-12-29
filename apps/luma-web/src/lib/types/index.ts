export interface Task {
	id: string;
	title: string;
	description: string;
	projectId?: string;
	date?: string; // ISO date string (YYYY-MM-DD)
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Project {
	id: string;
	name: string;
	description: string;
	tasks: Task[];
	createdAt: string;
	updatedAt: string;
}

export interface Note {
	id: string;
	title: string;
	body: string; // markdown content
	projectIds: string[];
	taskIds: string[];
	createdAt: string;
	updatedAt: string;
}

export interface WeekView {
	startDate: string; // ISO date string
	endDate: string; // ISO date string
}
