import React from 'react';
import type { Jwell_quizs } from '../generated/models/Jwell_quizsModel';
import type { Jwell_certificates } from '../generated/models/Jwell_certificatesModel';
import type { Jwell_badges } from '../generated/models/Jwell_badgesModel';
import type { Jwell_trainings } from '../generated/models/Jwell_trainingsModel';
import type { Jwell_attempts } from '../generated/models/Jwell_attemptsModel';

interface DashboardViewProps {
  quizzes: Jwell_quizs[];
  certificates: Jwell_certificates[];
  badges: Jwell_badges[];
  trainings: Jwell_trainings[];
  attempts: Jwell_attempts[];
  questionsCount: number;
  onNavigateTab: (tab: string) => void;
  onStartQuiz: (quiz: Jwell_quizs) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  quizzes,
  certificates,
  badges,
  trainings,
  attempts,
  questionsCount,
  onNavigateTab,
  onStartQuiz
}) => {
  const publishedQuizzes = quizzes.filter(q => q.jwell_status === 911120003 || !q.jwell_status);

  return (
    <div>
      {/* Hero Welcome */}
      <div className="hero-card">
        <div className="hero-content">
          <div className="hero-pill">
            <span>✨</span> Dataverse-Integrated Assessment Platform
          </div>
          <h2 className="hero-title">Validate Skills, Earn Badges & Track Milestones</h2>
          <p className="hero-description">
            Welcome to the <strong>Learning Assessment Hub</strong>. Explore specialized technical quizzes,
            evaluate your readiness against industry benchmarks, earn accredited credentials, and participate
            in interactive knowledge evaluations backed by Dataverse.
          </p>
          <div className="hero-actions">
            <button 
              className="btn-primary"
              onClick={() => {
                if (publishedQuizzes.length > 0) {
                  onStartQuiz(publishedQuizzes[0]);
                } else {
                  onNavigateTab('quizzes');
                }
              }}
            >
              <span>🚀</span> Start Featured Assessment
            </button>
            <button className="btn-secondary" onClick={() => onNavigateTab('quizzes')}>
              Browse All Assessments ({quizzes.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => onNavigateTab('quizzes')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Active Quizzes</span>
            <span className="stat-value">{quizzes.length}</span>
            <span className="stat-subtext">{publishedQuizzes.length} ready to take</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigateTab('questions')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-cyan">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Question Bank</span>
            <span className="stat-value">{questionsCount}</span>
            <span className="stat-subtext">Verified assessment items</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigateTab('certificates')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Certificates Issued</span>
            <span className="stat-value">{certificates.length}</span>
            <span className="stat-subtext">Verified credentials</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigateTab('certificates')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Digital Badges</span>
            <span className="stat-value">{badges.length}</span>
            <span className="stat-subtext">Milestone awards</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => onNavigateTab('trainings')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon-wrapper stat-icon-emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-label">Live Trainings</span>
            <span className="stat-value">{trainings.length}</span>
            <span className="stat-subtext">Upcoming cohorts</span>
          </div>
        </div>
      </div>

      {/* Featured Assessments Section */}
      <div className="section-header-bar">
        <div className="section-title-group">
          <h2>Featured Quizzes & Assessments</h2>
          <p>Take an assessment to test your mastery and earn verifiable certificates</p>
        </div>
        <button className="btn-secondary" onClick={() => onNavigateTab('quizzes')}>
          View All Quizzes &rarr;
        </button>
      </div>

      <div className="cards-grid">
        {quizzes.slice(0, 3).map((quiz) => (
          <div key={quiz.jwell_quizid} className="assessment-card">
            <div className="card-top">
              <span className={`badge-status ${quiz.jwell_status === 911120003 ? 'status-published' : 'status-review'}`}>
                {quiz.jwell_statusname || 'Active'}
              </span>
              {quiz.jwell_certificateenabled && (
                <span className="cert-available-tag">
                  <span>🎖️</span> Certificate
                </span>
              )}
            </div>

            <h3 className="assessment-title">{quiz.jwell_title}</h3>
            <p className="assessment-desc">{quiz.jwell_description}</p>

            <div className="assessment-details-row">
              <div className="detail-item">
                <span className="label">Pass Mark</span>
                <span className="value">{quiz.jwell_passmarkpercent || 75}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Time</span>
                <span className="value">{quiz.jwell_timelimitminutes || 20}m</span>
              </div>
              <div className="detail-item">
                <span className="label">Questions</span>
                <span className="value">{quiz.jwell_questionsperattempt || 5}</span>
              </div>
            </div>

            <div className="card-footer">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {quiz.jwell_retakepolicyname || 'Available now'}
              </span>
              <button className="btn-primary" onClick={() => onStartQuiz(quiz)}>
                Take Assessment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Attempts Strip */}
      {attempts.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div className="section-header-bar">
            <div className="section-title-group">
              <h2>Recent Attempt History</h2>
              <p>Your recorded evaluation runs in Dataverse</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {attempts.map((att) => (
              <div key={att.jwell_attemptid} className="question-row-card" style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
                    {att.jwell_attemptname || 'Evaluation Attempt'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                    Recorded
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
