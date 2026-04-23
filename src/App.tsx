import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Activity, ShieldAlert, Cpu, Terminal as TerminalIcon, Globe, Lock, BrainCircuit, Search, Database, Server, Loader2, X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';

// Simulated WebSockets Data Stream
const MOCK_EVENTS = [
  { id: 1, type: 'DISCOVERY', message: 'New domain mapped: dark-ops-proxy.net', time: '00:00:12', severity: 'low' },
  { id: 2, type: 'BREACH', message: 'Credentials found in Pastebin dump (ID: 8x93Ka)', time: '00:00:45', severity: 'critical' },
  { id: 3, type: 'INFRASTRUCTURE', message: 'IP 192.168.1.45 resolves to Cloudflare node', time: '00:01:05', severity: 'info' },
  { id: 4, type: 'SOCMINT', message: 'Username @ghost_strike active on Telegram', time: '00:01:30', severity: 'medium' },
  { id: 5, type: 'CRYPTO', message: 'Wallet 1A1zP1eP5QGefi2D... received 2.4 BTC', time: '00:02:15', severity: 'high' }
];

const NODES = [
  { id: 'start', label: 'Target.io', x: 50, y: 50, type: 'domain' },
  { id: 'ip', label: '192.168.1.1', x: 20, y: 70, type: 'ip' },
  { id: 'email', label: 'admin@target.io', x: 80, y: 70, type: 'email' },
  { id: 'leak', label: 'Breach_02', x: 80, y: 30, type: 'breach' },
  { id: 'user', label: '@admin_ops', x: 20, y: 25, type: 'social' }
];

const EDGES = [
  { source: 'start', target: 'ip' },
  { source: 'start', target: 'email' },
  { source: 'email', target: 'leak' },
  { source: 'ip', target: 'user' },
  { source: 'start', target: 'user' }
];

