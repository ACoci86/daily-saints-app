import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonDatetime } from '@ionic/angular/standalone';
import { SaintService, SearchResult } from '../saint.service';

@Component({
  selector: 'app-calendar',
  templateUrl: 'calendar.page.html',
  styleUrls: ['calendar.page.scss'],
  imports: [IonContent, IonDatetime],
})
export class CalendarPage {
  private router = inject(Router);
  private saintService = inject(SaintService);

  // Matching saints for the current search text (empty when not searching).
  results: SearchResult[] = [];

  // Runs as the user types in the search box.
  async onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.results = await this.saintService.searchByName(query);
  }

  // Picked a day on the calendar: jump to that day.
  goToDate(event: CustomEvent) {
    const iso = event.detail.value as string; // e.g. "2026-07-26T00:00:00"
    const monthDay = iso.slice(5, 10); // grabs "07-26"
    this.jump(monthDay);
  }

  // Tapped a search result: jump to that saint's day.
  openResult(result: SearchResult) {
    this.jump(result.date);
  }

  private jump(monthDay: string) {
    this.router.navigate(['/tabs/today'], { queryParams: { date: monthDay } });
  }
}
