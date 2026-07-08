import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Copy, ThumbsUp } from 'lucide-react';
import { LoadingState } from '../../components/common/LoadingState';
import { useDocuments } from '../../hooks/useDocuments';
import { useSelectedDocumentId } from '../../hooks/useSelectedDocumentId';
import { mnemonicService } from '../../services/mnemonicService';
import type { Mnemonic } from '../../services/types';

export function Mnemonics() {
  const { documents, loadDocuments } = useDocuments();
  const selectedDocumentId = useSelectedDocumentId();
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mnemonics, setMnemonics] = useState<Mnemonic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documents.length === 0) loadDocuments();
  }, [documents.length, loadDocuments]);

  useEffect(() => {
    if (!selectedDocumentId) return;
    setLoading(true);
    mnemonicService.list(selectedDocumentId).then(setMnemonics).finally(() => setLoading(false));
  }, [selectedDocumentId]);

  const handleGenerate = async () => {
    if (!input) return;
    setIsGenerating(true);
    try {
      const mnemonic = await mnemonicService.create(input);
      setMnemonics((current) => [mnemonic, ...current]);
      setInput('');
    } finally {
      setIsGenerating(false);
    }
  };

  const result = mnemonics[0]?.mnemonic_text ?? null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Mnemonic Generator</h1>
        <p className="text-slate-500 mt-1">Turn complex lists into easy-to-remember phrases.</p>
      </div>

      {loading ? <LoadingState label="Loading mnemonics..." /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col">
            <label className="text-sm font-bold text-slate-800 mb-3 block">What do you want to memorize?</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Kingdom, Phylum, Class, Order, Family, Genus, Species"
              className="w-full flex-1 min-h-[200px] p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-pink/20 focus:border-accent-pink/30 transition-all text-slate-700"
            />
            <button onClick={handleGenerate} disabled={!input || isGenerating} className="mt-6 w-full py-3.5 rounded-xl gradient-bg text-white font-medium shadow-glow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              {isGenerating ? <span className="animate-pulse">Generating...</span> : <><Sparkles size={18} /> Generate Mnemonic</>}
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-8 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Result</h3>
            {result ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 rounded-2xl border-2 border-pink-100 bg-pink-50/30 p-6 flex flex-col relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(result)} className="p-2 text-slate-400 hover:text-accent-pink bg-white rounded-lg shadow-sm transition-colors">
                    <Copy size={16} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-accent-pink bg-white rounded-lg shadow-sm transition-colors">
                    <ThumbsUp size={16} />
                  </button>
                </div>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-accent-pink mb-6">
                  <BrainCircuit size={24} />
                </div>
                <p className="text-xl font-medium text-slate-800 whitespace-pre-line leading-relaxed">{result}</p>
              </motion.div>
            ) : (
              <div className="flex-1 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <BrainCircuit size={48} className="mb-4 opacity-20" />
                <p>Enter a list of items to generate a custom mnemonic device.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
