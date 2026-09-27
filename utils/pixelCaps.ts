/**
 * Uppercase text for the pixel font, without Latin accents: Press Start 2P draws
 * accented capitals (É, È…) like lowercase letters. Only Latin combining marks
 * are removed, so Arabic text is left untouched.
 */
export function pixelCaps(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toUpperCase()
}
