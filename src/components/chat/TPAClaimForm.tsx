import React from "react";
import type { ClaimData } from "@/lib/claim-pdf.tsx";

interface Props {
  data: ClaimData;
  attachedFiles?: { src: string; mimeType: string; fileName: string }[];
  language: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {}, // Fallback is key
  hi: {
    "HEALTH INSURANCE CLAIM FORM - PART A": "स्वास्थ्य बीमा दावा प्रपत्र - भाग ए",
    "TO BE FILLED IN BY THE INSURED": "बीमित व्यक्ति द्वारा भरा जाना है",
    "Generated on": "उत्पन्न",
    "A. DETAILS OF PRIMARY INSURED": "ए. प्राथमिक बीमित व्यक्ति का विवरण",
    "Name:": "नाम:",
    "Not found": "नहीं मिला",
    "B. DETAILS OF HOSPITAL / CLINIC": "बी. अस्पताल / क्लिनिक का विवरण",
    "Hospital Name:": "अस्पताल का नाम:",
    "Doctor Name:": "डॉक्टर का नाम:",
    "C. DETAILS OF CLAIM": "सी. दावे का विवरण",
    "Diagnosis:": "निदान:",
    "Date of Bill:": "बिल की तारीख:",
    "Bill Number:": "बिल संख्या:",
    "Total Amount (INR):": "कुल राशि (रुपये):",
    "D. CLAIMSETU AI ANALYSIS": "डी. क्लेमसेतु एआई विश्लेषण",
    "Policy Rule Application:": "पॉलिसी नियम लागू:",
    "Predicted Deductions (Consumables):": "संभावित कटौती (उपभोग्य वस्तुएं):",
    "Missing / Invalid Fields:": "गायब / अमान्य फ़ील्ड:",
    "Status: READY TO SUBMIT": "स्थिति: जमा करने के लिए तैयार",
    "Status: ACTION REQUIRED BEFORE SUBMISSION": "स्थिति: जमा करने से पहले कार्रवाई आवश्यक",
    "E. ATTACHED BILL COPY": "ई. संलग्न बिल की प्रति",
    "E. ATTACHED DOCUMENTS": "ई. संलग्न दस्तावेज़",
    "Document Attached:": "संलग्न दस्तावेज़:",
    "Generated securely by ClaimSetu AI": "क्लेमसेतु एआई द्वारा सुरक्षित रूप से उत्पन्न",
  },
  ta: {
    "HEALTH INSURANCE CLAIM FORM - PART A": "சுகாதார காப்பீட்டு கோரிக்கை படிவம் - பகுதி A",
    "TO BE FILLED IN BY THE INSURED": "காப்பீடு செய்தவரால் நிரப்பப்பட வேண்டும்",
    "Generated on": "உருவாக்கப்பட்டது",
    "A. DETAILS OF PRIMARY INSURED": "A. முதன்மை காப்பீடு செய்தவரின் விவரங்கள்",
    "Name:": "பெயர்:",
    "Not found": "கிடைக்கவில்லை",
    "B. DETAILS OF HOSPITAL / CLINIC": "B. மருத்துவமனை / கிளினிக் விவரங்கள்",
    "Hospital Name:": "மருத்துவமனை பெயர்:",
    "Doctor Name:": "மருத்துவர் பெயர்:",
    "C. DETAILS OF CLAIM": "C. கோரிக்கையின் விவரங்கள்",
    "Diagnosis:": "கண்டறிதல்:",
    "Date of Bill:": "பில் தேதி:",
    "Bill Number:": "பில் எண்:",
    "Total Amount (INR):": "மொத்த தொகை (INR):",
    "D. CLAIMSETU AI ANALYSIS": "D. ClaimSetu AI பகுப்பாய்வு",
    "Policy Rule Application:": "பாலிசி விதி பயன்பாடு:",
    "Predicted Deductions (Consumables):": "கணிக்கப்பட்ட விலக்குகள் (நுகர்பொருட்கள்):",
    "Missing / Invalid Fields:": "விடுபட்ட / தவறான புலங்கள்:",
    "Status: READY TO SUBMIT": "நிலை: சமர்ப்பிக்க தயார்",
    "Status: ACTION REQUIRED BEFORE SUBMISSION": "நிலை: சமர்ப்பிக்கும் முன் நடவடிக்கை தேவை",
    "E. ATTACHED BILL COPY": "E. இணைக்கப்பட்ட பில் நகல்",
    "E. ATTACHED DOCUMENTS": "E. இணைக்கப்பட்ட ஆவணங்கள்",
    "Document Attached:": "இணைக்கப்பட்ட ஆவணம்:",
    "Generated securely by ClaimSetu AI": "ClaimSetu AI ஆல் பாதுகாப்பாக உருவாக்கப்பட்டது",
  },
  ml: {
    "HEALTH INSURANCE CLAIM FORM - PART A": "ആരോഗ്യ ഇൻഷുറൻസ് ക്ലെയിം ഫോം - ഭാഗം എ",
    "TO BE FILLED IN BY THE INSURED": "ഇൻഷ്വർ ചെയ്തയാൾ പൂരിപ്പിക്കേണ്ടത്",
    "Generated on": "ജനറേറ്റുചെയ്തത്",
    "A. DETAILS OF PRIMARY INSURED": "എ. പ്രധാന ഇൻഷ്വർ ചെയ്തയാളുടെ വിശദാംശങ്ങൾ",
    "Name:": "പേര്:",
    "Not found": "കണ്ടെത്തിയില്ല",
    "B. DETAILS OF HOSPITAL / CLINIC": "ബി. ആശുപത്രി / ക്ലിനിക്ക് വിശദാംശങ്ങൾ",
    "Hospital Name:": "ആശുപത്രിയുടെ പേര്:",
    "Doctor Name:": "ഡോക്ടറുടെ പേര്:",
    "C. DETAILS OF CLAIM": "സി. ക്ലെയിം വിശദാംശങ്ങൾ",
    "Diagnosis:": "രോഗനിർണയം:",
    "Date of Bill:": "ബിൽ തീയതി:",
    "Bill Number:": "ബിൽ നമ്പർ:",
    "Total Amount (INR):": "മൊത്തം തുക (INR):",
    "D. CLAIMSETU AI ANALYSIS": "ഡി. ക്ലെയിംസേതു എഐ വിശകലനം",
    "Policy Rule Application:": "പോളിസി റൂൾ പ്രയോഗം:",
    "Predicted Deductions (Consumables):": "പ്രതീക്ഷിക്കുന്ന കിഴിവുകൾ (ഉപഭോഗവസ്തുക്കൾ):",
    "Missing / Invalid Fields:": "നഷ്ടപ്പെട്ട / അസാധുവായ ഫീൽഡുകൾ:",
    "Status: READY TO SUBMIT": "സ്റ്റാറ്റസ്: സമർപ്പിക്കാൻ തയ്യാറാണ്",
    "Status: ACTION REQUIRED BEFORE SUBMISSION": "സ്റ്റാറ്റസ്: സമർപ്പിക്കുന്നതിന് മുമ്പ് നടപടി ആവശ്യമാണ്",
    "E. ATTACHED BILL COPY": "ഇ. അറ്റാച്ച് ചെയ്ത ബിൽ പകർപ്പ്",
    "E. ATTACHED DOCUMENTS": "ഇ. അറ്റാച്ച് ചെയ്ത രേഖകൾ",
    "Document Attached:": "അറ്റാച്ചുചെയ്ത രേഖ:",
    "Generated securely by ClaimSetu AI": "ClaimSetu AI സുരക്ഷിതമായി ജനറേറ്റ് ചെയ്തു",
  },
  bn: {
    "HEALTH INSURANCE CLAIM FORM - PART A": "স্বাস্থ্য বীমা দাবি ফর্ম - পার্ট এ",
    "TO BE FILLED IN BY THE INSURED": "বীমাকৃত দ্বারা পূরণ করতে হবে",
    "Generated on": "তৈরি হয়েছে",
    "A. DETAILS OF PRIMARY INSURED": "এ. প্রাথমিক বীমাকৃতের বিবরণ",
    "Name:": "নাম:",
    "Not found": "পাওয়া যায়নি",
    "B. DETAILS OF HOSPITAL / CLINIC": "বি. হাসপাতাল / ক্লিনিকের বিবরণ",
    "Hospital Name:": "হাসপাতালের নাম:",
    "Doctor Name:": "ডাক্তারের নাম:",
    "C. DETAILS OF CLAIM": "সি. দাবির বিবরণ",
    "Diagnosis:": "রোগ নির্ণয়:",
    "Date of Bill:": "বিলের তারিখ:",
    "Bill Number:": "বিল নম্বর:",
    "Total Amount (INR):": "মোট পরিমাণ (INR):",
    "D. CLAIMSETU AI ANALYSIS": "ডি. ClaimSetu এআই বিশ্লেষণ",
    "Policy Rule Application:": "পলিসি নিয়ম প্রয়োগ:",
    "Predicted Deductions (Consumables):": "অনুমানিত কর্তন (ব্যবহার্য দ্রব্য):",
    "Missing / Invalid Fields:": "অনুপস্থিত / অবৈধ ক্ষেত্র:",
    "Status: READY TO SUBMIT": "অবস্থা: জমা দেওয়ার জন্য প্রস্তুত",
    "Status: ACTION REQUIRED BEFORE SUBMISSION": "অবস্থা: জমা দেওয়ার আগে পদক্ষেপ প্রয়োজন",
    "E. ATTACHED BILL COPY": "ই. সংযুক্ত বিলের অনুলিপি",
    "E. ATTACHED DOCUMENTS": "ই. সংযুক্ত নথিপত্র",
    "Document Attached:": "সংযুক্ত নথি:",
    "Generated securely by ClaimSetu AI": "ClaimSetu AI দ্বারা নিরাপদে তৈরি",
  }
};

