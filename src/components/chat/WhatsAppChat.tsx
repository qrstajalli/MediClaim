import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Mic,
  Paperclip,
  Send,
  Smile,
  Phone,
  Video,
  MoreVertical,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "./ChatBubble";
import { TypingBubble } from "./TypingBubble";
import { ClaimSummaryCard } from "./ClaimSummaryCard";
import { supabase } from "@/integrations/supabase/client";
import { generateClaimPdf, type ClaimData } from "@/lib/claim-pdf.tsx";
import { toast } from "sonner";
import { callGeminiChat, analyzeDocuments } from "@/lib/gemini";

type Message =
  | {
      id: string;
      from: "bot" | "user";
      type: "text";
      text: string;
      time: string;
    }
  | {
      id: string;
      from: "user";
      type: "file";
      src: string;
      mimeType: string;
      fileName: string;
      time: string;
    }
  | {
      id: string;
      from: "bot";
      type: "summary";
      data: ClaimData;
      attachedFiles?: { src: string; mimeType: string; fileName: string }[];
      time: string;
    };

const time = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const uid = () => Math.random().toString(36).slice(2);

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export const WhatsAppChat = ({ onBack, language = "en", t = (k) => k }: { onBack: () => void; language?: string; t?: (key: string) => string }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(),
      from: "bot",
      type: "text",
      time: time(),
      text: t("Namaste 🙏 I'm ClaimSetu, your insurance claim helper."),
    },
    {
      id: uid(),
      from: "bot",
      type: "text",
      time: time(),
      text: t("Just send me a photo of your hospital bill and I'll prepare your claim. No forms. No English needed."),
    },
  ]);
  const [typing, setTyping] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [useDemoPolicy, setDemoPolicy] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const push = (m: Message) => setMessages((prev) => [...prev, m]);

  const handleFiles = async (files: File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/") || f.type === "application/pdf");
    if (validFiles.length === 0) {
      toast.error(t("Please upload valid images or PDFs"));
      return;
    }
    setPendingFiles(validFiles);
  };

  const processFiles = async (validFiles: File[]) => {
    setPendingFiles(null);
    
    const fileDataUrls = await Promise.all(validFiles.map(fileToDataUrl));
    
    const attachedFiles = validFiles.map((file, i) => ({
      src: fileDataUrls[i],
      mimeType: file.type,
      fileName: file.name
    }));

    attachedFiles.forEach(file => {
      push({ id: uid(), from: "user", type: "file", src: file.src, mimeType: file.mimeType, fileName: file.fileName, time: time() });
    });

    setTyping(t("Reading your documents…"));
    setTimeout(() => setTyping(t("Cross-referencing files & checking for issues…")), 1400);
    setTimeout(() => setTyping(t("Preparing your claim…")), 2800);

    try {
      const documents = attachedFiles.map(file => ({
        mimeType: file.mimeType,
        data: file.src.split(",")[1]
      }));

      const policyText = useDemoPolicy 
        ? "Policy Limit: ₹3 Lakh Sum Insured. Room Rent Capped at 1% of Sum Insured (₹3,000/day). Consumables like Gloves, Syringes, and Nebulization kits are strictly non-payable."
        : undefined;

      const data = await analyzeDocuments(documents, policyText);
      setTyping(null);

      const claim = data as ClaimData;
      const intro = claim.claim_ready
        ? t("Great news! Your documents look good ✅ Here's your comprehensive claim summary:")
        : t("I found a few issues across the documents that may cause rejection. Please review:");
      push({ id: uid(), from: "bot", type: "text", time: time(), text: intro });
      push({ id: uid(), from: "bot", type: "summary", data: claim, attachedFiles, time: time() });
      push({
        id: uid(), from: "bot", type: "text", time: time(),
        text: t("Tap *Download Claim PDF* to get a ready-to-submit file you can send to your TPA."),
      });
    } catch (e) {
      setTyping(null);
      console.error(e);
      push({ id: uid(), from: "bot", type: "text", time: time(), text: t("⚠️ Something went wrong. Please try again.") });
    }
  };

  const sendText = async () => {
    const text = draft.trim();
    if (!text) return;

    const userMsg: Message = {
      id: uid(),
      from: "user",
      type: "text",
      text: text,
      time: time(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setDraft("");
    setTyping(t("typing..."));

    try {
      const latestSummary = newMessages
        .filter((m) => m.type === "summary")
        .pop();
      const context = latestSummary ? (latestSummary as any).data : null;

      const reply = await callGeminiChat(
        text,
        newMessages
          .filter((m) => m.type === "text")
          .map((m) => ({
            role: m.from === "bot" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
        context,
        language
      );

      setTyping(null);

      push({
        id: uid(),
        from: "bot",
        type: "text",
        time: time(),
        text: reply,
      });
    } catch (e) {
      setTyping(null);
      console.error(e);
      push({
        id: uid(),
        from: "bot",
        type: "text",
        time: time(),
        text: t("⚠️ Something went wrong. Please try again."),
      });
    }
  };

  return (
    <div className="min-h-screen bg-chat-bg flex flex-col font-sans">
      {/* Header */}
      <header className="glassmorphism text-chat-header-foreground sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 max-w-3xl mx-auto w-full">
          <button
            onClick={onBack}
            className="text-chat-header-foreground hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full transition-colors -ml-2"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="relative cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src="fav.jpg"
              alt="ClaimSetu Logo"
              className="h-8 w-8 rounded-full object-cover shadow-elegant"
            />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success ring-2 ring-white dark:ring-black animate-pulse" />
          </div>
          <div className="flex-1 min-w-0 cursor-pointer">
            <p className="font-bold text-base truncate flex items-center gap-1.5 group">
              ClaimSetu{" "}
              <ShieldCheck className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </p>
            <p className="text-[13px] opacity-80 font-medium tracking-wide">
              {t("online • AI assistant")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="text-chat-header-foreground hover:bg-black/5 dark:hover:bg-white/10 p-2.5 rounded-full transition-all hover:scale-105 hidden sm:block">
              <Video className="h-5 w-5" />
            </button>
            <button className="text-chat-header-foreground hover:bg-black/5 dark:hover:bg-white/10 p-2.5 rounded-full transition-all hover:scale-105 hidden sm:block">
              <Phone className="h-5 w-5" />
            </button>
            <button className="text-chat-header-foreground hover:bg-black/5 dark:hover:bg-white/10 p-2.5 rounded-full transition-all hover:scale-105">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-chat-pattern relative"
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <div className="flex justify-center mb-6 flex-col items-center gap-2">
            <span className="text-xs font-medium bg-muted/80 backdrop-blur-sm text-muted-foreground px-4 py-1.5 rounded-lg shadow-sm border border-border/50 text-center max-w-[90%]">
              {t("🔒 Messages are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can read or listen to them.")}
            </span>
            <label className="flex items-center gap-2 text-xs font-semibold bg-primary/10 hover:bg-primary/20 transition-colors text-primary px-4 py-2 rounded-full cursor-pointer border border-primary/20 shadow-sm">
              <input
                type="checkbox"
                checked={useDemoPolicy}
                onChange={(e) => setDemoPolicy(e.target.checked)}
                className="accent-primary w-3.5 h-3.5"
              />
              {t("Enable Demo Policy (₹3L Limit & Consumables Rule)")}
            </label>
          </div>

          {messages.map((m) => {
            if (m.type === "text") {
              return (
                <ChatBubble key={m.id} from={m.from} time={m.time}>
                  {m.text.split("*").map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="font-bold">
                        {part}
                      </strong>
                    ) : (
                      <span key={i}>{part}</span>
                    ),
                  )}
                </ChatBubble>
              );
            }
            if (m.type === "file") {
              if (m.mimeType === "application/pdf") {
                return (
                  <ChatBubble
                    key={m.id}
                    from="user"
                    time={m.time}
                    className="p-3 bg-chat-bubble-user"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/50 p-2 rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0 max-w-[180px]">
                        <span className="text-sm font-semibold truncate text-foreground/90">
                          {m.fileName}
                        </span>
                        <span className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider mt-0.5">
                          PDF Document
                        </span>
                      </div>
                    </div>
                  </ChatBubble>
                );
              }
              return (
                <ChatBubble
                  key={m.id}
                  from="user"
                  time={m.time}
                  className="p-1.5 bg-chat-bubble-user"
                >
                  <img
                    src={m.src}
                    alt="bill"
                    className="rounded-xl max-h-72 w-full object-cover"
                  />
                </ChatBubble>
              );
            }
            return (
              <div key={m.id} className="flex justify-start w-full">
                <ClaimSummaryCard
                  data={m.data}
                  attachedFiles={m.attachedFiles}
                  defaultLanguage={language}
                  onDownload={(lang) => {
                    generateClaimPdf(m.data, m.attachedFiles, lang);
                    toast.success(t("Claim PDF downloaded"));
                  }}
                />
              </div>
            );
          })}

          {typing && <TypingBubble label={typing} />}
        </div>
      </div>

      {/* Input bar */}
      <div className="glassmorphism sticky bottom-0 z-20 pb-safe">
        <div className="max-w-3xl mx-auto flex items-end gap-2 p-3">
          <div className="flex-1 flex items-center gap-2 bg-background/80 backdrop-blur-xl rounded-full px-4 py-2 border border-border/60 shadow-sm focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/50 transition-all duration-300">
            <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors shrink-0">
              <Smile className="h-6 w-6" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder={t("Message")}
              className="flex-1 bg-transparent outline-none text-[15px] py-1.5 min-w-0"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
              aria-label="Attach"
            >
              <Paperclip className="h-5 w-5 transform -rotate-45" />
            </button>
            {!draft.trim() && (
              <button
                onClick={() => fileRef.current?.click()}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="Camera"
              >
                <Camera className="h-6 w-6" />
              </button>
            )}
          </div>
          <button
            onClick={draft.trim() ? sendText : () => fileRef.current?.click()}
            className="h-[52px] w-[52px] rounded-full shrink-0 shadow-sm flex items-center justify-center bg-primary hover:bg-primary-glow text-primary-foreground transition-all hover:scale-105 active:scale-95"
          >
            {draft.trim() ? (
              <Send className="h-6 w-6 ml-1" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files;
              if (f && f.length > 0) handleFiles(Array.from(f));
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingFiles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-background rounded-2xl shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {t("Process Documents")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("Can we process your data?")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPendingFiles(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors font-medium text-sm"
                >
                  {t("Cancel")}
                </button>
                <button
                  onClick={() => processFiles(pendingFiles)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary-glow transition-all hover:scale-105 active:scale-95 font-medium text-sm"
                >
                  {t("Yes, Proceed")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
