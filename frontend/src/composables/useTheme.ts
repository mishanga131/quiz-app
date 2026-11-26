import { ref, watch } from 'vue';

export type Theme = 'night' | 'corporate';
const KEY = 'quiz-app:theme';

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'night' || saved === 'corporate') return saved;
  } catch {
    /* ignore */
  }
  return 'night';
}

/** Перемикання теми DaisyUI (темна / світла). */
export function useTheme() {
  const theme = ref<Theme>(initialTheme());

  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value;
      try {
        localStorage.setItem(KEY, value);
      } catch {
        /* ignore */
      }
    },
    { immediate: true },
  );

  const toggle = () => {
    theme.value = theme.value === 'night' ? 'corporate' : 'night';
  };

  return { theme, toggle };
}
