/**
 * Right-to-left reading for the Chat transcript.
 *
 * Chat renders assistant Markdown and the user bubble with an LTR base
 * direction, which misplaces terminal punctuation and list markers for
 * Persian and Arabic. This plugin mounts one stylesheet for the plugin's
 * lifetime and removes it on dispose; it reads no service, registers no slot,
 * and never touches the DOM the transcript owns.
 */
import type { Context } from '@deepseek-ai/cordis'
import styles from './rtl.css?inline'

/** Package id stamped on the stylesheet tag so DevTools and teardown name their owner. */
const PLUGIN_ID = '@deepseek-ai/dsh-client-ui-rtl'

/**
 * Mount the RTL transcript stylesheet.
 * @param ctx - owning client context; disposing the plugin removes the tag.
 */
export function apply(ctx: Context): void {
  /* v8 ignore next -- needs a documentless run (node e2e booting the client tree) */
  if (typeof document === 'undefined') return
  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = PLUGIN_ID
    tag.dataset.pluginCss = `${PLUGIN_ID}/rtl.css`
    tag.textContent = styles
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, 'ui-rtl: transcript direction')
}
