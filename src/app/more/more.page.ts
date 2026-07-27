import { Component, inject } from '@angular/core';
import { IonContent, IonToggle } from '@ionic/angular/standalone';
import { SettingsService } from '../settings.service';
import { NotifyService } from '../notify.service';

@Component({
  selector: 'app-more',
  templateUrl: 'more.page.html',
  styleUrls: ['more.page.scss'],
  imports: [IonContent, IonToggle],
})
export class MorePage {
  private settings = inject(SettingsService);
  private notify = inject(NotifyService);

  // Whether daily reminders are on, and the reminder time as "HH:MM".
  enabled = true;
  time = '08:00';

  // Load the saved settings each time the page opens.
  async ionViewWillEnter() {
    this.enabled = await this.settings.isEnabled();
    this.time = await this.settings.getTime();
  }

  // Turn reminders on/off, then reschedule (which also clears them when off).
  async onToggle(event: CustomEvent) {
    this.enabled = event.detail.checked;
    await this.settings.setEnabled(this.enabled);
    await this.notify.scheduleDaily();
  }

  // Pick a new time: save it and reschedule the notifications.
  async onTimeChange(event: Event) {
    const time = (event.target as HTMLInputElement).value; // "07:30"
    if (!time) return;

    await this.settings.setTime(time);
    await this.notify.scheduleDaily();
  }
}
