export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range',
  'Access-Control-Expose-Headers': 'Accept-Ranges, Content-Range, Content-Length, X-TTS-Cache',
  'Access-Control-Max-Age': '86400',
};

export const GEMINI_FALLBACK_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash'];

export function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}
