import { useState, useEffect } from "react";
import { Hero } from "@/components/chat/Hero";
import { WhatsAppChat } from "@/components/chat/WhatsAppChat";
import { landingTranslations } from "@/lib/i18n";

const Index = () => {
  const [view, setView] = useState<"hero" | "chat">("hero");
  const [lang, setLang] = useState("en");

  const t = (key: string) => {
    return landingTranslations[lang]?.[key] || key;
  };

  useEffect(() => {
    document.title = "ClaimSetu — AI Health Insurance Claims on WhatsApp";
    const desc =
      "Send a photo of your medical bill on WhatsApp. ClaimSetu's AI extracts the data, detects errors, and prepares a ready-to-submit health insurance claim PDF.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + "/");
  }, []);

  if (view === "chat") return <WhatsAppChat onBack={() => setView("hero")} language={lang} t={t} />;
  return (
    <main className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <nav className="glassmorphism sticky top-0 z-50 animate-fade-in-up">
        <div className="container max-w-5xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="fav.jpg"
              alt="ClaimSetu Logo"
              className="h-8 w-8 rounded-full object-cover shadow-elegant"
            />{" "}
            <span className="font-bold text-lg tracking-tight">ClaimSetu</span>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-sm font-medium bg-transparent outline-none cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="ml">മലയാളം</option>
              <option value="bn">বাংলা</option>
            </select>
            <button
              onClick={() => setView("chat")}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {t("Try Demo")}
            </button>
          </div>
        </div>
      </nav>

      <Hero onStart={() => setView("chat")} t={t} />

      <section
        className="container max-w-5xl py-24 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {t("Why ClaimSetu wins")}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            {t(
              "Indian patients lose lakhs every year to claim rejections caused by tiny mistakes. ClaimSetu catches them before submission.",
            )}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              t: t("Zero learning curve"),
              d: t(
                "Will works inside WhatsApp — the app every Indian already uses.",
              ),
            },
            {
              t: t("Vernacular friendly"),
              d: t(
                "Send a text or voice note in Hindi, Marathi, Tamil — we understand.",
              ),
            },
            {
              t: t("Catches rejection causes"),
              d: t(
                "Missing stamps, unclear bills, wrong dates — flagged instantly.",
              ),
            },
            {
              t: t("Claim-ready PDF"),
              d: t("Submit directly to your TPA. No paperwork stress."),
            },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-2xl bg-card p-8 shadow-soft border border-border/50 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
            >
              <p className="font-semibold text-xl group-hover:text-primary transition-colors">
                {f.t}
              </p>
              <p className="text-muted-foreground mt-2 leading-relaxed">
                {f.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/40 bg-card py-12 mt-auto">
        <div className="container max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="fav.jpg"
              alt="ClaimSetu Logo"
              className="h-8 w-8 rounded-full object-cover shadow-elegant"
            />{" "}
            <span className="font-bold text-lg tracking-tight">ClaimSetu</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <a href="#" className="hover:text-primary transition-colors">
              {t("Privacy Policy")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("Terms of Service")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("Contact Us")}
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClaimSetu. {t("All rights reserved.")}
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;
