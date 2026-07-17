/**
 * Normaliza un texto a un slug válido para dominio/URL:
 * minúsculas, sin acentos, solo [a-z0-9-], sin guiones repetidos ni en extremos.
 */
export const sanitizeSlug = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
