import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import HeaderBar from './HeaderBar.svelte';
import type { Theme } from '$lib/config';

const themes = [
	{ id: 'pastel', label: 'Pastel Light', mode: 'light' } as Theme,
	{ id: 'pastel-dark', label: 'Pastel Dark', mode: 'dark' } as Theme
];

describe('HeaderBar', () => {
	it('shows title and user', async () => {
		render(HeaderBar, {
			title: 'Dash',
			subtitle: 'Today',
			userName: 'Alex',
			themeId: 'pastel',
			themes
		});
		await expect.element(page.getByRole('heading', { level: 1, name: 'Dash' })).toBeInTheDocument();
		await expect.element(page.getByText('Alex')).toBeInTheDocument();
	});

	it('emits sidebar toggle', async () => {
		const handler = vi.fn();
		render(HeaderBar, {
			title: 'Dash',
			themeId: 'pastel',
			themes,
			toggleSidebar: handler
		});
		await page.getByLabelText('Collapse sidebar').click();
		expect(handler).toHaveBeenCalledOnce();
	});

	it('emits theme change from select', async () => {
		const handler = vi.fn();
		render(HeaderBar, {
			title: 'Dash',
			themeId: 'pastel',
			themes,
			themeChange: handler
		});
		await page.getByLabelText('Select theme').selectOptions('pastel-dark');
		expect(handler).toHaveBeenCalledWith('pastel-dark');
	});

	it('emits themeToggle', async () => {
		const handler = vi.fn();
		render(HeaderBar, {
			title: 'Dash',
			themeId: 'pastel',
			themes,
			ready: true,
			themeToggle: handler
		});
		await page.getByLabelText('Toggle dark mode').click();
		expect(handler).toHaveBeenCalledOnce();
	});
});
