// src/components/ReportViewer.jsx
import React from "react";
import { useAuth } from "../services/auth.service";
import { localDb } from "../services/localDb.service";
import { notifyError, notifySuccess } from "../services/notification.service";

// Simple print helper that opens a new window and prints its contents
function printHtml(title, html) {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return notifyError("Popups blocked. Allow popups for printing.");
  w.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111 }
          h1,h2,h3 { margin: 0 0 8px 0 }
          .section { margin-bottom: 14px }
          table { width:100%; border-collapse: collapse; }
          td, th { padding:6px; border: 1px solid #ddd; text-align:left; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `);
  w.document.close();
  // give a short delay then print
  setTimeout(() => {
    w.focus();
    w.print();
  }, 250);
}

// convert report to HTML
function reportToHtml(report, appointment) {
  const medicinesHtml =
    (report.medicines || [])
      .map(
        (m, i) =>
          `<tr><td>${i + 1}</td><td>${m.name}</td><td>${m.dose || ""}</td><td>${
            m.qty || ""
          }</td></tr>`
      )
      .join("") || `<tr><td colspan="4">—</td></tr>`;

  const labsHtml =
    (report.labs || [])
      .map(
        (l, i) =>
          `<tr><td>${i + 1}</td><td>${l.name}</td><td>${
            l.details || ""
          }</td></tr>`
      )
      .join("") || `<tr><td colspan="3">—</td></tr>`;

  return `
    <h1>Clinical Report</h1>
    <div class="section"><strong>Appointment:</strong> ${
      appointment?.date || ""
    } ${appointment?.time || ""} - ${appointment?.reason || ""}</div>
    <div class="section"><strong>Notes:</strong><div style="margin-top:6px">${
      report.notes ? report.notes.replace(/\n/g, "<br/>") : "—"
    }</div></div>
    <div class="section">
      <strong>Medicines</strong>
      <table>
        <thead><tr><th>#</th><th>Name</th><th>Dose</th><th>Qty</th></tr></thead>
        <tbody>${medicinesHtml}</tbody>
      </table>
    </div>
    <div class="section">
      <strong>Lab Allocations</strong>
      <table>
        <thead><tr><th>#</th><th>Test</th><th>Details</th></tr></thead>
        <tbody>${labsHtml}</tbody>
      </table>
    </div>
    <div class="section"><small>Generated: ${new Date(
      report.createdAt || Date.now()
    ).toLocaleString()}</small></div>
  `;
}

export default function ReportViewer({ report, appointment }) {
  const { user } = useAuth();

  if (!report) return <div>No report available</div>;

  const html = reportToHtml(report, appointment);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => printHtml("Report", html)}
          className="px-3 py-2 bg-slate-100 rounded"
        >
          Print / Save as PDF
        </button>
        {/* Optionally allow download as .html for record keeping */}
        <button
          onClick={() => {
            try {
              const blob = new Blob([`<html><body>${html}</body></html>`], {
                type: "text/html",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `report-${appointment?.id || Date.now()}.html`;
              a.click();
              URL.revokeObjectURL(url);
              notifySuccess(
                "Downloaded HTML. Use browser Print -> Save as PDF to get PDF."
              );
            } catch (e) {
              console.error(e);
              notifyError("Failed to download");
            }
          }}
          className="px-3 py-2 bg-slate-100 rounded"
        >
          Download HTML
        </button>
      </div>
    </div>
  );
}