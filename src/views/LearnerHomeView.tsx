import React, { useState, useEffect } from "react";
import { CoursesStore, type Course } from "../data/coursesStore";
import { lmsDataService } from "../services/lmsDataService";
import type { AuthUser } from "../context/AuthContext";

interface LearnerHomeViewProps {
  onNavigate: (path: string) => void;
  user?: AuthUser | null;
}

export const LearnerHomeView: React.FC<LearnerHomeViewProps> = ({ onNavigate, user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [certCount, setCertCount] = useState<number>(1);
  const [filter, setFilter] = useState<"all" | "urgent">("all");

  useEffect(() => {
    const unsub = CoursesStore.subscribe((c) => setCourses(c));
    lmsDataService.getCertificates(user?.email).then((certs) => {
      if (certs) setCertCount(certs.length);
    }).catch(() => {});
    return unsub;
  }, [user]);

  // Filter courses available to this user based on their subsidiary
  const userSubsidiary = user?.subsidiary || "Transcorp Group HQ";

  const availableCourses = courses.filter((c) => {
    if (c.audienceScope === "ALL") return true;
    return c.targetSubsidiary.toLowerCase().includes(
      userSubsidiary.toLowerCase().split(" ")[1] || userSubsidiary.toLowerCase()
    );
  });

  const filteredCourses = filter === "urgent" ? availableCourses.slice(0, 2) : availableCourses;

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="view-content-centered">
      {/* Top Greeting & Streak */}
      <section className="learner-hero-section">
        <div className="learner-greeting-row">
          <div>
            <h1 className="greeting-title">
              {greeting}, {firstName} <span className="wave-icon">👋</span>
            </h1>
            <p className="greeting-subtitle">
              <span className="material-symbols-outlined icon-small text-primary">bolt</span>
              <span>{user?.subsidiary || "Transcorp Group"}</span>
              {user?.department && <span>• {user.department}</span>}
            </p>
          </div>
          <div className="streak-pill">
            <span className="material-symbols-outlined text-amber">local_fire_department</span>
            <span className="streak-text">4 wk streak</span>
          </div>
        </div>

        {/* Level & XP Card */}
        <div className="xp-level-card">
          <div className="xp-card-glow" />
          <div className="xp-card-header">
            <div className="level-badge-row">
              <span className="level-chip">Level 3</span>
              <span className="role-title">Senior Field Specialist</span>
            </div>
            <div className="xp-counter">
              <span className="xp-number">1,420</span>
              <span className="xp-unit">XP</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="xp-progress-column">
            <div className="xp-progress-labels">
              <span>Progress to <strong>Level 4</strong></span>
              <span>680 / 800 XP <span className="text-primary font-bold">(85%)</span></span>
            </div>
            <div className="progress-track">
              <div className="progress-fill-gradient" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Nav Shortcuts */}
      <section className="shortcuts-grid">
        <button onClick={() => onNavigate("/quiz/intro")} className="shortcut-card">
          <div className="shortcut-icon-box bg-primary-fixed text-primary">
            <span className="material-symbols-outlined">play_arrow</span>
          </div>
          <div>
            <div className="shortcut-title">Start Quiz</div>
            <div className="shortcut-sub">Cybersecurity</div>
          </div>
        </button>

        <button onClick={() => onNavigate("/leaderboard/team")} className="shortcut-card">
          <div className="shortcut-icon-box bg-secondary-fixed text-secondary">
            <span className="material-symbols-outlined">leaderboard</span>
          </div>
          <div>
            <div className="shortcut-title">Rankings</div>
            <div className="shortcut-sub">Top 5 Team</div>
          </div>
        </button>

        <button onClick={() => onNavigate("/certificates")} className="shortcut-card">
          <div className="shortcut-icon-box bg-tertiary-fixed text-tertiary">
            <span className="material-symbols-outlined">workspace_premium</span>
          </div>
          <div>
            <div className="shortcut-title">Certificates</div>
            <div className="shortcut-sub">{certCount} Accredited</div>
          </div>
        </button>

        <button onClick={() => onNavigate("/profile")} className="shortcut-card">
          <div className="shortcut-icon-box bg-surface-high text-on-surface">
            <span className="material-symbols-outlined">account_circle</span>
          </div>
          <div>
            <div className="shortcut-title">Profile</div>
            <div className="shortcut-sub">{user?.fullName || "My Profile"}</div>
          </div>
        </button>

        {/* Admin shortcut — only for admins */}
        {user?.isAdmin && (
          <button onClick={() => onNavigate("/admin")} className="shortcut-card">
            <div className="shortcut-icon-box" style={{ background: "rgba(251,191,36,0.12)", color: "var(--color-amber)" }}>
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <div>
              <div className="shortcut-title">Admin Hub</div>
              <div className="shortcut-sub">{user.role}</div>
            </div>
          </button>
        )}
      </section>

      {/* Section: Assigned Courses & Assessments */}
      <section className="todo-section">
        <div className="section-title-row">
          <div className="flex-center-gap">
            <h2 className="section-heading">Assigned Courses & Assessments</h2>
            <span className="pending-counter-chip">{availableCourses.length} active</span>
          </div>
          <button
            onClick={() => setFilter(filter === "all" ? "urgent" : "all")}
            className={`filter-toggle-btn ${filter === "urgent" ? "active-urgent" : ""}`}
          >
            <span className="material-symbols-outlined icon-small">tune</span>
            <span>{filter === "urgent" ? "Urgent Only" : "Filter All"}</span>
          </button>
        </div>

        <div className="quizzes-card-stack">
          {filteredCourses.map((course) => {
            const isGroupwide = course.audienceScope === "ALL";

            return (
              <div key={course.id} className="learner-quiz-item">
                <div className="quiz-item-header">
                  <div className="quiz-meta-col">
                    <div className="flex-center-gap" style={{ flexWrap: "wrap", marginBottom: "0.25rem" }}>
                      <span className="course-code-chip">{course.courseCode}</span>
                      <span className="category-chip">{course.category}</span>
                      {isGroupwide ? (
                        <span className="trainer-status-badge">
                          <span className="material-symbols-outlined icon-tiny">public</span>
                          <span>ALL Transcorp Group</span>
                        </span>
                      ) : (
                        <span className="trainer-status-badge" style={{ background: "rgba(185, 28, 28, 0.1)", color: "#b91c1c" }}>
                          <span className="material-symbols-outlined icon-tiny">domain</span>
                          <span>{course.targetSubsidiary}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="quiz-title-main">{course.title}</h3>

                    {/* Assigned Trainer Attribution */}
                    <div className="flex-center-gap" style={{ marginTop: "0.35rem", fontSize: "0.78rem" }}>
                      <div className="trainer-avatar-bubble small">{course.trainer.avatar}</div>
                      <span className="text-secondary">
                        Facilitated by <strong>{course.trainer.fullName}</strong> ({course.trainer.subsidiary})
                      </span>
                    </div>
                  </div>

                  <span className="due-badge badge-tertiary">
                    <span className="material-symbols-outlined icon-tiny">schedule</span>
                    <span>Active Session</span>
                  </span>
                </div>

                <div className="quiz-item-footer">
                  <div className="quiz-specs">
                    <span className="spec-item">
                      <span className="material-symbols-outlined icon-small">timer</span>
                      <span>{course.durationMinutes} mins</span>
                    </span>
                    <span className="spec-divider">•</span>
                    <span className="spec-item">
                      <span className="material-symbols-outlined icon-small">verified</span>
                      <span>Pass Mark: {course.passMark}%</span>
                    </span>
                    <span className="spec-divider">•</span>
                    <span className="spec-item text-secondary">
                      <span>{isGroupwide ? "Broadcast to 451 Learners" : `Targeted for ${userSubsidiary}`}</span>
                    </span>
                  </div>

                  <button onClick={() => onNavigate("/quiz/intro")} className="btn-take-quiz">
                    <span>Take Course Quiz</span>
                    <span className="material-symbols-outlined icon-small">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
