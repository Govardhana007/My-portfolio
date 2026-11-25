import { ArrowUpRight, Download, X } from 'lucide-react';
import { useEffect } from 'react';
import { CertificateItem } from '../data/portfolio';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  useEffect(() => {
    if (!certificate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [certificate, onClose]);

  if (!certificate) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0E0F11]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[50px] bg-[#0E0F11] text-[#F7F4EE] border border-[#F7F4EE]/20 p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate preview"
          className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-[#0E0F11] text-[#FFFFFF] border border-[#F7F4EE]/25 flex items-center justify-center hover:bg-[#C82333] hover:border-[#C82333] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-[#0E0F11] rounded-[50px] border border-[#F7F4EE]/12 p-4 sm:p-6 flex items-center justify-center">
          <img
            src={certificate.image}
            alt={`${certificate.title} certificate from ${certificate.issuer}`}
            referrerPolicy="no-referrer"
            className="max-h-[54vh] w-auto object-contain rounded-[50px]"
          />
        </div>

        <div className="px-2 pt-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#C82333] mb-1 tabular-nums">
              {certificate.issuer} · {certificate.date}
            </p>
            <h2 id="certificate-modal-title" className="font-display text-2xl font-bold">
              {certificate.title}
            </h2>
            <p className="text-sm text-[#F7F4EE]/75 mt-1">{certificate.credentialNote}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={certificate.pdf}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[50px] border border-[#F7F4EE]/25 hover:border-[#FFFFFF] transition-colors"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download PDF</span>
            </a>
            <a
              href={certificate.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[50px] bg-[#C82333] text-[#FFFFFF] hover:bg-transparent border border-[#C82333] transition-colors"
            >
              <span>Open PDF</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
