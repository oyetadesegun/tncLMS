import React, { useState, useEffect } from "react";
import {
  CoursesStore,
  type Course,
} from "../data/coursesStore";
import { CategoriesStore } from "../data/categoriesStore";
import {
  TRANSCORP_LEARNERS,
  searchLearners,
  type TranscorpLearner,
} from "../data/transcorpUsers";

interface AdminCoursesViewProps {
  onNavigate: (path: string) => void;
}

export const AdminCoursesView: React.FC<AdminCoursesViewProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [selectedSubsidiaryFilter, setSelectedSubsidiaryFilter] = useState<string>("ALL");

  // Initiate Course Modal state
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState(""); // set after categories load
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addCategoryInput, setAddCategoryInput] = useState("");
  const [newDeliveryMethod, setNewDeliveryMethod] = useState<Course["deliveryMethod"]>("Virtual");
  const [newMeetingPlatform, setNewMeetingPlatform] = useState<"Microsoft Teams" | "Zoom">("Microsoft Teams");
  const [newMeetingLink, setNewMeetingLink] = useState("");
  const [newPassMark, setNewPassMark] = useState(80);
  const [newDuration, setNewDuration] = useState(25);
  const [newAudienceScope, setNewAudienceScope] = useState<"ALL" | "SUBSIDIARY">("ALL");
  const [newTargetSubsidiary, setNewTargetSubsidiary] = useState<string>("Transcorp Power Plc");

  // Trainer selection state
  const [trainerSearch, setTrainerSearch] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState<TranscorpLearner>(TRANSCORP_LEARNERS[6] || TRANSCORP_LEARNERS[0]);

  // Reassign Trainer modal state
  const [reassignCourse, setReassignCourse] = useState<Course | null>(null);
  const [reassignSearch, setReassignSearch] = useState("");

  // Enrolled learners view modal state
  const [viewingAudienceCourse, setViewingAudienceCourse] = useState<Course | null>(null);

  // Success alert toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubCourses = CoursesStore.subscribe((updated) => setCourses(updated));
    const unsubCats = CategoriesStore.subscribe((cats) => {
      setCategories(cats);
      setNewCategory((prev) => prev || cats[0] || "");
    });
    return () => { unsubCourses(); unsubCats(); };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      c.trainer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.trainer.email.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === "ALL" ||
      c.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    const matchesSubsidiary =
      selectedSubsidiaryFilter === "ALL" ||
      (selectedSubsidiaryFilter === "ALL_ONLY" && c.audienceScope === "ALL") ||
      (c.audienceScope === "SUBSIDIARY" && c.targetSubsidiary.toLowerCase().includes(selectedSubsidiaryFilter.toLowerCase()));

    return matchesSearch && matchesCategory && matchesSubsidiary;
  });

  // Search learners for trainer assignment
  const candidateTrainers = searchLearners(trainerSearch).slice(0, 8);
  const reassignCandidates = searchLearners(reassignSearch).slice(0, 8);

  const handleInitiateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please specify a course title.");
      return;
    }

    try {
      await CoursesStore.initiateCourse({
        title: newTitle,
        description: newDescription || "Mandatory professional development module certified by Transcorp Group HR.",
        category: newCategory,
        trainerLearner: selectedTrainer,
        audienceScope: newAudienceScope,
        targetSubsidiary: newAudienceScope === "ALL" ? "ALL Transcorp Group (All Subsidiaries)" : newTargetSubsidiary,
        deliveryMethod: newDeliveryMethod,
        meetingPlatform: newDeliveryMethod === "Virtual" ? newMeetingPlatform : undefined,
        meetingLink: newDeliveryMethod === "Virtual" && newMeetingLink.trim() ? newMeetingLink.trim() : undefined,
        passMark: newPassMark,
        durationMinutes: newDuration,
      });

      setIsInitiateModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewMeetingLink("");
      showToast(`Course "${newTitle}" initiated! Assigned Trainer: ${selectedTrainer.fullName}.`);
    } catch {
      alert("Error initiating course. Please try again.");
    }
  };

  const handleReassignSubmit = async (learner: TranscorpLearner) => {
    if (!reassignCourse) return;
    await CoursesStore.reassignTrainer(reassignCourse.id, learner);
    setReassignCourse(null);
    showToast(`Assigned ${learner.fullName} as the Lead Trainer for ${reassignCourse.courseCode}.`);
  };

  const handleAudienceScopeToggle = async (course: Course, newScope: "ALL" | "SUBSIDIARY", subsidiary?: string) => {
    await CoursesStore.setAudienceScope(course.id, newScope, subsidiary);
    showToast(`Updated audience for ${course.courseCode} to: ${newScope === "ALL" ? "ALL Transcorp Group" : subsidiary}.`);
  };

  return (
    <div className="admin-view-content">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast-banner">
          <span className="material-symbols-outlined text-amber">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Strip */}
      <div className="admin-header-strip">
        <div>
          <div className="breadcrumb-line">
            <button onClick={() => onNavigate("/admin")} className="crumb-btn">Admin</button>
            <span>/</span>
            <span className="text-primary font-bold">Courses & Trainer Governance</span>
          </div>
          <h1 className="page-main-heading">Corporate Courses & Trainer Assignment</h1>
          <p className="page-sub-heading">
            HR control center to initiate courses, elevate learners to lead trainers, and scope audience eligibility to the entire Transcorp Group or a specific subsidiary.
          </p>
        </div>

        <div className="header-action-group">
          <button
            onClick={() => setIsInitiateModalOpen(true)}
            className="btn-primary-action"
            title="Initiate Course & Assign Trainer"
          >
            <span className="material-symbols-outlined icon-small">add_circle</span>
            <span>+ Initiate New Course</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="kpi-quad-grid">
        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Initiated Courses</span>
            <span className="material-symbols-outlined kpi-icon text-amber">school</span>
          </div>
          <div className="kpi-big-number">{courses.length}</div>
          <div className="kpi-trend text-secondary">
            <span>{courses.filter((c) => c.status === "Active").length} Active in catalog</span>
          </div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Assigned Lead Trainers</span>
            <span className="material-symbols-outlined kpi-icon text-amber">record_voice_over</span>
          </div>
          <div className="kpi-big-number">{new Set(courses.map((c) => c.trainer.id)).size}</div>
          <div className="kpi-trend text-secondary">
            <span>Elevated from Learner workforce</span>
          </div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Groupwide Scope (ALL)</span>
            <span className="material-symbols-outlined kpi-icon text-amber">public</span>
          </div>
          <div className="kpi-big-number">{courses.filter((c) => c.audienceScope === "ALL").length}</div>
          <div className="kpi-trend text-secondary">
            <span>Available to all 451 staff</span>
          </div>
        </div>

        <div className="kpi-metric-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Subsidiary Specific</span>
            <span className="material-symbols-outlined kpi-icon text-amber">domain</span>
          </div>
          <div className="kpi-big-number">{courses.filter((c) => c.audienceScope === "SUBSIDIARY").length}</div>
          <div className="kpi-trend text-secondary">
            <span>Targeted to specific entities</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="catalog-filters-bar">
        <div className="search-field-wrapper flex-1">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Search by course title, course code, or assigned trainer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="directory-search-input"
          />
        </div>

        <div className="filter-select-wrapper">
          <label className="filter-select-label">Category:</label>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="filter-select-input"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-select-wrapper">
          <label className="filter-select-label">Audience:</label>
          <select
            value={selectedSubsidiaryFilter}
            onChange={(e) => setSelectedSubsidiaryFilter(e.target.value)}
            className="filter-select-input"
          >
            <option value="ALL">All Scopes</option>
            <option value="ALL_ONLY">ALL Transcorp Group Only</option>
            <option value="Transcorp Power">Transcorp Power Plc</option>
            <option value="Transcorp Hotels">Transcorp Hotels Plc</option>
            <option value="Transcorp Group HQ">Transcorp Group HQ</option>
            <option value="Transafam Power">Transafam Power Limited</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="courses-grid-stack">
        {filteredCourses.length === 0 ? (
          <div className="empty-state-card">
            <span className="material-symbols-outlined empty-icon">menu_book</span>
            <h3>No courses match the selected filters</h3>
            <p className="text-secondary">Try adjusting your search query or subsidiary filter, or initiate a new course.</p>
            <button onClick={() => setIsInitiateModalOpen(true)} className="btn-primary-action" style={{ marginTop: "1rem" }}>
              <span className="material-symbols-outlined icon-small">add</span>
              <span>Initiate First Course</span>
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => {
            const isGroupwide = course.audienceScope === "ALL";

            return (
              <div key={course.id} className="course-admin-card">
                <div className="course-admin-header">
                  <div className="course-badges-row">
                    <span className="course-code-chip">{course.courseCode}</span>
                    <span className="category-chip">{course.category}</span>
                    <span className={`status-pill ${course.status === "Active" ? "active" : "upcoming"}`}>
                      {course.status}
                    </span>
                  </div>

                  <div className="course-header-actions">
                    <button
                      onClick={() => setViewingAudienceCourse(course)}
                      className="btn-text-subtle"
                      title="View enrolled learners"
                    >
                      <span className="material-symbols-outlined icon-small">group</span>
                      <span>{course.enrolledLearnersCount} Enrolled</span>
                    </button>
                    <button
                      onClick={() => CoursesStore.deleteCourse(course.id)}
                      className="btn-icon-subtle text-red"
                      title="Archive / Remove Course"
                    >
                      <span className="material-symbols-outlined icon-small">delete</span>
                    </button>
                  </div>
                </div>

                <div className="course-body-section">
                  <h3 className="course-card-title">{course.title}</h3>
                  <p className="course-card-description">{course.description}</p>
                </div>

                {/* Trainer & Audience Section */}
                <div className="course-governance-strip">
                  {/* Assigned Trainer Box */}
                  <div className="governance-box trainer-box">
                    <div className="gov-box-label">
                      <span className="material-symbols-outlined icon-small text-amber">record_voice_over</span>
                      <span>Assigned Course Trainer (Elevated Learner)</span>
                    </div>

                    <div className="trainer-profile-snippet">
                      <div className="trainer-avatar-bubble">{course.trainer.avatar}</div>
                      <div className="trainer-meta">
                        <div className="trainer-name-row">
                          <span className="trainer-full-name">{course.trainer.fullName}</span>
                          <span className="trainer-status-badge">Lead Trainer</span>
                        </div>
                        <div className="trainer-sub-line">
                          <span>{course.trainer.email}</span>
                          <span>•</span>
                          <span className="text-secondary">{course.trainer.subsidiary}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setReassignCourse(course);
                          setReassignSearch("");
                        }}
                        className="btn-change-trainer"
                        title="Assign a different Learner as Trainer"
                      >
                        <span className="material-symbols-outlined icon-small">swap_horiz</span>
                        <span>Reassign</span>
                      </button>
                    </div>
                  </div>

                  {/* Audience Scope Box */}
                  <div className="governance-box audience-box">
                    <div className="gov-box-label">
                      <span className="material-symbols-outlined icon-small text-amber">
                        {isGroupwide ? "public" : "domain"}
                      </span>
                      <span>Target Audience Scope (HR Decision)</span>
                    </div>

                    <div className="audience-scope-display">
                      <div className="scope-status-line">
                        {isGroupwide ? (
                          <div className="scope-indicator groupwide">
                            <span className="material-symbols-outlined icon-small">corporate_fare</span>
                            <div>
                              <div className="font-bold">ALL Transcorp Group</div>
                              <div className="text-xs text-secondary">
                                Open to all 451 employees across all subsidiaries
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="scope-indicator subsidiary">
                            <span className="material-symbols-outlined icon-small">factory</span>
                            <div>
                              <div className="font-bold">{course.targetSubsidiary}</div>
                              <div className="text-xs text-secondary">
                                Restricted strictly to {course.targetSubsidiary} workforce
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Scope Switcher */}
                      <div className="scope-switch-dropdown-row">
                        <span className="text-xs text-secondary">Change Audience:</span>
                        <select
                          value={isGroupwide ? "ALL" : course.targetSubsidiary}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "ALL") {
                              handleAudienceScopeToggle(course, "ALL");
                            } else {
                              handleAudienceScopeToggle(course, "SUBSIDIARY", val);
                            }
                          }}
                          className="scope-quick-select"
                        >
                          <option value="ALL">🌐 ALL Transcorp Group (All Subsidiaries)</option>
                          <option value="Transcorp Power Plc">⚡ Transcorp Power Plc (Ughelli)</option>
                          <option value="Transcorp Hotels Plc">🏨 Transcorp Hotels Plc (Abuja & Calabar)</option>
                          <option value="Transcorp Group HQ">🏛️ Transcorp Group HQ (Corporate Centre)</option>
                          <option value="Transafam Power Limited">⚡ Transafam Power Limited (Afam)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="course-card-footer">
                  <div className="footer-details-line">
                    <span className="flex-center-gap">
                      <span className="material-symbols-outlined icon-small">
                        {course.deliveryMethod === "Virtual" ? "video_camera_front" : "location_on"}
                      </span>
                      <span>
                        {course.deliveryMethod === "Virtual"
                          ? `Virtual — ${course.meetingPlatform || "Online"}`
                          : "Physical Session"}
                      </span>
                    </span>
                    <span>•</span>
                    <span className="flex-center-gap">
                      <span className="material-symbols-outlined icon-small">timer</span>
                      <span>{course.durationMinutes} mins</span>
                    </span>
                    <span>•</span>
                    <span className="flex-center-gap">
                      <span className="material-symbols-outlined icon-small">verified</span>
                      <span>Pass mark: {course.passMark}%</span>
                    </span>
                    <span>•</span>
                    <span className="text-secondary text-xs">Initiated by {course.initiatedBy.name} (HR)</span>
                  </div>

                  <div className="course-footer-btns">
                    <button
                      onClick={() => onNavigate("/assessments")}
                      className="btn-secondary-flat"
                    >
                      <span className="material-symbols-outlined icon-small">quiz</span>
                      <span>Assessment</span>
                    </button>
                    <button
                      onClick={() => {
                        const link = course.meetingLink;
                        if (link) window.open(link, "_blank");
                        else alert("No meeting link set for this course.");
                      }}
                      className="btn-teams-link"
                      disabled={course.deliveryMethod === "Physical" || !course.meetingLink}
                      style={{ opacity: (course.deliveryMethod === "Physical" || !course.meetingLink) ? 0.45 : 1 }}
                    >
                      <span className="material-symbols-outlined icon-small">videocam</span>
                      <span>{course.deliveryMethod === "Physical" ? "Physical Session" : `Open ${course.meetingPlatform || "Meeting"}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: INITIATE NEW COURSE WIZARD */}
      {isInitiateModalOpen && (
        <div className="modal-backdrop-scrim" onClick={() => setIsInitiateModalOpen(false)}>
          <div className="modal-container-card course-initiate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex-center-gap">
                <span className="material-symbols-outlined modal-header-icon text-amber">add_box</span>
                <div>
                  <h2 className="modal-heading-title">Initiate Corporate Course & Assign Trainer</h2>
                  <p className="modal-subheading">HR governance module for Transcorp Group learning administration</p>
                </div>
              </div>
              <button onClick={() => setIsInitiateModalOpen(false)} className="btn-modal-close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleInitiateSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minHeight: 0 }}>
              {/* Scrollable body */}
              <div className="initiate-modal-body">
                {/* SECTION 1: COURSE BASICS */}
                <div className="form-section-group">
                  <div className="section-label-chip">Step 1: Course Identity & Details</div>

                  <div className="form-field-group">
                    <label className="field-label">Course Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Substation High-Voltage Switching & Lockout Protocols"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="form-text-input"
                    />
                  </div>

                  <div className="form-row-duo">
                    {/* Category with Add New */}
                    <div className="form-field-group">
                      <label className="field-label">Discipline / Category</label>
                      <div className="category-select-row">
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="form-text-input"
                          style={{ flex: 1 }}
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn-add-category-toggle"
                          onClick={() => setShowAddCategory((v) => !v)}
                          title="Add a new category"
                        >
                          <span className="material-symbols-outlined icon-small">
                            {showAddCategory ? "close" : "add"}
                          </span>
                        </button>
                      </div>
                      {showAddCategory && (
                        <div className="add-category-inline">
                          <input
                            type="text"
                            placeholder="New category name e.g. Leadership & Strategy"
                            value={addCategoryInput}
                            onChange={(e) => setAddCategoryInput(e.target.value)}
                            className="form-text-input"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const ok = CategoriesStore.addCategory(addCategoryInput);
                                if (ok) {
                                  setNewCategory(addCategoryInput.trim());
                                  setAddCategoryInput("");
                                  setShowAddCategory(false);
                                } else {
                                  alert("Category already exists or is empty.");
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="btn-primary-action"
                            style={{ marginTop: "0.4rem", width: "100%" }}
                            onClick={() => {
                              const ok = CategoriesStore.addCategory(addCategoryInput);
                              if (ok) {
                                setNewCategory(addCategoryInput.trim());
                                setAddCategoryInput("");
                                setShowAddCategory(false);
                              } else {
                                alert("Category already exists or is empty.");
                              }
                            }}
                          >
                            <span className="material-symbols-outlined icon-small">check</span>
                            <span>Add Category</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Delivery Method */}
                    <div className="form-field-group">
                      <label className="field-label">Delivery Method</label>
                      <div className="delivery-toggle-row">
                        <button
                          type="button"
                          className={`delivery-toggle-btn ${newDeliveryMethod === "Virtual" ? "active" : ""}`}
                          onClick={() => setNewDeliveryMethod("Virtual")}
                        >
                          <span className="material-symbols-outlined icon-small">video_camera_front</span>
                          <span>Virtual</span>
                        </button>
                        <button
                          type="button"
                          className={`delivery-toggle-btn ${newDeliveryMethod === "Physical" ? "active" : ""}`}
                          onClick={() => setNewDeliveryMethod("Physical")}
                        >
                          <span className="material-symbols-outlined icon-small">location_on</span>
                          <span>Physical</span>
                        </button>
                      </div>

                      {/* Virtual: platform + optional URL */}
                      {newDeliveryMethod === "Virtual" && (
                        <div className="virtual-meeting-panel">
                          <label className="field-label" style={{ marginTop: "0.6rem" }}>Meeting Platform</label>
                          <div className="platform-toggle-row">
                            <button
                              type="button"
                              className={`platform-pill-btn ${newMeetingPlatform === "Microsoft Teams" ? "active" : ""}`}
                              onClick={() => setNewMeetingPlatform("Microsoft Teams")}
                            >
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                                <rect width="20" height="20" rx="4" fill="#5058CF"/>
                                <text x="4" y="14" fontSize="10" fill="white" fontWeight="bold">T</text>
                              </svg>
                              Microsoft Teams
                            </button>
                            <button
                              type="button"
                              className={`platform-pill-btn ${newMeetingPlatform === "Zoom" ? "active" : ""}`}
                              onClick={() => setNewMeetingPlatform("Zoom")}
                            >
                              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                                <rect width="20" height="20" rx="4" fill="#2D8CFF"/>
                                <text x="3" y="14" fontSize="9" fill="white" fontWeight="bold">Z</text>
                              </svg>
                              Zoom
                            </button>
                          </div>
                          <label className="field-label" style={{ marginTop: "0.6rem" }}>
                            Meeting Link <span className="field-optional-hint">(optional)</span>
                          </label>
                          <input
                            type="url"
                            placeholder={newMeetingPlatform === "Zoom"
                              ? "https://us06web.zoom.us/j/..."
                              : "https://teams.microsoft.com/l/meetup-join/..."}
                            value={newMeetingLink}
                            onChange={(e) => setNewMeetingLink(e.target.value)}
                            className="form-text-input"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Curriculum Scope &amp; Description</label>
                    <textarea
                      rows={2}
                      placeholder="Describe course objectives, statutory mandates, and learning outcomes..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="form-text-input"
                    />
                  </div>
                </div>

                {/* SECTION 2: ASSIGN LEARNER AS TRAINER */}
                <div className="form-section-group highlighted-section">
                  <div className="section-label-chip">
                    Step 2: Assign Lead Trainer (Elevate from Learners)
                  </div>

                  <div className="governance-notice-box">
                    <span className="material-symbols-outlined icon-small text-amber">info</span>
                    <div className="text-xs">
                      <strong>HR Workforce Rule:</strong> All 451 corporate staff are registered as Learners. As Admin/HR, designate any Learner below to lead this course as its certified <strong>Course Trainer</strong>.
                    </div>
                  </div>

                  {/* Selected Trainer Preview */}
                  <div className="current-selected-trainer-card">
                    <div className="trainer-avatar-bubble large">{selectedTrainer.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold text-base flex-center-gap">
                        <span>{selectedTrainer.fullName}</span>
                        <span className="trainer-status-badge">Selected Trainer</span>
                      </div>
                      <div className="text-xs text-secondary">{selectedTrainer.email} &bull; {selectedTrainer.subsidiary}</div>
                      <div className="text-xs text-amber font-mono" style={{ marginTop: "2px" }}>
                        ID: {selectedTrainer.id} &bull; {selectedTrainer.department}
                      </div>
                    </div>
                  </div>

                  {/* Search & Pick Trainer */}
                  <div className="form-field-group" style={{ marginTop: "0.75rem" }}>
                    <label className="field-label">Search &amp; Select Learner from Transcorp Workforce (451 Users)</label>
                    <div className="search-field-wrapper">
                      <span className="material-symbols-outlined search-icon">search</span>
                      <input
                        type="text"
                        placeholder="Type employee name, email, or subsidiary..."
                        value={trainerSearch}
                        onChange={(e) => setTrainerSearch(e.target.value)}
                        className="directory-search-input"
                      />
                    </div>

                    {trainerSearch && (
                      <div className="candidates-dropdown-list">
                        {candidateTrainers.length === 0 ? (
                          <div className="p-3 text-secondary text-xs">No employees found matching &ldquo;{trainerSearch}&rdquo;</div>
                        ) : (
                          candidateTrainers.map((learner) => (
                            <div
                              key={learner.id}
                              onClick={() => {
                                setSelectedTrainer(learner);
                                setTrainerSearch("");
                              }}
                              className={`candidate-picker-item ${selectedTrainer.id === learner.id ? "selected" : ""}`}
                            >
                              <div className="trainer-avatar-bubble small">{learner.avatar}</div>
                              <div className="candidate-info">
                                <span className="candidate-name">{learner.fullName}</span>
                                <span className="candidate-email">{learner.email} &bull; {learner.subsidiary}</span>
                              </div>
                              <button type="button" className="btn-select-chip">Assign as Trainer</button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 3: AUDIENCE SCOPE (ALL vs SUBSIDIARY) */}
                <div className="form-section-group highlighted-section">
                  <div className="section-label-chip">
                    Step 3: Target Audience Scope (HR Decision Gate)
                  </div>

                  <div className="audience-decision-grid">
                    {/* Option A: ALL Transcorp Group */}
                    <label
                      className={`audience-decision-card ${newAudienceScope === "ALL" ? "active" : ""}`}
                      onClick={() => setNewAudienceScope("ALL")}
                    >
                      <div className="decision-radio-row">
                        <input
                          type="radio"
                          name="audienceScope"
                          checked={newAudienceScope === "ALL"}
                          onChange={() => setNewAudienceScope("ALL")}
                        />
                        <span className="material-symbols-outlined icon-medium text-amber">public</span>
                        <span className="decision-title">Available to ALL Transcorp Group</span>
                      </div>
                      <p className="decision-desc">
                        Broadcast to entire workforce (451+ staff) across Transcorp Power, Transcorp Hotels, and Corporate Centre.
                      </p>
                      <div className="decision-stat-chip">Enrolls 451 Learners</div>
                    </label>

                    {/* Option B: Specific Subsidiary */}
                    <label
                      className={`audience-decision-card ${newAudienceScope === "SUBSIDIARY" ? "active" : ""}`}
                      onClick={() => setNewAudienceScope("SUBSIDIARY")}
                    >
                      <div className="decision-radio-row">
                        <input
                          type="radio"
                          name="audienceScope"
                          checked={newAudienceScope === "SUBSIDIARY"}
                          onChange={() => setNewAudienceScope("SUBSIDIARY")}
                        />
                        <span className="material-symbols-outlined icon-medium text-amber">domain</span>
                        <span className="decision-title">Restrict to Particular Subsidiary</span>
                      </div>
                      <p className="decision-desc">
                        Scope eligibility strictly to employees of a designated Transcorp operating company.
                      </p>
                      <div className="decision-stat-chip">Targeted Subsidiary Only</div>
                    </label>
                  </div>

                  {/* If Subsidiary selected, show picker */}
                  {newAudienceScope === "SUBSIDIARY" && (
                    <div className="subsidiary-picker-panel">
                      <label className="field-label">Select Target Transcorp Subsidiary *</label>
                      <select
                        value={newTargetSubsidiary}
                        onChange={(e) => setNewTargetSubsidiary(e.target.value)}
                        className="form-text-input"
                      >
                        <option value="Transcorp Power Plc">Transcorp Power Plc (Ughelli Power)</option>
                        <option value="Transcorp Hotels Plc">Transcorp Hotels Plc (Abuja &amp; Calabar)</option>
                        <option value="Transcorp Group HQ">Transcorp Group HQ (Corporate Centre)</option>
                        <option value="Transafam Power Limited">Transafam Power Limited (Afam)</option>
                        <option value="Ughelli Power Plc">Ughelli Power Plc</option>
                      </select>
                      <div className="text-xs text-amber" style={{ marginTop: "6px" }}>
                        ✓ Only staff belonging to <strong>{newTargetSubsidiary}</strong> will receive this course and its associated examination.
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 4: ASSESSMENT & PASSING THRESHOLD */}
                <div className="form-section-group">
                  <div className="section-label-chip">Step 4: Assessment Standards</div>
                  <div className="form-row-duo">
                    <div className="form-field-group">
                      <label className="field-label">Passing Threshold (%)</label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={newPassMark}
                        onChange={(e) => setNewPassMark(Number(e.target.value))}
                        className="form-text-input"
                      />
                    </div>
                    <div className="form-field-group">
                      <label className="field-label">Session Duration (Minutes)</label>
                      <input
                        type="number"
                        min="10"
                        max="180"
                        value={newDuration}
                        onChange={(e) => setNewDuration(Number(e.target.value))}
                        className="form-text-input"
                      />
                    </div>
                  </div>
                </div>
              </div>{/* end scrollable body */}

              {/* Sticky Modal Footer — outside scroll area */}
              <div className="modal-actions-footer">
                <button
                  type="button"
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="btn-secondary-flat"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  <span className="material-symbols-outlined icon-small">publish</span>
                  <span>Initiate &amp; Publish Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REASSIGN TRAINER MODAL */}
      {reassignCourse && (
        <div className="modal-backdrop-scrim" onClick={() => setReassignCourse(null)}>
          <div className="modal-container-card reassign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex-center-gap">
                <span className="material-symbols-outlined modal-header-icon text-amber">swap_horiz</span>
                <div>
                  <h2 className="modal-heading-title">Reassign Lead Trainer</h2>
                  <p className="modal-subheading">Course: {reassignCourse.courseCode} - {reassignCourse.title}</p>
                </div>
              </div>
              <button onClick={() => setReassignCourse(null)} className="btn-modal-close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="initiate-modal-body">
              <div className="governance-notice-box">
                <span className="material-symbols-outlined icon-small text-amber">info</span>
                <div className="text-xs">
                  Current Lead Trainer is <strong>{reassignCourse.trainer.fullName}</strong>. Select any other Learner from the 451 Transcorp corporate directory to elevate them as the new Lead Trainer.
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">Search Learner by Name, Email, or Subsidiary</label>
                <div className="search-field-wrapper">
                  <span className="material-symbols-outlined search-icon">search</span>
                  <input
                    type="text"
                    placeholder="Search 451 corporate staff..."
                    value={reassignSearch}
                    onChange={(e) => setReassignSearch(e.target.value)}
                    className="directory-search-input"
                    autoFocus
                  />
                </div>
              </div>

              <div className="candidates-list-scroll">
                {(reassignSearch ? reassignCandidates : TRANSCORP_LEARNERS.slice(0, 10)).map((learner) => {
                  const isCurrent = learner.id === reassignCourse.trainer.id;
                  return (
                    <div
                      key={learner.id}
                      className={`reassign-candidate-row ${isCurrent ? "is-current" : ""}`}
                    >
                      <div className="trainer-avatar-bubble">{learner.avatar}</div>
                      <div className="flex-1">
                        <div className="font-bold flex-center-gap">
                          <span>{learner.fullName}</span>
                          {isCurrent && <span className="trainer-status-badge">Current Trainer</span>}
                        </div>
                        <div className="text-xs text-secondary">{learner.email} • {learner.subsidiary}</div>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => handleReassignSubmit(learner)}
                          className="btn-select-chip"
                        >
                          Assign as Trainer
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: VIEW ENROLLED AUDIENCE MODAL */}
      {viewingAudienceCourse && (
        <div className="modal-backdrop-scrim" onClick={() => setViewingAudienceCourse(null)}>
          <div className="modal-container-card reassign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="flex-center-gap">
                <span className="material-symbols-outlined modal-header-icon text-amber">groups</span>
                <div>
                  <h2 className="modal-heading-title">Enrolled Workforce Audience</h2>
                  <p className="modal-subheading">
                    {viewingAudienceCourse.title} • {viewingAudienceCourse.audienceScope === "ALL" ? "ALL Transcorp Group" : viewingAudienceCourse.targetSubsidiary}
                  </p>
                </div>
              </div>
              <button onClick={() => setViewingAudienceCourse(null)} className="btn-modal-close">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="initiate-modal-body">
              <div className="audience-stats-banner">
                <div className="font-bold text-base">
                  {viewingAudienceCourse.enrolledLearnersCount} Employees Enrolled as Learners
                </div>
                <div className="text-xs text-secondary">
                  Lead Facilitator: <strong>{viewingAudienceCourse.trainer.fullName}</strong> ({viewingAudienceCourse.trainer.email})
                </div>
              </div>

              <div className="candidates-list-scroll">
                {(viewingAudienceCourse.audienceScope === "ALL"
                  ? TRANSCORP_LEARNERS.slice(0, 20)
                  : TRANSCORP_LEARNERS.filter((l) =>
                      l.subsidiary.toLowerCase().includes(viewingAudienceCourse.targetSubsidiary.toLowerCase().replace(" (all subsidiaries)", ""))
                    ).slice(0, 20)
                ).map((learner) => (
                  <div key={learner.id} className="reassign-candidate-row">
                    <div className="trainer-avatar-bubble small">{learner.avatar}</div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{learner.fullName}</div>
                      <div className="text-xs text-secondary">{learner.email} • {learner.subsidiary}</div>
                    </div>
                    <span className="learner-role-chip">Learner</span>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-secondary p-2">
                Showing sample from {viewingAudienceCourse.enrolledLearnersCount} eligible corporate learners
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
