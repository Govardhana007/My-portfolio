import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { FormEvent, PointerEvent, useState } from 'react';
import { PROFILE, ThemeMode } from '../data/portfolio';
import { SplitHeading } from './SplitHeading';

interface ContactSectionProps {
  themeMode: ThemeMode;
}

export function ContactSection({ themeMode }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setStatusMessage(`Email: ${PROFILE.email}`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMsg) {
      setIsError(true);
      setStatusMessage('Please fill in your name, email address, and message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setIsError(true);
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setIsError(false);
    setStatusMessage(
      `Thanks ${trimmedName} — your note is ready. Open your mail client below or copy ${PROFILE.email}.`,
    );
  };

  const handleSpotlightMove = (e: PointerEvent<HTMLFormElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const mailtoHref = `mailto:${PROFILE.email}?subject=${encodeURIComponent(
    `Portfolio Inquiry from ${name.trim() || 'Visitor'}`,
  )}&body=${encodeURIComponent(
    `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
  )}`;

  const isObsidian = themeMode === 'obsidian';

  return (
    <section
      id="contact"
      data-section="contact"
      className={`py-24 lg:py-32 transition-colors duration-500 border-t ${
        isObsidian
          ? 'bg-[#0E0F11] text-[#F7F4EE] border-[#F7F4EE]/15'
          : 'bg-[#4A0B12] text-[#F7F4EE] border-[#F7F4EE]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 grid lg:grid-cols-12 gap-14 items-center">
        {/* Left: Split Heading + Circular 50% Social Controls */}
        <div className="lg:col-span-5">
          <p
            className={`font-mono text-xs uppercase tracking-[0.2em] mb-3 ${
              isObsidian ? 'text-[#C82333]' : 'text-[#F7F4EE]/80'
            }`}
          >
            04 · Contact
          </p>

          <SplitHeading
            as="h2"
            text="Let's talk"
            className="font-display font-extrabold tracking-tight text-5xl sm:text-6xl lg:text-7xl leading-[0.94] mb-6"
          />

          <p className="text-base sm:text-lg leading-relaxed opacity-90 mb-8 max-w-md">
            Open to AI &amp; ML internships, full-stack roles, and thoughtful software products.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mb-6">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="w-14 h-14 rounded-full border border-current/35 flex items-center justify-center font-mono text-sm font-semibold hover:bg-[#F7F4EE] hover:text-[#0E0F11] hover:border-[#F7F4EE] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FFFFFF]"
            >
              GH
            </a>

            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="w-14 h-14 rounded-full border border-current/35 flex items-center justify-center font-mono text-sm font-semibold hover:bg-[#F7F4EE] hover:text-[#0E0F11] hover:border-[#F7F4EE] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FFFFFF]"
            >
              in
            </a>

            <a
              href={`mailto:${PROFILE.email}`}
              aria-label="Send email directly"
              className="w-14 h-14 rounded-full border border-current/35 flex items-center justify-center font-mono text-sm font-semibold hover:bg-[#F7F4EE] hover:text-[#0E0F11] hover:border-[#F7F4EE] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FFFFFF]"
            >
              @
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 h-14 rounded-[50px] border border-current/35 text-xs font-mono uppercase tracking-wider hover:bg-[#F7F4EE] hover:text-[#0E0F11] hover:border-[#F7F4EE] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FFFFFF]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  <span>{PROFILE.email}</span>
                </>
              )}
            </button>
          </div>

          <p className="font-mono text-xs opacity-80 tabular-nums">{PROFILE.phone}</p>
        </div>

        {/* Right: Spotlight Card with Floating Underline Inputs */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            onPointerMove={handleSpotlightMove}
            noValidate
            className="spotlight-card rounded-[50px] border border-[#F7F4EE]/30 bg-[#0E0F11]/45 p-8 sm:p-10 space-y-6"
          >
            <div className="relative">
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                required
                className="peer w-full pt-6 pb-2.5 px-1 bg-transparent border-0 border-b border-[#F7F4EE]/35 text-base text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF] transition-colors"
              />
              <label
                htmlFor="contact-name"
                className="pointer-events-none absolute left-1 top-5 font-mono text-sm text-[#F7F4EE]/70 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#FFFFFF] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#FFFFFF]"
              >
                Your name
              </label>
            </div>

            <div className="relative">
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                className="peer w-full pt-6 pb-2.5 px-1 bg-transparent border-0 border-b border-[#F7F4EE]/35 text-base text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF] transition-colors"
              />
              <label
                htmlFor="contact-email"
                className="pointer-events-none absolute left-1 top-5 font-mono text-sm text-[#F7F4EE]/70 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#FFFFFF] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#FFFFFF]"
              >
                Email address
              </label>
            </div>

            <div className="relative">
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder=" "
                required
                className="peer w-full pt-6 pb-2.5 px-1 bg-transparent border-0 border-b border-[#F7F4EE]/35 text-base text-[#FFFFFF] focus:outline-none focus:border-[#FFFFFF] transition-colors resize-none"
              />
              <label
                htmlFor="contact-message"
                className="pointer-events-none absolute left-1 top-5 font-mono text-sm text-[#F7F4EE]/70 transition-all duration-200 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#FFFFFF] peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#FFFFFF]"
              >
                Message
              </label>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="px-8 py-4 text-sm font-semibold rounded-[50px] bg-[#F7F4EE] text-[#0E0F11] border border-[#F7F4EE] hover:bg-transparent hover:text-[#FFFFFF] active:scale-[0.98] transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFFFFF]"
              >
                Send message
              </button>

              {!isError && statusMessage && (
                <a
                  href={mailtoHref}
                  className="inline-flex items-center gap-1.5 px-6 py-4 text-sm font-medium rounded-[50px] border border-[#F7F4EE]/45 text-[#FFFFFF] hover:bg-[#F7F4EE] hover:text-[#0E0F11] transition-colors duration-300"
                >
                  <span>Open in Email Client</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>

            {statusMessage && (
              <p
                role="status"
                aria-live="polite"
                className={`text-sm font-medium ${isError ? 'text-red-300' : 'text-[#F7F4EE]'}`}
              >
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
