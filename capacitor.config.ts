import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'dailySaintsApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#f7f3e9',
      showSpinner: false,
      androidScaleType: 'CENTER_INSIDE',
    },
  },
};

export default config;
