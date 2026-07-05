<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools--/v0.14.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **yokawasa--action-setup-kube-tools--/v0.14.0** was hardened automatically. 2 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### script-injection (severity: high)

Multiple run: blocks in .github/workflows/test.yml directly interpolate GitHub Actions expressions (${{ ... }}) inside shell commands, violating rule (a). This includes ${{steps.setup.outputs.kubectl-path}} and similar step output expressions used as shell variable assignments in run: blocks across jobs test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, and test-arm-autodetect. Additionally, ${{ runner.os }} and ${{ runner.arch }} are interpolated directly in a run: block in test-arm-autodetect. Any ${{ ... }} expression inside a run: shell string is a script-injection risk because the value is substituted before the shell parses the command.

Locations:

- `.github/workflows/test.yml:43`
- `.github/workflows/test.yml:79`
- `.github/workflows/test.yml:113`
- `.github/workflows/test.yml:175`
- `.github/workflows/test.yml:205`
- `.github/workflows/test.yml:218`

### missing-permissions (severity: medium)

The workflow file .github/workflows/test.yml has no top-level permissions: key and none of its jobs (build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-version-file, test-force-arm64, test-arm-autodetect) define a permissions: block. Without explicit permissions, the workflow inherits the default repository permissions, which may be overly broad.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** script-injection, missing-permissions

**Notes:**

Fixed .github/workflows/test.yml: (1) Added top-level `permissions: {}` to restrict default permissions. (2) Moved all ${{ steps.setup.outputs.*-path }} expressions from run: blocks into env: blocks across jobs test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, and test-arm-autodetect. Also moved ${{ runner.os }} and ${{ runner.arch }} from the run: block in test-arm-autodetect into an env: block. Shell scripts now reference plain environment variables instead of GitHub Actions expressions.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed script injection in .github/workflows/test.yml by double-quoting all unquoted variable expansions used in command position. Changed ${kubectl}, ${kustomize}, ${helm}, ${kubeval}, ${kubeconform}, ${conftest}, ${yq}, ${rancher}, ${tilt}, ${skaffold}, ${kubescore} to "${variable}" form across all 5 affected jobs: test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, and test-arm-autodetect. Also fixed the unquoted if guards ([ ! -z ${kubectl} ] → [ ! -z "${kubectl}" ]) in the test-with-some-tools-selected-and-latest job.

