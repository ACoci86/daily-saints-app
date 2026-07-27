import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { Share } from '@capacitor/share';
import { SaintService, SaintDay, Saint } from '../saint.service';
import { NotifyService } from '../notify.service';
import { FavouritesService } from '../favourites.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})
export class HomePage implements OnInit {

  private saintService = inject(SaintService); // gives access to SaintService so it can use getDay()
  private notifyService = inject(NotifyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private favourites = inject(FavouritesService);

  day: SaintDay | null = null;

  // Quick in-memory lookup of which saints are saved, for the filled/outline icons.
  private favKeys = new Set<string>();

  ngOnInit() {
    this.notifyService.scheduleNext30Days();
  }

  // Runs every time this tab becomes visible.
  async ionViewWillEnter() {
    // Load the date the calendar sent us; if there's none, load today.
    const date = this.route.snapshot.queryParamMap.get('date');
    this.day = await this.saintService.getDay(date ?? new Date());

    // Load which saints are already favourited, so the icons show filled/outline.
    const favs = await this.favourites.list();
    this.favKeys = new Set(favs.map(f => this.keyFor(f.date, f.name)));

    // Drop the date from the address so the next visit defaults back to today.
    if (date) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true,
      });
    }
  }

  // Saves the saint if it isn't saved yet, or removes it if it already is.
  async toggleFavourite(saint: Saint) {
    const date = this.day!.date;
    const key = this.keyFor(date, saint.name);

    if (this.favKeys.has(key)) {
      await this.favourites.remove(date, saint.name);
      this.favKeys.delete(key); // update the quick lookup so the icon empties
    } else {
      await this.favourites.add({ date, name: saint.name, image: saint.image });
      this.favKeys.add(key); // update the quick lookup so the icon fills
    }
  }

  // Opens the phone's share sheet with this saint's name and Wikipedia link.
  async shareSaint(saint: Saint) {
    await Share.share({
      title: saint.name,
      text: `Saint of the day: ${saint.name}`,
      url: saint.wikipedia ?? '',
      dialogTitle: 'Share this saint',
    });
  }

  // True if this saint is currently saved (used by the template for the icon).
  isFav(saint: Saint): boolean {
    return this.day ? this.favKeys.has(this.keyFor(this.day.date, saint.name)) : false;
  }

  // Builds the unique key for a saint: date + name.
  private keyFor(date: string, name: string): string {
    return `${date}|${name}`;
  }
}
