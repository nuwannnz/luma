# Nx + AWS CDK (Go)

This folder contains the Go-based AWS CDK app managed through Nx project `infra-cdk`.

## Running CDK via Nx

Use Nx targets so stack names and other flags can be forwarded directly to the CDK CLI:

```
nx deploy infra-cdk -- frontend-stack            # deploy one stack
nx diff infra-cdk -- frontend-stack storage-stack # diff multiple stacks
nx synth infra-cdk -- --profile prod             # synth with extra flags
nx bootstrap infra-cdk -- aws://123456789012/us-east-1
```

All commands execute from `infra/cdk` using the configuration in `cdk.json`. Ensure the `aws-cdk` CLI is installed (locally or via `devDependencies`) and AWS credentials are available before running the targets.

## Local Development

- `go test ./...` runs unit tests for the CDK app.
- `go run cdk.go` executes the CDK entrypoint directly if you prefer not to use Nx.

Additional stacks can be registered in `cdk.go`; pass their names to the Nx commands above to operate on them.
