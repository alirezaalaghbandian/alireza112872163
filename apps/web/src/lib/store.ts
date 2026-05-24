import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  sidebarWidth: 240,
  commandPaletteOpen: false,
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
      sidebarWidth: state.sidebarCollapsed ? 240 : 60,
    })),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));

interface AuthState {
  accessToken: string | null;
  user: { id: string; email: string; name: string } | null;
  org: { id: string; name: string; slug: string } | null;
  role: string | null;
  setAuth: (data: {
    accessToken: string;
    user: { id: string; email: string; name: string };
    org: { id: string; name: string; slug: string };
    role: string;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  org: null,
  role: null,
  setAuth: (data) => set(data),
  clearAuth: () => set({ accessToken: null, user: null, org: null, role: null }),
}));
