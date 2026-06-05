import fs from "fs";
import path from "path";
import { Document } from "./knowledgeBase";

export interface GitHubRepository {
  name: string;
  description: string;
  html_url: string;
  language: string;
  languages: string[];
  readme?: string;
  stars: number;
  forks: number;
  updated_at: string;
}

const CACHE_DIR = path.join(process.cwd(), "data");
const CACHE_FILE = path.join(CACHE_DIR, "github-cache.json");

// Default mock repositories to use as fallback or initial load to ensure instant speed & functionality
const MOCK_REPOSITORIES: GitHubRepository[] = [
  {
    name: "AutoBotX",
    description: "An award-winning IoT system blending hardware control and software execution. Placed 2nd in the National IoT Hackathon.",
    html_url: "https://github.com/goyaljiiiiii/AutoBotX",
    language: "C++",
    languages: ["C++", "Python", "HTML"],
    readme: "# AutoBotX\n\nAutoBotX is an autonomous IoT system designed to orchestrate sensory feedback and machine actions in real-time. This project placed second in the IoT Hackathon, demonstrating robustness across hardware-software lines.\n\n## Features\n- Direct hardware sensory loops\n- Python orchestration server\n- Real-time diagnostics panel",
    stars: 12,
    forks: 3,
    updated_at: "2026-05-15T10:00:00Z"
  },
  {
    name: "AutoAlign",
    description: "A utility tool for automated alignment and visual component mapping, recognized on Commudle.",
    html_url: "https://github.com/goyaljiiiiii/AutoAlign",
    language: "TypeScript",
    languages: ["TypeScript", "React", "CSS"],
    readme: "# AutoAlign\n\nAutoAlign simplifies spatial alignment calculations for design models and interactive layouts. Recognized on Commudle for its ease-of-use and clear developer utility.",
    stars: 8,
    forks: 1,
    updated_at: "2026-06-01T14:30:00Z"
  },
  {
    name: "portfolio",
    description: "Personal portfolio built with Next.js 16, Tailwind CSS v4, and Framer Motion.",
    html_url: "https://github.com/goyaljiiiiii/portfolio",
    language: "TypeScript",
    languages: ["TypeScript", "Next.js", "Tailwind CSS"],
    readme: "# Personal Portfolio\n\nThis is my interactive digital twin portfolio showcasing projects, education, and communities.",
    stars: 5,
    forks: 0,
    updated_at: "2026-06-05T18:00:00Z"
  }
];

/**
 * Loads repositories from the local JSON cache. Falls back to mock data if cache is empty.
 */
export function getCachedRepositories(): GitHubRepository[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading GitHub cache:", error);
  }
  return MOCK_REPOSITORIES;
}

/**
 * Saves repository array to the local JSON cache.
 */
export function saveCachedRepositories(repos: GitHubRepository[]): void {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(repos, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing GitHub cache:", error);
  }
}

/**
 * Fetches repositories and details dynamically from the GitHub API.
 * Designed for on-demand sync triggers or cron schedules.
 */
export async function syncGitHubData(username: string = "goyaljiiiiii"): Promise<GitHubRepository[]> {
  try {
    // 1. Fetch repos list
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Nandini-Portfolio-Assistant"
      },
      next: { revalidate: 3600 } // Cache for 1 hour in Next.js
    });

    if (!reposRes.ok) {
      throw new Error(`GitHub API returned status ${reposRes.status}`);
    }

    const reposData = await reposRes.json();
    if (!Array.isArray(reposData)) {
      throw new Error("Invalid response from GitHub API");
    }

    const updatedRepos: GitHubRepository[] = [];

    for (const repo of reposData) {
      if (repo.fork) continue; // Skip forks to show original work

      // Fetch languages
      let languages: string[] = [repo.language].filter(Boolean);
      try {
        const langRes = await fetch(repo.languages_url, {
          headers: { "User-Agent": "Nandini-Portfolio-Assistant" }
        });
        if (langRes.ok) {
          const langData = await langRes.ok ? await langRes.json() : {};
          languages = Object.keys(langData);
        }
      } catch {
        // Fallback to primary language
      }

      // Fetch README content from raw usercontent (or fallback API content)
      let readme = "";
      const branches = ["main", "master"];
      for (const branch of branches) {
        try {
          const readmeRes = await fetch(`https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/README.md`);
          if (readmeRes.ok) {
            readme = await readmeRes.text();
            break;
          }
        } catch {
          // try next branch
        }
      }

      updatedRepos.push({
        name: repo.name,
        description: repo.description || "",
        html_url: repo.html_url,
        language: repo.language || "",
        languages: languages.length > 0 ? languages : [repo.language || "Other"],
        readme: readme || undefined,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updated_at: repo.updated_at
      });
    }

    if (updatedRepos.length > 0) {
      saveCachedRepositories(updatedRepos);
      return updatedRepos;
    }
  } catch (error) {
    console.error("Failed to sync dynamically from GitHub, returning cached data. Error:", error);
  }

  // Fallback to cached data if API call fails (rate limits or offline)
  return getCachedRepositories();
}

/**
 * Map repository data to Vector/RAG document objects
 */
export function getRepositoriesAsDocuments(repos: GitHubRepository[]): Document[] {
  return repos.map(repo => ({
    id: `github-repo-${repo.name.toLowerCase()}`,
    content: `Repository name: ${repo.name}. Description: ${repo.description}. URL: ${repo.html_url}. Primary language: ${repo.language}. Languages used: ${repo.languages.join(", ")}. Stars: ${repo.stars}. Forks: ${repo.forks}. Last updated: ${repo.updated_at}. README content:\n${repo.readme || "No README available."}`,
    metadata: {
      source: "github",
      category: "projects",
      name: repo.name,
      url: repo.html_url,
      stars: repo.stars,
      forks: repo.forks
    }
  }));
}
