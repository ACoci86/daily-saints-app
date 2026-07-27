import { Injectable, inject } from '@angular/core';
import {
  LocalNotifications,
  LocalNotificationSchema,
} from '@capacitor/local-notifications';
import { SaintService } from './saint.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private saintService = inject(SaintService);
  private settings = inject(SettingsService);

  async askPermission(): Promise<boolean> {
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  }

  // Sets up a notification for each of the next 30 days, each showing that day's saint.
  async scheduleNext30Days() {
    // Remove the notifications we set up before, so we don't end up with duplicates.
    await LocalNotifications.cancel(await LocalNotifications.getPending());

    // If the user switched reminders off, stop here (everything is now cleared).
    if (!(await this.settings.isEnabled())) return;

    if (!(await this.askPermission())) return;

    // Read the user's chosen reminder time, e.g. "07:30".
    const [hour, minute] = (await this.settings.getTime()).split(':').map(Number);

    const notifications: LocalNotificationSchema[] = [];

    for (let day = 0; day < 30; day++) {
      const at = new Date();
      at.setDate(at.getDate() + day);
      at.setHours(hour, minute, 0, 0);
      if (at.getTime() <= Date.now()) continue; // If that time has already passed today, skip to tomorrow.

      const saint = (await this.saintService.getDay(at)).saints[0];
      notifications.push({
        id: day, // Give each day its own number so the notifications don't overwrite each other.
        title: 'Saint of the Day',
        body: `Today: ${saint.name}`,
        schedule: { at, allowWhileIdle: true },
      });
    }

    await LocalNotifications.schedule({ notifications });
  }
}
