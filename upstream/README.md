# Staged contribution for `deepseek-ai/deepseek-harness`

This folder holds the plugin in the shape the Harness repository itself uses, so it can be
applied as a patch if the upstream project starts accepting pull requests.

It is **not** applied anywhere. The plugin that runs today is the standalone bundle at the
repository root; this tree is a copy reshaped for upstream.

## Why it is staged instead of submitted

The upstream repository currently has these disabled:

```json
{ "has_issues": false, "has_pull_requests": false, "open_issues_count": 0 }
```

There is no pull request to open and nothing is waiting on a review. When that changes, the
tree below applies as-is.

## What is here

```
packages/client/ui-rtl/
├── package.json          # @deepseek-ai/dsh-client-ui-rtl, dsh.client declaration, tsdown scripts
├── tsconfig.json         # references the host and client projects
├── tsconfig.host.json
├── tsconfig.client.json
├── locale/{en,fa,zh}.json
├── README.md             # package documentation (English)
├── README.zh.md          # package documentation (Chinese)
└── src/
    ├── index.ts          # host half: a no-op row
    └── client/
        ├── index.ts      # mounts the stylesheet in ctx.effect, removes it on dispose
        └── rtl.css       # the rules, imported with ?inline like ui-theme's sheets
```

## Applying it

1. Fork `deepseek-ai/deepseek-harness` and clone the fork.
2. Copy `packages/client/ui-rtl` into the fork at the same path.
3. Mount the row. In `packages/bundle/web-app/cordis.patch.yml`, inside the browser-plugin
   roster `- insert:` list, add it right after the `ui-chat` row:

   ```yaml
       - id: ui-chat
         name: '@deepseek-ai/dsh-client-ui-chat'

       - id: ui-rtl
         name: '@deepseek-ai/dsh-client-ui-rtl'
   ```

   No `config` is needed: the plugin takes none.
4. `pnpm install`, then `pnpm run build`. The package builds through the repository's
   `tsdown` setup; the CSS import uses the same `?inline` convention as
   `packages/client/ui-theme/src/client/styles.ts`.
5. Run the repository's own checks (typecheck, tests, lint) from the fork root. The
   contribution rules live in `CONTRIBUTING.md`; this tree makes no claim about passing
   them yet.
6. Push the branch and open the pull request.

## Open questions for the maintainers

Worth settling before a real submission, because they change the shape of the patch:

- **Always-on or opt-in?** The bundle forces RTL for the whole transcript. A preference
  would belong to the Chat settings namespace and make this package inject `configForms`.
- **Automatic per-paragraph direction?** `unicode-bidi: plaintext` gives each paragraph its
  own base direction but leaves alignment tied to the element's direction, so correct
  auto-alignment needs a different mechanism than this stylesheet.
- **Locale copy.** `locale/*.json` carries only `meta` here, which is what Plugin Manager and
  Settings read; a settings row would add a real dictionary.
- **Tests.** The package has no test file: the behaviour is CSS, and the repository's client
  test conventions should decide whether a stylesheet assertion is worth one.
- **Version.** `0.1.0` is a placeholder; a new package in that repository normally joins the
  release train of the surrounding packages.
