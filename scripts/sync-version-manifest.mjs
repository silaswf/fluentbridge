import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;

const manifest = {
  version,
  publishedAt: new Date().toISOString().slice(0, 10),
  releaseNotes: `FluentBridge Academy v${version}`,
  windowsUrl: `https://github.com/silaswf/fluentbridge-releases/releases/download/v${version}/FluentBridge-Setup-${version}.exe`,
  androidUrl: `https://github.com/silaswf/fluentbridge-releases/releases/download/v${version}/FluentBridge-v${version}.apk`,
  releasePageUrl: `https://github.com/silaswf/fluentbridge-releases/releases/tag/v${version}`,
};

fs.writeFileSync(
  path.join(root, 'public', 'version.json'),
  JSON.stringify(manifest, null, 2) + '\n',
  'utf8',
);
console.log(`Synced public/version.json to v${version}`);
