export const levels = (a1, a2, b1) => ({ a1, a2, b1 });
export const line = (who, a1, a2, b1, ru, extra = {}) => ({ type: 'line', who, text: levels(a1, a2, b1), ru, ...extra });
export const choice = (prompt, ...options) => ({ type: 'choice', prompt, options });
export const option = (text, ru, extra = {}) => ({ text, ru, ...extra });
export const word = (form, ru, text, clozeRu) => ({ form, ru, cloze: { text, ru: clozeRu } });
