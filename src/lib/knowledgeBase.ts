/**
 * Knowledge Base Abstractions & Content for Nandini's AI Assistant
 * Prepared for future vector database and RAG integration.
 */

export interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    category: string;
    [key: string]: unknown;
  };
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: "static" | "github" | "resume" | "blog" | "youtube";
  load(): Promise<Document[]>;
}

export interface VectorStore {
  addDocuments(docs: Document[]): Promise<void>;
  search(query: string, limit?: number): Promise<Document[]>;
}

/**
 * Clean abstraction layer for future Vector Database integration (e.g., Pinecone, Chroma, pgvector).
 * Currently implements a high-fidelity keyword/term matching algorithm as a placeholder.
 */
export class MockVectorDatabase implements VectorStore {
  private documents: Document[] = [];

  async addDocuments(docs: Document[]): Promise<void> {
    this.documents.push(...docs);
  }

  async search(query: string, limit: number = 3): Promise<Document[]> {
    const cleanQuery = query.toLowerCase();
    const queryWords = cleanQuery.split(/[\s,?.!]+/).filter(w => w.length > 2);

    if (queryWords.length === 0) {
      return this.documents.slice(0, limit);
    }

    // Rank documents based on matches
    const scored = this.documents.map(doc => {
      const content = doc.content.toLowerCase();
      let score = 0;

      // Count term matches
      queryWords.forEach(word => {
        if (content.includes(word)) {
          score += 1;
          // Extra weight for match in title/metadata
          if (doc.metadata.category.toLowerCase().includes(word)) {
            score += 2;
          }
        }
      });

      // Special exact phrases matching
      if (cleanQuery.includes("autobotx") && content.includes("autobotx")) score += 10;
      if (cleanQuery.includes("autoalign") && content.includes("autoalign")) score += 10;
      if (cleanQuery.includes("cdn ignou") && content.includes("cdn ignou")) score += 10;
      if (cleanQuery.includes("resume") && content.includes("resume")) score += 10;
      if (cleanQuery.includes("contact") && content.includes("contact")) score += 10;
      if (cleanQuery.includes("email") && content.includes("email")) score += 10;
      if (cleanQuery.includes("github") && content.includes("github")) score += 10;

      return { doc, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.doc)
      .slice(0, limit);
  }
}

// Static Portfolio Knowledge Source
export const portfolioKnowledge: Document[] = [
  {
    id: "about-me",
    content: "Nandini is a software engineer and community builder based in India. She is currently a Bachelor of Computer Applications (BCA) student at IGNOU and has completed a Master Diploma in Computer Engineering. She is building her pathway to pursue a Master of Computer Applications (MCA) in 2027 through NIMCET / CUET PG. She describes her approach as curiosity-first: learning fast, building consistently, and sharing knowledge openly to help other student builders.",
    metadata: { source: "portfolio", category: "about" }
  },
  {
    id: "education-timeline",
    content: "Nandini's learning pathway consists of three key nodes:\n1. Master Diploma in Computer Engineering (Completed): focused on hardware, computer systems, and systems-level development.\n2. Bachelor of Computer Applications (BCA) at IGNOU (Active): building the core academic backbone for software engineering and application development.\n3. Master of Computer Applications (MCA) (Planned): targeted for admission in 2027 through NIMCET / CUET PG to deepen advanced computer science and product-building skills.",
    metadata: { source: "portfolio", category: "education" }
  },
  {
    id: "experience-cdn-ignou",
    content: "Nandini is the Founder & Technical Lead of CDN IGNOU. She built this student community to offer peer support, technical learning, and open-source opportunities for IGNOU learners, building space for students to ask, build, and grow together.",
    metadata: { source: "portfolio", category: "experience" }
  },
  {
    id: "experience-open-source",
    content: "Nandini is an Open Source Project Admin for programs like SSOC (Social Summer of Code), GSSOC (Girlscript Summer of Code), and Apertre. In these roles, she guides new contributors, reviews pull requests, and hosts open learning sessions. She was recognized as a Top 25 contributor in Apertre 3.0.",
    metadata: { source: "portfolio", category: "experience" }
  },
  {
    id: "experience-mentorship",
    content: "Nandini runs 'Self Taught Bob' where she works as a content creator and mentor. She translates her self-taught coding experience into public notes, beginner guides, and structured learning roadmaps to make tech accessible.",
    metadata: { source: "portfolio", category: "experience" }
  },
  {
    id: "experience-leadership",
    content: "Nandini has held key leadership positions:\n- Campus Ambassador for GeeksforGeeks, connecting students to tech events and resources.\n- Campus Ambassador Program Manager Lead for Work2Hire, managing ambassador workflows, outreach, and coordination loops.\n- Host and Management Lead for Open Source Connect (OSCG), coordinating event flow, speakers, and developer meetups.\n- Sales Development Representative at algoacquisition, refining outreach, communication, and business context.",
    metadata: { source: "portfolio", category: "experience" }
  },
  {
    id: "achievements-wins",
    content: "Nandini's top achievements include:\n- 2nd Place in an IoT Hackathon with AutoBotX, which blended hardware engineering with software execution.\n- Recognized as a Top 25 contributor in Apertre 3.0.\n- Recipient of Commudle recognition for her project AutoAlign.\n- Organized major student hackathons, workshops, and HackDay sessions.",
    metadata: { source: "portfolio", category: "achievements" }
  },
  {
    id: "tech-stack-details",
    content: "Nandini's primary tech stack and tools are:\n- Frontend: React, Next.js, JavaScript, TypeScript, Tailwind CSS\n- Backend: Python, Flask, Node.js, REST APIs\n- Tools & Databases: Git, GitHub, Postman, SQL (PostgreSQL)\n- AI & Computer Vision: OpenCV, MediaPipe",
    metadata: { source: "portfolio", category: "tech_stack" }
  },
  {
    id: "projects-autobotx",
    content: "AutoBotX is a award-winning project built by Nandini. It won 2nd place in an IoT Hackathon. AutoBotX blends hardware-level computer thinking with software execution to create a responsive, autonomous system.",
    metadata: { source: "portfolio", category: "projects" }
  },
  {
    id: "projects-autoalign",
    content: "AutoAlign is a project built by Nandini that received recognition on Commudle. It focuses on automated alignments or coordination, showcasing her utility-first developer mindset.",
    metadata: { source: "portfolio", category: "projects" }
  },
  {
    id: "resume-pdf",
    content: "You can view and download Nandini's official resume directly at: /assets/Nandini.pdf",
    metadata: { source: "portfolio", category: "resume" }
  },
  {
    id: "contact-socials",
    content: "You can reach out to Nandini via these channels:\n- YouTube Channel: https://youtube.com/@self_taught_bob\n- GitHub: https://github.com/nandinigoyaldev\n- LinkedIn: https://linkedin.com/in/nandinigoyaldev\n- Resume: /assets/Nandini.pdf",
    metadata: { source: "portfolio", category: "contact" }
  }
];
