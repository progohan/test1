import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const base = process.env['VITE_BASE_PATH'] || '/test1/';
const data = JSON.parse(await readFile('public/data.json', 'utf8'));
const renderedAt = new Date().toISOString();
const { render } = await import(pathToFileURL(resolve('.prerender/entry-server.js')).href);
const markup = render(data, renderedAt);
const bootstrap = JSON.stringify({ data, renderedAt }).replace(/</g, '\\u003c');
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = await readFile('dist/index.html', 'utf8');
if (!html.includes('<div id="root"></div>')) throw new Error('Missing HTML mount point.');
html = html.replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${markup}</div><script id="portfolio-bootstrap" type="application/json">${bootstrap}</script>`);
const siteUrl = `https://progohan.github.io${base}`;
html = html.replaceAll('https://progohan.github.io/EF/', siteUrl);
html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(data.personal_info.full_name)} | Infrastructure Portfolio</title>`);
html = html.replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${escape(data.personal_info.summary)}$2`);
html = html.replace(/<meta (?:name|property)="(?:author|og:title|og:description|og:url|og:image|twitter:title|twitter:description|twitter:image)"[^>]*>/g, '');
const metadata = {
  author: data.personal_info.full_name,
  'og:title': `${data.personal_info.full_name} | Infrastructure Portfolio`,
  'og:description': data.personal_info.summary,
  'og:url': siteUrl,
  'og:image': `${siteUrl}${data.personal_info.profile_image}`,
  'og:image:alt': `${data.personal_info.full_name} - corporate portrait`,
  'twitter:title': `${data.personal_info.full_name} | Infrastructure Portfolio`,
  'twitter:description': data.personal_info.summary,
  'twitter:image': `${siteUrl}${data.personal_info.profile_image}`,
};
const tags = Object.entries(metadata).map(([key, value]) => `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escape(value)}" />`).join('');
html = html.replace('</head>', tags + '<meta name="robots" content="noindex,follow" /><meta property="og:image:width" content="320" /><meta property="og:image:height" content="320" /></head>');
html = html.replace('</body>', '<noscript><style>.email-draft-form{display:none}</style><p>Portfolio content and contact links are available without JavaScript. Interactive charts, maps, and filters require JavaScript.</p></noscript></body>');
await writeFile('dist/index.html', html);
console.log(`Pre-rendered the portfolio at ${siteUrl}; test preview remains noindex.`);
