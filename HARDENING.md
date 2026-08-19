<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools/v0.13.5

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **yokawasa--action-setup-kube-tools/v0.13.5** was hardened automatically. 7 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### permissions (severity: medium)

missing-permissions: The workflow file has no top-level `permissions:` key and none of the six jobs (build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, test-arm-autodetect) define a job-level `permissions:` block. Without explicit permissions, the GITHUB_TOKEN is granted default (potentially write) permissions, violating least-privilege.

Locations:

- `.github/workflows/test.yml:1`

### script-injection (severity: high)

Rule (a): Direct expression interpolation of `steps.*.outputs.*` context values inside `run:` shell scripts. In job `test-all-tools-no-input`, the run block assigns shell variables directly from `${{steps.setup.outputs.kubectl-path}}`, `${{steps.setup.outputs.kustomize-path}}`, etc., and then executes them as commands (e.g., `${kubectl} version --client`). These expressions are substituted by the YAML template engine before the shell sees them, allowing an attacker who controls step outputs to inject arbitrary shell commands.

Locations:

- `.github/workflows/test.yml:37`

### script-injection (severity: high)

Rule (a): Direct expression interpolation of `steps.*.outputs.*` context values inside `run:` shell scripts. In job `test-all-tools-with-versrion-input`, the run block assigns shell variables directly from `${{steps.setup.outputs.kubectl-path}}`, `${{steps.setup.outputs.kustomize-path}}`, etc., and then executes them as commands. These expressions are substituted before the shell sees them, enabling command injection.

Locations:

- `.github/workflows/test.yml:86`

### script-injection (severity: high)

Rule (a): Direct expression interpolation of `steps.*.outputs.*` context values inside `run:` shell scripts. In job `test-with-some-tools-selected-and-latest`, the run block assigns shell variables directly from `${{steps.setup.outputs.kubectl-path}}`, `${{steps.setup.outputs.kustomize-path}}`, etc., and then executes them as commands inside `if` guards. These expressions are substituted before the shell sees them, enabling command injection.

Locations:

- `.github/workflows/test.yml:131`

### script-injection (severity: high)

Rule (a): Direct expression interpolation of `steps.*.outputs.*` context values inside `run:` shell scripts. In job `test-force-arm64`, the run block assigns shell variables directly from `${{steps.setup.outputs.kubectl-path}}`, `${{steps.setup.outputs.kustomize-path}}`, etc., and then passes them to `check_arch`. These expressions are substituted before the shell sees them, enabling command injection.

Locations:

- `.github/workflows/test.yml:181`

### script-injection (severity: high)

Rule (a): Direct expression interpolation of `runner.*` context values inside a `run:` shell script. In job `test-arm-autodetect`, the 'Show runner arch' step uses `${{ runner.os }}` and `${{ runner.arch }}` directly inside the run: block (e.g., `echo "runner.os=${{ runner.os }}"`). Any `${{ ... }}` expression directly inside a run: script is a script-injection finding regardless of which context it reads from.

Locations:

- `.github/workflows/test.yml:213`

### script-injection (severity: high)

Rule (a): Direct expression interpolation of `steps.*.outputs.*` context values inside `run:` shell scripts. In job `test-arm-autodetect`, the 'Verify binaries are ARM64' run block assigns shell variables directly from `${{steps.setup.outputs.kubectl-path}}`, `${{steps.setup.outputs.kustomize-path}}`, etc., and then passes them to `check_arch`. These expressions are substituted before the shell sees them, enabling command injection.

Locations:

- `.github/workflows/test.yml:232`

## Iteration Notes

### Iteration 1

**Fixes applied:** permissions, script-injection

**Notes:**

Fixed all 7 findings in .github/workflows/test.yml: (1) Added `permissions: {}` at the top-level workflow scope and at each of the 6 job levels to enforce least-privilege for the GITHUB_TOKEN. (2) Fixed 6 script-injection instances by moving all `${{ steps.setup.outputs.* }}` and `${{ runner.* }}` expressions out of `run:` shell scripts into `env:` blocks on the same step. Shell scripts now reference plain environment variables (KUBECTL_PATH, KUSTOMIZE_PATH, HELM_PATH, etc., RUNNER_OS, RUNNER_ARCH) instead of inline template expressions, preventing command injection via attacker-controlled step output values.

