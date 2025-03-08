


export async function GetTS(slug: string) {
  if (!slug.endsWith('.js')) return null;
  const path = new URL('../static/' + slug.replace(/\.js$/, '.ts'), import.meta.url);
  try {
    const module = await import(path.href);
    const text = `(${module.default})();`
    return new Response(text, {
      headers: {
        'Content-Type': 'application/javascript',
      },
    });
  } catch (e) {
    return null;
  }
}