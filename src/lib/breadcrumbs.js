/** @typedef {{ name: string, url: string }} Crumb */

const BASE = 'https://planyourrecovery.com';

const HOME       = { name: 'Home',        url: `${BASE}/` };
const THERAPY    = { name: 'Therapy',     url: `${BASE}/therapy` };
const PSYCHIATRY = { name: 'Psychiatry',  url: `${BASE}/psychiatry` };
const CONDITIONS = { name: 'Conditions',  url: `${BASE}/conditions` };
const TEAM       = { name: 'Our Team',    url: `${BASE}/team` };

/** @type {Record<string, Crumb[]>} */
const routes = {
	'/':           [HOME],
	'/therapy':    [HOME, THERAPY],
	'/psychiatry': [HOME, PSYCHIATRY],
	'/conditions': [HOME, CONDITIONS],
	'/team':       [HOME, TEAM],

	'/patients': [HOME, { name: 'Who We Treat', url: `${BASE}/patients` }],

	// Audience pages
	'/adults':   [HOME, { name: 'Adults',           url: `${BASE}/adults` }],
	'/teens':    [HOME, { name: 'Teens',             url: `${BASE}/teens` }],
	'/children': [HOME, { name: 'Children',          url: `${BASE}/children` }],
	'/students': [HOME, { name: 'College Students',  url: `${BASE}/students` }],

	// Utility pages
	'/booking':         [HOME, { name: 'Make an Appointment', url: `${BASE}/booking` }],
	'/videos':          [HOME, { name: 'Videos',               url: `${BASE}/videos` }],
	'/ce':              [HOME, { name: 'Continuing Education', url: `${BASE}/ce` }],
	'/interventions':   [HOME, { name: 'Interventions',        url: `${BASE}/interventions` }],
	'/clinical-tools':     [HOME, { name: 'Clinical Screening Tools', url: `${BASE}/clinical-tools` }],
	'/clinical-tools/asi': [HOME, { name: 'Clinical Screening Tools', url: `${BASE}/clinical-tools` }, { name: 'ASI-5', url: `${BASE}/clinical-tools/asi` }],
	'/privacy':         [HOME, { name: 'Privacy Policy',       url: `${BASE}/privacy` }],

	// Conditions
	'/depression':             [HOME, CONDITIONS, { name: 'Depression',             url: `${BASE}/depression` }],
	'/anxiety':                [HOME, CONDITIONS, { name: 'Anxiety',                url: `${BASE}/anxiety` }],
	'/ptsd':                   [HOME, CONDITIONS, { name: 'PTSD & Trauma',          url: `${BASE}/ptsd` }],
	'/adhd':                   [HOME, CONDITIONS, { name: 'ADHD',                   url: `${BASE}/adhd` }],
	'/ocd':                    [HOME, CONDITIONS, { name: 'OCD',                    url: `${BASE}/ocd` }],
	'/alcohol-use-disorder':   [HOME, CONDITIONS, { name: 'Alcohol Use Disorder',   url: `${BASE}/alcohol-use-disorder` }],
	'/opioid-use-disorder':    [HOME, CONDITIONS, { name: 'Opioid Use Disorder',    url: `${BASE}/opioid-use-disorder` }],
	'/stimulant-use-disorder': [HOME, CONDITIONS, { name: 'Stimulant Use Disorder', url: `${BASE}/stimulant-use-disorder` }],
	'/gambling-disorder':      [HOME, CONDITIONS, { name: 'Gambling Disorder',      url: `${BASE}/gambling-disorder` }],
	'/addiction':              [HOME, CONDITIONS, { name: 'Addiction',              url: `${BASE}/addiction` }],

	// Therapy approaches
	'/cbt':                       [HOME, THERAPY, { name: 'Cognitive Behavioral Therapy', url: `${BASE}/cbt` }],
	'/family-therapy':            [HOME, THERAPY, { name: 'Family Therapy',               url: `${BASE}/family-therapy` }],
	'/motivational-interviewing': [HOME, THERAPY, { name: 'Motivational Interviewing',    url: `${BASE}/motivational-interviewing` }],
	'/contingency-management':    [HOME, THERAPY, { name: 'Contingency Management',       url: `${BASE}/contingency-management` }],
	'/our-approach':              [HOME, THERAPY, { name: 'Our Approach',                 url: `${BASE}/our-approach` }],

	// Psychiatry / treatments
	'/mat':                    [HOME, PSYCHIATRY, { name: 'Medication-Assisted Treatment', url: `${BASE}/mat` }],
	'/alcohol-treatment':      [HOME, PSYCHIATRY, { name: 'Alcohol Treatment',             url: `${BASE}/alcohol-treatment` }],
	'/suboxone-treatment':     [HOME, PSYCHIATRY, { name: 'Suboxone Treatment',            url: `${BASE}/suboxone-treatment` }],
	'/outpatient-detox':       [HOME, PSYCHIATRY, { name: 'Outpatient Detox',              url: `${BASE}/outpatient-detox` }],
	'/psychiatric-evaluation': [HOME, PSYCHIATRY, { name: 'Psychiatric Evaluation',        url: `${BASE}/psychiatric-evaluation` }],
};

/** @param {string} pathname @returns {Crumb[] | null} */
export function getBreadcrumbs(pathname) {
	return routes[pathname] ?? null;
}

/** @param {Crumb[]} crumbs */
export function toBreadcrumbSchema(crumbs) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		name: crumbs.map(c => c.name).join(' > '),
		itemListElement: crumbs.map((crumb, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: crumb.name,
			item: crumb.url
		}))
	};
}
