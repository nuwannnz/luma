import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	// Only check authentication in browser context
	if (!browser) {
		return {};
	}

	// Check for authentication tokens
	const accessToken = localStorage.getItem('luma_access_token');
	
	if (!accessToken) {
		// Not authenticated, redirect to login
		throw redirect(302, '/auth');
	}

	return {};
};
