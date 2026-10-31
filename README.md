# dsh-rtl

Right-to-left, right-aligned text for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) chat —
built for Persian and Arabic conversations that the default LTR transcript renders badly.

[فارسی](README.fa.md) · English

A small DSH profile bundle: a Host half that does nothing, plus a Client module that
registers one stylesheet and removes it on dispose. No fork of the harness, no patched
artifacts, no DOM rewriting.

## What it changes

| Surface | Before | After |
| --- | --- | --- |
| Assistant messages (Markdown) | LTR, left-aligned | RTL, right-aligned |
| User message bubble | LTR, left-aligned | RTL, right-aligned |
| Lists inside messages | marker on the left, indent on the left | marker on the right, mirrored indent |
| Code blocks, inline code, KaTeX | LTR | LTR, and `unicode-bidi: isolate` so their punctuation cannot reorder the sentence |
| Composer | LTR | RTL while typing |

The sidebar, tab strip, toolbars, and Settings keep their own direction; the stylesheet is
scoped to the transcript and the composer.

## Install

The bundle is installed the same way as any other DSH plugin — no build step.

### From this repository

1. **Plugins** in the left sidebar → **Add plugin**.
2. Paste the repository address: `https://github.com/hami-ashraafi/dsh-rtl`
3. Install, then switch **Right-to-left Chat** on.

### From a local checkout

1. **Plugins** → **Add plugin**.
2. Paste the absolute path of this directory.
3. Install, then switch **Right-to-left Chat** on.

Restart DeepSeek Harness if the manager reports `restart-required`.

## Uninstall

**Plugins** → **Right-to-left Chat** → **Remove**.

## How it works

`package.json` declares three things the Harness reads without running any code:

```json
"dsh": {
  "bundle": { "patch": "./cordis.patch.yml" },
  "client": { "platform": "web", "immediately": true, "inject": ["@deepseek-ai/dsh-client-ui-chat"] }
}
```

- `dsh.bundle.patch` makes this package a **bundle**: `cordis.patch.yml` inserts the
  `dsh-rtl` row into the profile composition.
- `dsh.client` makes the Client module load with the Web UI at boot.

`client.js` is a lazy factory registered into `window.__ModuleLoader__.load` — the same
contract every shipped DSH client plugin uses:

```js
window.__ModuleLoader__.load({
  id: '@local/dsh-rtl',
  factory(require) {
    return {
      apply(ctx) {
        const style = document.createElement('style');
        style.setAttribute('data-dsh-rtl', '');
        style.textContent = CSS;
        document.head.append(style);
        ctx.effect(() => () => style.remove());
      },
    };
  },
});
```

### Selectors

DSH class names are CSS-module hashes, so the stylesheet matches the stable parts instead:
the `data-slot="conversation.chat.flow"` transcript anchor, the `data-chat-turn` rows, the
`data-conversation-scroll` container, class names that contain `markdown` or `bubble`, and
`[data-composer-seat]` for the editor. If a future Harness release renames one of them, the
fix is a one-line selector change in `client.js`.

## Compatibility

Written against DSH `0.2.1-rc.3` (Desktop and Web). It touches only presentation, so a
release that changes no chat DOM keeps working.

## Connecting it to the Harness project

The harness repository ships **no** RTL or bidi handling of its own — this repository exists
to fill that gap. It follows the project's documented path for community plugins:

- the repository carries the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic, which
  the Harness README names as the discoverability mechanism;
- it is announced in
  [DeepSeek Harness Discussions #11672](https://github.com/deepseek-ai/deepseek-harness/discussions/11672),
  which the project uses instead of issues.

The upstream repository has issues and pull requests disabled, so this is distributed as a
standalone bundle rather than a patch to the harness sources. The same plugin is also staged
in the upstream package shape under [`upstream/`](upstream/README.md) — `packages/client/ui-rtl`
with the repository's TypeScript, tsconfig, and `?inline` CSS conventions — ready to apply if
that repository starts accepting contributions.

## License

[MIT](LICENSE) © 2026 hami masoud

---

**فارسی:** توضیح کامل فارسی — نصب، حذف، سازگاری و عیب‌یابی — در
[README.fa.md](README.fa.md) است.
