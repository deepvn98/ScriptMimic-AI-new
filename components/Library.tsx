
import React from 'react';
import { Card, Button, Badge } from './UI';
import { StyleDNA } from '../types';

interface LibraryProps {
  dnas: StyleDNA[];
  onDelete: (id: string) => void;
}

const Library: React.FC<LibraryProps> = ({ dnas, onDelete }) => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Style Library</h1>
          <p className="text-slate-400">Manage your extracted Channel DNA profiles.</p>
        </div>
      </header>

      {dnas.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
           <p className="text-slate-500">Your style library is currently empty.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dnas.map(dna => (
            <Card key={dna.id} className="group flex flex-col h-full border-slate-800 hover:border-cyan-500/50 transition-colors">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{dna.name}</h3>
                  <Badge color="cyan">DNA v2.0</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Hook Strategy</label>
                    <p className="text-[11px] text-slate-300 leading-tight">{dna.narrative.hookType}</p>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Reasoning</label>
                    <p className="text-[11px] text-slate-300 leading-tight">{dna.editorial.reasoningStyle}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Linguistic DNA</label>
                  <p className="text-xs text-slate-400 italic mb-2">"{dna.linguistic.sentenceRhythm}"</p>
                  <div className="flex flex-wrap gap-1">
                    {dna.vocabulary.lexicalQuirks.slice(0, 4).map((v, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 bg-cyan-500/10 rounded text-cyan-300 border border-cyan-500/20">"{v}"</span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-slate-500 uppercase font-bold">Safety Guard</span>
                    <span className="text-cyan-400 font-mono">{(dna.safetyRules.maxSimilarityScale * 100).toFixed(0)}% Limit</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full" 
                      style={{ width: `${dna.safetyRules.maxSimilarityScale * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">
                  Analyzed {new Date(dna.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                   <Button variant="danger" className="text-xs py-1.5 px-3" onClick={() => onDelete(dna.id)}>
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     DELETE
                   </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
