<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools/v0.13.1

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **yokawasa--action-setup-kube-tools/v0.13.1** was hardened automatically. 3 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references in the workflow use mutable tag-based refs (@v5) instead of full 40-character SHA commit digests. This exposes the workflow to supply-chain attacks if the tag is moved or the upstream action is compromised. Affected references: `actions/checkout@v5` (used in every job: build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, test-arm-autodetect) and `actions/setup-node@v5` (used in the build job).

Locations:

- `.github/workflows/test.yml:17`
- `.github/workflows/test.yml:18`
- `.github/workflows/test.yml:25`
- `.github/workflows/test.yml:64`
- `.github/workflows/test.yml:105`
- `.github/workflows/test.yml:157`
- `.github/workflows/test.yml:194`

### script-injection (severity: high)

Multiple `run:` blocks directly interpolate GitHub Actions expressions (`${{...}}`) inside shell command strings, violating rule (a). This means the YAML template substitution injects the value before the shell ever sees it, allowing shell metacharacters to be interpreted. Affected patterns include: (1) `${{steps.setup.outputs.kubectl-path}}` and similar step output expressions assigned to shell variables in run: blocks across jobs test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, and test-arm-autodetect; (2) `${{ runner.os }}` and `${{ runner.arch }}` interpolated directly into echo commands in the test-arm-autodetect job's 'Show runner arch' step.

Locations:

- `.github/workflows/test.yml:39`
- `.github/workflows/test.yml:79`
- `.github/workflows/test.yml:120`
- `.github/workflows/test.yml:162`
- `.github/workflows/test.yml:197`
- `.github/workflows/test.yml:208`

### missing-permissions (severity: medium)

The workflow file has no top-level `permissions:` key and no job-level `permissions:` key on any of its six jobs (build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, test-arm-autodetect). Without explicit permissions, the workflow inherits the repository's default token permissions, which may be overly broad (write access to contents, packages, etc.). Explicit minimal permissions should be declared.

Locations:

- `.github/workflows/test.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, script-injection, missing-permissions

**Notes:**

Fixed hardened/action/.github/workflows/test.yml: (1) Pinned actions/checkout@v5 to SHA 93cb6efe18208431cddfb8368fd83d5badbf9bfd and actions/setup-node@v5 to SHA a0853c24544627f65ddf259abe73b1d18a591444 in all 7 occurrences. (2) Moved all ${{steps.setup.outputs.*}} expressions into env: blocks (KUBECTL_PATH, KUSTOMIZE_PATH, HELM_PATH, etc.) across all 5 affected jobs, and moved ${{ runner.os }} and ${{ runner.arch }} into an env: block in the Show runner arch step. (3) Added top-level permissions: {} since the workflow only runs tests and needs no GitHub token permissions.

### Iteration 2

**Fixes applied:** script-injection

**Notes:**

Fixed unquoted shell variable expansions in .github/workflows/test.yml. In the test-all-tools-no-input, test-all-tools-with-versrion-input, and test-with-some-tools-selected-and-latest jobs, changed ${kubectl}, ${kustomize}, ${helm}, ${kubeval}, ${kubeconform}, ${conftest}, ${yq}, ${rancher}, ${tilt}, ${skaffold}, ${kubescore} to "${kubectl}", "${kustomize}", etc. in command position and in [ ! -z ] conditionals. The test-force-arm64 and test-arm-autodetect jobs already used double-quoted expansions in their check_arch() calls and required no changes.

