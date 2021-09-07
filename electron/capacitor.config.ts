import { ElectronCapacitorConfig } from '@capacitor-community/electron';

const config: ElectronCapacitorConfig = {
  appId: 'net.wolkeneis.eiswald',
  appName: 'eiswald',
  webDir: 'build',
  bundledWebRuntime: false,
  electron: {
    customUrlScheme: 'capacitor-electron',
    trayIconAndMenuEnabled: false,
    splashScreenEnabled: false,
    splashScreenImageName: 'splash.png',
    hideMainWindowOnLaunch: false,
    deepLinkingEnabled: true,
    deepLinkingCustomProtocol: 'eiswald',
  }
};

export default config;
