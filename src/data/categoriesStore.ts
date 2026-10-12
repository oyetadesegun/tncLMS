/**
 * Categories Store — persists custom course categories to localStorage.
 * Seeded with Transcorp Group defaults; admin can add new ones freely.
 */

const CAT_STORAGE_KEY = "transcorp_lms_categories_v1";

const DEFAULT_CATEGORIES: string[] = [
  "Information Security & Compliance",
  "Engineering & Plant Operations",
  "Hospitality & Guest Experience",
  "Corporate Governance & Ethics",
  "Finance & Statutory Audit",
  "Health, Safety & Environment (HSE)",
];

function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [...DEFAULT_CATEGORIES];
}

let inMemoryCategories: string[] = loadCategories();
const catListeners: Array<(cats: string[]) => void> = [];

function persistCatsAndNotify() {
  try {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(inMemoryCategories));
  } catch {
    // storage fallback
  }
  catListeners.forEach((fn) => fn([...inMemoryCategories]));
}

export const CategoriesStore = {
  getAll(): string[] {
    return [...inMemoryCategories];
  },

  subscribe(callback: (cats: string[]) => void): () => void {
    catListeners.push(callback);
    callback([...inMemoryCategories]);
    return () => {
      const idx = catListeners.indexOf(callback);
      if (idx !== -1) catListeners.splice(idx, 1);
    };
  },

  /** Add a new category (trimmed, deduped, case-insensitive). Returns false if already exists. */
  addCategory(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) return false;
    const exists = inMemoryCategories.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return false;
    inMemoryCategories = [...inMemoryCategories, trimmed];
    persistCatsAndNotify();
    return true;
  },

  /** Remove a custom category (cannot remove if it's used by an existing course). */
  removeCategory(name: string): void {
    inMemoryCategories = inMemoryCategories.filter((c) => c !== name);
    persistCatsAndNotify();
  },

  /** Reset to defaults */
  reset(): void {
    inMemoryCategories = [...DEFAULT_CATEGORIES];
    persistCatsAndNotify();
  },
};
