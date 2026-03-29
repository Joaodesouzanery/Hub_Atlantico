"use client";

import { useState, useEffect } from "react";
import { MessageSquarePlus, X, Star, Send, ChevronRight } from "lucide-react";

const LINKEDIN_URL = "https://linkedin.com/company/construdatasoftware";
const VISIT_COUNT_KEY = "hub_visit_count";
const FEEDBACK_DISMISSED_KEY = "hub_feedback_dismissed_at";
const FEEDBACK_SUBMITTED_KEY = "hub_feedback_submitted";

type Step = "rating" | "feedback" | "thanks";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Track visits and auto-show after 3 visits
  useEffect(() => {
    const count = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10) + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(count));

    const dismissed = localStorage.getItem(FEEDBACK_DISMISSED_KEY);
    const submitted = localStorage.getItem(FEEDBACK_SUBMITTED_KEY);
    const daysSinceDismissed = dismissed
      ? (Date.now() - parseInt(dismissed, 10)) / (1000 * 60 * 60 * 24)
      : Infinity;

    // Show auto popup after 3 visits, if not dismissed in last 30 days and not submitted
    if (count >= 3 && daysSinceDismissed > 30 && !submitted) {
      const timer = setTimeout(() => setShowAutoPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowAutoPopup(false);
    setStep("rating");
    setRating(0);
    setFeedback("");
    setSuggestion("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowAutoPopup(false);
    localStorage.setItem(FEEDBACK_DISMISSED_KEY, String(Date.now()));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback, suggestion }),
      });
    } catch {
      // Silent fail — feedback is best-effort
    }
    setSubmitting(false);
    setStep("thanks");
    localStorage.setItem(FEEDBACK_SUBMITTED_KEY, "true");
    setTimeout(() => setIsOpen(false), 3000);
  };

  return (
    <>
      {/* Fixed side buttons — higher on mobile to not overlap footer ad */}
      <div className="fixed right-0 z-40 flex flex-col gap-2 bottom-[80px] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
        {/* Feedback button */}
        <button
          onClick={handleOpen}
          className="group flex items-center gap-2 rounded-l-lg bg-accent px-3 py-2.5 text-sm font-medium text-dark-bg shadow-lg transition-all hover:px-4"
          title="Enviar feedback"
        >
          <MessageSquarePlus size={18} />
          <span className="hidden group-hover:inline">Feedback</span>
        </button>

        {/* LinkedIn support button */}
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-l-lg bg-[#0A66C2] px-3 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:px-4"
          title="Suporte via LinkedIn"
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          <span className="hidden group-hover:inline">Suporte</span>
        </a>
      </div>

      {/* Auto popup notification */}
      {showAutoPopup && !isOpen && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs animate-in slide-in-from-bottom-4 rounded-xl border border-dark-border bg-dark-card p-4 shadow-2xl">
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 text-text-muted hover:text-text-primary"
          >
            <X size={16} />
          </button>
          <p className="mb-3 pr-4 text-sm text-text-primary">
            Como está sua experiência com o HuB? Sua opinião nos ajuda a melhorar!
          </p>
          <button
            onClick={handleOpen}
            className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Avaliar agora <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Feedback modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4">
          <div className="w-full max-h-[90vh] overflow-y-auto rounded-t-2xl border border-dark-border bg-dark-card shadow-2xl sm:max-w-md sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dark-border px-6 py-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {step === "thanks" ? "Obrigado!" : "Pesquisa de Satisfação"}
              </h3>
              <button onClick={handleClose} className="text-text-muted hover:text-text-primary">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5">
              {step === "rating" && (
                <div className="space-y-5">
                  <p className="text-sm text-text-secondary">
                    Como você avalia a plataforma HuB - Atlântico?
                  </p>

                  {/* Star rating */}
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={36}
                          className={
                            star <= (hoverRating || rating)
                              ? "fill-accent text-accent"
                              : "text-dark-border"
                          }
                        />
                      </button>
                    ))}
                  </div>

                  {rating > 0 && (
                    <p className="text-center text-sm text-text-muted">
                      {rating <= 2
                        ? "Entendemos. Conte-nos como melhorar."
                        : rating <= 4
                          ? "Ótimo! O que podemos melhorar?"
                          : "Incrível! Ficamos felizes!"}
                    </p>
                  )}

                  <button
                    onClick={() => rating > 0 && setStep("feedback")}
                    disabled={rating === 0}
                    className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-dark-bg transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {step === "feedback" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      O que achou da plataforma? (obrigatório)
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Conte-nos sua experiência..."
                      rows={3}
                      className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                      Alguma sugestão de melhoria?
                    </label>
                    <textarea
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Funcionalidades, melhorias, ideias..."
                      rows={2}
                      className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!feedback.trim() || submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-dark-bg transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={16} />
                    {submitting ? "Enviando..." : "Enviar Feedback"}
                  </button>
                </div>
              )}

              {step === "thanks" && (
                <div className="py-4 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <Star size={32} className="fill-accent text-accent" />
                  </div>
                  <p className="text-lg font-semibold text-text-primary">
                    Obrigado pelo seu feedback!
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Sua opinião é muito importante para nós.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
