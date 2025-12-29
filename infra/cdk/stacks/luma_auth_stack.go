package stacks

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscognito"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type LumaAuthStackProps struct {
	awscdk.StackProps
}

type LumaAuthStack struct {
	awscdk.Stack
	UserPool       awscognito.UserPool
	UserPoolClient awscognito.UserPoolClient
	IdentityPool   awscognito.CfnIdentityPool
}

func NewLumaAuthStack(scope constructs.Construct, id string, props *LumaAuthStackProps) *LumaAuthStack {
	sprops := awscdk.StackProps{}
	if props != nil {
		sprops = props.StackProps
	}

	stack := awscdk.NewStack(scope, &id, &sprops)

	// Create Cognito User Pool
	userPool := awscognito.NewUserPool(stack, jsii.String("LumaUserPool"), &awscognito.UserPoolProps{
		UserPoolName: jsii.String("luma-users"),
		SelfSignUpEnabled: jsii.Bool(true),
		SignInAliases: &awscognito.SignInAliases{
			Email: jsii.Bool(true),
		},
		AutoVerify: &awscognito.AutoVerifiedAttrs{
			Email: jsii.Bool(true),
		},
		PasswordPolicy: &awscognito.PasswordPolicy{
			MinLength:        jsii.Number(8),
			RequireLowercase: jsii.Bool(true),
			RequireUppercase: jsii.Bool(true),
			RequireDigits:    jsii.Bool(true),
			RequireSymbols:   jsii.Bool(false),
		},
		AccountRecovery: awscognito.AccountRecovery_EMAIL_ONLY,
		RemovalPolicy:   awscdk.RemovalPolicy_RETAIN,
	})

	// Create User Pool Client with refresh token rotation
	userPoolClient := userPool.AddClient(jsii.String("LumaWebClient"), &awscognito.UserPoolClientOptions{
		UserPoolClientName: jsii.String("luma-web-client"),
		AuthFlows: &awscognito.AuthFlow{
			UserPassword: jsii.Bool(true),
			UserSrp:      jsii.Bool(true),
		},
		OAuth: &awscognito.OAuthSettings{
			Flows: &awscognito.OAuthFlows{
				AuthorizationCodeGrant: jsii.Bool(false),
				ImplicitCodeGrant:      jsii.Bool(false),
			},
		},
		PreventUserExistenceErrors: jsii.Bool(true),
		RefreshTokenValidity:       awscdk.Duration_Days(jsii.Number(30)),
		AccessTokenValidity:        awscdk.Duration_Minutes(jsii.Number(60)),
		IdTokenValidity:            awscdk.Duration_Minutes(jsii.Number(60)),
		EnableTokenRevocation:      jsii.Bool(true),
	})

	// Create Identity Pool
	identityPool := awscognito.NewCfnIdentityPool(stack, jsii.String("LumaIdentityPool"), &awscognito.CfnIdentityPoolProps{
		IdentityPoolName:               jsii.String("luma-identity-pool"),
		AllowUnauthenticatedIdentities: jsii.Bool(false),
		CognitoIdentityProviders: &[]*awscognito.CfnIdentityPool_CognitoIdentityProviderProperty{
			{
				ClientId:     userPoolClient.UserPoolClientId(),
				ProviderName: userPool.UserPoolProviderName(),
			},
		},
	})

	// Outputs
	awscdk.NewCfnOutput(stack, jsii.String("UserPoolId"), &awscdk.CfnOutputProps{
		Value:       userPool.UserPoolId(),
		Description: jsii.String("Cognito User Pool ID"),
		ExportName:  jsii.String("LumaUserPoolId"),
	})

	awscdk.NewCfnOutput(stack, jsii.String("UserPoolArn"), &awscdk.CfnOutputProps{
		Value:       userPool.UserPoolArn(),
		Description: jsii.String("Cognito User Pool ARN"),
		ExportName:  jsii.String("LumaUserPoolArn"),
	})

	awscdk.NewCfnOutput(stack, jsii.String("UserPoolClientId"), &awscdk.CfnOutputProps{
		Value:       userPoolClient.UserPoolClientId(),
		Description: jsii.String("Cognito User Pool Client ID"),
		ExportName:  jsii.String("LumaUserPoolClientId"),
	})

	awscdk.NewCfnOutput(stack, jsii.String("IdentityPoolId"), &awscdk.CfnOutputProps{
		Value:       identityPool.Ref(),
		Description: jsii.String("Cognito Identity Pool ID"),
		ExportName:  jsii.String("LumaIdentityPoolId"),
	})

	return &LumaAuthStack{
		Stack:          stack,
		UserPool:       userPool,
		UserPoolClient: userPoolClient,
		IdentityPool:   identityPool,
	}
}
