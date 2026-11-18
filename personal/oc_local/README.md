# Personal `oc_local` snapshot (Option 3)

This is an opt-in snapshot for an existing OpenCode v2 `oc_local` setup, not a
standalone installer. It does not include the launcher, base OpenCode config,
provider credentials, MCP configuration, or runtime state.

| Snapshot file | Installed path |
| --- | --- |
| `profiles/local-settings.json` | `~/.config/opencode-v2/opencode/profiles/local-settings.json` |
| `profiles/local-v2.json` | `~/.config/opencode-v2/opencode/profiles/local-v2.json` |
| `opencode-model-router.overrides.jsonc` | `~/.config/opencode-v2/opencode/opencode-model-router.overrides.jsonc` |
| `wrappers/router/server.ts` | `~/.local/share/opencode-v2/wrappers/router/server.ts` |
| `wrappers/router/tui.ts` | `~/.local/share/opencode-v2/wrappers/router/tui.ts` |
| `xdg.patch` | `~/.local/share/opencode-v2/.router-update/xdg.patch` (optional storage for updates) |

1. In the **runtime router source directory** at
   `~/.local/share/opencode-v2/src/opencode-model-router`, run
   `git apply --reverse --check /path/to/xdg.patch` to see if it is already
   applied. If not, run `git apply --check /path/to/xdg.patch`, then
   `git apply /path/to/xdg.patch` only if the check passes.
   The patch redirects only the global router override and state paths to the
   selected XDG config home, and includes its regression test.
2. Copy the profiles and override to the paths above. **Copy both wrappers into
   the runtime before importing them.** Their relative imports resolve from
   the installed directory into the runtime's `src/opencode-model-router`
   source, not from this snapshot. The existing local
   `~/.config/opencode-v2/opencode/opencode.json` must load the installed
   `~/.local/share/opencode-v2/wrappers/router` directory as a plugin.
3. Use the existing `oc_local` launcher (via `opencode-with-jev` and the
   runtime's `launch.py`). It sets `XDG_CONFIG_HOME` to `~/.config/opencode-v2`,
   reads both profile files, and applies the selected setting. For example,
   `oc_local --setting more` selects `more`. The names are `default`, `more`,
   `complex`, and `frontier`. Selection falls back to `OC_LOCAL_SETTING`,
   then to the snapshot default (`complex`).

The `.ts` wrappers are outside the repository's TypeScript, Vitest, and npm
package inputs. The regression test is only stored inside the patch.