export default function AegisDashboard() {
  const [events, setEvents] = useState(MOCK_EVENTS.slice(0, 1));
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // AI State
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initial event stream simulation
  useEffect(() => {
    let index = 1;
    const interval = setInterval(() => {
      if (index < MOCK_EVENTS.length) {
        setEvents(prev => [MOCK_EVENTS[index], ...prev]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handle clicking outside the search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search API call with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }
    
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        setSearchResults(data.results || []);
        setShowResults(true);
      } catch (e: any) {
        console.error("Search failed:", e);
        setSearchError(e.message || "Failed to fetch results.");
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle calling Express Backend for AI Generation
  const handleGenerateAiReport = async () => {
    setIsGenerating(true);
    setAiReport(null);
    try {
      const activeData = selectedNode 
         ? NODES.find(n => n.id === selectedNode) 
         : { context: "Overall infrastructure overview involving 14k leaked records, obfuscated proxies, and active social media threats." };
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetData: activeData })
      });
      
      const data = await response.json();
      if (data.report) {
         setAiReport(data.report);
      } else {
         setAiReport("Failed to synthesize valid response.");
      }
    } catch (e) {
      console.error(e);
      setAiReport("CRITICAL EXCEPTION: Link to Google GenAI capabilities currently offline.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-mono selection:bg-primary/30">
      {/* Background Grid & Vignette */}
      <div className="absolute inset-0 bg-checkerboard opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      
      {/* Top Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4 w-1/4">
          <div className="relative flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg border border-primary/20 shrink-0">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold font-sans tracking-tight text-white shadow-primary drop-shadow-[0_0_10px_rgba(0,255,157,0.5)]">AEGIS-ULTIMA</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest hidden lg:block">Autonomous Intelligence Engine</p>
          </div>
        </div>
        
        {/* Global Search Bar */}
        <div className="flex-1 flex justify-center w-1/2 relative z-50">
          <div ref={searchRef} className="w-full max-w-lg relative group">
            <div className={cn("flex items-center w-full bg-black/60 border rounded-lg transition-colors overflow-hidden",
              showResults && (searchResults.length > 0 || isSearching) ? "border-primary/50 shadow-[0_0_15px_rgba(0,255,157,0.15)] rounded-b-none" : "border-border group-focus-within:border-primary/30"
            )}>
              <div className="pl-3 pr-2 py-2 flex items-center justify-center pointer-events-none text-muted-foreground">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Search className="w-4 h-4" />}
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search global intelligence databases (e.g. IPs, handles, hashes)..." 
                className="w-full bg-transparent border-none outline-none py-2 pr-3 text-sm placeholder:text-muted-foreground/50 text-white"
                spellCheck={false}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="pr-3 pl-2 py-2 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Global Search Results Dropdown */}
            <AnimatePresence>
              {showResults && searchQuery.trim() && !isSearching && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-10 left-0 w-full bg-card/95 backdrop-blur-xl border border-t-0 border-primary/50 rounded-b-lg shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar"
                >
                  {searchError ? (
                    <div className="p-4 text-center text-sm text-destructive flex flex-col items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-destructive" />
                      <span>Search Query Failed: {searchError}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Check network connection</span>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No matching intelligence found for "{searchQuery}".
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="px-3 py-1.5 bg-black/40 border-b border-border text-[10px] uppercase font-bold tracking-widest text-primary/70">
                        {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Extracted
                      </div>
                      <div className="p-1">
                        {searchResults.map((res: any, idx: number) => {
                          const Icon = res.type === 'domain' ? Globe : res.type === 'ip' ? Server : res.type === 'email' ? Database : res.type === 'social' ? Search : Lock;
                          return (
                            <button key={idx} className="w-full text-left p-2 hover:bg-primary/10 rounded flex items-start gap-3 transition-colors group cursor-pointer border border-transparent hover:border-primary/20">
                               <div className="mt-1 w-6 h-6 rounded bg-black/50 border border-border flex items-center justify-center shrink-0">
                                   <Icon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                               </div>
                               <div className="flex flex-col">
                                   <span className="text-white text-sm font-bold truncate">{res.value}</span>
                                   <span className="text-muted-foreground text-xs truncate">{res.context}</span>
                               </div>
                               <div className="ml-auto mt-0.5">
                                 <span className={cn("text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border leading-none whitespace-nowrap",
                                    res.severity === 'critical' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                                    res.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                    res.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                    'bg-primary/10 text-primary border-primary/20'
                                 )}>
                                   {res.type}
                                 </span>
                               </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-8 text-sm w-1/4">
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Engine Status</span>
            <span className="text-primary font-bold flex items-center gap-2 text-xs"><div className="w-2 h-2 rounded-full bg-primary" /> ONLINE & HUNTING</span>
          </div>
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Active Nodes</span>
            <span className="text-white font-bold text-xs">14,208</span>
          </div>
          <div className="flex flex-col items-end hidden lg:flex">
            <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Stealth Router</span>
            <span className="text-purple-400 font-bold flex items-center gap-1 text-xs"><Globe className="w-3 h-3"/> ROTATING TLS</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-[calc(100vh-80px)]">
        
        {/* Left Column: Live Event Stream */}
        <div className="lg:col-span-3 flex flex-col gap-4 max-h-full">
          <div className="flex items-center gap-2 px-2 border-b border-border pb-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="uppercase text-sm font-bold tracking-widest text-primary shadow-primary">Live Intel Feed</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {events.filter(Boolean).map((ev, idx) => (
                <motion.div
                  key={ev?.id || idx}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  className="bg-card/40 border border-border rounded-md p-3 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded", 
                      ev?.severity === 'critical' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                      ev?.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      ev?.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-primary/10 text-primary border border-primary/20'
                    )}>
                      {ev?.type}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{ev?.time}</span>
                  </div>
                  <p className="text-xs text-secondary-foreground leading-tight">{ev?.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Column: Knowledge Graph */}
        <div className="lg:col-span-6 bg-card/20 border border-border rounded-xl relative overflow-hidden backdrop-blur-sm flex flex-col">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <Network className="w-4 h-4 text-muted-foreground" />
            <h2 className="uppercase text-sm font-bold tracking-widest text-muted-foreground">Global Knowledge Graph</h2>
          </div>
          
          <div className="absolute top-4 right-4 z-20 text-[10px] text-muted-foreground flex gap-3 pointer-events-none uppercase tracking-widest bg-black/40 px-2 py-1 rounded border border-border">
            <span>Scroll &bull; Zoom</span>
            <span>Drag &bull; Pan</span>
          </div>

          {/* Graph Rendering */}
          <div className="flex-1 relative w-full h-full min-h-[400px]">
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={4}
              centerZoomedOut={true}
              wheel={{ step: 0.1 }}
            >
              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
                <div 
                  className="relative w-full h-full" 
                  onClick={() => setSelectedNode(null)}
                >
                  {/* Edges */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {EDGES.map((edge, i) => {
                      const source = NODES.find(n => n.id === edge.source);
                      const target = NODES.find(n => n.id === edge.target);
                      if (!source || !target) return null;
                      
                      const isHovered = activeNode === source.id || activeNode === target.id;
                      const isSelected = selectedNode === source.id || selectedNode === target.id;
                      
                      let edgeStroke = '#272730';
                      let edgeWidth = 1;
                      let edgeOpacity = 1;

                      if (selectedNode) {
                        if (isSelected) {
                          edgeStroke = '#00ff9d';
                          edgeWidth = 2;
                          edgeOpacity = 1;
                        } else {
                          edgeOpacity = 0.15;
                        }
                      } else if (activeNode) {
                        if (isHovered) {
                          edgeStroke = '#00ff9d';
                          edgeWidth = 2;
                          edgeOpacity = 1;
                        } else {
                          edgeOpacity = 0.15;
                        }
                      }
                      
                      return (
                        <motion.line
                          key={i}
                          x1={`${source.x}%`}
                          y1={`${source.y}%`}
                          x2={`${target.x}%`}
                          y2={`${target.y}%`}
                          stroke={edgeStroke}
                          strokeWidth={edgeWidth}
                          opacity={edgeOpacity}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1, stroke: edgeStroke, strokeWidth: edgeWidth, opacity: edgeOpacity }}
                          transition={{ duration: 0.3 }}
                        />
                      );
                    })}
                  </svg>

                  {/* Nodes */}
                  {NODES.map((node) => {
                     const Icon = node.type === 'domain' ? Globe : node.type === 'ip' ? Server : node.type === 'email' ? Database : node.type === 'social' ? Search : Lock;
                     
                     const isConnected = (nodeId1: string, nodeId2: string) => {
                       return EDGES.some(e => (e.source === nodeId1 && e.target === nodeId2) || (e.source === nodeId2 && e.target === nodeId1));
                     };

                     const isHovered = activeNode === node.id || (activeNode && isConnected(activeNode, node.id));
                     const isSelected = selectedNode === node.id || (selectedNode && isConnected(selectedNode, node.id));
                     
                     let nodeOpacity = 1;
                     let isHighlighted = false;
                     
                     if (selectedNode) {
                       if (isSelected) {
                         nodeOpacity = 1;
                         isHighlighted = selectedNode === node.id;
                       } else {
                         nodeOpacity = 0.2;
                       }
                     } else if (activeNode) {
                       if (isHovered) {
                         nodeOpacity = 1;
                         isHighlighted = activeNode === node.id;
                       } else {
                         nodeOpacity = 0.4;
                       }
                     } else {
                       isHighlighted = node.id === 'start';
                     }

                     return (
                       <motion.div
                         key={node.id}
                         className="absolute -ml-4 -mt-4 cursor-pointer z-10"
                         style={{ left: `${node.x}%`, top: `${node.y}%`, opacity: nodeOpacity }}
                         whileHover={{ scale: 1.15 }}
                         onHoverStart={() => setActiveNode(node.id)}
                         onHoverEnd={() => setActiveNode(null)}
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedNode(node.id === selectedNode ? null : node.id);
                         }}
                         initial={{ scale: 0, opacity: 0 }}
                         animate={{ scale: 1, opacity: nodeOpacity }}
                         transition={{ type: 'spring', delay: Math.random() * 0.3, opacity: { duration: 0.2 } }}
                       >
                         <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-card shadow-lg border-2 transition-all duration-300", 
                            isHighlighted ? 'border-primary text-primary shadow-[0_0_15px_rgba(0,255,157,0.5)] bg-black' : 'border-border text-muted-foreground hover:border-muted-foreground hover:text-white'
                         )}>
                           <Icon className="w-5 h-5" />
                         </div>
                         <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/90 px-2 py-0.5 rounded border border-border text-[10px] font-bold pointer-events-none">
                           {node.label}
                         </div>
                       </motion.div>
                     );
                  })}
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>

        {/* Right Column: AI Intelligence Brief */}
        <div className="lg:col-span-3 flex flex-col gap-4 max-h-full">
           <div className="flex items-center gap-2 px-2 border-b border-border pb-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <h2 className="uppercase text-sm font-bold tracking-widest text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">AI Synthesis Brief</h2>
          </div>

          <div className="flex-1 bg-card/30 border border-purple-500/20 rounded-md p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar relative backdrop-blur-md">
             
             {/* Scanlines Effect */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />

             {isGenerating ? (
               <div className="flex flex-col items-center justify-center p-12 text-purple-400 gap-4 mt-12 z-10 relative">
                 <Loader2 className="w-10 h-10 animate-spin" />
                 <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Running AI Synthesis...</span>
               </div>
             ) : aiReport ? (
               <div className="space-y-4 text-sm relative z-10">
                 <div>
                   <h3 className="text-xs font-bold uppercase text-purple-400 mb-2 flex items-center gap-1"><Cpu className="w-3 h-3"/> Executive Summary</h3>
                   <div className="text-xs text-secondary-foreground space-y-4 bg-purple-900/10 border border-purple-500/20 p-4 rounded markdown-body leading-relaxed text-justify w-full">
                     <Markdown>{aiReport}</Markdown>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-4 text-sm relative z-10">
                 <div>
                    <h3 className="text-xs font-bold uppercase text-muted-foreground mb-1">Target Profile</h3>
                    <div className="bg-background rounded p-2 border border-border">
                       <div className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">Focus:</span>
                          <span className="font-bold">{selectedNode ? NODES.find(n => n.id === selectedNode)?.label : "Global Overview"}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs mt-1">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="text-primary font-bold">94.2%</span>
                       </div>
                    </div>
                 </div>

                 <div>
                   <h3 className="text-xs font-bold uppercase text-purple-400 mb-1 flex items-center gap-1"><Cpu className="w-3 h-3"/> Standby Mode</h3>
                   <p className="text-xs text-secondary-foreground leading-relaxed bg-purple-900/10 border border-purple-500/20 p-3 rounded opacity-70">
                      Nexus AI is currently on standby. Synthesize active node data to generate an automated threat advisory and recommended attack paths based on current graph state.
                   </p>
                 </div>
               </div>
             )}

             <div className="mt-auto relative z-10">
                 <button 
                  onClick={handleGenerateAiReport}
                  disabled={isGenerating}
                  className="w-full py-2 bg-purple-500/10 border border-purple-500/50 text-purple-400 text-xs font-bold uppercase tracking-widest rounded transition-all hover:bg-purple-500/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isGenerating ? "Synthesizing..." : "Generate AI Report"}
                 </button>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}
