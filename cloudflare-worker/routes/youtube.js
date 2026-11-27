/**
 * @file cloudflare-worker/routes/youtube.js
 * @description Ponto de entrada modular para a rota /api/youtube-study, reexportando os handlers de youtubeStudy.js.
 * @exports extractYouTubeIdServer, handleYouTubeStudyRequest
 */
export { extractYouTubeIdServer, handleYouTubeStudyRequest } from './youtubeStudy.js';
