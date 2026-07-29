import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import OneSignal from 'onesignal-cordova-plugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    this.initOneSignal();
  }

  // OneSignal push. Only runs on a real device (the plugin isn't available in the browser).
  private initOneSignal() {
    if (!Capacitor.isNativePlatform()) return;

    OneSignal.initialize('cfe8deaf-eaaf-4bd7-bf5f-dd9bfe257da2');
    OneSignal.Notifications.requestPermission(true);
  }
}
