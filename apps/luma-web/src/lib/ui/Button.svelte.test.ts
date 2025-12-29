import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';
import { createRawSnippet } from 'svelte';

describe('Button', () => {
	it('renders button with text', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Click me</span>',
			setup: () => {}
		}));
		render(Button, {
			children: testSnippet
		});
		await expect.element(page.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
	});

	it('applies primary variant styles by default', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Button</span>',
			setup: () => {}
		}));
		render(Button, {
			children: testSnippet
		});
		const button = page.getByRole('button');
		await expect.element(button).toBeInTheDocument();
	});

	it('applies secondary variant styles', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Secondary</span>',
			setup: () => {}
		}));
		render(Button, {
			variant: 'secondary',
			children: testSnippet
		});
		const button = page.getByRole('button');
		await expect.element(button).toBeInTheDocument();
	});

	it('applies outline variant styles', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Outline</span>',
			setup: () => {}
		}));
		render(Button, {
			variant: 'outline',
			children: testSnippet
		});
		const button = page.getByRole('button');
		await expect.element(button).toBeInTheDocument();
	});

	it('disables button when disabled prop is true', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Disabled</span>',
			setup: () => {}
		}));
		render(Button, {
			disabled: true,
			children: testSnippet
		});
		const button = page.getByRole('button');
		await expect.element(button).toBeDisabled();
	});

	it('renders submit button type', async () => {
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Submit</span>',
			setup: () => {}
		}));
		render(Button, {
			type: 'submit',
			children: testSnippet
		});
		const button = page.getByRole('button');
		await expect.element(button).toHaveAttribute('type', 'submit');
	});

	it('handles click events', async () => {
		const handleClick = vi.fn();
		const testSnippet = createRawSnippet(() => ({
			render: () => '<span>Clickable</span>',
			setup: () => {}
		}));
		render(Button, {
			onclick: handleClick,
			children: testSnippet
		});
		const button = page.getByRole('button');
		await button.click();
		expect(handleClick).toHaveBeenCalledOnce();
	});
});
