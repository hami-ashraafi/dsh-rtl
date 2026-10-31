/**
 * Host half of the RTL client plugin. Every effect lives in the browser
 * module ({@link ./client/index.ts}); this row exists so the bundle patch can
 * mount one entry whose node and browser halves both resolve.
 */
export function apply(): void {}
