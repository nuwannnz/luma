import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from './Card.svelte';
import { createRawSnippet } from 'svelte';

describe('Card', () => {
	it('renders title and subtitle', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<p>Content</p>',
			setup: () => {}
		}));
		render(Card, {
			title: 'Card Title',
			subtitle: 'Details',
			children: testSnippet
		});
		await expect.element(page.getByText('Card Title')).toBeInTheDocument();
		await expect.element(page.getByText('Details')).toBeInTheDocument();
		await expect.element(page.getByText('Content')).toBeInTheDocument();
	});

	it('renders slot only when no title provided', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<p>Plain content</p>',
			setup: () => {}
		}));

		render(Card, { children: testSnippet });
		await expect.element(page.getByText('Plain content')).toBeInTheDocument();
	});
});
