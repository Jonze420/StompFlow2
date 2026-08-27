import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stompflow.app',
  appName: 'StompFlow',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    hostname: 'localhost',
  },
};

export default config;