<script lang="ts">
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Input from '$lib/ui/Input.svelte';
	import Button from '$lib/ui/Button.svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
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
		isLoading = true;

		try {
			await authService.signIn(email, password);
			// Redirect to dashboard on success
			goto('/me');
		} catch (err: unknown) {
			if (err instanceof Error) {
				error = err.message || 'Failed to sign in. Please check your credentials.';
			} else {
				error = 'Failed to sign in. Please check your credentials.';
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
				<h1 class="text-3xl font-bold text-[var(--text)]">Welcome to Luma</h1>
				<p class="text-[var(--text-muted)] mt-2">Sign in to your account</p>
			</div>

			<form onsubmit={handleSubmit}>
				<div class="space-y-4">
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

					{#if error}
						<div
							class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
						>
							<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					{/if}

					<Button type="submit" variant="primary" fullWidth={true} disabled={isLoading}>
						{#snippet children()}
							{isLoading ? 'Signing in...' : 'Sign in'}
						{/snippet}
					</Button>

					<div class="text-center mt-4">
						<p class="text-sm text-[var(--text-muted)]">
							Don't have an account?
							<a href="/register" class="text-[var(--accent)] hover:underline">Create one</a>
						</p>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>
