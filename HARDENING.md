<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools/v0.13.2

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **yokawasa--action-setup-kube-tools/v0.13.2** was hardened automatically. 3 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow references GitHub Actions by mutable tag/version refs instead of pinned 40-character commit SHAs. Failing references: `actions/checkout@v5` (build job, line 17), `actions/setup-node@v6` (build job, line 18), `actions/checkout@v6` (test-all-tools-no-input, line 27), `actions/checkout@v6` (test-all-tools-with-versrion-input, line 70), `actions/checkout@v6` (test-with-some-tools-selected-and-latest, line 110), `actions/checkout@v6` (test-force-arm64, line 160), `actions/checkout@v6` (test-arm-autodetect, line 193). These mutable tags can be moved to point to different (potentially malicious) commits without notice.

Locations:

- `.github/workflows/test.yml:17`
- `.github/workflows/test.yml:18`
- `.github/workflows/test.yml:27`
- `.github/workflows/test.yml:70`
- `.github/workflows/test.yml:110`
- `.github/workflows/test.yml:160`
- `.github/workflows/test.yml:193`

### missing-permissions (severity: medium)

The workflow file has no top-level `permissions:` key and none of its 6 jobs (build, test-all-tools-no-input, test-all-tools-with-versrion-input, test-with-some-tools-selected-and-latest, test-force-arm64, test-arm-autodetect) define a job-level `permissions:` block. Without explicit permissions, the GITHUB_TOKEN is granted default (potentially write) permissions, violating the principle of least privilege.

Locations:

- `.github/workflows/test.yml:1`

### script-injection (severity: high)

Multiple `run:` blocks directly interpolate `${{ }}` expressions inside shell scripts (rule a), and then use the resulting shell variables unquoted (rule b).

Rule (a) — direct expression interpolation in run: blocks:
- `kubectl=${{steps.setup.outputs.kubectl-path}}` and similar for all 11 tools appear in 5 separate run: blocks across jobs test-all-tools-no-input (line 44), test-all-tools-with-versrion-input (line 84), test-with-some-tools-selected-and-latest (line 123), test-force-arm64 (line 164), and test-arm-autodetect (line 208).
- `echo "runner.os=${{ runner.os }}"` and `echo "runner.arch=${{ runner.arch }}"` are interpolated directly in a run: block (lines 196–197).

Rule (b) — unquoted shell variable expansion of workflow-controllable data:
- After assignment from `${{steps.setup.outputs.*}}`, the variables are expanded unquoted: `${kubectl} version --client`, `${kustomize} version`, `${helm} version`, etc. in every affected run: block. Unquoted expansions allow shell metacharacter injection if the output values contain special characters.

Locations:

- `.github/workflows/test.yml:44`
- `.github/workflows/test.yml:84`
- `.github/workflows/test.yml:123`
- `.github/workflows/test.yml:164`
- `.github/workflows/test.yml:196`
- `.github/workflows/test.yml:208`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions, script-injection

**Notes:**

Fixed all three findings in .github/workflows/test.yml: (1) Pinned all 7 action references to full 40-char commit SHAs (actions/checkout@v5→93cb6efe, actions/setup-node@v6→249970729, actions/checkout@v6→df4cb1c0); (2) Added top-level `permissions: {}` block; (3) Moved all ${{ }} expressions from run: blocks into step-level env: blocks, renamed variables to *_PATH convention, and replaced all unquoted ${var} expansions with properly double-quoted "${VAR_PATH}" forms throughout all 6 affected run blocks.

