import React from 'react';
import { Collapse } from 'antd';
import '../index.css'; // Import a custom CSS file for additional styles

const Accordion = ({ reports }) => {
  // Function to map the reports to items
  const items = reports.map((report, index) => ({
    key: String(index + 1),
    label: (
      <span style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>
        Your activity at date: {new Date(report.reportDate).toLocaleDateString()}
      </span>
    ),
    children: (
      <div style={{ fontFamily: 'unset' }}>
        <p>Video Link: {report.videoLink}</p>
        <p>Text: {report.transcribedText}</p>
      </div>
    ),
  }));

  return (
    <Collapse
      accordion
      items={items}
      className="custom-accordion"
    />
  );
};

export default Accordion;