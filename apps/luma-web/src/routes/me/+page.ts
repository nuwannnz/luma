import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	// Check if running in browser
	if (typeof window === 'undefined') {
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
