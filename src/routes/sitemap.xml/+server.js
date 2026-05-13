export const prerender = true;

import { PUBLIC_SITE_URL } from '$env/static/public';
import videosData from '$lib/content/videos.json';

const site = PUBLIC_SITE_URL;

/** @param {string} str */
function xmlEscape(str) {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

const routes = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/therapy', priority: '0.9', changefreq: 'monthly' },
	{ path: '/psychiatry', priority: '0.9', changefreq: 'monthly' },
	{ path: '/conditions', priority: '0.8', changefreq: 'monthly' },
	{ path: '/interventions', priority: '0.7', changefreq: 'monthly' },
	{ path: '/booking', priority: '0.9', changefreq: 'monthly' },
	{ path: '/team', priority: '0.7', changefreq: 'monthly' },
	// Conditions
	{ path: '/anxiety', priority: '0.8', changefreq: 'monthly' },
	{ path: '/depression', priority: '0.8', changefreq: 'monthly' },
	{ path: '/adhd', priority: '0.8', changefreq: 'monthly' },
	{ path: '/ocd', priority: '0.8', changefreq: 'monthly' },
	{ path: '/ptsd', priority: '0.8', changefreq: 'monthly' },
	{ path: '/opioid-use-disorder', priority: '0.8', changefreq: 'monthly' },
	{ path: '/alcohol-use-disorder', priority: '0.8', changefreq: 'monthly' },
	{ path: '/stimulant-use-disorder', priority: '0.8', changefreq: 'monthly' },
	{ path: '/gambling-disorder', priority: '0.7', changefreq: 'monthly' },
	{ path: '/bipolar-complex-mood', priority: '0.8', changefreq: 'monthly' },
	{ path: '/relational-conflict', priority: '0.7', changefreq: 'monthly' },
	{ path: '/technology-addiction', priority: '0.7', changefreq: 'monthly' },
	{ path: '/cannabis-use-disorder', priority: '0.8', changefreq: 'monthly' },
	// Approaches
	{ path: '/cbt', priority: '0.7', changefreq: 'monthly' },
	{ path: '/family-therapy', priority: '0.7', changefreq: 'monthly' },
	{ path: '/motivational-interviewing', priority: '0.7', changefreq: 'monthly' },
	{ path: '/contingency-management', priority: '0.7', changefreq: 'monthly' },
	{ path: '/suboxone-treatment', priority: '0.7', changefreq: 'monthly' },
	{ path: '/alcohol-treatment', priority: '0.7', changefreq: 'monthly' },
	{ path: '/psychiatric-evaluation', priority: '0.7', changefreq: 'monthly' },
	{ path: '/outpatient-detox', priority: '0.7', changefreq: 'monthly' },
	{ path: '/mindfulness-based-cognitive-therapy', priority: '0.7', changefreq: 'monthly' },
	{ path: '/emotionally-focused-couples-therapy', priority: '0.7', changefreq: 'monthly' },
	// Who we treat
	{ path: '/patients', priority: '0.7', changefreq: 'monthly' },
	{ path: '/children', priority: '0.7', changefreq: 'monthly' },
	{ path: '/teens', priority: '0.7', changefreq: 'monthly' },
	{ path: '/students', priority: '0.7', changefreq: 'monthly' },
	{ path: '/adults', priority: '0.7', changefreq: 'monthly' },
	// Team
	{ path: '/team/ned-presnall', priority: '0.6', changefreq: 'monthly' },
	{ path: '/team/michelle-charbonnier', priority: '0.6', changefreq: 'monthly' },
	{ path: '/team/matt-silva', priority: '0.6', changefreq: 'monthly' },
	{ path: '/team/sean-sudekum', priority: '0.6', changefreq: 'monthly' },
	{ path: '/team/katherine-fezzi', priority: '0.6', changefreq: 'monthly' },
	{ path: '/team/angela-jones', priority: '0.6', changefreq: 'monthly' },
	{ path: '/team/john-gransbach', priority: '0.6', changefreq: 'monthly' },
];

const today = new Date().toISOString().split('T')[0];

const videoEntries = videosData.videos
	.map(
		(v) => `    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${v.videoID}/hqdefault.jpg</video:thumbnail_loc>
      <video:title>${xmlEscape(v.title)}</video:title>
      <video:description>${xmlEscape(v.description)}</video:description>
      <video:player_loc>https://www.youtube.com/embed/${v.videoID}</video:player_loc>
      <video:publication_date>${v.uploadDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>`
	)
	.join('\n');

export async function GET() {
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes
	.map(
		({ path, priority, changefreq }) => `  <url>
    <loc>${site}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
	)
	.join('\n')}
  <url>
    <loc>${site}/videos</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
${videoEntries}
  </url>
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
