import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  // The drawer label we store the notification time under.
  private storageKey = 'notifyTime';

  // Reads the saved reminder time as "HH:MM" (defaults to 08:00 if none saved).
  async getTime(): Promise<string> {
    const stored = await Preferences.get({ key: this.storageKey });
    return stored.value ?? '08:00';
  }

  // Saves the reminder time as "HH:MM".
  async setTime(time: string): Promise<void> {
    await Preferences.set({ key: this.storageKey, value: time });
  }

  // The drawer label for whether daily reminders are switched on.
  private enabledKey = 'notifyEnabled';

  // Are daily reminders on? Defaults to true (on) if never set.
  async isEnabled(): Promise<boolean> {
    const stored = await Preferences.get({ key: this.enabledKey });
    return stored.value !== 'false';
  }

  // Turn daily reminders on or off.
  async setEnabled(enabled: boolean): Promise<void> {
    await Preferences.set({ key: this.enabledKey, value: String(enabled) });
  }
}
