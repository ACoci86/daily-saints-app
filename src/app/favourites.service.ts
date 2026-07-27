import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

// The shape of one saved favourite.
export interface Favourite {
  date: string; // "07-26"
  name: string; // "Joachim"
  image: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  // The drawer label we store all favourites under.
  private storageKey = 'favourites';

  // Reads every saved favourite back (empty list if nothing is saved yet).
  async list(): Promise<Favourite[]> {
    const stored = await Preferences.get({ key: this.storageKey });
    console.log(`this is the value ${stored.value}!`);

    // Drawer is empty, so there are no favourites.
    if (!stored.value) {
      return [];
    }

    // Storage only holds text, so turn that text back into a list.
    return JSON.parse(stored.value);
  }

  // Writes the whole list to storage (helper used by add and remove).
  async save(favourites: Favourite[]) {
    await Preferences.set({
      key: this.storageKey,
      // Turn the list into text, because storage only holds text.
      value: JSON.stringify(favourites),
    });
  }

  // Adds one saint, unless it is already saved.
  async add(fav: Favourite) {
    const current = await this.list();

    // Is this saint (same date and name) already in the list?
    const alreadyThere = current.some(f => f.date === fav.date && f.name === fav.name);
    if (alreadyThere) {
      return; // Already saved, so do nothing.
    }

    current.push(fav); // Add it on the end.
    await this.save(current);
  }

  // Removes one saint, found by its date and name.
  async remove(date: string, name: string) {
    const current = await this.list();
    // Keep everything except the saint we want to drop.
    const kept = current.filter(f => f.date !== date || f.name !== name);
    await this.save(kept);
  }

  // Answers true/false: is this saint already saved?
  async isFavourite(date: string, name: string): Promise<boolean> {
    const current = await this.list();
    return current.some(f => f.date === date && f.name === name);
  }
}
