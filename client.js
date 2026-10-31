window.__ModuleLoader__.load({
  id: '@local/dsh-rtl',
  factory(require) {
    const STYLE_ATTR = 'data-dsh-rtl';

    const CSS = String.raw`
/* ------------------------------------------------------------------ *
 * dsh-rtl — Persian / Arabic right-to-left reading for the Chat UI.
 * Scoped to the transcript: layout chrome keeps its own direction.
 * ------------------------------------------------------------------ */

/* 1. Prose: right-to-left base direction, lines aligned to the start
 *    (which is the right edge once the direction is RTL). */
:is([data-slot="conversation.chat.flow"], [data-chat-turn], [data-conversation-scroll])
  :is([class*="markdown"], [class*="bubble"]) {
  direction: rtl;
  text-align: start;
}

/* 2. Lists: the shipped indent sits on the left, which pushes right-hand
 *    markers out of the text block. Mirror it. */
:is([data-slot="conversation.chat.flow"], [data-chat-turn], [data-conversation-scroll])
  [class*="markdown"] :where(ul, ol) {
  padding-left: 0;
  padding-right: 18px;
}

:is([data-slot="conversation.chat.flow"], [data-chat-turn], [data-conversation-scroll])
  [class*="markdown"] :where(ul, ol) ol {
  padding-left: 0;
  padding-right: 0;
}

/* 3. Code and technical output stay left-to-right, and are isolated so
 *    their punctuation cannot reorder the surrounding sentence. */
:is([data-slot="conversation.chat.flow"], [data-chat-turn], [data-conversation-scroll])
  :is(pre, code, kbd, samp, .md-code-block, [data-code-block-banner], .katex, .katex-display) {
  direction: ltr;
  text-align: left;
  unicode-bidi: isolate;
}

/* 4. Composer: type Persian the way it is read. */
[data-composer-seat] [contenteditable="true"],
[data-composer-seat] textarea {
  direction: rtl;
  text-align: right;
}
`;

    function mount() {
      const existing = document.head.querySelector('style[' + STYLE_ATTR + ']');
      if (existing) return existing;
      const style = document.createElement('style');
      style.setAttribute(STYLE_ATTR, '');
      style.textContent = CSS;
      document.head.append(style);
      return style;
    }

    return {
      apply(ctx) {
        const style = mount();
        const dispose = () => {
          style.remove();
        };
        // Cordis `effect` owns the cleanup; `dispose` is the fallback used by
        // older contexts that only expose the event.
        if (typeof ctx.effect === 'function') ctx.effect(() => dispose);
        else ctx.on('dispose', dispose);
      },
    };
  },
});
