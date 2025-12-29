import { page } from 'vitest/browser';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import RegisterPage from './+page.svelte';

// Mock the auth service
vi.mock('$lib/auth/authService', () => ({
	authService: {
		isAuthenticated: vi.fn().mockResolvedValue(false),
		signUp: vi.fn()
	}
}));

// Mock navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Register Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders registration form with title', async () => {
		render(RegisterPage);
		await expect.element(page.getByText('Create Account')).toBeInTheDocument();
		await expect.element(page.getByText('Join Luma today')).toBeInTheDocument();
	});

	it('renders all required input fields', async () => {
		render(RegisterPage);
		await expect.element(page.getByLabelText(/Full Name/i)).toBeInTheDocument();
		await expect.element(page.getByLabelText('Email')).toBeInTheDocument();
		await expect.element(page.getByLabelText('Password', { exact: true })).toBeInTheDocument();
		await expect
			.element(page.getByLabelText(/Confirm Password/i))
			.toBeInTheDocument();
	});

	it('renders create account button', async () => {
		render(RegisterPage);
		await expect
			.element(page.getByRole('button', { name: /Create Account/i }))
			.toBeInTheDocument();
	});

	it('shows password requirements', async () => {
		render(RegisterPage);
		await expect
			.element(page.getByText(/Password must be at least 8 characters/i))
			.toBeInTheDocument();
	});

	it('shows link to login page', async () => {
		render(RegisterPage);
		await expect.element(page.getByText(/Already have an account/i)).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: /Sign in/i })).toBeInTheDocument();
	});

	it('has all fields marked as required', async () => {
		render(RegisterPage);
		const nameInput = page.getByLabelText(/Full Name/i);
		const emailInput = page.getByLabelText('Email');
		const passwordInput = page.getByLabelText('Password', { exact: true });
		const confirmPasswordInput = page.getByLabelText(/Confirm Password/i);

		await expect.element(nameInput).toHaveAttribute('required');
		await expect.element(emailInput).toHaveAttribute('required');
		await expect.element(passwordInput).toHaveAttribute('required');
		await expect.element(confirmPasswordInput).toHaveAttribute('required');
	});
});
