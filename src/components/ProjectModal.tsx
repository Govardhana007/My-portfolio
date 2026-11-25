import { ArrowUpRight, Code2, X } from 'lucide-react';
import { useEffect } from 'react';
import { ProjectItem } from '../data/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0E0F11]/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[50px] bg-[#0E0F11] text-[#F7F4EE] border border-[#F7F4EE]/20 p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full bg-[#0E0F11] text-[#FFFFFF] border border-[#F7F4EE]/25 flex items-center justify-center hover:bg-[#C82333] hover:border-[#C82333] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C82333]"
        >
          <X className="w-5 h-5" />
        </button>

        {project.image && (
          <div className="w-full aspect-[16/9] rounded-[50px] bg-[#0E0F11] overflow-hidden border border-[#F7F4EE]/15 mb-6">
            <img
              src={project.image}
              alt={project.imageAlt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-3 pb-3 space-y-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#C82333] mb-2 tabular-nums">
              {project.index} · {project.category} · {project.year}
            </p>
            <h2 id="project-modal-title" className="font-display text-3xl sm:text-4xl font-bold">
              {project.title}
            </h2>
            <p className="text-base text-[#F7F4EE]/80 mt-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="pt-5 border-t border-[#F7F4EE]/12">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[#F7F4EE]/60 mb-3">
              Engineering Highlights
            </h3>
            <ul className="space-y-2 text-sm text-[#F7F4EE]/85">
              {project.highlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#C82333] mt-0.5" aria-hidden="true">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-5 border-t border-[#F7F4EE]/12 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-xs text-[#F7F4EE]/70">
              {project.stack.join(' · ')}
            </span>

            <div className="flex items-center gap-3">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[50px] border border-[#F7F4EE]/25 hover:border-[#FFFFFF] transition-colors"
              >
                <Code2 className="w-4 h-4" aria-hidden="true" />
                <span>View Source</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-[50px] bg-[#C82333] text-[#FFFFFF] hover:bg-transparent border border-[#C82333] transition-colors"
                >
                  <span>Open Live Demo</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
