import React from "react";
import { toCsv } from "./csv";

const DownloadCSVButton = ({ rows = [], columns = [], filename = "data.csv", title = "" }) => {
  const handleDownload = () => {
    const csv = toCsv(rows, columns);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="download-btn" onClick={handleDownload} aria-label={`Download ${title || filename} as CSV`} title="Download CSV">
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M5 20h14v-2H5v2Zm7-3 5-5h-3V4h-4v8H7l5 5Z"/>
      </svg>
    </button>
  );
};

export default DownloadCSVButton;
