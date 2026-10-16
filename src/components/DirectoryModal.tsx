import React, { useState, useEffect } from "react";
import { PAGES_DIRECTORY } from "../types/lms";
import type { AuthUser } from "../context/AuthContext";

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  user?: AuthUser | null;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  user,
}) => {
  const isAdmin = user?.isAdmin ?? false;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Filter pages based on role: Learners cannot see Admin or Assessment Builder pages
  const accessiblePages = PAGES_DIRECTORY.filter((p) => {
    if (!isAdmin) {
      if (p.category === "Admin & Executive" || p.category === "Assessments & Builder") return false;
    }
    return true;
  });

  const filtered = accessiblePages.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(accessiblePages.map((p) => p.category)));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="directory-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="directory-modal-header">
          <div className="directory-brand-badge">
            <div className="count-circle">24</div>
            <div>
              <h2 className="directory-title">Transcorp LMS Page Directory</h2>
              <p className="directory-subtitle">Browse all 24 reconstructed pages and modules</p>
            </div>
          </div>
          <button onClick={onClose} className="directory-close-btn" aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="directory-search-bar">
          <div className="search-field-wrapper">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Filter by page title, feature, or keyword (e.g. certificate, quiz, admin)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="directory-search-input"
              autoFocus
            />
          </div>
        </div>

        {/* Page List */}
        <div className="directory-modal-scroll">
          {categories.map((category) => {
            const items = filtered.filter((p) => p.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category} className="directory-category-section">
                <div className="directory-category-header">
                  <span className="category-title">{category}</span>
                  <span className="category-count">{items.length}</span>
                </div>
                <div className="directory-grid">
                  {items.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onClose();
                      }}
                      className="directory-page-card"
                    >
                      <div className="page-card-top">
                        <span className="page-title">{item.title}</span>
                        {item.badge && (
                          <span className={`page-badge badge-${item.badge.toLowerCase()}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="page-desc">{item.desc}</p>
                      <div className="page-path-row">
                        <span className="path-code">{item.path}</span>
                        <span className="material-symbols-outlined nav-arrow">arrow_forward</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
