import React from "react";

const SummaryCard = ({ title, value, helper }) => (
  <div className="summary-card">
    <div className="summary-title">{title}</div>
    <div className="summary-value">{value}</div>
    {helper ? <div className="summary-helper">{helper}</div> : null}
  </div>
);

export default SummaryCard;
