import Footer from '../Components/Footer.js';
import '../App.css';
import './UserDashboard.css';
import { useState } from 'react';
import Header from '../Components/Header.js';
import StepperModal from '../Components/StepperModal.js';
import {
  extractAudioFile,
  extractTextFromAudio,
  summarizeText,
  findPersonOccurrence,
  findPersonContext,
} from '../speechTotextApi.js';
import { useNavigate, Navigate } from 'react-router-dom';
import PdfButton from '../Components/pdfButton.js';
import toast from 'react-hot-toast';
import { useAuth } from '../Store/auth.js';
import { addReport } from '../addReportApi.js';

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const UserDashboard = () => {
  const { User, isLoggedIn } = useAuth();
  const [vlink, setvLink] = useState('');
  const [vval, setvval] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showStepper, setShowStepper] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([false, false, false, false, false, false]);
  const [Summarize, setSummarize] = useState('');
  const [Frequency, setFrequency] = useState([]);
  const [Context, setContext] = useState({});
  const [showPDF, setShowPDF] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(null);

  const steps = [
    'Extracting Audio File',
    'Extracting Text from Audio',
    'Summarizing Text',
    'Finding Entity Occurrence',
    'Contextual Analysis',
    'Completed',
  ];

  const navigate = useNavigate();

  const handleButtonClick = async () => {
    try {
      if (!vlink.trim()) {
        toast.error('Please enter a YouTube link');
        return;
      }

      const entityList = vval
        .split(',')
        .map((entity) => entity.trim())
        .filter(Boolean);

      setShowPDF(false);
      setSummarize('');
      setFrequency([]);
      setContext({});
      setShowStepper(true);
      setCurrentStep(0);
      setProcessingSteps([false, false, false, false, false, false]);
      setTranscriptionProgress(null);

      const audioResponse = await extractAudioFile(vlink.trim());
      if (!audioResponse || !audioResponse.data || !audioResponse.data.success) {
        throw new Error(audioResponse?.data?.message || 'Failed to extract audio file');
      }

      setCurrentStep(1);
      setProcessingSteps([true, false, false, false, false, false]);
      setTranscriptionProgress({ percent: 0, message: 'Starting transcription...' });

      const textResponse = await extractTextFromAudio(
        audioResponse.data.path,
        setTranscriptionProgress
      );
      setTranscriptionProgress(null);
      if (!textResponse || !textResponse.data || !textResponse.data.success) {
        throw new Error('Failed to extract text from audio');
      }
      setCurrentStep(2);
      setProcessingSteps([true, true, false, false, false, false]);

      const summarizeResponse = await summarizeText(textResponse.data.text);
      if (!summarizeResponse || !summarizeResponse.data || !summarizeResponse.data.success) {
        throw new Error('Failed to summarize text');
      }
      setSummarize(summarizeResponse.data.text);
      setCurrentStep(3);
      setProcessingSteps([true, true, true, false, false, false]);

      let frequencyResults = [];
      let entityContexts = {};

      if (entityList.length > 0) {
        const occurrenceData = await findPersonOccurrence(textResponse.data.text, entityList);
        if (!occurrenceData || !occurrenceData.data || !occurrenceData.data.success) {
          throw new Error(occurrenceData?.data?.message || 'Failed to find occurrence');
        }
        frequencyResults = occurrenceData.data.results || [];
        setFrequency(frequencyResults);
        setCurrentStep(4);
        setProcessingSteps([true, true, true, true, false, false]);

        const contextData = await findPersonContext(textResponse.data.text, entityList);
        if (!contextData || !contextData.data || !contextData.data.success) {
          throw new Error(contextData?.data?.message || 'Failed to find context');
        }
        entityContexts = contextData.data.entityContexts || {};
        setContext(entityContexts);
        setCurrentStep(5);
        setProcessingSteps([true, true, true, true, true, false]);
      } else {
        // No entities: skip frequency/context, still produce summary PDF
        setFrequency([]);
        setContext({});
        setCurrentStep(5);
        setProcessingSteps([true, true, true, true, true, false]);
      }

      const ReportData = await addReport(vlink, textResponse.data.text, User._id);
      if (!ReportData || !ReportData.data || !ReportData.data.success) {
        throw new Error(ReportData?.data?.message || 'Failed to save report');
      }

      setCurrentStep(6);
      setProcessingSteps([true, true, true, true, true, true]);
      setShowPDF(true);
      setShowStepper(false);
      setProcessingSteps([false, false, false, false, false, false]);
      setCurrentStep(0);

      toast.success('Your report is ready! Scroll down to download the PDF.', {
        duration: 6000,
        style: {
          background: '#0f766e',
          color: '#fff',
          fontWeight: 600,
          fontSize: '15px',
          padding: '14px 18px',
        },
      });

      setTimeout(() => {
        document.getElementById('pdf-ready')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err) {
      toast.error(err.message);
      console.error('Error during step processing:', err.message);
      setTranscriptionProgress(null);
      setShowStepper(false);
      setShowPDF(false);
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="ud-page">
      <Header />
      <img src="/dots.png" alt="" className="ud-dots" />

      {showStepper && (
        <StepperModal
          steps={steps}
          currentStep={currentStep}
          processingSteps={processingSteps}
          subProgress={transcriptionProgress}
        />
      )}

      <section className="ud-hero">
        <div className="ud-left">
          <div className="ud-welcome">Welcome back, {User.username}</div>
          <h1 className="ud-title">
            Generate an in-depth
            <br />
            news video <em>analysis report</em>
          </h1>
          <p className="ud-lead">
            Turn any YouTube news clip into a clear English summary with entity frequency and
            contextual analysis — ready as a downloadable PDF.
          </p>

          <div className="ud-panel">
            <p className="ud-panel-title">Start a new analysis</p>
            <div className="ud-form">
              <div className="ud-field">
                <label htmlFor="Link">YouTube video link</label>
                <div className="ud-input-wrap">
                  <LinkIcon />
                  <input
                    id="Link"
                    type="url"
                    value={vlink}
                    onChange={(e) => setvLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              <div className="ud-field">
                <label htmlFor="personVal">Entities to analyze</label>
                <div className="ud-input-wrap">
                  <PeopleIcon />
                  <input
                    id="personVal"
                    type="text"
                    value={vval}
                    onChange={(e) => setvval(e.target.value)}
                    placeholder="e.g. Imran Khan, Karachi, Pakistan"
                  />
                </div>
                <p className="ud-hint">Optional. Use English terms, separated by commas (cities, countries, names, topics, etc.).</p>
              </div>

              <div className="ud-actions">
                <button type="button" className="ud-btn ud-btn--primary" onClick={handleButtonClick}>
                  Generate report
                </button>
                <button
                  type="button"
                  className="ud-btn ud-btn--ghost"
                  onClick={() => navigate('/activities')}
                >
                  Past activities
                </button>
              </div>
            </div>
          </div>

          {showPDF && Summarize && (
            <div id="pdf-ready" className="ud-pdf">
              <h3>Report ready to download</h3>
              <p>Your news analysis PDF has been generated. Download it below.</p>
              <div className="ud-pdf-action">
                <PdfButton
                  summary={Summarize}
                  frequency={Frequency}
                  context={Context}
                  name={User.username}
                />
              </div>
            </div>
          )}
        </div>

        <div className="ud-visual" aria-hidden="false">
          <div className="ud-visual-glow" />
          <div className="ud-visual-frame">
            <img src="/Bg.png" alt="News analysis visualization" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;
