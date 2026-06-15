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

    // Add simulated latency for realistic "thinking"
    const delay = Math.floor(Math.random() * 800) + 600; // 600ms to 1400ms
    await new Promise(resolve => setTimeout(resolve, delay));

    // 4. Construct response based on matched intent or search results
    let reply = "";

    // Advanced Regex Intent Matching
    if (/\b(hello|hi|hey|greetings|hola)\b/.test(query)) {
      reply = "Hey there! 👋 I'm Nandini's AI Twin. I can tell you about her **projects**, **communities**, **open-source work**, and **technical journey**. What would you like to explore?";
    } else if (/\b(autobotx)\b/.test(query)) {
      reply = "**AutoBotX** is one of my favorite projects! 🤖\n\nIt's an IoT system that placed **2nd in a national hackathon**, blending hardware sensory loops with a Python orchestration server. You can check out the source code on my GitHub!";
    } else if (/\b(autoalign)\b/.test(query)) {
      reply = "**AutoAlign** is a layout alignment calculation utility that simplifies spatial coordinates in designs. 📐\n\nIt actually received special recognition on **Commudle** for its utility in developer workflows!";
    } else if (/\b(project|projects|built|work|portfolio)\b/.test(query)) {
      reply = "I've built several exciting projects! Some highlights include:\n\n* **AutoBotX**: IoT hackathon 2nd place winner.\n* **AutoAlign**: Commudle recognized layout utility.\n\nMy recent GitHub activity also shows a lot of new experiments. What type of project are you curious about?";
    } else if (/\b(community|communities|founded|ignou|cdn)\b/.test(query)) {
      reply = "Community is a huge part of my journey! 🌍\n\n* I founded **CDN IGNOU** to help student developers support one another, share code, and find opportunities.\n* I also led ambassadors for **Work2Hire**.\n* I've hosted multiple events at **Open Source Connect**!";
    } else if (/\b(open(-|\s)?source|contribut(e|ion|or)|ssoc|gssoc)\b/.test(query)) {
      reply = "I love open source! 🌟\n\nI've been a **Project Admin** for SSOC, GSSOC, and Apertre (where I made the **Top 25 contributor list**!). I really enjoy helping other developers learn how to make their first pull requests and get involved.";
    } else if (/\b(resume|cv|experience|background)\b/.test(query)) {
      reply = "Sure thing! 📄\n\nYou can view or download my resume directly here: [**Nandini's Resume**](/assets/Nandini.pdf).\n\nLet me know if you have specific questions about my experience or skills!";
    } else if (/\b(contact|reach|youtube|social|linkedin|github|twitter|x)\b/.test(query)) {
      reply = "Let's connect! 🤝\n\n* Watch my mentorship guides on [**YouTube**](https://youtube.com/@self_taught_bob)\n* Connect with me professionally on [**LinkedIn**](https://linkedin.com/in/goyaljiiiiii)\n* Check out my open-source code on [**GitHub**](https://github.com/goyaljiiiiii)\n\nI'm always open to talking about new opportunities!";
    } else if (/\b(nandini|who are you|tell me about)\b/.test(query)) {
      reply = "I'm Nandini, a BCA student at IGNOU and technical diploma graduate. 👩‍💻\n\nI'm building spaces in tech through **CDN IGNOU**, mentoring on my YouTube channel **Self Taught Bob**, and growing in public through open source. I'm currently targeting my MCA postgraduate studies in 2027!";
    } else if (searchResults.length > 0) {
      // General RAG mapping: formulate answer from matched document
      const primaryDoc = searchResults[0];
      if (primaryDoc.metadata.source === "github") {
        const repo = githubRepos.find(r => primaryDoc.id.includes(r.name.toLowerCase()));
        if (repo) {
          reply = `From my GitHub data: **${repo.name}** is a ${repo.language} repository. ${repo.description || "It's an active project in my stack."} It has ${repo.stars} stars and was last updated recently.`;
        } else {
          reply = primaryDoc.content.slice(0, 160) + "... You can check this out in my GitHub repositories!";
        }
      } else {
        reply = primaryDoc.content;
      }
    } else {
      // Conversational Fallback
      reply = "I can tell you about my **projects**, **communities**, **open-source work**, and **technical journey**. Let me know if you want to see my resume, hear about AutoBotX, or connect! 😊";
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
