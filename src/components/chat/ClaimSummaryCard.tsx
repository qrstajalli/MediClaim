import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, FileText, Download, ShieldAlert, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { ClaimData } from "@/lib/claim-pdf.tsx";
import { cn } from "@/lib/utils";

interface Props {
  data: ClaimData;
  attachedFiles?: { src: string; mimeType: string; fileName: string }[];
  defaultLanguage?: string;
  onDownload: (language: string) => void;
}

const Field = ({ label, value, missing }: { label: string; value?: string; missing?: boolean }) => (
  <div className="flex justify-between items-center gap-3 py-2 border-b border-border/40 last:border-0 group hover:bg-muted/30 px-1 rounded-sm transition-colors">
    <span className="text-sm text-muted-foreground font-medium">{label}</span>
    <span className={cn("text-sm font-semibold text-right truncate max-w-[60%]", missing && "text-destructive italic")}>
      {missing ? "Missing" : value}
    </span>
  </div>
);

export const ClaimSummaryCard = ({ data, attachedFiles, defaultLanguage, onDownload }: Props) => {
  const [language, setLanguage] = useState(defaultLanguage || "en");
  const score = Math.round(data.readability_score);
  return (
    <div className="rounded-3xl bg-card shadow-soft hover:shadow-elegant transition-all duration-500 overflow-hidden border border-border/40 w-full max-w-[360px] animate-in fade-in slide-in-from-bottom-4 duration-500 mt-2 mb-4 group/card">
      <div className="bg-gradient-to-br from-primary to-primary-glow p-5 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover/card:scale-150 transition-transform duration-700"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="h-5 w-5 drop-shadow-md" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight block">Claim Summary</span>
              <p className="text-xs font-medium opacity-90 mt-0.5">{data.document_type}</p>
            </div>
          </div>
        </div>
      </div>

      {attachedFiles && attachedFiles.length > 0 && (
        <div className="bg-muted relative group border-b border-border/40">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
          {attachedFiles[0].mimeType.startsWith('image/') ? (
            <img src={attachedFiles[0].src} alt="bill" className="w-full h-32 object-cover" />
          ) : (
            <div className="w-full h-32 flex items-center justify-center flex-col gap-2 bg-muted/50 text-muted-foreground">
              <FileText className="h-8 w-8 text-primary/50" />
              <span className="text-xs font-semibold px-4 truncate w-full text-center">{attachedFiles[0].fileName}</span>
            </div>
          )}
          {attachedFiles.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/10">
              +{attachedFiles.length - 1} more attached
            </div>
          )}
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="bg-muted/30 rounded-xl p-3 border border-border/40">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground font-medium">Document Readability</span>
            <span className={cn("font-bold", score > 80 ? "text-success" : score > 50 ? "text-warning" : "text-destructive")}>{score}%</span>
          </div>
          <Progress value={score} className="h-2 rounded-full overflow-hidden" />
        </div>

        <div className="pt-2 px-1">
          <Field label="Patient" value={data.patient_name} missing={!data.patient_name} />
          <Field label="Hospital" value={data.hospital_name} missing={!data.hospital_name} />
          <Field label="Date" value={data.bill_date} missing={!data.bill_date} />
          <Field label="Amount" value={data.total_amount ? `₹ ${data.total_amount}` : ""} missing={!data.total_amount} />
          <Field label="Stamp" value={data.has_hospital_stamp ? "Present" : ""} missing={!data.has_hospital_stamp} />
        </div>

        {data.policy_analysis && (
          <div className="bg-primary/10 rounded-xl p-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-1.5 text-primary">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-sm font-bold">Policy Analysis</span>
            </div>
            <p className="text-sm text-primary/90 leading-relaxed">
              {data.policy_analysis}
            </p>
          </div>
        )}

        {data.deductions && data.deductions.length > 0 && (
          <div className="bg-destructive/10 rounded-xl p-3 border border-destructive/20">
            <div className="flex items-center gap-2 mb-2 text-destructive">
              <Receipt className="h-4 w-4" />
              <span className="text-sm font-bold">Predicted Deductions (Consumables)</span>
            </div>
            <div className="space-y-1.5">
              {data.deductions.map((ded, i) => (
                <div key={i} className="flex justify-between items-start text-sm">
                  <div>
                    <span className="font-semibold text-destructive/90">{ded.item_name}</span>
                    <p className="text-xs text-destructive/70">{ded.reason}</p>
                  </div>
                  <span className="font-bold text-destructive">₹ {ded.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.issues.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">Detected issues</p>
            {data.issues.map((iss, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2.5 text-sm rounded-xl p-3 border",
                  iss.severity === "error"
                    ? "bg-destructive/10 text-destructive border-destructive/20"
                    : "bg-warning/10 text-warning border-warning/20",
                )}
              >
                {iss.severity === "error" ? (
                  <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug font-medium">{iss.message}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl p-3.5 text-sm font-semibold border",
            data.claim_ready ? "bg-success/15 text-success border-success/20" : "bg-warning/15 text-warning-foreground border-warning/20",
          )}
        >
          {data.claim_ready ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{data.claim_ready ? "Ready to submit" : "Fix issues before submitting"}</span>
        </div>

        <div className="pt-4 flex flex-col gap-3 mt-2 border-t border-border/40">
          <div className="flex items-center gap-3 justify-between px-1">
            <span className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              Language <span className="text-[10px] uppercase bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">Select</span>
            </span>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium border-border bg-muted/50 hover:bg-muted transition-colors rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
            >
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 Hindi (हिंदी)</option>
              <option value="ta">🇮🇳 Tamil (தமிழ்)</option>
              <option value="ml">🇮🇳 Malayalam (മലയാളം)</option>
              <option value="bn">🇮🇳 Bengali (বাংলা)</option>
            </select>
          </div>
          
          <Button onClick={() => onDownload(language)} className="w-full gap-2 h-14 rounded-xl text-base font-bold shadow-soft hover:shadow-elegant transition-all duration-300 bg-foreground text-background hover:bg-foreground/90 group/btn" size="lg">
            <Download className="h-5 w-5 group-hover/btn:-translate-y-0.5 transition-transform" />
            Generate TPA Form
          </Button>
        </div>
      </div>
    </div>
  );
};
