import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blackcrown.barber',
  appName: 'Black Crown Barber',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
