'use client';

import { useState, useRef, useCallback } from 'react';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
}

const MAX_SIZE_MB = 8;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export default function CloudinaryUpload({
  onUploadSuccess,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPG, PNG, WEBP or GIF allowed.';
    if (file.size > MAX_SIZE_BYTES) return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_SIZE_MB} MB.`;
    return null;
  };

  const uploadFile = useCallback(async (file: File) => {
    const err = validateFile(file);
    if (err) { setError(err); return; }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Step 1 — get a signed upload token from our server (fast: <100ms, no file transfer)
      const sigRes = await fetch('/api/upload-signature', { cache: 'no-store' });
      if (!sigRes.ok) {
        let errMessage = 'Failed to get upload token';
        try {
          const errData = await sigRes.json();
          if (errData.error) errMessage = errData.error;
        } catch {
          errMessage = `Failed to get upload token (${sigRes.status})`;
        }
        throw new Error(errMessage);
      }
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      // Step 2 — upload DIRECTLY from browser to Cloudinary (no Next.js relay)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('api_key', apiKey);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        // Real upload progress from XHR
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const result = JSON.parse(xhr.responseText);
            // Build optimised delivery URL (CDN applies transforms at edge, zero upload delay)
            const raw: string = result.secure_url;
            const idx = raw.indexOf('/upload/') + 8;
            const optimized = raw.slice(0, idx) + 'q_auto,f_auto,w_1200/' + raw.slice(idx);
            onUploadSuccess(optimized);
            resolve();
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData?.error?.message ?? 'Upload failed'));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
      });

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(msg);
    } finally {
      setUploading(false);
      setProgress(0);
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      xhrRef.current = null;
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [onUploadSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .upload-zone-inner {
          position: relative;
          border: 2px dashed #e2e8f0;
          border-radius: 14px;
          padding: 28px 20px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 130px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          text-align: center;
          overflow: hidden;
        }
        .upload-zone-inner.drag-over {
          border-color: #d4af5f !important;
          background: rgba(212,175,95,0.06) !important;
          box-shadow: 0 0 0 4px rgba(212,175,95,0.12);
        }
        .upload-zone-inner:hover:not(.uploading-state) {
          border-color: #d4af5f;
          background: rgba(212,175,95,0.04);
        }
        .upload-file-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .upload-file-input:disabled { cursor: not-allowed; }
      `}</style>

      <div
        className={`upload-zone-inner ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading-state' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onClick={() => !uploading && inputRef.current?.click()}
        style={{ cursor: uploading ? 'default' : 'pointer' }}
      >
        {/* Progress bar */}
        {uploading && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, height: '3px',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #d4af5f, #c9973a)',
            transition: 'width 0.15s ease',
          }} />
        )}

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            {localPreview ? (
              <div style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={localPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,31,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '22px', height: '22px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                </div>
              </div>
            ) : (
              <div style={{ width: '36px', height: '36px', border: '3px solid rgba(212,175,95,0.3)', borderTopColor: '#d4af5f', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Uploading directly to cloud…</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>{progress}%</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: dragOver ? 'linear-gradient(135deg, rgba(212,175,95,0.2), rgba(212,175,95,0.1))' : 'white',
              border: dragOver ? '1.5px solid rgba(212,175,95,0.4)' : '1.5px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 6px rgba(0,0,0,0.06)', transition: 'all 0.2s',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={dragOver ? '#d4af5f' : '#94a3b8'}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'stroke 0.2s' }}>
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1" />
                <polyline points="16 8 12 4 8 8" />
                <line x1="12" y1="4" x2="12" y2="16" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '13.5px', color: '#475569', margin: 0 }}>
                <span style={{ fontWeight: '700', color: '#d4af5f' }}>Click to upload</span> or drag & drop
              </p>
              <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '4px 0 0' }}>
                PNG, JPG, WEBP · Max {MAX_SIZE_MB} MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          className="upload-file-input"
          onChange={handleFileChange}
          disabled={uploading}
          onClick={e => e.stopPropagation()}
        />
      </div>

      {error && (
        <div style={{
          marginTop: '10px', display: 'flex', alignItems: 'flex-start', gap: '8px',
          padding: '10px 14px', background: '#fef2f2', border: '1.5px solid #fca5a5',
          borderRadius: '10px', color: '#b91c1c', fontSize: '12.5px', fontWeight: '500', lineHeight: '1.5',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
          <button type="button" onClick={() => setError('')}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
