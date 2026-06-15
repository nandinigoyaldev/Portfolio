import { NextResponse } from "next/server";
import { syncGitHubData } from "../../../lib/githubSync";

export async function POST() {
  try {
    // Check for authorization token if needed in production (e.g. from req.headers)
    // const authHeader = req.headers.get("authorization");

    const repos = await syncGitHubData("goyaljiiiiii");
    return NextResponse.json({
      success: true,
      message: "GitHub repositories synchronized successfully.",
      count: repos.length,
      repositories: repos.map(r => r.name)
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to synchronize GitHub data" },
      { status: 500 }
    );
  }
}

// Allow GET for simple manual verification/testing in browser or curl
export async function GET() {
  try {
    const repos = await syncGitHubData("goyaljiiiiii");
    return NextResponse.json({
      success: true,
      message: "GitHub repositories synchronized successfully (via GET).",
      count: repos.length,
      repositories: repos.map(r => r.name)
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || "Failed to synchronize GitHub data" },
      { status: 500 }
    );
  }
}
