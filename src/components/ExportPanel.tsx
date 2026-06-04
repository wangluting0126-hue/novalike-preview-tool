import React, { useState } from 'react';
import { Download, Video, Loader2 } from 'lucide-react';
import type { ExportProgress } from '../types';

interface ExportPanelProps {
  onExport: () => void;
  progress: ExportProgress;
  exportUrl: string | null;
  disabled: boolean;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport,
  progress,
  exportUrl,
  disabled,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!exportUrl) return;
    setDownloading(true);
    const a = document.createElement('a');
    a.href = exportUrl;
    a.download = 'novalike_preview.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="space-y-3">
      <button
        className="btn-primary w-full"
        onClick={onExport}
        disabled={disabled || progress.stage === 'rendering' || progress.stage === 'encoding'}
      >
        {progress.stage === 'rendering' || progress.stage === 'encoding' ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {progress.message}
          </>
        ) : (
          <>
            <Video size={16} />
            Generate Preview Video
          </>
        )}
      </button>

      {/* Progress bar */}
      {(progress.stage === 'rendering' || progress.stage === 'encoding') && (
        <div className="progress-bar">
          <div className="fill" style={{ width: `${progress.percent}%` }} />
        </div>
      )}

      {/* Export result */}
      {progress.stage === 'done' && exportUrl && (
        <div className="space-y-2">
          <video
            src={exportUrl}
            controls
            loop
            style={{
              width: '100%',
              borderRadius: 12,
              border: '1px solid var(--border-color)',
              background: '#000',
            }}
          />
          <button className="btn-secondary w-full" onClick={handleDownload}>
            <Download size={14} />
            {downloading ? 'Downloading...' : 'Download novalike_preview.webm'}
          </button>
        </div>
      )}

      {progress.stage === 'error' && (
        <div className="validation-msg error">{progress.message}</div>
      )}
    </div>
  );
};

export default ExportPanel;
