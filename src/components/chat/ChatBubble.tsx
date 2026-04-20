import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface Props {
  from: "bot" | "user";
  children: React.ReactNode;
  time?: string;
  className?: string;
}

export const ChatBubble = ({ from, children, time, className }: Props) => {
  const isUser = from === "user";
  return (
    <div
      className={cn(
        "flex w-full animate-fade-in-up mb-3",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "relative max-w-[85%] px-4 py-2.5 shadow-bubble text-[15px] leading-relaxed transition-all",
          isUser
            ? "bg-chat-bubble-user text-foreground rounded-2xl rounded-tr-sm"
            : "bg-chat-bubble-bot text-foreground rounded-2xl rounded-tl-sm border border-border/50",
          className,
        )}
      >
        <div className="break-words">{children}</div>
        <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[11px] text-muted-foreground font-medium select-none">
          <span>{time ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {isUser && <CheckCheck className="h-3.5 w-3.5 text-primary" />}
          {!isUser && <Check className="h-3.5 w-3.5 opacity-60" />}
        </div>
      </div>
    </div>
  );
};
