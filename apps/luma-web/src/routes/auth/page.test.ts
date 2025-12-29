import { page } from 'vitest/browser';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LoginPage from './+page.svelte';

// Mock the auth service
vi.mock('$lib/auth/authService', () => ({
	authService: {
		isAuthenticated: vi.fn().mockResolvedValue(false),
		signIn: vi.fn()
	}
}));

// Mock navigation
vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('Login Page', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders login form with title', async () => {
		render(LoginPage);
		await expect.element(page.getByText('Welcome to Luma')).toBeInTheDocument();
		await expect.element(page.getByText('Sign in to your account')).toBeInTheDocument();
	});

	it('renders email and password inputs', async () => {
		render(LoginPage);
		await expect.element(page.getByLabelText(/Email/i)).toBeInTheDocument();
		await expect.element(page.getByLabelText(/Password/i)).toBeInTheDocument();
	});

	it('renders sign in button', async () => {
		render(LoginPage);
		await expect.element(page.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
	});

	it('shows link to registration page', async () => {
		render(LoginPage);
		await expect.element(page.getByText(/Don't have an account/i)).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: /Create one/i })).toBeInTheDocument();
	});

	it('has required fields marked', async () => {
		render(LoginPage);
		const emailInput = page.getByLabelText(/Email/i);
		const passwordInput = page.getByLabelText(/Password/i);
		await expect.element(emailInput).toHaveAttribute('required');
		await expect.element(passwordInput).toHaveAttribute('required');
	});
});
