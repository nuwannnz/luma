package stacks

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awsapigateway"
	"github.com/aws/aws-cdk-go/awscdk/v2/awslambda"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type LumaApiStackProps struct {
	awscdk.StackProps
	DockerAssetPath *string
	StageName       *string
}

func NewLumaApiStack(scope constructs.Construct, id string, props *LumaApiStackProps) awscdk.Stack {
	sprops := awscdk.StackProps{}
	dockerAssetPath := jsii.String("../../apps/luma-api/")
	stageName := jsii.String("dev")

	if props != nil {
		sprops = props.StackProps
		if props.DockerAssetPath != nil {
			dockerAssetPath = props.DockerAssetPath
		}
		if props.StageName != nil {
			stageName = props.StageName
		}
	}

	stack := awscdk.NewStack(scope, &id, &sprops)

	lumaApiLambda := awslambda.NewDockerImageFunction(stack, jsii.String("LumaApiLambda"), &awslambda.DockerImageFunctionProps{
		Code:       awslambda.DockerImageCode_FromImageAsset(dockerAssetPath, &awslambda.AssetImageCodeProps{}),
		MemorySize: jsii.Number(128),
		Timeout:    awscdk.Duration_Seconds(jsii.Number(30)),
	})

	api := awsapigateway.NewRestApi(stack, jsii.String("LumaApi"), &awsapigateway.RestApiProps{
		RestApiName: jsii.String("LumaApi"),
		Description: jsii.String("Luma API Gateway"),
		DeployOptions: &awsapigateway.StageOptions{
			StageName: stageName,
		},
		DefaultCorsPreflightOptions: &awsapigateway.CorsOptions{
			AllowOrigins: awsapigateway.Cors_ALL_ORIGINS(),
			AllowMethods: awsapigateway.Cors_ALL_METHODS(),
			AllowHeaders: jsii.Strings("*"),
		},
	})

	apiResource := api.Root().AddResource(jsii.String("api"), nil)
	v1Resource := apiResource.AddResource(jsii.String("v1"), nil)

	v1Resource.AddProxy(&awsapigateway.ProxyResourceOptions{
		DefaultIntegration: awsapigateway.NewLambdaIntegration(lumaApiLambda, &awsapigateway.LambdaIntegrationOptions{
			Proxy: jsii.Bool(true),
		}),
		AnyMethod: jsii.Bool(true),
	})

	return stack
}
