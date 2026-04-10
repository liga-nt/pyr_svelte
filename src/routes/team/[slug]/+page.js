import team from '$lib/content/team.json';
export const prerender = true;
export function entries() {
  return team.filter(p => p.isProvider).map(p => ({ slug: p.slug }));
}
