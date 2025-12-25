
import React, { useState } from 'react';
import { Card, Button, TextArea, Badge } from './UI';
import { StyleDNA, GeneratedScript } from '../types';
import { executeFullPipeline } from '../services/geminiService';

interface GeneratorProps {
  availableDnas: StyleDNA[];
  onScriptGenerated: (script: GeneratedScript) => void;
}

const Generator: React.FC<GeneratorProps> = ({ availableDnas, onScriptGenerated }) => {
  const [topic, setTopic] = useState('');
  const [selectedDnaId, setSelectedDnaId] = useState(availableDnas[0]?.id || '');
  const [targetWordCount, setTargetWordCount] = useState(1000);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    const dna = availableDnas.find(d => d.id === selectedDnaId);
    if (!dna || !topic) return;

    setIsGenerating(true);
    setResult(null);
    try {
      const content = await executeFullPipeline(
        topic, 
        dna, 
        targetWordCount,
        (s) => setStatus(s)
      );
      setResult(content);
      onScriptGenerated({
        id: crypto.randomUUID(),
        topic,
        content,
        dnaName: dna.name,
        createdAt: Date.now()
      });
    } catch (err) {
      console.error(err);
      setStatus("Error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (availableDnas.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
             <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">No Style DNA Profiles Found</h2>
          <p className="text-slate-400 mb-6">You need to analyze transcripts first to extract a style profile before you can generate new scripts.</p>
          <Button onClick={() => window.location.hash = '#analyze'} className="mx-auto">
            Go to Analyzer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Script Config</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Style DNA</label>
              <select 
                value={selectedDnaId}
                onChange={(e) => setSelectedDnaId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full"
              >
                {availableDnas.map(dna => (
                  <option key={dna.id} value={dna.id}>{dna.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Topic / Outline</label>
              <TextArea 
                placeholder="Example: US-China trade conflict 2025, impact on AI supply chain..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 italic">Input will be normalized into structured Topic, Angle, and Key Points.</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Length & Depth</label>
                <span className="text-xs font-mono text-cyan-400">{targetWordCount} words</span>
              </div>
              <input 
                type="range" min="100" max="5000" step="100"
                value={targetWordCount}
                onChange={(e) => setTargetWordCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-bold px-1">
                <div className="text-center">
                  <span>SHORT</span>
                  <p className="font-normal text-[8px]">Direct, few examples</p>
                </div>
                <div className="text-center">
                  <span>MEDIUM</span>
                  <p className="font-normal text-[8px]">Context + Analysis</p>
                </div>
                <div className="text-center">
                  <span>EPIC</span>
                  <p className="font-normal text-[8px]">Deep dive, multi-layer</p>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={isGenerating || !topic}>
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Generating...
                </>
              ) : 'Generate Script'}
            </Button>
            
            {isGenerating && (
              <div className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">Pipeline Status</p>
                <p className="text-xs text-slate-300 font-mono animate-pulse">{status}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <Card className="min-h-[600px] flex flex-col">
          <div className="border-b border-slate-800 p-4 flex justify-between items-center bg-slate-900/30">
            <div className="flex items-center gap-3">
              <Badge>Draft</Badge>
              <span className="text-slate-400 text-sm font-mono truncate max-w-xs">{topic || 'Untitled Project'}</span>
            </div>
            {result && (
              <Button variant="ghost" className="text-xs" onClick={() => navigator.clipboard.writeText(result)}>
                Copy Markdown
              </Button>
            )}
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto prose prose-invert max-w-none prose-cyan prose-sm lg:prose-base">
            {result ? (
              <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-300">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400">Processing professional scriptwriting pipeline...</p>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" /></svg>
                    <p>Your script will appear here...</p>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Generator;
