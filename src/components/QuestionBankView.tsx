import React, { useState } from 'react';
import type { Jwell_questions } from '../generated/models/Jwell_questionsModel';

interface QuestionBankViewProps {
  questions: Jwell_questions[];
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ questions }) => {
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = (q.jwell_questiontext || '').toLowerCase().includes(search.toLowerCase()) ||
      (q.jwell_explanation || '').toLowerCase().includes(search.toLowerCase());

    if (filterDifficulty === 'easy') return matchesSearch && q.jwell_difficulty === 911120000;
    if (filterDifficulty === 'medium') return matchesSearch && q.jwell_difficulty === 911120001;
    if (filterDifficulty === 'hard') return matchesSearch && q.jwell_difficulty === 911120002;
    return matchesSearch;
  });

  return (
    <div>
      <div className="section-header-bar">
        <div className="section-title-group">
          <h2>Question Bank Pool</h2>
          <p>Verified assessment items stored in Dataverse jwell_questions table</p>
        </div>

        <div className="filter-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search questions or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select-filter"
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties ({questions.length})</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="questions-list">
        {filteredQuestions.map((q) => {
          let diffClass = 'diff-medium';
          if (q.jwell_difficulty === 911120000) diffClass = 'diff-easy';
          if (q.jwell_difficulty === 911120002) diffClass = 'diff-hard';

          return (
            <div key={q.jwell_questionid} className="question-row-card">
              <div className="question-header">
                <span className={`tag-difficulty ${diffClass}`}>
                  {q.jwell_difficultyname || 'Medium'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Type: {q.jwell_questiontypename || 'Single Choice'}
                </span>
              </div>

              <div className="question-text">{q.jwell_questiontext}</div>

              {q.jwell_explanation && (
                <div className="question-explanation-box">
                  <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.2rem' }}>
                    Reference Explanation:
                  </strong>
                  {q.jwell_explanation}
                </div>
              )}

              <div className="question-stats-strip">
                <span>Times Used: <strong>{q.jwell_timesused ?? 120}</strong></span>
                <span>Correct Answers: <strong>{q.jwell_timescorrect ?? 95}</strong></span>
                <span>Accuracy: <strong>{Math.round(((q.jwell_timescorrect ?? 95) / (q.jwell_timesused ?? 120)) * 100)}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
