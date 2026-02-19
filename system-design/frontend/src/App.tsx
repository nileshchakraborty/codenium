import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SystemDesign.css';
import type { Topic, Problem } from './SystemDesignComponents';
import {
  YouTubePlayer,
  ProblemCard,
  AddProblemModal
} from './SystemDesignComponents';
import SystemDesignPlayground from './SystemDesignPlayground';
import { SharedHeader } from '@shared/components/SharedHeader';
import { ThemeToggle } from '../../../frontend/src/components/ThemeToggle';
import { LoginButton } from '../../../frontend/src/components/LoginButton';

import { Search, Grid, Layout, Cpu, Database, Network, Shield, Settings, Layers, BookOpen, Plus } from 'lucide-react';

const getTopicIcon = (id: string) => {
  switch(id) {
    case 'all': return <Grid size={16} />;
    case 'foundations': return <Layers size={16} />;
    case 'storage': return <Database size={16} />;
    case 'distributed-systems': return <Network size={16} />;
    case 'system-design-case-studies': return <BookOpen size={16} />;
    case 'frontend-architecture': return <Layout size={16} />;
    case 'backend-infra': return <Cpu size={16} />;
    case 'security': return <Shield size={16} />;
    default: return <Settings size={16} />;
  }
};

const SystemDesignApp = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<{id: string, title: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [newProblem, setNewProblem] = useState<Partial<Problem>>({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Medium',
    category: 'foundations',
    topics: []
  });

  const navigate = useNavigate();

  // Navigation handler
  const handleNavigate = (route: '/' | '/system-design') => {
    if (route === '/') {
      // Navigate to main app
      navigate('/');
    }
    // If route is /system-design, we're already here
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, problemsRes] = await Promise.all([
          fetch('/api/system-design/topics'),
          fetch('/api/system-design/problems')
        ]);
        const topicsData = await topicsRes.json();
        const problemsData = await problemsRes.json();
        setTopics(topicsData.topics);
        setProblems(problemsData.problems);
      } catch (error) {
        console.error('Error fetching system design data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblem.title || !newProblem.slug) return;

    try {
      const res = await fetch('/api/system-design/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: newProblem })
      });
      if (res.ok) {
        setShowAddModal(false);
        // Refresh data
        const problemsRes = await fetch('/api/system-design/problems');
        const problemsData = await problemsRes.json();
        setProblems(problemsData.problems);
        setNewProblem({
          title: '',
          slug: '',
          description: '',
          difficulty: 'Medium',
          category: 'foundations',
          topics: []
        });
      }
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  };

  const filteredProblems = problems?.filter(p => {
    const matchesTopic = activeTopic === 'all' ||
      p.category?.toLowerCase() === activeTopic.toLowerCase() ||
      p.topics?.some(t => t.toLowerCase() === activeTopic.toLowerCase());

    const matchesSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTopic && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="system-design-module min-h-screen bg-slate-950 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Initializing Systems...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProblem) {
    return (
      <div className="system-design-module min-h-screen bg-slate-950 flex flex-col">
        <div className="flex-1">
          <SystemDesignPlayground 
            problem={selectedProblem} 
            onBack={() => setSelectedProblem(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="system-design-module min-h-screen bg-slate-950 flex flex-col">
      <div className="aurora-container"></div>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <SharedHeader 
          currentRoute="system-design"
          onNavigate={handleNavigate}
          ThemeToggleComponent={ThemeToggle}
          LoginButtonComponent={LoginButton}
          // TODO: Add stats once System Design tracks progress
        />
      </div>
      <div className="app-container fade-in flex-1">
        <div className="dashboard-grid">
          <aside className="sidebar slide-right">
            <h3 className="section-title">Knowledge Domains</h3>
            <div 
              className={`topic-item ${activeTopic === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTopic('all')}
            >
              <div className="topic-icon">{getTopicIcon('all')}</div>
              All Architectures
            </div>
            {topics.map(topic => (
              <div 
                key={topic.id} 
                className={`topic-item ${activeTopic === topic.id ? 'active' : ''}`}
                onClick={() => setActiveTopic(topic.id)}
              >
                <div className="topic-icon">{getTopicIcon(topic.id)}</div>
                {topic.title}
              </div>
            ))}
            
            <button className="add-case-btn" onClick={() => setShowAddModal(true)}>
               <Plus size={16} /> Add Case
            </button>
            
            <div className="sidebar-footer">
              <p>© 2026 Codenium</p>
            </div>
          </aside>

          <main className="problems-grid">
            <header className="hero-section text-center">
              <div className="glow glow-1"></div>
              <div className="glow glow-2"></div>
              <div className="glow glow-3"></div>
              
              <div className="badge-new">ARCHITECTURE MASTERY</div>
              <h1 className="gradient-text mx-auto">System Design <br/>Playground</h1>
              <p className="subtitle mx-auto">Master high-level architectural patterns, distributed systems, and modern infrastructure analysis through interactive visual tools.</p>
              
              <div className="search-container">
                <Search className="search-icon-absolute" size={20} />
                <input 
                  type="text" 
                  placeholder="Search architectures, systems, or concepts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </header>

            {filteredProblems.map((problem, idx) => (
              <div 
                key={problem.id} 
                onClick={() => setSelectedProblem(problem)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedProblem(problem);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Open ${problem.title} playground`}
              >
                <ProblemCard 
                  problem={problem} 
                  idx={idx} 
                  onVideoClick={(id, title) => setSelectedVideo({id, title})} 
                />
              </div>
            ))}
          </main>
        </div>

        {selectedVideo && (
          <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedVideo(null)}>&times;</button>
              <h2 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.5rem' }}>{selectedVideo.title}</h2>
              <YouTubePlayer videoId={selectedVideo.id} title={selectedVideo.title} />
            </div>
          </div>
        )}

        <AddProblemModal 
          show={showAddModal} 
          onClose={() => setShowAddModal(false)}
          newProblem={newProblem}
          setNewProblem={setNewProblem}
          onAdd={handleAddProblem}
          topics={topics}
        />
      </div>
    </div>
  );
};

export default SystemDesignApp;
