import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Excalidraw, WelcomeScreen, MainMenu } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';
import {
  BookOpen,
  ClipboardList,
  MessageSquare,
  Bot,
  User,
  Send,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Lightbulb,
  Sparkles,
  X,
  Loader2
} from 'lucide-react';
import { YouTubePlayer } from './SystemDesignComponents';
import type { Problem } from './SystemDesignComponents';
import type { DesignSolution } from '../../src/domain/entities/SystemDesign';
import { Breadcrumb } from './components/Breadcrumb';
import { useTheme } from '../../../frontend/src/context/useTheme';
import { useAuth } from '../../../frontend/src/context/AuthContextDefinition';
import { SignInGate } from '../../../frontend/src/components/SignInGate';
import { AuthUnlockModal } from '../../../frontend/src/components/AuthUnlockModal';


interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SystemDesignPlaygroundProps {
  problem: Problem;
  onBack: () => void;
}

const SystemDesignPlayground: React.FC<SystemDesignPlaygroundProps> = ({ problem, onBack }) => {
  const { theme: siteTheme } = useTheme();
  const { accessToken, login } = useAuth();
  const excalidrawTheme = siteTheme === 'dark' ? 'dark' : 'light';
  const [activeTab, setActiveTab] = useState<'problem' | 'solution' | 'ai'>('problem');
  const [leftWidth, setLeftWidth] = useState(30); // percentage
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [solution, setSolution] = useState<DesignSolution | null>(null);
  const [loadingSolution, setLoadingSolution] = useState(false);
  const [errorLoadingSolution, setErrorLoadingSolution] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm your System Design assistant. How can I help you with "${problem.title}"?` }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);
  const [inputValue, setInputValue] = useState('');

  // Progressive hints state
  const [revealedHints, setRevealedHints] = useState(0);

  // Section collapse state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    functional: true,
    nonFunctional: false,
    constraints: false,
    components: false,
  });

  // Excalidraw analysis state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [analysisFeedback, setAnalysisFeedback] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFeatureName, setAuthFeatureName] = useState('');

  const openAuthModal = (feature: string) => {
    setAuthFeatureName(feature);
    setShowAuthModal(true);
  };

  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const container = document.querySelector('.playground-main');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    if (newLeftWidth > 20 && newLeftWidth < 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  useEffect(() => {
    if (activeTab === 'solution' && !solution && !loadingSolution && !errorLoadingSolution) {
      const fetchSolution = async () => {
        setLoadingSolution(true);
        try {
          const res = await fetch(`/api/system-design/solutions/${problem.slug}`);
          if (res.ok) {
            const data = await res.json();
            setSolution(data.solution);
          } else {
            setErrorLoadingSolution(true);
          }
        } catch (err) {
          console.error('Error fetching solution:', err);
          setErrorLoadingSolution(true);
        } finally {
          setLoadingSolution(false);
        }
      };
      fetchSolution();
    }
  }, [activeTab, solution, loadingSolution, errorLoadingSolution, problem.slug]);


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Auth check
    if (!accessToken) {
      // This should be handled by the SignInGate wrapping the tab, 
      // but keeping a safety check that triggers the modal if needed.
      openAuthModal('AI Tutor');
      return;
    }

    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setIsAiThinking(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/system-design/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          slug: problem.slug,
          message: userMsg,
          history: history
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
         throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: unknown) {
      console.error('AI Chat Error:', err);
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (err instanceof Error) {
        if (err.message && (err.message.includes("AUTH_REQUIRED") || err.message.includes("Invalid token"))) {
            errorMessage = "Session expired. Please log in again.";
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const revealNextHint = () => {
    if (solution && revealedHints < solution.hints.length) {
      setRevealedHints(prev => prev + 1);
    }
  };

  // Extract text elements from Excalidraw canvas
  const getCanvasTextElements = useCallback((): string[] => {
    if (!excalidrawAPI) return [];
    try {
      const elements = excalidrawAPI.getSceneElements();
      return elements
        .filter((el: Record<string, unknown>) => el.type === 'text' && !el.isDeleted)
        .map((el: Record<string, unknown>) => (el.text as string)?.trim())
        .filter((text: string) => text && text.length > 0);
    } catch {
      return [];
    }
  }, [excalidrawAPI]);

  // Analyze canvas architecture
  const analyzeDesign = useCallback(async () => {
    // Auth check
    if (!accessToken) {
      openAuthModal('Design Analysis');
      return;
    }

    const textElements = getCanvasTextElements();
    if (textElements.length === 0) {
      setAnalysisFeedback('Draw some components on the canvas first! Add text labels for your architecture components (e.g., "Load Balancer", "Database", "Cache").');
      setShowAnalysisPanel(true);
      return;
    }

    setAnalysisLoading(true);
    setShowAnalysisPanel(true);
    try {
      const res = await fetch('/api/system-design/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canvasElements: textElements,
          problemTitle: problem.title,
          problemDescription: problem.description,
          expectedComponents: problem.expectedComponents,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisFeedback(data.content || 'No feedback available.');
      } else {
        setAnalysisFeedback('AI analysis is currently unavailable. Please check your AI configuration.');
      }
    } catch {
      setAnalysisFeedback('Could not connect to the AI service. Ensure the AI provider is accessible.');
    } finally {
      setAnalysisLoading(false);
    }
  }, [getCanvasTextElements, problem]);

  // Idle detection: auto-trigger analysis after 30s of no canvas changes
  const handleCanvasChange = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const textElements = getCanvasTextElements();
      if (textElements.length >= 3) {
        analyzeDesign();
      }
    }, 30000); // 30 seconds
  }, [getCanvasTextElements, analyzeDesign]);

  // Cleanup idle timer
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <div className="system-design-playground">
      <div className="playground-container">
        {/* Top Navigation Bar with Breadcrumb */}
        <nav className="playground-nav">
          <div className="breadcrumb-section">
            <Breadcrumb
              problemTitle={problem.title}
              categoryName={problem.category}
              onNavigateToHome={onBack}
            />
          </div>
          <div className="problem-header">
            <span className={`difficulty-badge difficulty-${problem.difficulty}`}>{problem.difficulty}</span>
            <h2 className="playground-title">{problem.title}</h2>
          </div>
          <div className="nav-actions">
            <button 
              className="toggle-sidebar-btn" 
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              title={isSidebarVisible ? "Hide Panel" : "Show Panel"}
            >
              {isSidebarVisible ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>
        </nav>



        <div className="playground-main">
          {isSidebarVisible && (
            <div 
              className="left-pane" 
              style={{ width: `${leftWidth}%` }}
            >
              <div className="tab-header-container">
                <button 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-base font-medium transition-all ${activeTab === 'problem' ? 'active-tab bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'}`}
                  onClick={() => setActiveTab('problem')}
                >
                  <BookOpen size={18} />
                  Problem
                </button>
                <button 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-base font-medium transition-all ${activeTab === 'solution' ? 'active-tab bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'}`}
                  onClick={() => setActiveTab('solution')}
                >
                  <ClipboardList size={18} />
                  Explain
                </button>
                <button 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-base font-medium transition-all ${activeTab === 'ai' ? 'active-tab bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'}`}
                  onClick={() => setActiveTab('ai')}
                >
                  <MessageSquare size={18} />
                  Tutor
                </button>
              </div>


              {activeTab === 'problem' && (
                <div className="tab-content bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold flex items-center gap-2"><BookOpen size={16} /> Problem Statement</h3>
                  <p className="problem-description">{problem.description}</p>
                  {problem.source && (
                    <div className="source-credit" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color, #e2e8f0)' }}>
                      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted, #64748b)' }}>
                        Source: {problem.source}
                      </p>
                    </div>
                  )}
                  
                  {/* Functional Requirements */}
                  {problem.functionalRequirements && problem.functionalRequirements.length > 0 && (
                    <div className="collapsible-section">
                      <button className="collapse-header" onClick={() => toggleSection('functional')}>
                        <span className="collapse-icon">
                          {expandedSections.functional ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                        <h4 className="subsection-title" style={{ margin: 0 }}>Functional Requirements</h4>
                        <span className="requirement-count">{problem.functionalRequirements.length}</span>
                      </button>
                      {expandedSections.functional && (
                        <ul className="requirements-list">
                          {problem.functionalRequirements.map((req, i) => (
                            <li key={i} className="requirement-item">
                              <span className="req-bullet">→</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Non-Functional Requirements */}
                  {problem.nonFunctionalRequirements && problem.nonFunctionalRequirements.length > 0 && (
                    <div className="collapsible-section">
                      <button className="collapse-header" onClick={() => toggleSection('nonFunctional')}>
                        <span className="collapse-icon">
                          {expandedSections.nonFunctional ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                        <h4 className="subsection-title" style={{ margin: 0 }}>Non-Functional Requirements</h4>
                        <span className="requirement-count">{problem.nonFunctionalRequirements.length}</span>
                      </button>
                      {expandedSections.nonFunctional && (
                        <ul className="requirements-list">
                          {problem.nonFunctionalRequirements.map((req, i) => (
                            <li key={i} className="requirement-item">
                              <span className="req-bullet">⚡</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Constraints */}
                  {problem.constraints && Object.keys(problem.constraints).length > 0 && (
                    <div className="collapsible-section">
                      <button className="collapse-header" onClick={() => toggleSection('constraints')}>
                        <span className="collapse-icon">
                          {expandedSections.constraints ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                        <h4 className="subsection-title" style={{ margin: 0 }}>Scale & Constraints</h4>
                        <span className="requirement-count">{Object.keys(problem.constraints).length}</span>
                      </button>
                      {expandedSections.constraints && (
                        <div className="constraints-grid">
                          {Object.entries(problem.constraints).map(([key, value]) => (
                            <div key={key} className="constraint-card">
                              <span className="constraint-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="constraint-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expected Components */}
                  {problem.expectedComponents && problem.expectedComponents.length > 0 && (
                    <div className="collapsible-section">
                      <button className="collapse-header" onClick={() => toggleSection('components')}>
                        <span className="collapse-icon">
                          {expandedSections.components ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </span>
                        <h4 className="subsection-title" style={{ margin: 0 }}>Expected Components</h4>
                        <span className="requirement-count">{problem.expectedComponents.length}</span>
                      </button>
                      {expandedSections.components && (
                        <div className="components-list">
                          {problem.expectedComponents.map((comp, i) => (
                            <span key={i} className="component-tag">{comp}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {problem.topics && problem.topics.length > 0 && (
                    <div className="topics-section">
                      <h4 className="subsection-title">Topics</h4>
                      <div className="topics-list">
                        {problem.topics.map((t: string, i: number) => (
                          <span key={i} className="topic-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'solution' && (
                <div className="tab-content solution-tab-content">
                  <SignInGate feature="System Design Solutions" description="Sign in to unlock professional architecture solutions, trade-off analysis, and video walkthroughs.">
                    {loadingSolution && (
                    <div className="solution-loading">
                      <div className="solution-spinner" />
                      <p className="solution-loading-text">Loading solution...</p>
                    </div>
                  )}
                  {errorLoadingSolution && (
                    <div className="solution-error">Error loading solution. Please try again.</div>
                  )}
                  {solution && (
                    <div className="solution-content">

                      {/* Featured Video — Cinema Frame */}
                      {solution.videoId && (
                        <div className="solution-video-frame">
                          <YouTubePlayer videoId={solution.videoId} title={solution.title} />
                        </div>
                      )}

                      {/* Hints — Interactive Progressive Disclosure */}
                      {solution.hints && solution.hints.length > 0 && (
                        <div className="solution-card solution-card--amber">
                          <div className="solution-card__accent-bar solution-card__accent-bar--amber" />
                          <div className="solution-card__body">
                            <div className="solution-card__header">
                              <div className="solution-card__icon solution-card__icon--amber">
                                <Lightbulb size={18} />
                              </div>
                              <div>
                                <h3 className="solution-card__title">Hints & Nudges</h3>
                                <p className="solution-card__subtitle">Stuck? Reveal hints one by one.</p>
                              </div>
                            </div>

                            {revealedHints === 0 ? (
                              <button className="solution-hint-btn" onClick={revealNextHint}>
                                Show First Hint
                                <Lightbulb size={14} />
                              </button>
                            ) : (
                              <div className="solution-hints-list">
                                {solution.hints.slice(0, revealedHints).map((hint: string, i: number) => (
                                  <div key={i} className="solution-hint-item">
                                    <span className="solution-hint-number">{i + 1}</span>
                                    <p className="solution-hint-text">{hint}</p>
                                  </div>
                                ))}
                                {revealedHints < solution.hints.length && (
                                  <button className="solution-hint-more" onClick={revealNextHint}>
                                    Reveal Next Hint
                                    <span className="solution-hint-remaining">({solution.hints.length - revealedHints} remaining)</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Core Concepts — 2-column grid */}
                      <div className="solution-grid-2">
                        {/* Intuition Card */}
                        {solution.intuition && (
                          <div className="solution-card solution-card--indigo">
                            <div className="solution-card__glow solution-card__glow--indigo" />
                            <div className="solution-card__body">
                              <div className="solution-card__header">
                                <div className="solution-card__icon solution-card__icon--indigo">
                                  <Sparkles size={18} />
                                </div>
                                <h3 className="solution-card__title">Intuition</h3>
                              </div>
                              <div className="solution-bullet-list">
                                {(Array.isArray(solution.intuition) ? solution.intuition : [solution.intuition]).map((point: string, i: number) => (
                                  <div key={i} className="solution-bullet-item">
                                    <span className="solution-bullet-dot solution-bullet-dot--indigo" />
                                    <p>{point}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Key Insight Card */}
                        {solution.keyInsight && (
                          <div className="solution-card solution-card--spotlight">
                            <div className="solution-card__glow solution-card__glow--amber" />
                            <div className="solution-card__body solution-card__body--center">
                              <div className="solution-card__header">
                                <div className="solution-card__icon solution-card__icon--amber">
                                  <Lightbulb size={18} />
                                </div>
                                <h3 className="solution-card__title solution-card__title--amber">Key Insight</h3>
                              </div>
                              <blockquote className="solution-insight-quote">
                                <span className="solution-quote-mark">&ldquo;</span>
                                {solution.keyInsight}
                                <span className="solution-quote-mark">&rdquo;</span>
                              </blockquote>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Walkthrough — Timeline */}
                      {solution.walkthrough && solution.walkthrough.length > 0 && (
                        <div className="solution-card">
                          <div className="solution-card__body">
                            <div className="solution-card__header">
                              <div className="solution-card__icon solution-card__icon--slate">
                                <BookOpen size={18} />
                              </div>
                              <h3 className="solution-card__title">Step-by-Step Walkthrough</h3>
                            </div>
                            <div className="solution-timeline">
                              <div className="solution-timeline__line" />
                              {solution.walkthrough.map((point: string, i: number) => (
                                <div key={i} className="solution-timeline__step">
                                  <div className="solution-timeline__marker">{i + 1}</div>
                                  <div className="solution-timeline__content">
                                    <p>{point}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Deep Dive — 2-column grid */}
                      <div className="solution-grid-2">
                        {solution.mentalModel && (
                          <div className="solution-card">
                            <div className="solution-card__body">
                              <h3 className="solution-card__title solution-card__title--emoji">
                                <span className="solution-emoji-badge">🧠</span>
                                Mental Model
                              </h3>
                              <p className="solution-card__text">{solution.mentalModel}</p>
                            </div>
                          </div>
                        )}
                        {(solution as DesignSolution).expectedArchitectureSummary && (
                          <div className="solution-card">
                            <div className="solution-card__body">
                              <h3 className="solution-card__title solution-card__title--emoji">
                                <span className="solution-emoji-badge">🏗️</span>
                                Architecture
                              </h3>
                              <p className="solution-card__text">{(solution as DesignSolution).expectedArchitectureSummary}</p>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                  </SignInGate>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="tab-content ai-chat-container">
                  <SignInGate feature="AI Tutor" description="Sign in to chat with our AI expert, get personalized architecture reviews, and ask follow-up questions.">
                    <div className="ai-messages-list">
                    {messages.length === 0 ? (
                      <div className="ai-empty-state">
                        <div className="ai-empty-icon">
                          <Bot size={48} />
                        </div>
                        <h3>System Design Assistant</h3>
                        <p>Ask me anything about the architecture, trade-offs, or implementation details.</p>
                      </div>
                    ) : (
                      messages.map((m, i) => (
                        <div key={i} className={`ai-message-wrapper ${m.role === 'user' ? 'ai-message-wrapper--user' : 'ai-message-wrapper--ai'}`}>
                          {m.role === 'assistant' && (
                            <div className="ai-avatar ai-avatar--ai">
                              <Bot size={20} />
                            </div>
                          )}
                          <div className={`ai-message-bubble ${m.role === 'user' ? 'ai-message-bubble--user' : 'ai-message-bubble--ai'}`}>
                            <p>{m.content}</p>
                          </div>
                          {m.role === 'user' && (
                            <div className="ai-avatar ai-avatar--user">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {isAiThinking && (
                      <div className="ai-message-wrapper ai-message-wrapper--ai">
                        <div className="ai-avatar ai-avatar--ai">
                          <Bot size={20} />
                        </div>
                         <div className="ai-message-bubble ai-message-bubble--ai">
                            <div className="typing-indicator">
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                              <span className="typing-dot"></span>
                            </div>
                         </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="ai-input-area">
                    <div className="ai-input-box">
                      <input 
                        type="text" 
                        value={inputValue} 
                        onChange={e => setInputValue(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask a follow-up question..." 
                      />
                      <button 
                        className="ai-send-btn"
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <div className="ai-disclaimer">
                      AI can be inaccurate. Check important info.
                    </div>
                    </div>
                  </SignInGate>
                </div>
              )}
            </div>
          )}

          <div 
            className="resize-handle" 
            onMouseDown={startResizing}
          />

          <div className="right-pane" 
            style={{ 
              width: isSidebarVisible ? `${100 - leftWidth}%` : '100%' 
            }}
          >
            <div className="excalidraw-wrapper">
              <Excalidraw
                theme={excalidrawTheme}
                gridModeEnabled={true}
                objectsSnapModeEnabled={true}
                handleKeyboardGlobally={true}
                autoFocus={true}
                name={problem.title}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                onChange={handleCanvasChange}
                UIOptions={{
                  canvasActions: {
                    clearCanvas: true,
                    loadScene: true,
                    saveToActiveFile: true,
                    saveAsImage: true,
                    export: { saveFileToDisk: true },
                    toggleTheme: true,
                    changeViewBackgroundColor: true,
                  },
                  tools: {
                    image: true,
                  },
                }}
              >
                <WelcomeScreen>
                  <WelcomeScreen.Center>
                    <WelcomeScreen.Center.Heading>
                      Architecture Playground
                    </WelcomeScreen.Center.Heading>
                    <WelcomeScreen.Center.Menu>
                      <WelcomeScreen.Center.MenuItemLoadScene />
                      <WelcomeScreen.Center.MenuItemHelp />
                      <WelcomeScreen.Center.MenuItemLiveCollaborationTrigger 
                        onSelect={() => window.alert("Collaboration coming soon!")}
                      />
                    </WelcomeScreen.Center.Menu>
                  </WelcomeScreen.Center>
                </WelcomeScreen>
                <MainMenu>
                  <MainMenu.DefaultItems.LoadScene />
                  <MainMenu.DefaultItems.SaveToActiveFile />
                  <MainMenu.DefaultItems.Export />
                  <MainMenu.DefaultItems.SaveAsImage />
                  <MainMenu.DefaultItems.ClearCanvas />
                  <MainMenu.Separator />
                  <MainMenu.DefaultItems.ToggleTheme />
                  <MainMenu.DefaultItems.ChangeCanvasBackground />
                  <MainMenu.Separator />
                  <MainMenu.DefaultItems.Help />
                </MainMenu>
              </Excalidraw>
            </div>

            {/* Floating Analyse Button */}
            <button 
              className="analyze-design-btn"
              onClick={analyzeDesign}
              disabled={analysisLoading}
              title="Analyse your architecture drawing"
            >
              {analysisLoading ? (
                <Loader2 size={18} className="spin-icon" />
              ) : (
                <Sparkles size={18} />
              )}
              <span>{analysisLoading ? 'Analysing...' : 'Analyse My Design'}</span>
            </button>

            {/* Analysis Feedback Panel */}
            {showAnalysisPanel && (
              <div className="analysis-panel">
                <div className="analysis-panel-header">
                  <Sparkles size={16} />
                  <span>AI Architecture Feedback</span>
                  <button className="close-analysis-btn" onClick={() => setShowAnalysisPanel(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="analysis-panel-body">
                  {analysisLoading ? (
                    <div className="analysis-loading">
                      <Loader2 size={24} className="spin-icon" />
                      <p>Analyzing your architecture...</p>
                    </div>
                  ) : (
                    <p className="analysis-feedback-text">{analysisFeedback}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AuthUnlockModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setShowAuthModal(false);
          login();
        }}
        featureName={authFeatureName}
      />
    </div>
  );
};

export default SystemDesignPlayground;
