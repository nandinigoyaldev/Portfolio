export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

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
          ? "flex justify-end"
          : "flex justify-start"
      }
    >
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl bg-brand text-white px-4 py-3 text-sm"
            : "max-w-[85%] rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-900"
        }
        aria-label={isUser ? "User message" : "Assistant message"}
      >
        {content}
      </div>
    </div>
  );
}

