/**
 * HR / Admin Role Store
 * Manages who has Admin/HR access to the Learning Assessment Hub.
 * Persists to localStorage. Seeded with Segun Oyetade as the default HR.
 */

const HR_STORAGE_KEY = "transcorp_lms_hr_admins_v1";

export interface HRAdmin {
  id: string;
  fullName: string;
  email: string;
  subsidiary: string;
  role: "HR Super Admin" | "HR Learning Admin" | "HR Viewer";
  addedOn: string;
}

const DEFAULT_HR_ADMINS: HRAdmin[] = [
  {
    id: "TRC-007",
    fullName: "Segun Oyetade",
    email: "segun.oyetade@transcorpgroup.com",
    subsidiary: "Transcorp Group HQ",
    role: "HR Super Admin",
    addedOn: "2026-01-01",
  },
  {
    id: "TRC-AMAKA",
    fullName: "Amaka Okafor",
    email: "amaka.okafor@transcorpgroup.com",
    subsidiary: "Transcorp Group HQ",
    role: "HR Learning Admin",
    addedOn: "2026-01-01",
  },
];

function loadHRAdmins(): HRAdmin[] {
  try {
    const raw = localStorage.getItem(HR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HRAdmin[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return [...DEFAULT_HR_ADMINS];
}

let inMemoryAdmins: HRAdmin[] = loadHRAdmins();
const hrListeners: Array<(admins: HRAdmin[]) => void> = [];

function persistHRAndNotify() {
  try {
    localStorage.setItem(HR_STORAGE_KEY, JSON.stringify(inMemoryAdmins));
  } catch {
    // storage fallback
  }
  hrListeners.forEach((fn) => fn([...inMemoryAdmins]));
}

export const HRAdminStore = {
  getAll(): HRAdmin[] {
    return [...inMemoryAdmins];
  },

  /** Primary HR email for notifications — always the Super Admin */
  getPrimaryHREmail(): string {
    const superAdmin = inMemoryAdmins.find((a) => a.role === "HR Super Admin");
    return superAdmin?.email ?? "segun.oyetade@transcorpgroup.com";
  },

  subscribe(callback: (admins: HRAdmin[]) => void): () => void {
    hrListeners.push(callback);
    callback([...inMemoryAdmins]);
    return () => {
      const idx = hrListeners.indexOf(callback);
      if (idx !== -1) hrListeners.splice(idx, 1);
    };
  },

  isAdmin(email: string): boolean {
    return inMemoryAdmins.some(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
  },

  addAdmin(admin: Omit<HRAdmin, "addedOn">): boolean {
    if (this.isAdmin(admin.email)) return false;
    inMemoryAdmins = [
      ...inMemoryAdmins,
      { ...admin, addedOn: new Date().toISOString().slice(0, 10) },
    ];
    persistHRAndNotify();
    return true;
  },

  removeAdmin(email: string): void {
    // Cannot remove the last Super Admin
    const superAdmins = inMemoryAdmins.filter((a) => a.role === "HR Super Admin");
    const target = inMemoryAdmins.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (target?.role === "HR Super Admin" && superAdmins.length <= 1) {
      throw new Error("Cannot remove the last Super Admin.");
    }
    inMemoryAdmins = inMemoryAdmins.filter(
      (a) => a.email.toLowerCase() !== email.toLowerCase()
    );
    persistHRAndNotify();
  },

  updateRole(email: string, role: HRAdmin["role"]): void {
    const idx = inMemoryAdmins.findIndex(
      (a) => a.email.toLowerCase() === email.toLowerCase()
    );
    if (idx !== -1) {
      inMemoryAdmins = inMemoryAdmins.map((a, i) =>
        i === idx ? { ...a, role } : a
      );
      persistHRAndNotify();
    }
  },
};
