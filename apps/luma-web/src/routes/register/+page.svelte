<script lang="ts">
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$lib/ui/Input.svelte';
	import Button from '$lib/ui/Button.svelte';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let success = $state(false);
	let isLoading = $state(false);

	onMount(async () => {
		// Redirect to dashboard if already authenticated
		const isAuthenticated = await authService.isAuthenticated();
		if (isAuthenticated) {
			goto('/me');
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		error = '';
		success = false;

		// Validate passwords match
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		// Validate password requirements
		if (password.length < 8) {
			error = 'Password must be at least 8 characters long';
			return;
		}
		if (!/[A-Z]/.test(password)) {
			error = 'Password must contain at least one uppercase letter';
			return;
		}
		if (!/[a-z]/.test(password)) {
			error = 'Password must contain at least one lowercase letter';
			return;
		}
		if (!/[0-9]/.test(password)) {
			error = 'Password must contain at least one digit';
			return;
		}

		isLoading = true;

		try {
			await authService.signUp(name, email, password);
			success = true;
			// Redirect to login after successful registration
			setTimeout(() => {
				goto('/auth');
			}, 2000);
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message || 'Failed to register. Please try again.';
			} else {
				error = 'Failed to register. Please try again.';
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-[var(--surface)] px-4">
	<div class="w-full max-w-md">
		<div class="bg-[var(--card)] rounded-lg border border-[var(--border)] p-8 shadow-lg">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-[var(--text)]">Create Account</h1>
				<p class="text-[var(--text-muted)] mt-2">Join Luma today</p>
			</div>

			<form onsubmit={handleSubmit}>
				<div class="space-y-4">
					<Input
						id="name"
						type="text"
						label="Full Name"
						placeholder="John Doe"
						bind:value={name}
						required={true}
						disabled={isLoading}
					/>

					<Input
						id="email"
						type="email"
						label="Email"
						placeholder="you@example.com"
						bind:value={email}
						required={true}
						disabled={isLoading}
					/>

					<Input
						id="password"
						type="password"
						label="Password"
						placeholder="••••••••"
						bind:value={password}
						required={true}
						disabled={isLoading}
					/>

					<Input
						id="confirmPassword"
						type="password"
						label="Confirm Password"
						placeholder="••••••••"
						bind:value={confirmPassword}
						required={true}
						disabled={isLoading}
					/>

					<div class="text-xs text-[var(--text-muted)] mt-2">
						Password must be at least 8 characters and contain uppercase, lowercase, and digits.
					</div>

					{#if error}
						<div
							class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
						>
							<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					{/if}

					{#if success}
						<div
							class="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
						>
							<p class="text-sm text-green-600 dark:text-green-400">
								Registration successful! Check your email for verification. Redirecting to
								login...
							</p>
						</div>
					{/if}

					<Button type="submit" variant="primary" fullWidth={true} disabled={isLoading}>
						{#snippet children()}
							{isLoading ? 'Creating account...' : 'Create Account'}
						{/snippet}
					</Button>

					<div class="text-center mt-4">
						<p class="text-sm text-[var(--text-muted)]">
							Already have an account?
							<a href="/auth" class="text-[var(--accent)] hover:underline">Sign in</a>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
