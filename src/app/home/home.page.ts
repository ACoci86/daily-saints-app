import { Component, OnInit, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { SaintService, SaintDay } from '../saint.service';
import { NotifyService } from '../notify.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent],
})
export class HomePage implements OnInit {

  private saintService = inject(SaintService); // gives access to SaintService so it can use getDay()
  private notifyService = inject(NotifyService);

  day: SaintDay | null = null;

  async ngOnInit() {
    this.day = await this.saintService.getDay();
    console.log(this.day)

    const firstSaint = this.day?.saints[0];
    if (firstSaint) {
      this.notifyService.scheduleDaily(firstSaint.name);
    }
  }

  // Latin day-of-month as printed in a missal, e.g. "xxiv Iulii" from "07-24".
  private static readonly LATIN_MONTHS = [
    'Ianuarii', 'Februarii', 'Martii', 'Aprilis', 'Maii', 'Iunii',
    'Iulii', 'Augusti', 'Septembris', 'Octobris', 'Novembris', 'Decembris',
  ];

  latinDate(monthDay: string): string {
    const [month, day] = monthDay.split('-').map(Number);
    if (!month || !day) return '';
    return `${this.roman(day)} ${HomePage.LATIN_MONTHS[month - 1]}`;
  }

  private roman(n: number): string {
    const table: [number, string][] = [[10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
    let out = '';
    for (const [value, sym] of table) {
      while (n >= value) { out += sym; n -= value; }
    }
    return out;
  }
}
