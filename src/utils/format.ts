function slugify(value: string): string {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function attachmentUrl(path: string, width?: number): string {
  const base = import.meta.env.QCLI_ATTACHMENTS_URL;

  const size = import.meta.env.QUASAR_PROD && width ? `/${width}` : '';

  return `${base}${size}/${path}`;
}

export { slugify, attachmentUrl };
