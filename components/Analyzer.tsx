import React, { useState } from 'react';
import { Card, Button, TextArea, Input } from './UI';
import { analyzeTranscripts } from '../services/geminiService';
import { StyleDNA } from '../types';

interface AnalyzerProps {
  onDnaExtracted: (dna: StyleDNA) => void;
  existingNames: string[];
}

const Analyzer: React.FC<AnalyzerProps> = ({ onDnaExtracted, existingNames }) => {
  const [transcripts, setTranscripts] = useState<string[]>(['']);
  const [profileName, setProfileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTranscript = () => setTranscripts([...transcripts, '']);
  
  const removeTranscript = (index: number) => {
    if (transcripts.length > 1) {
      const next = transcripts.filter((_, i) => i !== index);
      setTranscripts(next);
    }
  };

  const updateTranscript = (index: number, val: string) => {
    const next = [...transcripts];
    next[index] = val;
    setTranscripts(next);
  };

  const handleAnalyze = async () => {
    if (!profileName.trim()) {
      setError("Please provide a name for this style profile.");
      return;
    }

    if (existingNames.includes(profileName.trim().toLowerCase())) {
      setError(`A style profile named "${profileName}" already exists. Please use a unique name.`);
      return;
    }

    const validTranscripts = transcripts.filter(t => t.trim().length > 100);
    if (validTranscripts.length === 0) {
      setError("Please provide at least one substantial transcript (min 100 characters).");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const dna = await analyzeTranscripts(validTranscripts, profileName);
      onDnaExtracted(dna);
    } catch (err) {
      // Avoid mentioning API keys as per guidelines; use generic failure message.
      setError("Analysis failed. Please ensure the transcripts are valid and try again later.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-white mb-2">Source Material</h1>
          <p className="text-slate-400">Paste one or more transcripts to improve style accuracy.</p>
        </header>

        <div className="space-y-4">
          <Input 
            placeholder="Style Profile Name (e.g., 'Modern History Channel Style')" 
            value={profileName}
            onChange={(e) => {
              setProfileName(e.target.value);
              if (error) setError(null);
            }}
          />
          
          <div className="max-h-[600px] overflow-y-auto pr-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {transcripts.map((t, i) => (
              <div key={i} className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transcript {i + 1}</label>
                  {transcripts.length > 1 && (
                    <button 
                      onClick={() => removeTranscript(i)}
                      className="text-slate-500 hover:text-rose-400 transition-colors text-[10px] font-bold uppercase flex items-center gap-1"
                      title="Remove this transcript"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                    </button>
                  )}
                </div>
                <TextArea 
                  placeholder={`Paste content for Transcript ${i + 1} here...`}
                  value={t}
                  onChange={(e) => updateTranscript(i, e.target.value)}
                  className="h-48"
                />
              </div>
            ))}
            
            <Button variant="ghost" onClick={addTranscript} className="w-full border border-dashed border-slate-800 hover:border-cyan-500/50">
              + Add another transcript
            </Button>
          </div>

          {error && <div className="p-4 bg-rose-950/20 border border-rose-900/50 text-rose-400 rounded-lg text-sm animate-pulse">{error}</div>}

          <Button 
            className="w-full h-12 text-lg mt-4" 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Analyzing Style DNA...
              </>
            ) : (
              'Extract Style DNA'
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-cyan-950/10 border-cyan-900/30">
          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Forensic Analysis Engine
          </h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-300 font-bold">1</span>
              <div>
                <p className="font-bold text-slate-200">Input</p>
                <p className="text-xs text-slate-500">Provide transcripts from the target channel.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-300 font-bold">2</span>
              <div>
                <p className="font-bold text-slate-200">Analyze</p>
                <p className="text-xs text-slate-500">Extract Rhetorical, Cognitive, and Lexical patterns.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-300 font-bold">3</span>
              <div>
                <p className="font-bold text-slate-200">Mimic</p>
                <p className="text-xs text-slate-500">Generate a "Digital Clone" of the scriptwriting style.</p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Analyzer;