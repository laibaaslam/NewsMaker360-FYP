import React from 'react';
import { DownloadIcon } from 'lumina-ui';
import PdfGenerator from './pdf.js';
import toast from 'react-hot-toast';

const PdfButton = ({ summary, frequency = [], context = {}, name }) => {
  if (!summary) {
    return null;
  }

  const generatePdf = async () => {
    if (!summary) {
      toast.error('Summary is required to create a PDF');
      return;
    }
    await PdfGenerator({
      summary,
      frequency: Array.isArray(frequency) ? frequency : [],
      context: context && typeof context === 'object' ? context : {},
      name,
    });
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={generatePdf}
        className="inline-flex items-center gap-2 rounded-lg bg-[#001E35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003255]"
      >
        <DownloadIcon />
        Download PDF Report
      </button>
    </div>
  );
};

export default PdfButton;
