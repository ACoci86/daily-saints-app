import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { FavouritesService, Favourite } from '../favourites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: 'favorites.page.html',
  styleUrls: ['favorites.page.scss'],
  imports: [IonContent],
})
export class FavoritesPage {
  private favourites = inject(FavouritesService);
  private router = inject(Router);

  // The saved favourites to show on screen.
  favs: Favourite[] = [];

  // Runs every time the tab is opened, so the list is always up to date.
  async ionViewWillEnter() {
    this.favs = await this.favourites.list();
  }

  // Jump to the Today tab showing this saint's day.
  open(fav: Favourite) {
    this.router.navigate(['/tabs/today'], { queryParams: { date: fav.date } });
  }

  // Remove this favourite, then refresh the list so the row disappears.
  async remove(fav: Favourite) {
    await this.favourites.remove(fav.date, fav.name);
    this.favs = await this.favourites.list();
  }
}
