import React, { useState } from "react";
import { Sparkles, X, Check, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  areaName: string;
  textType: "resumo" | "experiência" | "educação" | "geral";
  onApply: (enhancedText: string) => void;
}

export default function AIEnhancerModal({
  isOpen,
  onClose,
  originalText,
  areaName,
  textType,
  onApply,
}: AIEnhancerModalProps) {
  const [loading, setLoading] = useState(false);
  const [enhancedText, setEnhancedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleEnhance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: originalText,
          area: areaName,
          type: textType,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro desconhecido ao chamar IA");
      }

      setEnhancedText(data.result || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Não foi possível conectar ao servidor de IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApply(enhancedText);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen && originalText) {
      setEnhancedText("");
      setError(null);
      // Auto-trigger the API call to save user a click
      handleEnhance();
    }
  }, [isOpen, originalText]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
              <h3 className="font-display font-semibold text-lg">Aprimorar com Gemini AI</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-sm">
                Foco: {areaName}
              </span>
              <span>• Otimizando o conteúdo para soar mais persuasivo e profissional.</span>
            </div>

            {/* Content panes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Content */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Texto Original
                </label>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 min-h-[160px] max-h-[250px] overflow-y-auto whitespace-pre-line leading-relaxed">
                  {originalText || <span className="text-slate-400 italic">Nenhum texto fornecido.</span>}
                </div>
              </div>

              {/* AI Enhanced Content */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider block flex items-center gap-1.5">
                  Sugestão da IA
                  {loading && <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />}
                </label>
                <div className="relative bg-blue-50/40 border border-blue-100/80 rounded-xl p-4 text-sm text-slate-800 min-h-[160px] max-h-[250px] overflow-y-auto whitespace-pre-line leading-relaxed">
                  {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 gap-3">
                      <RefreshCw className="h-7 w-7 text-blue-600 animate-spin" />
                      <span className="text-xs text-slate-500 animate-pulse font-medium">
                        Redigindo versão profissional...
                      </span>
                    </div>
                  ) : error ? (
                    <div className="text-red-600 text-xs flex items-start gap-2 p-1">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  ) : enhancedText ? (
                    <p className="font-medium text-slate-800">{enhancedText}</p>
                  ) : (
                    <span className="text-slate-400 italic">Aguardando geração...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Note about secrets if missing */}
            {!loading && error && error.includes("Secrets") && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                <p className="font-semibold mb-1">Dica para Desenvolvedores:</p>
                Para habilitar o refinamento inteligente via Inteligência Artificial, por favor configure sua chave de API do Gemini no AI Studio: clique no menu superior <strong>Settings</strong> &gt; <strong>Secrets</strong> e adicione uma variavel chamada <code>GEMINI_API_KEY</code> com sua chave.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleEnhance}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-blue-700 hover:bg-slate-200/50 disabled:opacity-50 text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Re-gerar
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleApply}
                disabled={loading || !enhancedText || !!error}
                className="flex items-center gap-1.5 px-4.5 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-700/10 transition-colors"
              >
                <Check className="h-4 w-4" />
                Aplicar Ajuste
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
