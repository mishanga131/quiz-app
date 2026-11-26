import axios, { AxiosError, type AxiosInstance } from 'axios';

/** Нормалізована помилка API, з якою працюють верхні шари застосунку. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base API: єдиний екземпляр Axios для всього застосунку.
 * Адреса береться з файлу оточення (.env → VITE_API_BASE_URL).
 */
export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
});

// Інтерцептор запиту: логування запитів у режимі розробки
http.interceptors.request.use((config) => {
  if (import.meta.env.DEV) console.debug(`[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Інтерцептор відповіді: перетворюємо будь-яку помилку Axios на зрозумілу ApiError
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message;
      const message =
        serverMessage ?? (status === 404 ? 'Набір запитань не знайдено (404)' : `Помилка сервера (${status})`);
      return Promise.reject(new ApiError(message, status));
    }
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new ApiError('Перевищено час очікування відповіді сервера'));
    }
    return Promise.reject(new ApiError('Немає зʼєднання з сервером. Перевірте мережу.'));
  },
);
