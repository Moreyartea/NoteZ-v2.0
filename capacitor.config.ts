import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.moreyartea.notez',
  appName: 'NoteZ',
  webDir: 'out',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_notez',
      iconColor: '#FFE135',
    },
  },
};

export default config;
