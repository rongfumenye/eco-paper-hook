export async function onRequest(context) {
  const url = new URL(context.request.url);
  return new Response('<!doctype html><html><head><meta charset="utf-8"><title>probe</title></head><body><h1 id="pName">FUNCTION_PROBE_OK_ZH</h1><p>SKU=' + (url.searchParams.get('sku')||'NONE') + '</p></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
