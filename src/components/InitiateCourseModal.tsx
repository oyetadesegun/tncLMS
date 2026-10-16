import React, { useState, useEffect } from "react";
import { CoursesStore, type Course } from "../data/coursesStore";
import { CategoriesStore } from "../data/categoriesStore";
import {
  TRANSCORP_LEARNERS,
  searchLearners,
  type TranscorpLearner,
} from "../data/transcorpUsers";

interface InitiateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseTitle: string, trainerName: string) => void;
}

export const InitiateCourseModal: React.FC<InitiateCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
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
  const [selectedTrainer, setSelectedTrainer] = useState<TranscorpLearner>(
    TRANSCORP_LEARNERS.find((l) => l.email === "segun.oyetade@transcorpgroup.com") ||
    TRANSCORP_LEARNERS[6] ||
    TRANSCORP_LEARNERS[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = CategoriesStore.subscribe((cats) => {
      setCategories(cats);
      setNewCategory((prev) => prev || cats[0] || "Information Security & Compliance");
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const candidateTrainers = searchLearners(trainerSearch).slice(0, 8);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please specify a course title.");
      return;
    }

    setIsSubmitting(true);
    try {
      await CoursesStore.initiateCourse({
        title: newTitle.trim(),
        description: newDescription.trim() || "Mandatory professional development module certified by Transcorp Group HR.",
        category: newCategory,
        trainerLearner: selectedTrainer,
        audienceScope: newAudienceScope,
        targetSubsidiary: newAudienceScope === "ALL" ? "ALL Transcorp Group (All Subsidiaries)" : newTargetSubsidiary,
        deliveryMethod: newDeliveryMethod,
        meetingPlatform: newDeliveryMethod === "Virtual" ? newMeetingPlatform : undefined,
        meetingLink: newDeliveryMethod === "Virtual" && newMeetingLink.trim() ? newMeetingLink.trim() : undefined,
        passMark: Number(newPassMark) || 80,
        durationMinutes: Number(newDuration) || 25,
      });

      onSuccess(newTitle, selectedTrainer.fullName);
      onClose();
      // Reset form
      setNewTitle("");
      setNewDescription("");
      setNewMeetingLink("");
    } catch {
      alert("Error initiating course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNewCategory = () => {
    const val = addCategoryInput.trim();
    if (!val) return;
    CategoriesStore.addCategory(val);
    setNewCategory(val);
    setAddCategoryInput("");
    setShowAddCategory(false);
  };

  return (
    <div className="directory-modal-backdrop" onClick={onClose}>
      <div
        className="directory-modal-container initiate-course-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "780px", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="directory-modal-header">
          <div>
            <div className="flex-center-gap">
              <span className="material-symbols-outlined icon-medium text-amber">school</span>
              <h2 className="directory-modal-title">Initiate Corporate Course</h2>
            </div>
            <p className="directory-modal-sub">
              Create a new accredited training module, assign a certified Course Trainer from the workforce, and set groupwide or subsidiary audience targeting.
            </p>
          </div>
          <button onClick={onClose} className="directory-close-btn" title="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="directory-modal-body">
          {/* SECTION 1: COURSE ESSENTIALS */}
          <div className="form-section-group">
            <div className="section-label-chip">Step 1: Course Identity & Curriculum</div>

            <div className="form-field-group">
              <label className="field-label">Course Title *</label>
              <input
                type="text"
                placeholder="e.g. Substation Arc Flash Safety & 330kV Isolation Protocol"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="form-text-input"
              />
            </div>

            <div className="form-field-group">
              <label className="field-label">Curriculum Description *</label>
              <textarea
                placeholder="Comprehensive overview of learning objectives, statutory standards, and target competencies..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className="form-text-input"
              />
            </div>

            <div className="form-row-duo">
              <div className="form-field-group">
                <div className="flex-between">
                  <label className="field-label">Category *</label>
                  {!showAddCategory && (
                    <button
                      type="button"
                      onClick={() => setShowAddCategory(true)}
                      className="btn-text-link"
                    >
                      + Add New
                    </button>
                  )}
                </div>
                {!showAddCategory ? (
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-text-input"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <div className="add-category-inline">
                    <input
                      type="text"
                      placeholder="Category name..."
                      value={addCategoryInput}
                      onChange={(e) => setAddCategoryInput(e.target.value)}
                      className="form-text-input"
                    />
                    <button type="button" onClick={handleAddNewCategory} className="btn-small-confirm">Add</button>
                    <button type="button" onClick={() => setShowAddCategory(false)} className="btn-small-cancel">Cancel</button>
                  </div>
                )}
              </div>

              <div className="form-field-group">
                <label className="field-label">Delivery Method</label>
                <select
                  value={newDeliveryMethod}
                  onChange={(e) => setNewDeliveryMethod(e.target.value as any)}
                  className="form-text-input"
                >
                  <option value="Virtual">Virtual (Online Webinar)</option>
                  <option value="Physical">Physical (On-Premises / Plant Site)</option>
                </select>
              </div>
            </div>

            {newDeliveryMethod === "Virtual" && (
              <div className="form-row-duo highlighted-subrow">
                <div className="form-field-group">
                  <label className="field-label">Virtual Platform</label>
                  <select
                    value={newMeetingPlatform}
                    onChange={(e) => setNewMeetingPlatform(e.target.value as any)}
                    className="form-text-input"
                  >
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Zoom">Zoom</option>
                  </select>
                </div>
                <div className="form-field-group">
                  <label className="field-label">Meeting Link / Teams URL</label>
                  <input
                    type="url"
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    value={newMeetingLink}
                    onChange={(e) => setNewMeetingLink(e.target.value)}
                    className="form-text-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: ASSIGN TRAINER */}
          <div className="form-section-group highlighted-section">
            <div className="section-label-chip">Step 2: Assign Lead Trainer (Workforce Delegation)</div>

            <div className="governance-notice-box">
              <span className="material-symbols-outlined icon-small text-amber">info</span>
              <div className="text-xs">
                <strong>HR Workforce Rule:</strong> All 451 corporate staff are registered as Learners. As Admin/HR, designate any colleague below to lead this course as its certified <strong>Course Trainer</strong>.
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

          {/* SECTION 3: AUDIENCE SCOPE */}
          <div className="form-section-group highlighted-section">
            <div className="section-label-chip">Step 3: Target Audience Scope (HR Decision Gate)</div>

            <div className="audience-decision-grid">
              <label
                className={`audience-decision-card ${newAudienceScope === "ALL" ? "active" : ""}`}
                onClick={() => setNewAudienceScope("ALL")}
              >
                <div className="decision-radio-row">
                  <input
                    type="radio"
                    name="scopeOption"
                    checked={newAudienceScope === "ALL"}
                    onChange={() => setNewAudienceScope("ALL")}
                  />
                  <span className="material-symbols-outlined icon-medium text-amber">public</span>
                  <span className="decision-title">ALL Transcorp Group</span>
                </div>
                <p className="decision-desc">
                  Open to all 451 corporate learners across Transcorp Power, Transcorp Hotels, and Corporate Centre.
                </p>
                <div className="decision-stat-chip">Enrolls 451 Learners</div>
              </label>

              <label
                className={`audience-decision-card ${newAudienceScope === "SUBSIDIARY" ? "active" : ""}`}
                onClick={() => setNewAudienceScope("SUBSIDIARY")}
              >
                <div className="decision-radio-row">
                  <input
                    type="radio"
                    name="scopeOption"
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
                  min={50}
                  max={100}
                  value={newPassMark}
                  onChange={(e) => setNewPassMark(Number(e.target.value))}
                  className="form-text-input"
                />
              </div>
              <div className="form-field-group">
                <label className="field-label">Duration (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="form-text-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions-footer">
            <button type="button" onClick={onClose} className="btn-secondary-flat">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary-action btn-amber">
              <span className="material-symbols-outlined icon-small">
                {isSubmitting ? "sync" : "rocket_launch"}
              </span>
              <span>{isSubmitting ? "Initiating in Cloud..." : "Initiate Course & Assign Trainer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
