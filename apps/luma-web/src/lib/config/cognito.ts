// AWS Cognito configuration
// These values should be set from environment variables or CDK outputs
export const cognitoConfig = {
	userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
	clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
	region: import.meta.env.VITE_AWS_REGION || 'us-east-1'
};
