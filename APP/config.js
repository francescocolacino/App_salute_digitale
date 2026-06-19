import { Platform } from 'react-native';

const localHost = Platform.select({
  android: '10.0.2.2',
  ios: '127.0.0.1',
  default: 'localhost',
});

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const browserHost =
  typeof window !== 'undefined' && window.location && window.location.hostname
    ? window.location.hostname
    : null;

const defaultBaseUrl = browserHost
  ? `http://${browserHost}:8000/api`
  : `http://${localHost}:8000/api`;

export const API_BASE_URL = envBaseUrl || defaultBaseUrl;
