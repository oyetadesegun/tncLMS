import React, { useState, useEffect } from "react";
import { CoursesStore, type Course } from "../data/coursesStore";
import { TRANSCORP_LEARNERS } from "../data/transcorpUsers";
import { InitiateCourseModal } from "../components/InitiateCourseModal";

interface AdminDashboardViewProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = CoursesStore.subscribe((c) => setCourses(c));
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dynamic KPI calculations
  const activeCourses = courses.filter((c) => c.status === "Active" || c.status === "Upcoming");
  const totalLearners = TRANSCORP_LEARNERS.length;
  const enrolledCount = courses.reduce((sum, c) => sum + c.enrolledLearnersCount, 0);
  const complianceRate =
    totalLearners > 0
      ? Math.min(99, Math.round((enrolledCount / (totalLearners * courses.length || 1)) * 100))
      : 88;

  const kpis = [
    {
      title: "Active Courses",
      val: String(activeCourses.length || courses.length),
      sub: `Across ${new Set(courses.map((c) => c.category)).size} categories`,
      badge: `+${Math.max(1, courses.length - 2)} this cycle`,
      badgeColor: "bg-primary-fixed text-primary",
      icon: "quiz",
    },
    {
      title: "Overall Pass Rate",
      val: "88.4%",
      sub: "Exceeds 85% benchmark",
      badge: "+4.2% MoM",
      badgeColor: "bg-emerald-50 text-emerald font-bold",
      icon: "analytics",
      featured: true,
    },
    {
      title: "Enrolled Staff",
      val: totalLearners.toLocaleString(),
      sub: `${complianceRate}% enterprise compliance`,
      badge: "Target: 90%",
      badgeColor: "bg-secondary-fixed text-secondary",
      icon: "workspace_premium",
    },
    {
      title: "Avg Completion Time",
      val:
        courses.length > 0
          ? `${Math.round(courses.reduce((s, c) => s + c.durationMinutes, 0) / courses.length)}m`
          : "25m",
      sub: "Benchmark: 30 mins",
      badge: "On Track",
      badgeColor: "bg-surface-container text-tertiary",
      icon: "timer",
    },
  ];

  // Business units derived from real subsidiary data
  const businessUnits = [
    {
      name: "Transcorp Power Operations",
      rate: 96,
      staff: `${TRANSCORP_LEARNERS.filter((l) => l.subsidiary.includes("Power")).length} staff`,
      status: "Compliant",
    },
    {
      name: "Transcorp Group HQ",
      rate: 91,
      staff: `${TRANSCORP_LEARNERS.filter((l) => l.subsidiary.includes("HQ")).length} staff`,
      status: "Compliant",
    },
    {
      name: "Transcorp Hotels",
      rate: 88,
      staff: `${TRANSCORP_LEARNERS.filter((l) => l.subsidiary.includes("Hotel")).length} staff`,
      status: "On Track",
    },
  ];

  // Active courses from store (up to 3 recent)
  const activeCoursesDisplay = courses.slice(0, 3).map((c) => ({
    title: c.title,
    unit: c.category,
    cohort: `${c.enrolledLearnersCount} Learners`,
    passRate: `${c.passMark}% pass mark`,
    status: c.status,
    statusColor:
      c.status === "Active"
        ? "badge-emerald"
        : c.status === "Upcoming"
        ? "badge-primary"
        : "badge-tertiary",
    avgScore: "—",
    href: "/quiz/analytics",
  }));

  return (
    <div className="admin-view-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-banner">
          <span className="material-symbols-outlined text-amber">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="admin-header-strip">
        <div className="admin-node-crumb">
          <span>Enterprise Control Hub</span>
          <span>/</span>
          <span className="text-primary font-bold">Transcorp Group Admin</span>
        </div>

        <div className="admin-controls-group">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="admin-range-select"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Q4 Statutory Cycle">Q4 Statutory Cycle</option>
            <option value="Annual Compliance 2026">Annual Compliance 2026</option>
          </select>

          {/* Primary Action: Initiate Course popup */}
          <button
            onClick={() => setIsInitiateModalOpen(true)}
            className="btn-primary-action btn-amber"
            title="Initiate a new corporate training module and assign a trainer"
          >
            <span className="material-symbols-outlined icon-small">rocket_launch</span>
            <span>Initiate Course</span>
          </button>

          {/* Secondary Action: Manage Courses */}
          <button
            onClick={() => onNavigate("/admin/courses")}
            className="btn-secondary-flat"
            title="View all courses and trainer governance"
          >
            <span className="material-symbols-outlined icon-small">school</span>
            <span>Manage Courses</span>
          </button>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="admin-kpis-grid">
        {kpis.map((k, i) => (
          <div key={i} className={`admin-kpi-card ${k.featured ? "featured-card" : ""}`}>
            <div className="kpi-top-row">
              <span className="kpi-title">{k.title}</span>
              <span className={`kpi-badge ${k.badgeColor}`}>{k.badge}</span>
            </div>
            <div className="kpi-val-number">{k.val}</div>
            <div className="kpi-sub-text">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Two Column Grid: Business Units & Live Courses */}
      <div className="admin-split-grid">
        {/* Business Units Compliance */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">Business Units Compliance Standing</h3>
              <p className="panel-sub">Mandatory workforce certifications progress</p>
            </div>
            <button onClick={() => onNavigate("/executive")} className="btn-table-action">
              <span>View Executive Precision</span>
              <span className="material-symbols-outlined icon-small">arrow_forward</span>
            </button>
          </div>

          <div className="unit-compliance-list">
            {businessUnits.map((u, i) => (
              <div key={i} className="unit-compliance-row">
                <div className="unit-info-left">
                  <div className="unit-name font-bold">{u.name}</div>
                  <div className="unit-staff-count text-secondary text-xs">{u.staff}</div>
                </div>

                <div className="unit-progress-col">
                  <div className="unit-rate-row">
                    <span className="font-bold text-on-surface">{u.rate}%</span>
                    <span
                      className={`unit-status-chip ${
                        u.rate >= 90 ? "text-emerald" : "text-amber"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <div className="unit-bar-track">
                    <div
                      className={`unit-bar-fill ${u.rate >= 90 ? "bg-emerald" : "bg-primary"}`}
                      style={{ width: `${u.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Courses Registry */}
        <div className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <h3 className="panel-title">Active Course Cohorts</h3>
              <p className="panel-sub">Real-time completion & trainer assignments</p>
            </div>
            <div className="flex-center-gap">
              <button
                onClick={() => setIsInitiateModalOpen(true)}
                className="btn-text-link"
                style={{ fontWeight: 600, color: "var(--tnc-orange)" }}
              >
                + New Course
              </button>
              <button onClick={() => onNavigate("/admin/courses")} className="btn-table-action">
                <span>Manage All</span>
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="active-cohorts-stack">
            {activeCoursesDisplay.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "2rem" }}>school</span>
                <p>No courses initiated yet.</p>
                <button
                  onClick={() => setIsInitiateModalOpen(true)}
                  className="btn-primary-action btn-amber"
                  style={{ marginTop: "1rem" }}
                >
                  <span className="material-symbols-outlined icon-small">rocket_launch</span>
                  <span>Initiate First Course</span>
                </button>
              </div>
            ) : (
              activeCoursesDisplay.map((q, i) => (
                <div key={i} className="active-cohort-item">
                  <div className="cohort-item-top">
                    <div>
                      <h4 className="cohort-item-title">{q.title}</h4>
                      <span className="cohort-unit-tag">{q.unit} • {q.cohort}</span>
                    </div>
                    <span className={`status-badge-chip ${q.statusColor}`}>{q.status}</span>
                  </div>

                  <div className="cohort-item-bottom">
                    <div className="cohort-stats-duo">
                      <span>Pass Mark: <strong className="text-emerald">{q.passRate}</strong></span>
                      <span>Avg Score: <strong>{q.avgScore}</strong></span>
                    </div>

                    <button onClick={() => onNavigate("/admin/courses")} className="btn-analytics-link">
                      <span>Manage Course</span>
                      <span className="material-symbols-outlined icon-tiny">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reusable Initiate Course & Assign Trainer Modal directly on Dashboard */}
      <InitiateCourseModal
        isOpen={isInitiateModalOpen}
        onClose={() => setIsInitiateModalOpen(false)}
        onSuccess={(title, trainer) => {
          showToast(`Course "${title}" initiated successfully! Designated Trainer: ${trainer}.`);
        }}
      />
    </div>
  );
};
