import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

const URDU_FONT_URL = '/fonts/NotoNaskhArabic-Regular.ttf';
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const hasArabicScript = (text) => ARABIC_REGEX.test(String(text || ''));

const textBlock = (text, extraClass = '') => {
    const value = String(text ?? '');
    const dir = hasArabicScript(value) ? 'rtl' : 'ltr';
    const align = hasArabicScript(value) ? 'right' : 'left';
    return `<div class="block ${extraClass}" dir="${dir}" style="text-align:${align};">${escapeHtml(value)}</div>`;
};

const waitForUrduFont = async () => {
    if (!document.getElementById('noto-naskh-font-face')) {
        const style = document.createElement('style');
        style.id = 'noto-naskh-font-face';
        style.textContent = `
            @font-face {
                font-family: 'Noto Naskh Arabic';
                src: url('${URDU_FONT_URL}') format('truetype');
                font-weight: normal;
                font-style: normal;
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }

    try {
        await document.fonts.load('16px "Noto Naskh Arabic"');
        await document.fonts.ready;
    } catch (error) {
        console.warn('Urdu font load warning:', error);
    }
};

const buildReportHtml = ({ summary, frequency, context, name }) => {
    const frequencyHtml = (frequency || [])
        .map((item) => {
            const label = `${item.entity}: ${item.count}`;
            return textBlock(label, 'freq-item');
        })
        .join('');

    const contextHtml = Object.entries(context || {})
        .map(([entity, contexts]) => {
            const body = (contexts || [])
                .map((ctx) => textBlock(ctx, 'context-item'))
                .join('');
            return `
                <div class="entity-block">
                    ${textBlock(`${entity}:`, 'entity-title')}
                    ${body}
                </div>
            `;
        })
        .join('');

    return `
        <div id="news-report-root" style="
            width: 794px;
            padding: 36px 40px 48px;
            background: #ffffff;
            color: #111111;
            box-sizing: border-box;
            font-family: 'Noto Naskh Arabic', 'Segoe UI', Tahoma, sans-serif;
            line-height: 1.8;
        ">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 18px; direction:ltr; text-align:left;">
                <img src="/logo.png" alt="logo" style="height:48px; object-fit:contain;" onerror="this.style.display='none'" />
                <div style="font-family: Helvetica, Arial, sans-serif; color:#1f1157; font-weight:700; font-size:14px; padding-top:10px;">
                    NEWS ANALYSIS REPORT
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; gap:24px; margin-bottom: 16px; direction:ltr;">
                <div style="font-family: Helvetica, Arial, sans-serif; font-size:12px;">
                    <div style="color:#1f1157; font-weight:700;">Username:</div>
                    <div>${escapeHtml(name || '')}</div>
                </div>
                <div style="font-family: Helvetica, Arial, sans-serif; font-size:12px; text-align:right;">
                    <div><span style="color:#1f1157; font-weight:700;">Date:</span> ${escapeHtml(format(new Date(), 'MMM dd, yyyy'))}</div>
                </div>
            </div>

            <hr style="border:none; border-top:1px solid #d0d0d0; margin: 12px 0;" />

            <div style="font-family: Helvetica, Arial, sans-serif; color:#1f1157; font-weight:700; font-size:14px; margin: 10px 0 8px; direction:ltr; text-align:left;">
                Summarized News:
            </div>
            ${textBlock(summary || 'No summary available', 'summary')}

            <hr style="border:none; border-top:1px solid #d0d0d0; margin: 18px 0;" />

            <div style="font-family: Helvetica, Arial, sans-serif; color:#1f1157; font-weight:700; font-size:14px; margin: 10px 0 8px; direction:ltr; text-align:left;">
                Frequency Analysis:
            </div>
            <div class="freq-list">${frequencyHtml || textBlock('No entities were provided for frequency analysis')}</div>

            <hr style="border:none; border-top:1px solid #d0d0d0; margin: 18px 0;" />

            <div style="font-family: Helvetica, Arial, sans-serif; color:#1f1157; font-weight:700; font-size:14px; margin: 10px 0 8px; direction:ltr; text-align:left;">
                Contextual Analysis:
            </div>
            <div class="context-list">${contextHtml || textBlock('No entities were provided for contextual analysis')}</div>

            <style>
                #news-report-root .block {
                    font-size: 15px;
                    margin-bottom: 8px;
                    white-space: pre-wrap;
                    word-break: break-word;
                }
                #news-report-root .entity-title {
                    font-weight: 700;
                    font-size: 16px;
                    margin-top: 10px;
                    margin-bottom: 4px;
                }
                #news-report-root .context-item {
                    font-size: 14px;
                    margin-bottom: 10px;
                    padding-right: 8px;
                }
                #news-report-root .freq-item {
                    margin-bottom: 4px;
                }
            </style>
        </div>
    `;
};

const canvasToMultiPagePdf = (canvas) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageCanvasHeight = Math.floor((usableHeight * canvas.width) / imgWidth);

    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;

        const ctx = pageCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
            canvas,
            0,
            renderedHeight,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
        );

        const pageData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const sliceMmHeight = (sliceHeight * imgWidth) / canvas.width;

        if (pageIndex > 0) {
            pdf.addPage();
        }
        pdf.addImage(pageData, 'JPEG', margin, margin, imgWidth, sliceMmHeight);

        renderedHeight += sliceHeight;
        pageIndex += 1;
    }

    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i += 1) {
        pdf.setPage(i);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(120);
        pdf.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            pageHeight - 4,
            { align: 'center' }
        );
    }

    return pdf;
};

const PdfGenerator = async ({ summary, frequency, context, name }) => {
    // Open preview immediately (same user click) so browsers don't block it as a popup.
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html><head><title>News Analysis Report</title>
            <style>body{font-family:Segoe UI,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;color:#334155;}</style>
            </head><body><p>Preparing PDF preview...</p></body></html>
        `);
        previewWindow.document.close();
    }

    await waitForUrduFont();

    const host = document.createElement('div');
    host.style.cssText = 'position:fixed; left:-10000px; top:0; z-index:-1;';
    host.innerHTML = buildReportHtml({ summary, frequency, context, name });
    document.body.appendChild(host);

    const root = host.querySelector('#news-report-root');

    try {
        // Give the browser a tick to apply the font and RTL layout.
        await new Promise((resolve) => setTimeout(resolve, 150));

        const canvas = await html2canvas(root, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: root.scrollWidth,
            windowHeight: root.scrollHeight,
        });

        const pdf = canvasToMultiPagePdf(canvas);
        pdf.save('News_Analysis_Report.pdf');

        // Blob URL is more reliable than data: URIs for PDF preview in modern browsers.
        const blob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(blob);

        if (previewWindow && !previewWindow.closed) {
            previewWindow.location.href = blobUrl;
        } else {
            // Popup blocked — open preview in the same tab flow as a fallback.
            window.open(blobUrl, '_blank');
        }

        // Keep blob URL alive long enough for the preview tab to load.
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (error) {
        if (previewWindow && !previewWindow.closed) {
            previewWindow.close();
        }
        throw error;
    } finally {
        document.body.removeChild(host);
    }
};

export default PdfGenerator;
