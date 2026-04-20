import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";
import { createRoot } from "react-dom/client";
import { TPAClaimForm } from "@/components/chat/TPAClaimForm";

export interface ClaimData {
  hospital_name: string;
  patient_name: string;
  bill_date: string;
  bill_number?: string;
  total_amount: string;
  diagnosis?: string;
  doctor_name?: string;
  has_hospital_stamp: boolean;
  readability_score: number;
  document_type: string;
  issues: { severity: "error" | "warning"; message: string }[];
  deductions: { item_name: string; amount: number; reason: string }[];
  policy_analysis?: string;
  claim_ready: boolean;
}

export async function generateClaimPdf(data: ClaimData, attachedFiles?: { src: string; mimeType: string; fileName: string }[], language: string = "en") {
  // Create a hidden container to render the React component
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  const root = createRoot(container);
  
  // Render the TPA form
  root.render(<TPAClaimForm data={data} attachedFiles={attachedFiles} language={language} />);

  // Wait for React to render and fonts to load
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const element = container.firstChild as HTMLElement;
    if (!element) throw new Error("Component failed to render");

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pages = Array.from(container.querySelectorAll('.pdf-page')) as HTMLElement[];
    
    if (pages.length === 0) {
      // Fallback
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const canvasRatio = canvas.height / canvas.width;
      const imgHeight = pdfWidth * canvasRatio;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
    } else {
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const canvasRatio = canvas.height / canvas.width;
        const imgHeight = pdfWidth * canvasRatio;
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight, undefined, "FAST");
      }
    }

    pdf.save(`ClaimSetu_TPA_Form_${(data.patient_name || "claim").replace(/\s+/g, "_")}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF", error);
  } finally {
    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  }
}
