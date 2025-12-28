<script lang="ts">
	import { authService } from '$lib/auth/authService';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

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
					<div>
						<label for="email" class="block text-sm font-medium text-[var(--text)] mb-2">
							Email
						</label>
						<input
							id="email"
							type="email"
							bind:value={email}
							required
							disabled={isLoading}
							class="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-[var(--text)] mb-2">
							Password
						</label>
						<input
							id="password"
							type="password"
							bind:value={password}
							required
							disabled={isLoading}
							class="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
							placeholder="••••••••"
						/>
					</div>

					{#if error}
						<div
							class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
						>
							<p class="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					{/if}

					<button
						type="submit"
						disabled={isLoading}
						class="w-full py-3 px-4 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
					>
						{isLoading ? 'Signing in...' : 'Sign in'}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
