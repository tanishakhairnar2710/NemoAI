import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { useDocuments } from '../../hooks/useDocuments';
import { useQuiz } from '../../hooks/useQuiz';
import { useSelectedDocumentId } from '../../hooks/useSelectedDocumentId';

export function Quiz() {
  const { documents, loadDocuments } = useDocuments();
  const selectedDocumentId = useSelectedDocumentId();
  const { questions, loading, loadQuiz, submitAnswer } = useQuiz();
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<{ is_correct: boolean; correct_answer: string; explanation: string } | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (documents.length === 0) loadDocuments();
  }, [documents.length, loadDocuments]);

  useEffect(() => {
    if (selectedDocumentId) loadQuiz(selectedDocumentId);
  }, [selectedDocumentId, loadQuiz]);

  const question = questions[index];

  const handleSubmit = async () => {
    if (!selectedOption || !question) return;
    const answer = await submitAnswer(question.id, selectedOption, (Date.now() - startedAt.current) / 1000);
    setResult(answer);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setResult(null);
    setIndex((current) => Math.min(current + 1, questions.length - 1));
    startedAt.current = Date.now();
  };

  if (loading) return <LoadingState label="Loading quiz..." />;
  if (!selectedDocumentId) return <div className="bg-white rounded-2xl p-8 text-center text-slate-500">Upload a document to generate a quiz.</div>;
  if (!question) return <div className="bg-white rounded-2xl p-8 text-center text-slate-500">No quiz questions are available for this document yet.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Practice Quiz</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">Question {index + 1} of {questions.length}</span>
          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-accent-pink rounded-full" style={{ width: `${((index + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 md:p-12">
        <h2 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-10">{question.question}</h2>
        <div className="space-y-4">
          {question.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === result?.correct_answer;
            let optionClass = 'border-slate-200 hover:border-accent-pink/50 hover:bg-pink-50/30';
            if (isSelected && !result) optionClass = 'border-accent-pink bg-pink-50 ring-1 ring-accent-pink';
            if (result && isCorrect) optionClass = 'border-green-500 bg-green-50 ring-1 ring-green-500';
            if (result && isSelected && !isCorrect) optionClass = 'border-red-500 bg-red-50 ring-1 ring-red-500';
            if (result && !isSelected && !isCorrect) optionClass = 'border-slate-200 opacity-50';
            return (
              <button key={option.id} onClick={() => !result && setSelectedOption(option.id)} disabled={Boolean(result)} className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${optionClass}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isSelected && !result ? 'bg-accent-pink text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-accent-pink/10 group-hover:text-accent-pink'} ${result && isCorrect ? 'bg-green-500 text-white' : ''} ${result && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}`}>
                    {option.id.toUpperCase()}
                  </div>
                  <span className={`text-lg ${isSelected || result ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>{option.text}</span>
                </div>
                {result && isCorrect && <CheckCircle2 className="text-green-500" size={24} />}
                {result && isSelected && !isCorrect && <XCircle className="text-red-500" size={24} />}
              </button>
            );
          })}
        </div>
        {result && <p className="mt-6 text-sm text-slate-500">{result.explanation}</p>}
        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
          {!result ? (
            <button onClick={handleSubmit} disabled={!selectedOption} className="px-8 py-3 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Submit Answer
            </button>
          ) : (
            <button onClick={handleNext} disabled={index === questions.length - 1} className="px-8 py-3 rounded-full gradient-bg text-white font-medium shadow-glow hover:shadow-lg disabled:opacity-50 transition-all">
              Next Question
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
