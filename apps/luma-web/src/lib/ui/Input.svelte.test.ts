import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Input from './Input.svelte';

describe('Input', () => {
	it('renders input with label', async () => {
		render(Input, {
			id: 'test-input',
			label: 'Test Label',
			value: ''
		});
		await expect.element(page.getByText('Test Label')).toBeInTheDocument();
		await expect.element(page.getByRole('textbox')).toBeInTheDocument();
	});

	it('shows required asterisk when required', async () => {
		render(Input, {
			id: 'test-input',
			label: 'Required Field',
			value: '',
			required: true
		});
		await expect.element(page.getByText('*')).toBeInTheDocument();
	});

	it('renders different input types', async () => {
		const { unmount } = render(Input, {
			id: 'email-input',
			type: 'email',
			value: ''
		});
		let input = page.getByRole('textbox');
		await expect.element(input).toHaveAttribute('type', 'email');
		unmount();

		render(Input, {
			id: 'password-input',
			type: 'password',
			value: ''
		});
		input = page.getByRole('textbox');
		await expect.element(input).toHaveAttribute('type', 'password');
	});

	it('displays error message when error prop is provided', async () => {
		render(Input, {
			id: 'test-input',
			value: '',
			error: 'This field is required'
		});
		await expect.element(page.getByText('This field is required')).toBeInTheDocument();
	});

	it('disables input when disabled prop is true', async () => {
		render(Input, {
			id: 'test-input',
			value: '',
			disabled: true
		});
		const input = page.getByRole('textbox');
		await expect.element(input).toBeDisabled();
	});

	it('renders placeholder text', async () => {
		render(Input, {
			id: 'test-input',
			value: '',
			placeholder: 'Enter text here'
		});
		const input = page.getByRole('textbox');
		await expect.element(input).toHaveAttribute('placeholder', 'Enter text here');
	});
});
