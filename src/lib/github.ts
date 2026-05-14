export type LatestCommit = {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  htmlUrl: string;
};

export async function getLatestCommit(
  owner: string,
  repo: string,
  branch: string,
): Promise<LatestCommit | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 300 },
      },
    );

    if (!res.ok) return null;
    const data = await res.json();
    return {
      sha: data.sha,
      shortSha: data.sha.slice(0, 7),
      message: (data.commit.message ?? "").split("\n")[0],
      date: data.commit.author.date,
      htmlUrl: data.html_url,
    };
  } catch {
    return null;
  }
}
