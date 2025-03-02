import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",  // 'theme' is a state which is set to coffee by default
  setTheme: (theme) => {                                // 'setTheme' is a function that sets the theme
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));