import { readFileSync } from 'fs';

const KEY = 'b15d78af4ba44a6a88fc422370a19148';
const HOST = 'www.planyourrecovery.com';
const SITEMAP = 'build/sitemap.xml';

const xml = readFileSync(SITEMAP, 'utf-8');
const urls = [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);

if (urls.length === 0) {
  console.error('No URLs found in sitemap — aborting');
  process.exit(1);
}

console.log(`Submitting ${urls.length} URLs to IndexNow...`);

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});

if (res.ok) {
  console.log(`Done — ${res.status} ${res.statusText}`);
} else {
  const body = await res.text();
  console.error(`IndexNow error ${res.status}: ${body}`);
  process.exit(1);
}
