import { expect, it, vi, describe } from 'vitest';
import Sidebar from './Sidebar.svelte';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';

const items = [
	{ id: 'overview', label: 'Overview' },
	{ id: 'users', label: 'Users', badge: '5' }
];

describe('Sidebar', () => {
	it('renders items and badges', async () => {
		// render(Sidebar, { props: { items, activeId: 'users' } });
		render(Sidebar, { items, activeId: 'users' });
		await expect.element(page.getByRole('link', { name: 'Overview' })).toBeInTheDocument();
		await expect.element(page.getByText('5')).toBeInTheDocument();
		const active = page.getByRole('link', { name: 'Users' });
		await expect.element(active).toBeInTheDocument();
		await expect.element(active).toHaveAttribute('aria-current', 'page');
	});

	it('emits select with id', async () => {
		const onSelect = vi.fn();
		render(Sidebar, { items, select: onSelect });
		const link = page.getByRole('link', { name: 'Users' });
		await link.click();
		expect(onSelect).toHaveBeenCalledWith('users');
	});
});
