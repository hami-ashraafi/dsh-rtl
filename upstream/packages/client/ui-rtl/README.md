# @deepseek-ai/dsh-client-ui-rtl

Right-to-left reading for the Chat transcript, for Persian and Arabic.

Chat renders assistant Markdown and the user bubble with an LTR base direction. For
RTL scripts that misplaces terminal punctuation and puts list markers on the wrong side.
This plugin mounts one stylesheet for its lifetime and removes it on dispose: it reads no
service, registers no slot, and never touches the DOM the transcript owns.

## What it changes

| Surface | Before | After |
| --- | --- | --- |
| Assistant Markdown | LTR, left-aligned | RTL, right-aligned |
| User bubble | LTR, left-aligned | RTL, right-aligned |
| Lists inside messages | marker left, indent left | marker right, mirrored indent |
| Code, inline code, KaTeX | LTR | LTR, `unicode-bidi: isolate` |
| Composer | LTR | RTL |

The sidebar, tab strip, toolbars, and Settings are untouched: the selectors are scoped to
`data-slot="conversation.chat.flow"`, `data-chat-turn`, and `data-conversation-scroll`.

## Selectors

Class names here are CSS-module hashes, so the stylesheet matches the structural hooks and
the source names that survive hashing instead of a built class name:

- `[data-slot="conversation.chat.flow"]`, `[data-chat-turn]`, `[data-conversation-scroll]` — scope;
- `[class*="markdown"]`, `[class*="bubble"]` — message prose and the user bubble;
- `[data-composer-seat]` — the composer;
- `pre`, `code`, `.md-code-block`, `.katex` — technical content that stays LTR.

## Mounting

The package is a Client plugin; the Web bundle's patch mounts it beside `ui-chat`:

```yaml
    - id: ui-rtl
      name: '@deepseek-ai/dsh-client-ui-rtl'
```

## Limits

- Direction is forced for the whole transcript. An English-only answer is right-aligned
  although each line keeps its internal order; a per-paragraph automatic mode is future work.
- The plugin carries no setting. A direction preference would belong to the Chat settings
  namespace, which this package would then inject.
