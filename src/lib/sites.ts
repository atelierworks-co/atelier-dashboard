import sitesConfig from "@/../config/sites.json";

export type Site = {
  slug: string;
  name: string;
  description: string;
  url: string | null;
  github: {
    owner: string;
    repo: string;
    branch: string;
  } | null;
  cloudflare: {
    zoneId: string | null;
  } | null;
  posthog: {
    projectId: string | null;
  } | null;
};

export function getSites(): Site[] {
  return sitesConfig.sites as Site[];
}

export function getSite(slug: string): Site | undefined {
  return getSites().find((s) => s.slug === slug);
}
