import csv
import xml.etree.ElementTree as ET
from urllib.parse import urlparse, urlunparse

SITEMAP = "build/sitemap.xml"
OUTPUT = "indexing_tasks.csv"

# Load new sitemap — canonical non-www URLs only, no youtube
tree = ET.parse(SITEMAP)
root = tree.getroot()
ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap_urls = {
    url.find("sm:loc", ns).text
    for url in root.findall("sm:url", ns)
    if "youtube.com" not in url.find("sm:loc", ns).text
    and "img.youtube.com" not in url.find("sm:loc", ns).text
}

def canonicalize(url):
    """Normalize to https://planyourrecovery.com/path (no www, no trailing slash, no query)."""
    p = urlparse(url)
    host = "planyourrecovery.com"
    path = p.path.rstrip("/") or "/"
    return urlunparse(("https", host, path, "", "", ""))

# Currently indexed (www, old site)
currently_indexed = """https://www.planyourrecovery.com/team/
https://www.planyourrecovery.com/referrals/
https://www.planyourrecovery.com/psychiatry/
https://www.planyourrecovery.com/
https://www.planyourrecovery.com/psychiatric-evaluation
https://www.planyourrecovery.com/adults/
https://www.planyourrecovery.com/ce/
https://www.planyourrecovery.com/interventions/
https://www.planyourrecovery.com/videos/
https://www.planyourrecovery.com/students/
https://www.planyourrecovery.com/teens/
https://www.planyourrecovery.com/booking/
https://www.planyourrecovery.com/beyond-recovery/
https://www.planyourrecovery.com/ce/substances-disrupt-college/
https://www.planyourrecovery.com/privacy/
https://www.planyourrecovery.com/michelle/
https://www.planyourrecovery.com/ce/contingency-management-teens/
https://www.planyourrecovery.com/psychiatry/opioid/""".strip().splitlines()

# Crawled but not indexed — old/junk URLs
crawled_not_indexed = """https://planyourrecovery.com/videos
https://www.planyourrecovery.com/psychiatry/opioid
https://www.planyourrecovery.com/privacy
https://www.planyourrecovery.com/booking
http://planyourrecovery.com/medication/
https://planyourrecovery.com/team
https://www.planyourrecovery.com/ce/mat-alcohol-use-disorder/
https://planyourrecovery.com/?org=stripe
https://www.planyourrecovery.com/videos
https://www.planyourrecovery.com/students
https://www.planyourrecovery.com/psychiatry/alcohol/
https://www.planyourrecovery.com/team/angela-jones""".strip().splitlines()

# Pages with redirect — all should be deleted
page_with_redirect = """http://planyourrecovery.com/
https://planyourrecovery.com/index
https://www.planyourrecovery.com/index
http://www.planyourrecovery.com/
https://planyourrecovery.com/?org=huntley
https://www.planyourrecovery.com/ce
https://www.planyourrecovery.com/teens
https://www.planyourrecovery.com/adults
https://www.planyourrecovery.com/CE
http://www.planyourrecovery.com/?source=post_page---------------------------
https://planyourrecovery.com/?source=user_profile----------------------------
https://www.planyourrecovery.com/providers
https://www.planyourrecovery.com/referrals
https://www.planyourrecovery.com/psychiatry
http://www.planyourrecovery.com/beyond-recovery
https://www.planyourrecovery.com/beyond-recovery
https://www.planyourrecovery.com/ce/substances-disrupt-college
https://www.planyourrecovery.com/team""".strip().splitlines()

# Discovered but not indexed — www versions of new site pages
# Don't delete (not indexed); just ensure non-www gets URL_UPDATED
discovered_not_indexed = """https://www.planyourrecovery.com/adhd
https://www.planyourrecovery.com/alcohol-treatment
https://www.planyourrecovery.com/alcohol-use-disorder
https://www.planyourrecovery.com/anxiety
https://www.planyourrecovery.com/bipolar-complex-mood
https://www.planyourrecovery.com/cannabis-use-disorder
https://www.planyourrecovery.com/cbt
https://www.planyourrecovery.com/children
https://www.planyourrecovery.com/conditions
https://www.planyourrecovery.com/contingency-management
https://www.planyourrecovery.com/depression
https://www.planyourrecovery.com/emotionally-focused-couples-therapy
https://www.planyourrecovery.com/family-therapy
https://www.planyourrecovery.com/gambling-disorder
https://www.planyourrecovery.com/interventions
https://www.planyourrecovery.com/mindfulness-based-cognitive-therapy
https://www.planyourrecovery.com/motivational-interviewing
https://www.planyourrecovery.com/ocd
https://www.planyourrecovery.com/opioid-use-disorder
https://www.planyourrecovery.com/outpatient-detox
https://www.planyourrecovery.com/patients
https://www.planyourrecovery.com/ptsd
https://www.planyourrecovery.com/relational-conflict
https://www.planyourrecovery.com/stimulant-use-disorder
https://www.planyourrecovery.com/suboxone-treatment
https://www.planyourrecovery.com/team/john-gransbach
https://www.planyourrecovery.com/team/katherine-fezzi
https://www.planyourrecovery.com/team/matt-silva
https://www.planyourrecovery.com/team/michelle-charbonnier
https://www.planyourrecovery.com/team/ned-presnall
https://www.planyourrecovery.com/team/sean-sudekum
https://www.planyourrecovery.com/technology-addiction
https://www.planyourrecovery.com/therapy""".strip().splitlines()

tasks = []
seen = set()

def add(url, ntype):
    key = (url, ntype)
    if key not in seen:
        seen.add(key)
        tasks.append(key)

def is_junk(url):
    """True for query-string-only URLs and /index paths."""
    p = urlparse(url)
    return bool(p.query) or p.path.rstrip("/") in ("/index",)

# Currently indexed — always delete the www version
for url in currently_indexed:
    add(url, "URL_DELETED")
    canonical = canonicalize(url)
    if canonical in sitemap_urls:
        add(canonical, "URL_UPDATED")

# Crawled not indexed — delete if not a canonical new-site URL
for url in crawled_not_indexed:
    if is_junk(url):
        add(url, "URL_DELETED")
        continue
    canonical = canonicalize(url)
    if url != canonical:
        # www or http variant → delete it
        add(url, "URL_DELETED")
    # If canonical is in sitemap, it'll get URL_UPDATED via sitemap sweep below

# Pages with redirect — delete all
for url in page_with_redirect:
    add(url, "URL_DELETED")

# Sweep: URL_UPDATED for every new sitemap URL not already added
for url in sorted(sitemap_urls):
    add(url, "URL_UPDATED")

with open(OUTPUT, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["url", "notification_type"])
    for url, ntype in tasks:
        writer.writerow([url, ntype])

deletes = [t for t in tasks if t[1] == "URL_DELETED"]
updates = [t for t in tasks if t[1] == "URL_UPDATED"]
print(f"Total tasks : {len(tasks)}")
print(f"  URL_DELETED: {len(deletes)}")
print(f"  URL_UPDATED: {len(updates)}")

print("\nIndexed URLs with no new-site equivalent (delete only):")
for url in currently_indexed:
    if canonicalize(url) not in sitemap_urls:
        print(f"  {url}")
