import React, { useState, useEffect } from "react";
import { TRANSCORP_LEARNERS, type TranscorpLearner } from "../data/transcorpUsers";
import { CoursesStore, type Course } from "../data/coursesStore";

interface AdminPeopleViewProps {
  onNavigate: (path: string) => void;
}

export const AdminPeopleView: React.FC<AdminPeopleViewProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "TRAINER" | "LEARNER">("ALL");

  // Assign trainer modal
  const [assigningLearner, setAssigningLearner] = useState<TranscorpLearner | null>(null);
  const [targetCourseId, setTargetCourseId] = useState<string>("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = CoursesStore.subscribe((c) => setCourses(c));
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Build a lookup of which learners are currently trainers
  const trainerCourseMap = new Map<string, Course[]>();
  courses.forEach((c) => {
    const existing = trainerCourseMap.get(c.trainer.id) || [];
    existing.push(c);
    trainerCourseMap.set(c.trainer.id, existing);
  });

  const filteredStaff = TRANSCORP_LEARNERS.filter((s) => {
    const matchesSearch =
      !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());

    const matchesSub =
      selectedSubsidiary === "ALL" ||
      s.subsidiary.toLowerCase().includes(selectedSubsidiary.toLowerCase());

    const isTrainer = trainerCourseMap.has(s.id);
    const matchesRole =
      roleFilter === "ALL" ||
      (roleFilter === "TRAINER" && isTrainer) ||
      (roleFilter === "LEARNER" && !isTrainer);

    return matchesSearch && matchesSub && matchesRole;
  });

  const handleConfirmAssignTrainer = async () => {
    if (!assigningLearner || !targetCourseId) return;
    await CoursesStore.reassignTrainer(targetCourseId, assigningLearner);
    const targetCourse = courses.find((c) => c.id === targetCourseId);
    showToast(`Elevated ${assigningLearner.fullName} to Lead Trainer for ${targetCourse?.courseCode || "course"}!`);
    setAssigningLearner(null);
    setTargetCourseId("");
  };

  return (
    <div className="admin-view-content">
      {toastMsg && (
        <div className="admin-toast-banner">
          <span className="material-symbols-outlined text-amber">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">People & Roles</span>
          </div>
          <h1 className="page-main-heading">Workforce Directory & Trainer Delegation</h1>
          <p className="page-sub-heading">
            All 451 Transcorp Group employees are Learners by default. HR can elevate any Learner to become a certified Course Trainer.
          </p>
        </div>

        <button onClick={() => onNavigate("/admin/courses")} className="btn-primary-action">
          <span className="material-symbols-outlined icon-small">school</span>
          <span>Manage Courses & Trainers</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="kpi-quad-grid">
        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Workforce</span>
            <span className="material-symbols-outlined kpi-icon text-amber">groups</span>
          </div>
          <div className="kpi-big-number">{TRANSCORP_LEARNERS.length}</div>
          <div className="kpi-trend text-secondary">Registered Learners in Dataverse</div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Elevated Course Trainers</span>
            <span className="material-symbols-outlined kpi-icon text-amber">record_voice_over</span>
          </div>
          <div className="kpi-big-number">{trainerCourseMap.size}</div>
          <div className="kpi-trend text-secondary">Assigned from workforce</div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Active Learners</span>
            <span className="material-symbols-outlined kpi-icon text-amber">school</span>
          </div>
          <div className="kpi-big-number">{TRANSCORP_LEARNERS.length - trainerCourseMap.size}</div>
          <div className="kpi-trend text-secondary">Taking statutory courses</div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Subsidiaries Covered</span>
            <span className="material-symbols-outlined kpi-icon text-amber">apartment</span>
          </div>
          <div className="kpi-big-number">3 Entities</div>
          <div className="kpi-trend text-secondary">Power, Hotels & Corporate HQ</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="catalog-filters-bar">
        <div className="search-field-wrapper flex-1">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search employee by name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="directory-search-input"
          />
        </div>

        <div className="filter-select-wrapper">
          <label className="filter-select-label">Subsidiary:</label>
          <select
            value={selectedSubsidiary}
            onChange={(e) => setSelectedSubsidiary(e.target.value)}
            className="filter-select-input"
          >
            <option value="ALL">All Subsidiaries</option>
            <option value="Transcorp Power">Transcorp Power Plc (406)</option>
            <option value="Transcorp Hotels">Transcorp Hotels Plc (17)</option>
            <option value="Transcorp Group HQ">Transcorp Group HQ (28)</option>
          </select>
        </div>

        <div className="filter-select-wrapper">
          <label className="filter-select-label">Role Filter:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "ALL" | "TRAINER" | "LEARNER")}
            className="filter-select-input"
          >
            <option value="ALL">All Roles ({filteredStaff.length})</option>
            <option value="TRAINER">Assigned Trainers Only ({trainerCourseMap.size})</option>
            <option value="LEARNER">Standard Learners Only</option>
          </select>
        </div>
      </div>

      {/* Workforce Table */}
      <div className="admin-panel-card">
        <div className="table-header-row">
          <span className="th-cell th-name" style={{ flex: 1.5 }}>Employee & Corporate Email</span>
          <span className="th-cell th-stat" style={{ flex: 1.2 }}>Subsidiary & Department</span>
          <span className="th-cell th-stat" style={{ flex: 1.5 }}>Governance Standing & Role</span>
          <span className="th-cell th-actions" style={{ flex: 1 }}>Actions</span>
        </div>

        <div className="table-body-stack">
          {filteredStaff.slice(0, 30).map((emp) => {
            const coursesLed = trainerCourseMap.get(emp.id);
            const isTrainer = Boolean(coursesLed && coursesLed.length > 0);

            return (
              <div key={emp.id} className="table-row-item">
                {/* Employee Info */}
                <div className="td-cell td-name" style={{ flex: 1.5 }}>
                  <div className="trainer-avatar-bubble small">{emp.avatar}</div>
                  <div className="meta-col">
                    <span className="font-bold flex-center-gap">
                      <span>{emp.fullName}</span>
                      <span className="text-secondary text-xs font-mono">[{emp.id}]</span>
                    </span>
                    <span className="text-secondary text-xs">{emp.email}</span>
                  </div>
                </div>

                {/* Subsidiary & Department */}
                <div className="td-cell td-stat" style={{ flex: 1.2 }}>
                  <div className="meta-col">
                    <span className="font-bold text-xs">{emp.subsidiary}</span>
                    <span className="text-secondary text-xs">{emp.department}</span>
                  </div>
                </div>

                {/* Role & Trainer Standing */}
                <div className="td-cell td-stat" style={{ flex: 1.5 }}>
                  {coursesLed && coursesLed.length > 0 ? (
                    <div>
                      <span className="trainer-status-badge glowing">
                        <span className="material-symbols-outlined icon-small">record_voice_over</span>
                        <span>Lead Trainer ({coursesLed.length} Course{coursesLed.length > 1 ? "s" : ""})</span>
                      </span>
                      <div className="text-xs text-amber" style={{ marginTop: "3px" }}>
                        {coursesLed.map((c) => c.courseCode).join(", ")}
                      </div>
                    </div>
                  ) : (
                    <span className="learner-role-chip">Learner</span>
                  )}
                </div>

                {/* Actions */}
                <div className="td-cell td-actions" style={{ flex: 1, justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      setAssigningLearner(emp);
                      setTargetCourseId(courses[0]?.id || "");
                    }}
                    className="btn-select-chip"
                    title="Elevate this Learner to lead a Course"
                  >
                    <span className="material-symbols-outlined icon-small">school</span>
                    <span>{isTrainer ? "Add Another Course" : "Assign as Trainer"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="table-footer-status">
          Showing {Math.min(30, filteredStaff.length)} of {filteredStaff.length} employees (All from Transcorp Users Directory)
        </div>
      </div>

      {/* ELEVATE LEARNER TO TRAINER MODAL */}
      {assigningLearner && (
        <div className="modal-backdrop-scrim" onClick={() => setAssigningLearner(null)}>
          <div className="modal-container-card reassign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex-center-gap">
                <span className="material-symbols-outlined modal-header-icon text-amber">record_voice_over</span>
                <div>
                  <h2 className="modal-heading-title">Elevate Learner to Course Trainer</h2>
                  <p className="modal-subheading">HR Trainer Delegation</p>
                </div>
              </div>
              <button onClick={() => setAssigningLearner(null)} className="btn-modal-close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="initiate-modal-body">
              <div className="current-selected-trainer-card">
                <div className="trainer-avatar-bubble large">{assigningLearner.avatar}</div>
                <div>
                  <div className="font-bold text-base">{assigningLearner.fullName}</div>
                  <div className="text-xs text-secondary">{assigningLearner.email} • {assigningLearner.subsidiary}</div>
                  <div className="text-xs text-amber font-mono">Department: {assigningLearner.department}</div>
                </div>
              </div>

              <div className="form-field-group" style={{ marginTop: "1rem" }}>
                <label className="field-label">Select Course for {assigningLearner.fullName} to Lead *</label>
                <select
                  value={targetCourseId}
                  onChange={(e) => setTargetCourseId(e.target.value)}
                  className="form-text-input"
                >
                  <option value="">-- Choose an Initiated Course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.courseCode}] {c.title} (Current: {c.trainer.fullName} | Scope: {c.audienceScope === "ALL" ? "ALL Group" : c.targetSubsidiary})
                    </option>
                  ))}
                </select>
              </div>

              <div className="governance-notice-box" style={{ marginTop: "0.75rem" }}>
                <span className="material-symbols-outlined icon-small text-amber">verified</span>
                <div className="text-xs">
                  This action will designate <strong>{assigningLearner.fullName}</strong> as the official Lead Course Trainer on this course in Dataverse and across the Learner portal.
                </div>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  onClick={() => setAssigningLearner(null)}
                  className="btn-secondary-flat"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!targetCourseId}
                  onClick={handleConfirmAssignTrainer}
                  className="btn-primary-action"
                >
                  <span className="material-symbols-outlined icon-small">check</span>
                  <span>Confirm Trainer Assignment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
