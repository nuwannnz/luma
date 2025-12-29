import {
	CognitoUserPool,
	CognitoUser,
	CognitoUserAttribute,
	AuthenticationDetails,
	CognitoUserSession
} from 'amazon-cognito-identity-js';
import { cognitoConfig } from '$lib/config/cognito';
import { browser } from '$app/environment';

// Token storage keys
const ACCESS_TOKEN_KEY = 'luma_access_token';
const ID_TOKEN_KEY = 'luma_id_token';
const REFRESH_TOKEN_KEY = 'luma_refresh_token';
const USER_EMAIL_KEY = 'luma_user_email';

class AuthService {
	private userPool: CognitoUserPool | null = null;

	constructor() {
		// Only initialize in browser context
		if (browser && cognitoConfig.userPoolId && cognitoConfig.clientId) {
			this.userPool = new CognitoUserPool({
				UserPoolId: cognitoConfig.userPoolId,
				ClientId: cognitoConfig.clientId
			});
		}
	}

	/**
	 * Sign in with email and password
	 * @param email - User's email address
	 * @param password - User's password
	 * @returns Promise that resolves with the Cognito user session
	 * @throws Error if authentication fails or auth service is not initialized
	 */
	async signIn(email: string, password: string): Promise<CognitoUserSession> {
		if (!this.userPool) {
			throw new Error('Auth service not initialized. Check your configuration.');
		}

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
		if (!this.userPool) return;

		const cognitoUser = this.userPool.getCurrentUser();
		if (cognitoUser) {
			cognitoUser.signOut();
		}
		this.clearTokens();
	}

	/**
	 * Sign up a new user
	 * @param name - User's full name
	 * @param email - User's email address
	 * @param password - User's password
	 * @returns Promise that resolves when user is created
	 * @throws Error if registration fails or auth service is not initialized
	 */
	async signUp(name: string, email: string, password: string): Promise<void> {
		if (!this.userPool) {
			throw new Error('Auth service not initialized. Check your configuration.');
		}

		const attributeList = [
			new CognitoUserAttribute({ Name: 'email', Value: email }),
			new CognitoUserAttribute({ Name: 'name', Value: name })
		];

		return new Promise((resolve, reject) => {
			this.userPool!.signUp(email, password, attributeList, [], (err, result) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}

	/**
	 * Get the current user session
	 * @returns Promise that resolves with the current session if valid, or null if not authenticated
	 * @throws Error if session validation fails
	 */
	async getCurrentSession(): Promise<CognitoUserSession | null> {
		if (!this.userPool) return null;

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
	 * @returns Promise that resolves to true if user has a valid session, false otherwise
	 */
	async isAuthenticated(): Promise<boolean> {
		if (!browser) return false;

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
		if (!browser) return null;
		return localStorage.getItem(ACCESS_TOKEN_KEY);
	}

	/**
	 * Get the ID token
	 */
	getIdToken(): string | null {
		if (!browser) return null;
		return localStorage.getItem(ID_TOKEN_KEY);
	}

	/**
	 * Get stored user email
	 */
	getStoredUserEmail(): string | null {
		if (!browser) return null;
		return localStorage.getItem(USER_EMAIL_KEY);
	}

	/**
	 * Store tokens in localStorage
	 */
	private storeTokens(session: CognitoUserSession, email: string): void {
		if (!browser) return;

		localStorage.setItem(ACCESS_TOKEN_KEY, session.getAccessToken().getJwtToken());
		localStorage.setItem(ID_TOKEN_KEY, session.getIdToken().getJwtToken());
		localStorage.setItem(REFRESH_TOKEN_KEY, session.getRefreshToken().getToken());
		localStorage.setItem(USER_EMAIL_KEY, email);
	}

	/**
	 * Clear all stored tokens
	 */
	private clearTokens(): void {
		if (!browser) return;

		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(ID_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
		localStorage.removeItem(USER_EMAIL_KEY);
	}
}

// Export singleton instance
export const authService = new AuthService();
