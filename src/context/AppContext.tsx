"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CURRENT_USER,
  DRAFTS,
  INITIATIVES,
  NOTIFICATIONS,
} from "@/lib/mock-data";
import type {
  AiRequestData,
  CurrentUser,
  DashboardView,
  DraftItem,
  GateId,
  Initiative,
  NotificationItem,
  Role,
} from "@/lib/types";

// --- Persistence (localStorage, no backend) -------------------
// Holds the mutable app data — including every gate review inside
// `initiatives.gateReviews`, since all workbench edits flow through
// updateInitiative(). Bump the version to discard incompatible old
// data after a shape change in mock-data/types.
const STORAGE_VERSION = 2;
const STORAGE_KEY = `aigov-state-v${STORAGE_VERSION}`;

interface PersistedState {
  initiatives: Initiative[];
  notifications: NotificationItem[];
  drafts: DraftItem[];
  user: CurrentUser;
}

interface WizardState {
  open: boolean;
  mode: "new" | "reapproval";
  initialData?: AiRequestData;
  draftId?: string;
  startStep?: number;
  seq: number; // increments per open → used as a remount key
}

interface WorkbenchState {
  open: boolean;
  initiativeId?: string;
  gate: GateId;
  seq: number; // increments per open → used as a remount key
}

interface AppContextValue {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;

  user: CurrentUser;
  setDashboardView: (v: DashboardView) => void;
  toggleRole: (r: Role) => void;

  initiatives: Initiative[];
  getInitiative: (id?: string) => Initiative | undefined;
  updateInitiative: (id: string, patch: Partial<Initiative>) => void;
  addInitiative: (init: Initiative) => void;

  notifications: NotificationItem[];
  unreadCount: number;
  markAllRead: () => void;

  drafts: DraftItem[];
  addDraft: (d: DraftItem) => void;

  // Modals
  wizard: WizardState;
  openWizard: (opts?: Partial<WizardState>) => void;
  closeWizard: () => void;

  workbench: WorkbenchState;
  openWorkbench: (initiativeId: string, gate: GateId) => void;
  closeWorkbench: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(true); // demo: start logged in
  const [user, setUser] = useState<CurrentUser>(CURRENT_USER);
  const [initiatives, setInitiatives] = useState<Initiative[]>(INITIATIVES);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(NOTIFICATIONS);
  const [drafts, setDrafts] = useState<DraftItem[]>(DRAFTS);

  const [wizard, setWizard] = useState<WizardState>({
    open: false,
    mode: "new",
    seq: 0,
  });
  const [workbench, setWorkbench] = useState<WorkbenchState>({
    open: false,
    gate: 1,
    seq: 0,
  });

  // Tracks whether the one-time hydrate from localStorage has run, so the
  // initial (mock-seeded) render can't overwrite persisted data on first save.
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once on mount. localStorage is client-only, so this runs in an
  // effect (never during SSR) — avoiding a hydration mismatch at the cost of
  // a brief flash of the seed data on reload.
  useEffect(() => {
    // Syncing an external store (localStorage) INTO React on mount is the
    // sanctioned effect use-case; set-state-in-effect is a false positive here.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<PersistedState>;
        if (Array.isArray(s.initiatives)) setInitiatives(s.initiatives);
        if (Array.isArray(s.notifications)) setNotifications(s.notifications);
        if (Array.isArray(s.drafts)) setDrafts(s.drafts);
        if (s.user) setUser(s.user);
      }
    } catch {
      // Corrupt or incompatible persisted state → keep the seeded mock data.
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist on every change, but only after hydration.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const state: PersistedState = { initiatives, notifications, drafts, user };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota exceeded / storage disabled → stay in-memory for this session.
    }
  }, [hydrated, initiatives, notifications, drafts, user]);

  const login = useCallback(() => setLoggedIn(true), []);
  const logout = useCallback(() => setLoggedIn(false), []);

  const setDashboardView = useCallback(
    (v: DashboardView) => setUser((u) => ({ ...u, dashboardView: v })),
    [],
  );

  const toggleRole = useCallback(
    (r: Role) =>
      setUser((u) => ({
        ...u,
        roles: u.roles.includes(r)
          ? u.roles.filter((x) => x !== r)
          : [...u.roles, r],
      })),
    [],
  );

  const getInitiative = useCallback(
    (id?: string) => initiatives.find((i) => i.id === id),
    [initiatives],
  );

  const updateInitiative = useCallback(
    (id: string, patch: Partial<Initiative>) =>
      setInitiatives((list) =>
        list.map((i) => (i.id === id ? { ...i, ...patch } : i)),
      ),
    [],
  );

  const addInitiative = useCallback(
    (init: Initiative) => setInitiatives((list) => [init, ...list]),
    [],
  );

  const markAllRead = useCallback(
    () => setNotifications((list) => list.map((n) => ({ ...n, read: true }))),
    [],
  );

  const addDraft = useCallback(
    (d: DraftItem) => setDrafts((list) => [d, ...list]),
    [],
  );

  const openWizard = useCallback(
    (opts?: Partial<WizardState>) =>
      setWizard((w) => ({
        open: true,
        mode: "new",
        startStep: 1,
        initialData: undefined,
        draftId: undefined,
        ...opts,
        seq: w.seq + 1,
      })),
    [],
  );
  const closeWizard = useCallback(
    () => setWizard((w) => ({ ...w, open: false })),
    [],
  );

  const openWorkbench = useCallback(
    (initiativeId: string, gate: GateId) =>
      setWorkbench((w) => ({
        open: true,
        initiativeId,
        gate,
        seq: w.seq + 1,
      })),
    [],
  );
  const closeWorkbench = useCallback(
    () => setWorkbench((w) => ({ ...w, open: false })),
    [],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value: AppContextValue = {
    loggedIn,
    login,
    logout,
    user,
    setDashboardView,
    toggleRole,
    initiatives,
    getInitiative,
    updateInitiative,
    addInitiative,
    notifications,
    unreadCount,
    markAllRead,
    drafts,
    addDraft,
    wizard,
    openWizard,
    closeWizard,
    workbench,
    openWorkbench,
    closeWorkbench,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
