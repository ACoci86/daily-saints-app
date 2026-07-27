import { Injectable, inject } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private settings = inject(SettingsService);

  async askPermission(): Promise<boolean> {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  }

  // Sets up the daily reminder at the user's chosen time.
  // Uses a repeating alarm (reliable even on aggressive phones like Xiaomi) with
  // generic text, so it never shows the wrong saint. Tap it to open today's saint.
  async scheduleDaily() {
    // Clear the old reminder so we don't stack duplicates.
    await LocalNotifications.cancel(await LocalNotifications.getPending());

    // If the user switched reminders off, stop here (it's now cleared).
    if (!(await this.settings.isEnabled())) return;

    if (!(await this.askPermission())) return;

    // Read the user's chosen reminder time, e.g. "07:30".
    const [hour, minute] = (await this.settings.getTime()).split(':').map(Number);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Saint of the Day',
          body: "Tap to meet today's saint.",
          largeIcon: 'ic_notification_large', // full-colour logo shown inside the notification
          schedule: { on: { hour, minute }, repeats: true },
        },
      ],
    });
  }
}
