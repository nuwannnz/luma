package stacks

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfront"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfrontorigins"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3deployment"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

// LumaFrontendStackProps allows overriding stack config for the web frontend.
type LumaFrontendStackProps struct {
	awscdk.StackProps
	BuildOutputPath *string
}

func NewLumaFrontendStack(scope constructs.Construct, id string, props *LumaFrontendStackProps) awscdk.Stack {
	sprops := awscdk.StackProps{}
	buildOutputPath := jsii.String("../../apps/luma-web/.svelte-kit/output/client")

	if props != nil {
		sprops = props.StackProps
		if props.BuildOutputPath != nil {
			buildOutputPath = props.BuildOutputPath
		}
	}

	stack := awscdk.NewStack(scope, &id, &sprops)

	bucket := awss3.NewBucket(stack, jsii.String("LumaWebBucket"), &awss3.BucketProps{
		BlockPublicAccess: awss3.BlockPublicAccess_BLOCK_ALL(),
		Encryption:        awss3.BucketEncryption_S3_MANAGED,
		RemovalPolicy:     awscdk.RemovalPolicy_RETAIN,
	})

	origin := awscloudfrontorigins.S3BucketOrigin_WithOriginAccessControl(bucket, nil)

	distribution := awscloudfront.NewDistribution(stack, jsii.String("LumaWebDistribution"), &awscloudfront.DistributionProps{
		DefaultBehavior: &awscloudfront.BehaviorOptions{
			Origin:               origin,
			ViewerProtocolPolicy: awscloudfront.ViewerProtocolPolicy_REDIRECT_TO_HTTPS,
			CachePolicy:          awscloudfront.CachePolicy_CACHING_OPTIMIZED(),
		},
		DefaultRootObject: jsii.String("index.html"),
		Comment:           jsii.String("Luma web frontend"),
		ErrorResponses: &[]*awscloudfront.ErrorResponse{
			{
				HttpStatus:         jsii.Number(403),
				ResponseHttpStatus: jsii.Number(200),
				ResponsePagePath:   jsii.String("/index.html"),
				Ttl:                awscdk.Duration_Minutes(jsii.Number(1)),
			},
			{
				HttpStatus:         jsii.Number(404),
				ResponseHttpStatus: jsii.Number(200),
				ResponsePagePath:   jsii.String("/index.html"),
				Ttl:                awscdk.Duration_Minutes(jsii.Number(1)),
			},
		},
	})

	awss3deployment.NewBucketDeployment(stack, jsii.String("LumaWebDeployment"), &awss3deployment.BucketDeploymentProps{
		Sources: &[]awss3deployment.ISource{
			awss3deployment.Source_Asset(buildOutputPath, nil),
		},
		DestinationBucket: bucket,
		Distribution:      distribution,
		DistributionPaths: jsii.Strings("/*"),
	})

	return stack
}
