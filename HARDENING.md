<!-- markdownlint-disable -->

# Hardening Report: yokawasa--action-setup-kube-tools/v0.13.3

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **yokawasa--action-setup-kube-tools/v0.13.3** was hardened automatically. 3 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The workflow file references actions using mutable version tags instead of pinned full-length SHA digests, making the workflow vulnerable to supply-chain attacks if the tag is moved. Failing references:
- `uses: actions/checkout@v5` (line 17, build job)
- `uses: actions/setup-node@v6` (line 18, build job)
- `uses: actions/checkout@v6` (line 26, test-all-tools-no-input job)
- `uses: actions/checkout@v6` (line 63, test-all-tools-with-versrion-input job)
- `uses: actions/checkout@v6` (line 101, test-with-some-tools-selected-and-latest job)
- `uses: actions/checkout@v6` (line 157, test-force-arm64 job)
- `uses: actions/checkout@v6` (line 196, test-arm-autodetect job)

Locations:

- `.github/workflows/test.yml:17`
- `.github/workflows/test.yml:18`
- `.github/workflows/test.yml:26`
- `.github/workflows/test.yml:63`
- `.github/workflows/test.yml:101`
- `.github/workflows/test.yml:157`
- `.github/workflows/test.yml:196`

### missing-permissions (severity: medium)

The workflow file has no top-level `permissions:` key and no per-job `permissions:` keys. Without explicit permissions, the workflow inherits the repository's default token permissions (which may be write-all), granting broader access than necessary.

Locations:

- `.github/workflows/test.yml:1`

### script-injection (severity: high)

Multiple `run:` blocks directly interpolate GitHub Actions expressions (`${{...}}`) inside shell command strings, violating sub-rule (a). Before the shell executes the script, GitHub Actions performs template substitution on these expressions, allowing an attacker who controls the values (e.g. via a malicious step output) to inject arbitrary shell commands.

Violations include:
- Sub-rule (a): `kubectl=${{steps.setup.outputs.kubectl-path}}` and similar step-output interpolations in run: blocks across jobs test-all-tools-no-input (line ~44), test-all-tools-with-versrion-input (line ~82), test-with-some-tools-selected-and-latest (line ~120), test-force-arm64 (line ~160), and test-arm-autodetect (line ~215).
- Sub-rule (a): `echo "runner.os=${{ runner.os }}"` and `echo "runner.arch=${{ runner.arch }}"` directly inside a run: block (test-arm-autodetect job, lines ~199-200). Even runner.* context values flow through YAML template substitution before the shell sees them.

All these should be replaced with env: variables and the values referenced as `"$ENV_VAR"` in the shell script.

Locations:

- `.github/workflows/test.yml:44`
- `.github/workflows/test.yml:82`
- `.github/workflows/test.yml:120`
- `.github/workflows/test.yml:160`
- `.github/workflows/test.yml:199`
- `.github/workflows/test.yml:215`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions, script-injection

**Notes:**

Fixed all three findings in hardened/action/.github/workflows/test.yml: (1) Pinned all 7 action references to full commit SHAs using lookup_action_sha (actions/checkout@v5→fbc6f39, actions/setup-node@v6→2499707, actions/checkout@v6→d23441a); (2) Added top-level `permissions: {}` to restrict default token permissions; (3) Moved all ${{steps.setup.outputs.*}} and ${{ runner.* }} expressions from run: blocks into step-level env: blocks, referencing them as plain shell variables ($KUBECTL_PATH, $RUNNER_OS, etc.) to prevent template-injection attacks.

