/**
 * @file cloudflare-worker/routes/media.js
 * @description Rotas de mídia R2 (/api/media/upload, /api/media/list e streaming /api/media/* com suporte a HTTP 206 Partial Content Range para Safari/iOS).
 * @exports handleMediaRequest
 */
import { CORS_HEADERS, jsonResponse } from '../lib/http.js';

export async function handleMediaRequest(request, env, path, { verifySupabaseJwt }) {
  if (!env.MEDIA_BUCKET) {
    return jsonResponse({ error: 'R2 MEDIA_BUCKET not configured' }, 503);
  }

  if (path === '/api/media/upload') {
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }
    const auth = await verifySupabaseJwt(request, env);
    if (env.REQUIRE_SUPABASE_JWT === 'true' && !auth.authenticated) {
      return jsonResponse({ error: 'Authentication required for media upload' }, 401);
    }
    const url = new URL(request.url);
    let rawKey = (url.searchParams.get('key') || `clip-${Date.now()}.mp4`).trim();
    let contentType = request.headers.get('content-type') || 'video/mp4';
    let bodyBytes;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!file || typeof file === 'string') {
        return jsonResponse({ error: 'Missing file in multipart form' }, 400);
      }
      rawKey = String(form.get('key') || file.name || rawKey);
      contentType = file.type || 'video/mp4';
      bodyBytes = await file.arrayBuffer();
    } else {
      bodyBytes = await request.arrayBuffer();
    }

    if (!bodyBytes || bodyBytes.byteLength === 0) {
      return jsonResponse({ error: 'Empty media payload' }, 400);
    }
    if (bodyBytes.byteLength > 15 * 1024 * 1024) {
      return jsonResponse({ error: 'Media payload exceeds 15MB limit' }, 413);
    }

    const safeName = rawKey.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/^_+/, '');
    const key = safeName.startsWith('videos/') ? safeName : `videos/${safeName}`;
    await env.MEDIA_BUCKET.put(key, bodyBytes, {
      httpMetadata: { contentType },
      customMetadata: { uploadedBy: auth.userId || 'local' },
    });
    const baseUrl = `${url.origin}/api/media/${key}`;
    return jsonResponse({ ok: true, key, url: baseUrl, size: bodyBytes.byteLength });
  }

  if (path === '/api/media/list') {
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }
    const url = new URL(request.url);
    const listed = await env.MEDIA_BUCKET.list({ prefix: 'videos/', limit: 100 });
    const items = (listed.objects || []).map((obj) => ({
      key: obj.key,
      url: `${url.origin}/api/media/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded,
    }));
    return jsonResponse({ ok: true, items });
  }

  const key = decodeURIComponent(path.replace(/^\/api\/media\//, '')).replace(/^\/+/, '');
  if (!key) {
    return jsonResponse({ error: 'Missing media key' }, 400);
  }
  const rangeHeader = request.headers.get('Range');
  if (rangeHeader) {
    const headObj = await env.MEDIA_BUCKET.head(key);
    if (!headObj) {
      return jsonResponse({ error: 'Media not found' }, 404);
    }
    const total = headObj.size;
    const match = /^bytes=(\d+)-(\d*)$/i.exec(rangeHeader.trim());
    if (!match) {
      return new Response('Invalid Range', { status: 416, headers: CORS_HEADERS });
    }
    const start = Number(match[1]);
    const end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
    if (start >= total || start > end) {
      return new Response('Range Not Satisfiable', {
        status: 416,
        headers: { ...CORS_HEADERS, 'Content-Range': `bytes */${total}` },
      });
    }
    const length = end - start + 1;
    const sliced = await env.MEDIA_BUCKET.get(key, { range: { offset: start, length } });
    if (!sliced) {
      return jsonResponse({ error: 'Media not found' }, 404);
    }
    const headers = new Headers();
    sliced.writeHttpMetadata(headers);
    if (!headers.get('Content-Type')) headers.set('Content-Type', 'video/mp4');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
    headers.set('Content-Length', String(length));
    headers.set('Cache-Control', 'public, max-age=31536000');
    Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
    return new Response(sliced.body, { status: 206, headers });
  }

  const obj = await env.MEDIA_BUCKET.get(key);
  if (!obj) {
    return jsonResponse({ error: 'Media not found' }, 404);
  }
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  if (!headers.get('Content-Type')) headers.set('Content-Type', 'application/octet-stream');
  headers.set('Accept-Ranges', 'bytes');
  if (typeof obj.size === 'number') {
    headers.set('Content-Length', String(obj.size));
  }
  headers.set('Cache-Control', 'public, max-age=31536000');
  Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
  return new Response(obj.body, { status: 200, headers });
}
