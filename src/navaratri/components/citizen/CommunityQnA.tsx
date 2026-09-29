import React, { useState } from "react";
import { CommunityQuestion, Mandapam } from "../../types";
import { useNavaratriData } from "../../context/NavaratriDataContext";
import { useNavaratriLanguage } from "../../context/NavaratriLanguageContext";
import { MessageCircle, CheckCircle, Send, HelpCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CommunityQnAProps {
  mandapam: Mandapam;
  questions: CommunityQuestion[];
}

export const CommunityQnA: React.FC<CommunityQnAProps> = ({
  mandapam,
  questions
}) => {
  const { askQuestion, answerQuestion, role } = useNavaratriData();
  const { t } = useNavaratriLanguage();
  const [askerName, setAskerName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answeringQId, setAnsweringQId] = useState<string | null>(null);
  const [organizerAnswer, setOrganizerAnswer] = useState("");

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askerName.trim() || !questionText.trim()) {
      toast.error("Please provide your name and question.");
      return;
    }
    askQuestion(mandapam.id, askerName.trim(), questionText.trim());
    setAskerName("");
    setQuestionText("");
    toast.success("Your question was posted. Mandapam organizers will reply soon!");
  };

  const handleAnswerSubmit = (qId: string) => {
    if (!organizerAnswer.trim()) return;
    answerQuestion(qId, `${mandapam.organizerName} (Official Team)`, organizerAnswer.trim(), true);
    setAnsweringQId(null);
    setOrganizerAnswer("");
    toast.success("Official answer published successfully!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
        <div>
          <h3 className="font-serif font-black text-xl text-[#8B1E1E] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span>Citizen & Devotee Q&A</span>
          </h3>
          <p className="text-xs text-stone-600">
            Ask queries about Pooja timings, prasadam, parking, or materials to bring
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-[#8B1E1E] border border-amber-300">
          Organizer Verified
        </span>
      </div>

      {/* Ask Question Form */}
      <form onSubmit={handleAsk} className="p-4 rounded-2xl bg-[#FFFDF9] border border-amber-300/80 shadow-sm space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-[#8B1E1E]" />
          <span>Ask Mandapam Committee a Question</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            required
            value={askerName}
            onChange={(e) => setAskerName(e.target.value)}
            placeholder="Enter your name"
            className="px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            required
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Ask question (e.g. Is parking available? What time is Harathi?)"
            className="sm:col-span-2 px-3 py-2 rounded-xl text-xs border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#8B1E1E] hover:bg-[#9A241C] text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Question</span>
          </button>
        </div>
      </form>

      {/* Questions Feed */}
      <div className="space-y-3">
        {questions.length > 0 ? (
          questions.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-sm space-y-3 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-stone-900">{q.askerName} asked:</span>
                  <p className="text-stone-800 text-sm font-medium mt-0.5 leading-relaxed">
                    "{q.question}"
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0">
                  {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Answers list */}
              {q.answers && q.answers.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-amber-100">
                  {q.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-[#8B1E1E] font-bold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{ans.responderName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase tracking-tighter">
                          Official Mandapam Reply
                        </span>
                      </div>
                      <p className="text-stone-800 leading-relaxed text-xs pl-5">
                        {ans.answer}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-amber-800 italic pt-1">
                  Awaiting response from Mandapam committee...
                </p>
              )}

              {/* Quick Organizer Answer Box (visible in Organizer / Admin mode) */}
              {(role === "organizer" || role === "admin") && (
                <div className="pt-2 border-t border-amber-100">
                  {answeringQId === q.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={organizerAnswer}
                        onChange={(e) => setOrganizerAnswer(e.target.value)}
                        placeholder="Write official Mandapam reply to devotee..."
                        className="w-full p-2.5 rounded-xl text-xs border border-amber-300 bg-amber-50/30 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setAnsweringQId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-stone-600 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAnswerSubmit(q.id)}
                          className="px-3 py-1 rounded-lg bg-[#8B1E1E] text-white text-xs font-bold hover:bg-[#9A241C]"
                        >
                          Publish Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAnsweringQId(q.id)}
                      className="text-xs font-bold text-[#8B1E1E] hover:underline flex items-center gap-1"
                    >
                      <span>+ Reply as Organizer</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-stone-500 text-center py-4 bg-amber-50/50 rounded-2xl">
            No questions asked yet. Be the first devotee to ask!
          </p>
        )}
      </div>
    </div>
  );
};
