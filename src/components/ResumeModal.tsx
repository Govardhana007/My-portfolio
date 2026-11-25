import { ArrowUpRight, Download, X } from 'lucide-react';
import { useEffect } from 'react';
import { PROFILE } from '../data/portfolio';

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export function ResumeModal({ open, onClose }: ResumeModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0E0F11]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[88vh] flex flex-col rounded-[50px] bg-[#0E0F11] text-[#F7F4EE] border border-[#F7F4EE]/20 overflow-hidden p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pb-4 flex items-center justify-between gap-4">
          <div className="pl-2">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#C82333]">
              Curriculum Vitae
            </p>
            <h2 id="resume-modal-title" className="font-display text-lg sm:text-xl font-bold">
              {PROFILE.name} — Resume
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={PROFILE.resumePdf}
              download="Govardhana_Ramgopal_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-medium rounded-[50px] bg-[#C82333] text-[#FFFFFF] hover:bg-transparent border border-[#C82333] transition-colors"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download</span>
            </a>
            <a
              href={PROFILE.resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-[50px] border border-[#F7F4EE]/25 hover:border-[#FFFFFF] transition-colors"
            >
              <span>New tab</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume viewer"
              className="w-10 h-10 rounded-full border border-[#F7F4EE]/25 flex items-center justify-center hover:bg-[#C82333] hover:border-[#C82333] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <iframe
          src={PROFILE.resumePdf}
          title="Govardhana Ramgopal Resume PDF"
          className="w-full flex-1 bg-[#FFFFFF] rounded-[50px] border border-[#F7F4EE]/15"
        />
      </div>
    </div>
  );
}
