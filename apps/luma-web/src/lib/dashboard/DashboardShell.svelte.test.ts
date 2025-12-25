import { page } from 'vitest/browser';
import { describe, expect, it, beforeEach, vi, afterEach, afterAll } from 'vitest';
import { render } from 'vitest-browser-svelte';
import DashboardShell from './DashboardShell.svelte';
import MatchMediaMock from 'vitest-matchmedia-mock';

let matchMediaMock = new MatchMediaMock();

const navItems = [
	{ id: 'overview', label: 'Overview', icon: '🏠' },
	{ id: 'users', label: 'Users', icon: '👥' }
];

describe('DashboardShell', () => {
	beforeEach(() => {
		window.localStorage.clear();
		document.documentElement.className = '';
		document.documentElement.removeAttribute('data-theme');
	});

	afterEach(() => {
		vi.resetAllMocks();
		matchMediaMock.clear();
	});

	afterAll(() => {
		// Clean up the mock after all tests are done
		matchMediaMock.destroy();
	});

	it('renders header and nav items', async () => {
		render(DashboardShell, { navItems, title: 'Test Dash', subtitle: 'Today' });
		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Test Dash' }))
			.toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
	});

	it('is expanded on desktop and collapses on toggle', async () => {
		matchMediaMock.useMediaQuery('(min-width: 768px)');
		render(DashboardShell, { navItems });
		const collapseButton = page.getByLabelText('Collapse sidebar');
		await expect.element(collapseButton).toBeInTheDocument();
		await collapseButton.click();
		await expect.element(page.getByLabelText('Expand sidebar')).toBeInTheDocument();
	});

	it('is collapsed on mobile by default', async () => {
		render(DashboardShell, { navItems });
		await expect.element(page.getByLabelText('Expand sidebar')).toBeInTheDocument();
	});

	it('toggles theme via button', async () => {
		render(DashboardShell, { navItems });
		const toggle = page.getByLabelText('Toggle dark mode');
		await toggle.click();
		await expect.poll(() => document.documentElement.dataset.theme).toBe('pastel-dark');
	});

	it('shows empty state when nav missing', async () => {
		render(DashboardShell, { navItems: [] });
		await expect.element(page.getByText('No sections')).toBeInTheDocument();
	});
});
