package main

import (
	"cdk/stacks"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/jsii-runtime-go"
)

func main() {
	defer jsii.Close()

	app := awscdk.NewApp(nil)

	// Create auth stack first
	authStack := stacks.NewLumaAuthStack(app, "LumaAuthStack", &stacks.LumaAuthStackProps{
		StackProps: awscdk.StackProps{
			Env: envConfig(),
		},
	})

	stacks.NewLumaApiStack(app, "LumaApiStack", &stacks.LumaApiStackProps{
		StackProps: awscdk.StackProps{
			Env: envConfig(),
		},
		UserPool: authStack.UserPool,
	})

	stacks.NewLumaFrontendStack(app, "LumaFrontendStack", &stacks.LumaFrontendStackProps{
		StackProps: awscdk.StackProps{
			Env: envConfig(),
		},
	})

	app.Synth(nil)
}
