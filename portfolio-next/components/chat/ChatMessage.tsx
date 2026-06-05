import React from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

/**
 * Basic inline markdown parser helper to render links and bold text
 */
function parseMessageContent(text: string) {
  // Regex to extract [label](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    
    if (textBefore) {
      parts.push(...parseBoldText(textBefore));
    }

    const [,, label, url] = match;
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 underline underline-offset-2 font-medium transition-colors"
      >
        {label} ↗
      </a>
    );

    lastIndex = linkRegex.lastIndex;
  }

  const textAfter = text.substring(lastIndex);
  if (textAfter) {
    parts.push(...parseBoldText(textAfter));
  }

  return parts.length > 0 ? parts : [text];
}

function parseBoldText(text: string): React.ReactNode[] {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const textBefore = text.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(textBefore);
    }

    parts.push(
      <strong key={match.index} className="font-semibold text-white">
        {match[1]}
      </strong>
    );

    lastIndex = boldRegex.lastIndex;
  }

  const textAfter = text.substring(lastIndex);
  if (textAfter) {
    parts.push(textAfter);
  }

  return parts.length > 0 ? parts : [text];
}

export default function ChatMessageView({
  role,
  content,
}: {
  role: ChatMessage["role"];
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div
      className={
        isUser
          ? "flex justify-end w-full"
          : "flex justify-start w-full"
      }
    >
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-tr-none bg-brand/20 text-white px-4 py-3 text-sm border border-brand/35 shadow-[0_4px_15px_rgba(213,83,77,0.15)] leading-relaxed select-text"
            : "max-w-[85%] rounded-2xl rounded-tl-none bg-white/[0.06] px-4 py-3 text-sm text-white/90 border border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.15)] leading-relaxed select-text"
        }
        aria-label={isUser ? "User message" : "Assistant message"}
      >
        <div className="whitespace-pre-wrap">
          {parseMessageContent(content)}
        </div>
      </div>
    </div>
  );
}
