package main

import (
	"testing"

	"cdk/stacks"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/assertions"
	"github.com/aws/jsii-runtime-go"
)

func TestLumaFrontendStackSynthesizes(t *testing.T) {
	app := awscdk.NewApp(nil)
	stack := stacks.NewLumaFrontendStack(app, "TestFrontend", &stacks.LumaFrontendStackProps{})

	template := assertions.Template_FromStack(stack, nil)

	template.HasResource(jsii.String("AWS::S3::Bucket"), map[string]any{})
	template.HasResource(jsii.String("AWS::CloudFront::Distribution"), map[string]any{})
	template.HasResource(jsii.String("AWS::S3::BucketPolicy"), map[string]any{})
	template.HasResource(jsii.String("Custom::CDKBucketDeployment"), map[string]any{})
}
