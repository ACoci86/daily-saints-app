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

    this.notifyService.scheduleNext30Days();
  }
}
