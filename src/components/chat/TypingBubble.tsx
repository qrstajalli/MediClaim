export const TypingBubble = ({ label }: { label?: string }) => (
  <div className="flex justify-start animate-fade-in-up">
    <div className="rounded-2xl rounded-tl-sm bg-chat-bubble-bot px-4 py-3 shadow-bubble flex items-center gap-2">
      <span className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: "300ms" }} />
      </span>
      {label && <span className="text-xs text-muted-foreground ml-1">{label}</span>}
    </div>
  </div>
);
