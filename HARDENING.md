<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools/v0.13.4

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **yokawasa--action-setup-kube-tools/v0.13.4** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references in .github/workflows/test.yml use mutable tag refs (@v6) instead of full 40-character commit SHAs. Affected references: `actions/checkout@v6` (lines 17, 26, 63, 104, 160, 196) and `actions/setup-node@v6` (line 18). These should be pinned to immutable SHA digests, e.g. `actions/checkout@<40-hex-sha> # v6`.

Locations:

- `.github/workflows/test.yml:17`
- `.github/workflows/test.yml:18`
- `.github/workflows/test.yml:26`
- `.github/workflows/test.yml:63`
- `.github/workflows/test.yml:104`
- `.github/workflows/test.yml:160`
- `.github/workflows/test.yml:196`

### missing-permissions (severity: medium)

The workflow file .github/workflows/test.yml has no top-level `permissions:` key and no job-level `permissions:` key on any of its jobs (build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, test-arm-autodetect). This means the workflow runs with the default, overly-broad token permissions. A minimal `permissions:` block (e.g. `contents: read`) should be added at the top level or on each job.

Locations:

- `.github/workflows/test.yml:1`

### script-injection (severity: high)

Multiple `run:` blocks in .github/workflows/test.yml directly interpolate GitHub Actions expressions inside shell scripts, violating rule (a). (1) Lines 41–51: `${{steps.setup.outputs.kubectl-path}}`, `${{steps.setup.outputs.kustomize-path}}`, etc. are interpolated directly into shell variable assignments — these values flow through YAML template substitution before the shell sees them, enabling injection. (2) Lines 81–91 (test-all-tools-with-versrion-input job): same pattern with `${{steps.setup.outputs.*}}`. (3) Lines 119–129 (test-with-some-tools-selected-and-latest job): same pattern. (4) Lines 165–175 (test-force-arm64 job): same pattern. (5) Lines 199–200 (test-arm-autodetect, 'Show runner arch' step): `${{ runner.os }}` and `${{ runner.arch }}` are interpolated directly inside a `run:` echo command. (6) Lines 215–225 (test-arm-autodetect, 'Verify binaries are ARM64' step): same `${{steps.setup.outputs.*}}` pattern. All these should be moved to `env:` blocks and referenced as quoted shell variables.

Locations:

- `.github/workflows/test.yml:41`
- `.github/workflows/test.yml:81`
- `.github/workflows/test.yml:119`
- `.github/workflows/test.yml:165`
- `.github/workflows/test.yml:199`
- `.github/workflows/test.yml:215`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions, script-injection

**Notes:**

Fixed all three findings in hardened/action/.github/workflows/test.yml:

1. unpinned-uses: Pinned all 7 mutable tag references to full commit SHAs:
   - actions/checkout@v6 → @d23441a48e516b6c34aea4fa41551a30e30af803 # v6 (6 occurrences at lines 17, 26, 63, 104, 160, 196)
   - actions/setup-node@v6 → @249970729cb0ef3589644e2896645e5dc5ba9c38 # v6 (line 18)

2. missing-permissions: Added top-level `permissions: contents: read` block.

3. script-injection: Moved all ${{ steps.setup.outputs.* }}, ${{ runner.os }}, and ${{ runner.arch }} expressions out of run: shell scripts and into step-level env: blocks. Shell scripts now reference the values via quoted environment variables (e.g., "$KUBECTL_PATH") instead of direct template interpolation.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed unquoted variable expansions in .github/workflows/test.yml at all three affected locations (lines ~70, ~120, ~165). Changed all `${kubectl}`, `${kustomize}`, `${helm}`, `${kubeval}`, `${kubeconform}`, `${conftest}`, `${yq}`, `${rancher}`, `${tilt}`, `${skaffold}`, `${kubescore}` expansions to `"${kubectl}"`, `"${kustomize}"`, etc. in both command invocations and `if [ ! -z ... ]` test conditions across jobs: test-all-tools-no-input, test-all-tools-with-versrion-input, and test-with-some-tools-selected-and-latest.

