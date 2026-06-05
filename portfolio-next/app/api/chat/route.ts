import { NextResponse } from "next/server";
import { MockVectorDatabase, portfolioKnowledge } from "../../../lib/knowledgeBase";
import { getCachedRepositories, getRepositoriesAsDocuments } from "../../../lib/githubSync";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { ok: false, reply: "I didn't catch that. Could you say it again?" },
        { status: 400 }
      );
    }

    const query = message.trim().toLowerCase();

    // 1. Load data from cached GitHub repos and static portfolio knowledge
    const githubRepos = getCachedRepositories();
    const githubDocs = getRepositoriesAsDocuments(githubRepos);
    
    // 2. Initialize and index search database
    const db = new MockVectorDatabase();
    await db.addDocuments(portfolioKnowledge);
    await db.addDocuments(githubDocs);

    // 3. Search database
    const searchResults = await db.search(query, 2);

    // 4. Construct response based on matched intent or search results
    let reply = "";

    // Exact matches / high-priority intent routing
    if (query.includes("hello") || query.includes("hi ") || query.includes("hey")) {
      reply = "Hey there! I can tell you about Nandini's projects, communities, open-source work, and technical journey. What would you like to explore?";
    } else if (query.includes("autobotx")) {
      const doc = searchResults.find(d => d.id.includes("autobotx") || d.content.toLowerCase().includes("autobotx"));
      reply = doc 
        ? `AutoBotX is one of my favorite projects. It's an IoT system that placed 2nd in a national hackathon, blending hardware sensory loops with a Python orchestration server. You can check it out on GitHub!`
        : `AutoBotX is an IoT project of mine that won 2nd place in a hackathon. It combines hardware-level sensing with software controls.`;
    } else if (query.includes("autoalign")) {
      reply = "AutoAlign is a layout alignment calculation utility that simplifies spatial coordinates in designs. It actually received recognition on Commudle!";
    } else if (query.includes("projects") || query.includes("built") || query.includes("work")) {
      const repoNames = githubRepos.map(r => r.name).slice(0, 3).join(", ");
      reply = `I've built projects like AutoBotX (IoT hackathon 2nd place) and AutoAlign (Commudle recognized). My GitHub sync shows recent work on repositories like ${repoNames || "AutoBotX and AutoAlign"}. What type of project are you curious about?`;
    } else if (query.includes("community") || query.includes("communities") || query.includes("founded")) {
      reply = "I founded CDN IGNOU to help student developers support one another, share code, and find opportunities. I also led ambassadors for Work2Hire and hosted events at Open Source Connect!";
    } else if (query.includes("open-source") || query.includes("open source") || query.includes("contribut")) {
      reply = "I've been a Project Admin for SSOC, GSSOC, and Apertre (where I made the Top 25 contributor list!). I enjoy helping other developers learn how to make their first pull requests.";
    } else if (query.includes("resume")) {
      reply = "Sure! You can view or download my resume directly here: [Nandini's Resume](/assets/Nandini.pdf). Let me know if you have questions about my experience!";
    } else if (query.includes("contact") || query.includes("reach") || query.includes("youtube") || query.includes("social")) {
      reply = "You can watch my guides on [YouTube](https://youtube.com/@self_taught_bob), connect with me on [LinkedIn](https://linkedin.com/in/goyaljiiiiii), or check out my code on [GitHub](https://github.com/goyaljiiiiii). Let's build something!";
    } else if (query.includes("nandini") || query.includes("who are you") || query.includes("tell me about")) {
      reply = "I'm Nandini, a BCA student at IGNOU and technical diploma graduate. I'm building spaces in tech through CDN IGNOU, mentoring on 'Self Taught Bob', and growing in public through open source. I'm targeting my MCA postgraduate studies in 2027!";
    } else if (searchResults.length > 0) {
      // General RAG mapping: formulate answer from matched document
      const primaryDoc = searchResults[0];
      if (primaryDoc.metadata.source === "github") {
        const repo = githubRepos.find(r => primaryDoc.id.includes(r.name.toLowerCase()));
        if (repo) {
          reply = `From my GitHub data: ${repo.name} is a ${repo.language} repository. ${repo.description || "It's an active project in my stack."} It has ${repo.stars} stars and was last updated recently.`;
        } else {
          reply = primaryDoc.content.slice(0, 160) + "... You can check this out in my GitHub repositories!";
        }
      } else {
        reply = primaryDoc.content;
      }
    } else {
      // Conversational Fallback
      reply = "I can tell you about Nandini's projects, communities, open-source work, and technical journey. Let me know if you want to see her resume, hear about AutoBotX, or connect!";
    }

    return NextResponse.json({ ok: true, reply }, { status: 200 });
  } catch (error: unknown) {
    console.error("Chat API error:", error as Error);
    return NextResponse.json(
      { ok: false, reply: "Sorry, I hit a slight connection glitch. Ask me again in a second!" },
      { status: 500 }
    );
  }
}
