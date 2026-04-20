import { Button } from "@/components/ui/button";
import { MessageCircle, ShieldCheck, Sparkles, FileCheck2 } from "lucide-react";

export const Hero = ({ onStart, t }: { onStart: () => void, t: (key: string) => string }) => (
  <section className="gradient-hero text-primary-foreground relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
    <div className="container max-w-5xl py-20 md:py-32 text-center relative z-10 animate-fade-in-up">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-medium mb-8 hover:bg-white/20 transition-colors cursor-default">
        <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
        {t("AI-powered insurance claims for India")}
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
        {t("No App. No English.")}<br />
        <span className="text-white/80">{t("No Rejections.")}</span>
      </h1>
      <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
        {t("Send a photo of your medical bill. Our AI reads it, finds mistakes, and prepares a ready-to-submit health insurance claim — in seconds.")}
      </p>
      <div className="mt-10 flex items-center justify-center gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Button
          size="lg"
          onClick={onStart}
          className="bg-white text-primary hover:bg-white/90 gap-2 shadow-elegant h-14 px-8 rounded-full text-base font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="h-5 w-5" />
          {t("Try the WhatsApp Demo")}
        </Button>
        <div className="flex items-center gap-2 text-sm text-white/80 font-medium px-4 py-2">
          <ShieldCheck className="h-4 w-4 text-green-300" />
          {t("Built for Indian patients")}
        </div>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto text-left animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {[
          { icon: MessageCircle, t: t("Send on WhatsApp"), d: t("Photo or voice — even in your local language.") },
          { icon: Sparkles, t: t("AI reads & checks"), d: t("Detects missing stamps, blurry bills, missing dates.") },
          { icon: FileCheck2, t: t("Get claim PDF"), d: t("A clean, structured claim file ready to submit.") },
        ].map(({ icon: Icon, t: title, d }) => (
          <div key={t} className="rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/10 shadow-lg hover:bg-white/15 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5 text-white">
              <Icon className="h-6 w-6" />
            </div>
            <p className="font-semibold text-lg">{title}</p>
            <p className="text-white/80 mt-2 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
