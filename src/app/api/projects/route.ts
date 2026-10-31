import { NextResponse } from "next/server";
import {
  fetchLiveRepositories,
  getCachedRepositories,
} from "../../../lib/githubSync";

export const revalidate = 300;

export async function GET() {
  try {
    let repositories;
    try {
      repositories = await fetchLiveRepositories("nandinigoyaldev");
    } catch (liveError) {
      console.error("Live GitHub fetch failed, using cache:", liveError);
      repositories = getCachedRepositories().filter(
        (r) => !r.fork && r.name.toLowerCase() !== "nandinigoyaldev"
      );
    }

    return NextResponse.json({
      success: true,
      count: repositories.length,
      repositories,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load projects" },
      { status: 500 }
    );
  }
}
