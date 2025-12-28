import {
	CognitoUserPool,
	CognitoUser,
	AuthenticationDetails,
	CognitoUserSession
} from 'amazon-cognito-identity-js';
import { cognitoConfig } from '$lib/config/cognito';

// Token storage keys
const ACCESS_TOKEN_KEY = 'luma_access_token';
const ID_TOKEN_KEY = 'luma_id_token';
const REFRESH_TOKEN_KEY = 'luma_refresh_token';
const USER_EMAIL_KEY = 'luma_user_email';

class AuthService {
	private userPool: CognitoUserPool;

	constructor() {
		this.userPool = new CognitoUserPool({
			UserPoolId: cognitoConfig.userPoolId,
			ClientId: cognitoConfig.clientId
		});
	}

	/**
	 * Sign in with email and password
	 */
	async signIn(email: string, password: string): Promise<CognitoUserSession> {
		const authenticationData = {
			Username: email,
			Password: password
		};

		const authenticationDetails = new AuthenticationDetails(authenticationData);

		const userData = {
			Username: email,
			Pool: this.userPool
		};

		const cognitoUser = new CognitoUser(userData);

		return new Promise((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (session: CognitoUserSession) => {
					// Store tokens in localStorage
					this.storeTokens(session, email);
					resolve(session);
				},
				onFailure: (err) => {
					reject(err);
				},
				newPasswordRequired: () => {
					reject(new Error('New password required'));
				}
			});
		});
	}

	/**
	 * Sign out the current user
	 */
	signOut(): void {
		const cognitoUser = this.userPool.getCurrentUser();
		if (cognitoUser) {
			cognitoUser.signOut();
		}
		this.clearTokens();
	}

	/**
	 * Get the current user session
	 */
	async getCurrentSession(): Promise<CognitoUserSession | null> {
		const cognitoUser = this.userPool.getCurrentUser();

		if (!cognitoUser) {
			return null;
		}

		return new Promise((resolve, reject) => {
			cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
				if (err) {
					reject(err);
					return;
				}
				if (session && session.isValid()) {
					// Update stored tokens
					const email = this.getStoredUserEmail();
					if (email) {
						this.storeTokens(session, email);
					}
					resolve(session);
				} else {
					resolve(null);
				}
			});
		});
	}

	/**
	 * Check if user is authenticated
	 */
	async isAuthenticated(): Promise<boolean> {
		try {
			const session = await this.getCurrentSession();
			return session !== null && session.isValid();
		} catch {
			return false;
		}
	}

	/**
	 * Get the access token
	 */
	getAccessToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	}

	/**
	 * Get the ID token
	 */
	getIdToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(ID_TOKEN_KEY);
	}

	/**
	 * Get stored user email
	 */
	getStoredUserEmail(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(USER_EMAIL_KEY);
	}

	/**
	 * Store tokens in localStorage
	 */
	private storeTokens(session: CognitoUserSession, email: string): void {
		if (typeof window === 'undefined') return;

		localStorage.setItem(ACCESS_TOKEN_KEY, session.getAccessToken().getJwtToken());
		localStorage.setItem(ID_TOKEN_KEY, session.getIdToken().getJwtToken());
		localStorage.setItem(REFRESH_TOKEN_KEY, session.getRefreshToken().getToken());
		localStorage.setItem(USER_EMAIL_KEY, email);
	}

	/**
	 * Clear all stored tokens
	 */
	private clearTokens(): void {
		if (typeof window === 'undefined') return;

		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(ID_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
		localStorage.removeItem(USER_EMAIL_KEY);
	}
}

// Export singleton instance
export const authService = new AuthService();
