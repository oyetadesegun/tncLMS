import React from 'react';
import type { Jwell_trainings } from '../generated/models/Jwell_trainingsModel';

interface TrainingsViewProps {
  trainings: Jwell_trainings[];
}

export const TrainingsView: React.FC<TrainingsViewProps> = ({ trainings }) => {
  return (
    <div>
      <div className="section-header-bar">
        <div className="section-title-group">
          <h2>Scheduled Training Sessions & Cohorts</h2>
          <p>Collaborative instructor-led sessions, clinics, and review workshops</p>
        </div>
      </div>

      <div className="cards-grid">
        {trainings.map((tr) => {
          const dateStr = tr.jwell_sessiondate
            ? new Date(tr.jwell_sessiondate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'Scheduled Session';

          return (
            <div key={tr.jwell_trainingid} className="training-card">
              <span className="training-date-tag">
                <span>📅</span> {dateStr}
              </span>
              <h3 className="training-title">{tr.jwell_title}</h3>
              <p className="training-desc">{tr.jwell_description}</p>

              <button
                className="teams-btn"
                onClick={() => alert(`Launching session meeting: ${tr.jwell_teamsmeetingname || tr.jwell_title}`)}
              >
                <span>🎥</span> {tr.jwell_teamsmeetingname || 'Join Microsoft Teams Session'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
