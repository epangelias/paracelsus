export function CSSVar(props: Record<string, string>) {
  // NOTE: XSS
  const __html = `:root{${Object.entries(props).map(([key, value]) => `--${key}: ${value};`).join('')}}`;
  return <style dangerouslySetInnerHTML={{ __html }}></style>;
}
