import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skillbazar.app',
  appName: 'SkillBazar',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    url: 'https://skillbazar-theta.vercel.app',
    cleartext: true
  }
};

export default config;
