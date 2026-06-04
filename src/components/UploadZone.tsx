import React, { useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import type { AssetValidation } from '../types';

interface UploadZoneProps {
  label: string;
  description: string;
  accept: string;
  validation?: AssetValidation | null;
  preview?: string | null;
  previewSize?: { width: number; height: number };
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  compact?: boolean;
  /** Optional hint text shown below the upload zone (for animation mode) */
  hint?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  label,
  description,
  accept,
  validation,
  preview,
  previewSize,
  onFileSelect,
  onClear,
  compact = false,
  hint,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
        e.target.value = '';
      }
    },
    [onFileSelect]
  );

  const hasFile = !!preview;
  const hasError = validation?.errors && validation.errors.length > 0;
  const isValid = validation?.valid && hasFile;

  let zoneClass = 'upload-zone';
  if (hasError) zoneClass += ' has-error';
  else if (isValid) zoneClass += ' has-file';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
        {hasFile && onClear && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className={zoneClass} onClick={handleClick}>
        <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

        {hasFile && preview ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative"
              style={{
                width: compact ? 48 : previewSize ? Math.min(previewSize.width, 120) : 80,
                height: compact ? 48 : previewSize ? Math.min(previewSize.height, 120) : 80,
              }}
            >
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-contain rounded"
                style={{
                  maxWidth: compact ? 48 : previewSize ? Math.min(previewSize.width, 120) : 80,
                  maxHeight: compact ? 48 : previewSize ? Math.min(previewSize.height, 120) : 80,
                }}
              />
            </div>
            <span className="text-xs text-[var(--text-secondary)]">Click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload size={20} className="text-[var(--text-secondary)]" />
            <span className="text-xs text-[var(--text-secondary)]">{description}</span>
          </div>
        )}
      </div>

      {/* Hint text (for animation mode) */}
      {hint && (
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
          {hint}
        </p>
      )}

      {/* Validation messages */}
      {validation && (
        <div className="mt-1.5 space-y-1">
          {validation.info && (
            <div className="validation-msg success flex items-center gap-1">
              <CheckCircle size={12} />
              <span>{validation.info}</span>
            </div>
          )}
          {validation.errors.map((err, i) => (
            <div key={i} className="validation-msg error flex items-center gap-1">
              <AlertCircle size={12} />
              <span>{err}</span>
            </div>
          ))}
          {validation.warnings.map((warn, i) => (
            <div key={i} className="validation-msg warning flex items-center gap-1">
              <AlertTriangle size={12} />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadZone;