const getFontFamily = (lang: string) => {
  switch (lang) {
    case "hi": return "'Noto Sans Devanagari', sans-serif";
    case "ta": return "'Noto Sans Tamil', sans-serif";
    case "ml": return "'Noto Sans Malayalam', sans-serif";
    case "bn": return "'Noto Sans Bengali', sans-serif";
    default: return "Helvetica, Arial, sans-serif";
  }
};

const getFontImport = (lang: string) => {
  switch (lang) {
    case "hi": return "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');";
    case "ta": return "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&display=swap');";
    case "ml": return "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Malayalam:wght@400;600;700&display=swap');";
    case "bn": return "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700&display=swap');";
    default: return "";
  }
};

export const TPAClaimForm = ({ data, attachedFiles, language }: Props) => {
  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <div
      id="tpa-claim-form-container"
      style={{
        width: "800px",
        backgroundColor: "white",
        color: "black",
        fontFamily: getFontFamily(language),
        padding: "0",
        margin: "0",
        position: "relative",
      }}
    >
      <style>
        {`
          ${getFontImport(language)}
          #tpa-claim-form-container * {
            box-sizing: border-box;
          }
          .pdf-page {
            width: 800px;
            min-height: 1130px;
            background-color: white;
            position: relative;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>

      {/* Page 1: Main Form */}
      <div className="pdf-page">
        {/* Header */}
      <div style={{ backgroundColor: "#1e3a8a", color: "white", padding: "40px", width: "100%" }}>
        <h1 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "bold" }}>
          {t("HEALTH INSURANCE CLAIM FORM - PART A")}
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ margin: 0, fontSize: "14px" }}>
            {t("TO BE FILLED IN BY THE INSURED")}
          </p>
          <p style={{ margin: 0, fontSize: "14px" }}>
            {t("Generated on")}: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Section A */}
        <div>
          <div style={{ backgroundColor: "#f1f5f9", padding: "10px 16px", marginBottom: "16px", borderRadius: "4px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "bold" }}>
              {t("A. DETAILS OF PRIMARY INSURED")}
            </h2>
          </div>
          <div style={{ display: "flex", padding: "0 16px", fontSize: "14px" }}>
            <span style={{ fontWeight: "bold", width: "200px" }}>{t("Name:")}</span>
            <span>{data.patient_name || t("Not found")}</span>
          </div>
        </div>

        {/* Section B */}
        <div>
          <div style={{ backgroundColor: "#f1f5f9", padding: "10px 16px", marginBottom: "16px", borderRadius: "4px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "bold" }}>
              {t("B. DETAILS OF HOSPITAL / CLINIC")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 16px", fontSize: "14px" }}>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold", width: "200px" }}>{t("Hospital Name:")}</span>
              <span style={{ flex: 1 }}>{data.hospital_name || t("Not found")}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold", width: "200px" }}>{t("Doctor Name:")}</span>
              <span style={{ flex: 1 }}>{data.doctor_name || t("Not found")}</span>
            </div>
          </div>
        </div>

        {/* Section C */}
        <div>
          <div style={{ backgroundColor: "#f1f5f9", padding: "10px 16px", marginBottom: "16px", borderRadius: "4px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "bold" }}>
              {t("C. DETAILS OF CLAIM")}
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "0 16px", fontSize: "14px" }}>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold", width: "200px" }}>{t("Diagnosis:")}</span>
              <span style={{ flex: 1 }}>{data.diagnosis || t("Not found")}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold", width: "200px" }}>{t("Date of Bill:")}</span>
              <span style={{ flex: 1 }}>{data.bill_date || t("Not found")}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold", width: "200px" }}>{t("Bill Number:")}</span>
              <span style={{ flex: 1 }}>{data.bill_number || t("Not found")}</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ fontWeight: "bold", width: "200px" }}>{t("Total Amount (INR):")}</span>
              <span style={{ flex: 1 }}>{data.total_amount ? `₹ ${data.total_amount}` : t("Not found")}</span>
            </div>
          </div>
        </div>

        {/* Section D */}
        <div>
          <div style={{ backgroundColor: "#f1f5f9", padding: "10px 16px", marginBottom: "16px", borderRadius: "4px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "bold" }}>
              {t("D. CLAIMSETU AI ANALYSIS")}
            </h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "0 16px" }}>
            {data.policy_analysis && (
              <div>
                <span style={{ fontWeight: "bold", color: "#0369a1", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                  {t("Policy Rule Application:")}
                </span>
                <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.5" }}>
                  {data.policy_analysis}
                </div>
              </div>
            )}

            {data.deductions && data.deductions.length > 0 && (
              <div>
                <span style={{ fontWeight: "bold", color: "#b91c1c", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                  {t("Predicted Deductions (Consumables):")}
                </span>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155", fontSize: "14px", lineHeight: "1.6" }}>
                  {data.deductions.map((d, i) => (
                    <li key={i}>{d.item_name} - ₹{d.amount} ({d.reason})</li>
                  ))}
                </ul>
              </div>
            )}

            {!data.claim_ready && data.issues.length > 0 && (
              <div>
                <span style={{ fontWeight: "bold", color: "#b91c1c", fontSize: "14px", display: "block", marginBottom: "8px" }}>
                  {t("Missing / Invalid Fields:")}
                </span>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155", fontSize: "14px", lineHeight: "1.6" }}>
                  {data.issues.map((iss, i) => (
                    <li key={i}>{iss.message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ marginTop: "10px", padding: "16px", borderRadius: "8px", border: `2px solid ${data.claim_ready ? '#15803d' : '#b91c1c'}`, backgroundColor: data.claim_ready ? '#f0fdf4' : '#fef2f2' }}>
              <span style={{ fontWeight: "bold", color: data.claim_ready ? '#15803d' : '#b91c1c', fontSize: "16px" }}>
                {data.claim_ready 
                  ? t("Status: READY TO SUBMIT") 
                  : t("Status: ACTION REQUIRED BEFORE SUBMISSION")
                }
              </span>
            </div>
          </div>
        </div>
      </div> {/* Closes the padding="40px" content wrapper */}
        
      <div style={{ marginTop: "auto", paddingTop: "40px", borderTop: "1px solid #e2e8f0", textAlign: "center", color: "#64748b", fontSize: "12px", paddingBottom: "20px" }}>
        {t("Generated securely by ClaimSetu AI")}
      </div>
    </div>

        {/* Page 2+: Attachments (Each gets its own page) */}
        {attachedFiles && attachedFiles.map((file, i) => (
          <div key={i} className="pdf-page" style={{ paddingTop: "40px" }}>
            <div style={{ padding: "0 40px" }}>
              <div style={{ backgroundColor: "#f1f5f9", padding: "10px 16px", marginBottom: "16px", borderRadius: "4px" }}>
                <h2 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "bold" }}>
                  {t("E. ATTACHED DOCUMENTS")} ({i + 1}/{attachedFiles.length})
                </h2>
              </div>
              <div style={{ textAlign: "center", border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", backgroundColor: "#f8fafc" }}>
                <p style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "bold", color: "#475569" }}>
                  {t("Document Attached:")} {file.fileName}
                </p>
                {file.mimeType.startsWith('image/') ? (
                  <img src={file.src} alt={file.fileName} style={{ maxWidth: "100%", maxHeight: "850px", objectFit: "contain", border: "1px solid #cbd5e1", backgroundColor: "white" }} />
                ) : (
                  <div style={{ padding: "40px 20px", backgroundColor: "white", border: "1px dashed #cbd5e1", borderRadius: "4px", color: "#64748b" }}>
                    📄 {file.fileName} (PDF)
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ marginTop: "auto", paddingTop: "20px", paddingBottom: "20px", borderTop: "1px solid #e2e8f0", textAlign: "center", color: "#64748b", fontSize: "12px" }}>
              {t("Generated securely by ClaimSetu AI")}
            </div>
          </div>
        ))}
    </div>
  );
};
