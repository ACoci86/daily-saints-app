import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acoci.dailysaints',
  appName: 'dailySaintsApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#f7f3e9',
      showSpinner: false,
      androidScaleType: 'CENTER_INSIDE',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_notification',
      iconColor: '#a3221b',
    },
  },
};

export default config;
