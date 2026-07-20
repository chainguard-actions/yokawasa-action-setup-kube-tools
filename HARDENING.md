<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools/v0.14.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **yokawasa--action-setup-kube-tools/v0.14.0** was hardened automatically. 2 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### script-injection (severity: high)

Rule (a): Multiple run: blocks in the workflow directly interpolate ${{ steps.setup.outputs.* }} expressions into shell scripts. The steps.*.outputs.* context is workflow-controllable and flows through YAML template substitution before the shell sees it, enabling script injection. For example: `kubectl=${{steps.setup.outputs.kubectl-path}}` assigns the raw expression value to a shell variable, and the value is then used unquoted as a command path. Affected steps: job 'test-all-tools-no-input' second run block (line 40), job 'test-all-tools-with-versrion-input' second run block (line 83), job 'test-with-some-tools-selected-and-latest' second run block (line 122), job 'test-force-arm64' run block (line 196), job 'test-arm-autodetect' 'Verify binaries are ARM64' run block (line 258). Additionally, rule (a): job 'test-arm-autodetect' 'Show runner arch' step (line 238) directly interpolates ${{ runner.os }} and ${{ runner.arch }} into a run: block.

Locations:

- `.github/workflows/test.yml:40`
- `.github/workflows/test.yml:83`
- `.github/workflows/test.yml:122`
- `.github/workflows/test.yml:196`
- `.github/workflows/test.yml:238`
- `.github/workflows/test.yml:258`

### missing-permissions (severity: medium)

The workflow file has no top-level `permissions:` key and none of the jobs (build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-version-file, test-force-arm64, test-arm-autodetect) define a job-level `permissions:` block. This means the workflow runs with the default, overly broad repository permissions. A top-level or per-job `permissions:` block with minimal specific scopes should be added.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** script-injection, missing-permissions

**Notes:**

Fixed both findings in hardened/action/.github/workflows/test.yml: (1) Added `permissions: {}` at the top level and to each of the 7 jobs to enforce least-privilege. (2) Moved all ${{ steps.setup.outputs.* }} and ${{ runner.os }}/${{ runner.arch }} expressions out of run: blocks and into env: blocks on the same step, then referenced them as plain environment variables in the shell scripts. This eliminates the script injection risk at all 6 affected locations.

