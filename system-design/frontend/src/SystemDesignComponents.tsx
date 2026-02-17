import { Clock } from 'lucide-react';

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: string;
  videoId?: string;
  category: string;
  topics: string[];
  functionalRequirements?: string[];
  nonFunctionalRequirements?: string[];
  constraints?: Record<string, string>;
  expectedComponents?: string[];
  source?: string;
}

export const YouTubePlayer = ({ videoId, title, className }: { videoId: string, title: string, className?: string }) => (
  <div className={`relative w-full aspect-video ${className || ''}`}>
    <iframe
      className="absolute top-0 left-0 w-full h-full rounded-2xl"
      src={`https://www.youtube.com/embed/${videoId}?autoplay=0&modestbranding=1&rel=0`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
);

export const ProblemCard = ({ 
  problem, 
  idx, 
  onVideoClick 
}: { 
  problem: Problem, 
  idx: number, 
  onVideoClick: (id: string, title: string) => void 
}) => (
  <div 
    className="problem-card slide-up"
    style={{ animationDelay: `${idx * 0.1}s` }}
  >
    <div className="card-header">
      <span className={`difficulty-badge difficulty-${problem.difficulty}`}>
        {problem.difficulty}
      </span>
      <div className="time-est">
        <Clock size={14} />
        <span>45-60 min</span>
      </div>
    </div>
    
    <h3 className="problem-title">{problem.title}</h3>
    <p className="problem-desc">{problem.description}</p>
    
    <div className="tag-list">
      {problem.topics?.map(tag => (
        <span key={tag} className="tag">{tag}</span>
      ))}
    </div>

    {problem.videoId ? (
      <div className="video-preview" onClick={() => onVideoClick(problem.videoId!, problem.title)}>
        <div className="play-button-overlay">
          <div className="play-button-glass">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
        <img 
          src={`https://img.youtube.com/vi/${problem.videoId}/mqdefault.jpg`} 
          alt={problem.title} 
          className="thumbnail"
        />
      </div>
    ) : (
      <div className="video-placeholder-container">
        <div className="video-placeholder">
          <span>Solution Pending</span>
        </div>
      </div>
    )}
  </div>
);

export const AddProblemModal = ({ 
  show, 
  onClose, 
  newProblem, 
  setNewProblem, 
  onAdd, 
  topics 
}: { 
  show: boolean, 
  onClose: () => void, 
  newProblem: Partial<Problem>, 
  setNewProblem: (p: Partial<Problem>) => void, 
  onAdd: (e: React.FormEvent) => void,
  topics: Topic[]
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Add System Design Case</h2>
        <form onSubmit={onAdd}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={newProblem.title} 
              onChange={e => setNewProblem({...newProblem, title: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Slug (URL name)</label>
            <input 
              type="text" 
              value={newProblem.slug} 
              onChange={e => setNewProblem({...newProblem, slug: e.target.value})} 
              required 
              placeholder="e.g. design-uber" 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={newProblem.description} 
              onChange={e => setNewProblem({...newProblem, description: e.target.value})} 
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Difficulty</label>
              <select 
                value={newProblem.difficulty} 
                onChange={e => setNewProblem({...newProblem, difficulty: e.target.value})}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                value={newProblem.category} 
                onChange={e => setNewProblem({...newProblem, category: e.target.value})}
              >
                {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Topics (comma separated)</label>
            <input 
              type="text" 
              placeholder="Distributed Systems, Caching..." 
              onChange={e => setNewProblem({...newProblem, topics: e.target.value.split(',').map(s => s.trim())})} 
            />
          </div>
          <button type="submit" className="submit-btn">Save Architecture</button>
        </form>
      </div>
    </div>
  );
};
