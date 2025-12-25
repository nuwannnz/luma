package main

import (
	"cdk/stacks"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/jsii-runtime-go"
)

func main() {
	defer jsii.Close()

	app := awscdk.NewApp(nil)

	stacks.NewLumaApiStack(app, "LumaApiStack", &stacks.LumaApiStackProps{
		StackProps: awscdk.StackProps{
			Env: envConfig(),
		},
	})

	app.Synth(nil)
}
