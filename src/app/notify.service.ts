import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  async askPermission(): Promise<boolean> {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  }

  // Sets a notification to fire every morning at 8:00am.
  async scheduleDaily(saintName: string) {
    const granted = await this.askPermission();
    if (!granted) return;

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Saint of the Day',
          body: `Today: ${saintName}`,
          schedule: { on: { hour: 8, minute: 0 }, repeats: true }, // every day at 8:00am
        },
      ],
    });
  }
}