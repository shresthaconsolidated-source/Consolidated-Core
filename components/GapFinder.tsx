
import React, { useState } from 'react';
import { Search, Loader2, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { analyzeProcessGaps } from '../services/geminiService';
import { GapAnalysisResult } from '../types';

const GapFinder: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<GapAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeProcessGaps(description);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze process. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section id="gap-finder" className="py-24 bg-indigo-950 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <Search className="h-64 w-64 rotate-12" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Operational Gap Finder</h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Describe your current workflow bottlenecks. Our AI auditor will identify hidden leaks and suggest the right fix.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <form onSubmit={handleAnalyze} className="mb-12">
            <label className="block text-sm font-semibold uppercase tracking-widest text-indigo-300 mb-3">
              Your Workflow Bottleneck
            </label>
            <textarea
              className="w-full h-40 bg-white/5 border border-white/20 rounded-2xl p-6 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-lg mb-6"
              placeholder="Example: My staff registers leads but doesn't always update the status. I'm not sure how much revenue is stuck in pending invoices..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={isAnalyzing || !description.trim()}
              className="w-full bg-white text-indigo-950 font-bold py-5 rounded-2xl hover:bg-indigo-50 disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Analyzing Your Process...
                </>
              ) : (
                <>
                  <Search className="h-6 w-6" />
                  Run Free Gap Audit
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 text-red-200 mb-8">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-8">
              <div className="border-t border-white/10 pt-8">
                <h3 className="text-2xl font-bold mb-4 text-indigo-300">Analysis Summary</h3>
                <p className="text-lg text-white/90 leading-relaxed italic border-l-4 border-indigo-500 pl-6">
                  "{result.summary}"
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-300 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Detected Operational Gaps
                  </h4>
                  <ul className="space-y-3">
                    {result.identifiedGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                        <span className="text-red-400 font-bold mt-1">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-indigo-600/30 rounded-2xl p-6 border border-indigo-400/30">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Strategic Recommendation
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-indigo-900/50 p-4 rounded-xl">
                      <span className="text-indigo-200">Recommended Tier:</span>
                      <span className="font-bold text-xl">{result.recommendedPlan}</span>
                    </div>
                    <div className="flex justify-between items-center bg-indigo-900/50 p-4 rounded-xl">
                      <span className="text-indigo-200">Est. ROI Impact:</span>
                      <span className="font-bold text-green-400">{result.roiEstimate}</span>
                    </div>
                    <button className="w-full bg-white text-indigo-950 font-bold py-3 rounded-xl mt-4 hover:bg-indigo-50 transition-colors">
                      Discuss This Analysis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GapFinder;
