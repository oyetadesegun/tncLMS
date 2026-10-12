import React, { useState } from 'react';
import type { Jwell_quizs } from '../generated/models/Jwell_quizsModel';

interface QuizzesViewProps {
  quizzes: Jwell_quizs[];
  onStartQuiz: (quiz: Jwell_quizs) => void;
}

export const QuizzesView: React.FC<QuizzesViewProps> = ({ quizzes, onStartQuiz }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = 
      (quiz.jwell_title || '').toLowerCase().includes(search.toLowerCase()) ||
      (quiz.jwell_description || '').toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'published') {
      return matchesSearch && quiz.jwell_status === 911120003;
    }
    if (statusFilter === 'review') {
      return matchesSearch && quiz.jwell_status === 911120001;
    }
    if (statusFilter === 'draft') {
      return matchesSearch && quiz.jwell_status === 911120000;
    }
    return matchesSearch;
  });

  return (
    <div>
      <div className="section-header-bar">
        <div className="section-title-group">
          <h2>Technical Quizzes & Assessments</h2>
          <p>Browse available knowledge checks, exams, and certifications</p>
        </div>

        <div className="filter-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search assessments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses ({quizzes.length})</option>
            <option value="published">Published Only</option>
            <option value="review">In Review</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {filteredQuizzes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No assessments found matching your filter criteria.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredQuizzes.map((quiz) => {
            const isPublished = quiz.jwell_status === 911120003 || !quiz.jwell_status;
            return (
              <div key={quiz.jwell_quizid} className="assessment-card">
                <div className="card-top">
                  <span className={`badge-status ${isPublished ? 'status-published' : 'status-review'}`}>
                    {quiz.jwell_statusname || (isPublished ? 'Published' : 'Under Review')}
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
                    <span className="value">{quiz.jwell_timelimitminutes || 25}m</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Pool</span>
                    <span className="value">{quiz.jwell_questionsperattempt || 5} Qs</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Policy: {quiz.jwell_retakepolicyname || 'Standard'}
                  </span>
                  <button className="btn-primary" onClick={() => onStartQuiz(quiz)}>
                    Start Assessment &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
