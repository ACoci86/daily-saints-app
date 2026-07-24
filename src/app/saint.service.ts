import { Injectable } from "@angular/core";

// Shape of one saint
export interface Saint {

      name: string,
      feast_day: string,
      era: string | null,
      patronage: string [] | null,
      legacy: string | null,
      summary: string | null,
      image: string | null,
      wikipedia: string | null,

}

// Shape of one day
export interface SaintDay {
    date: string,
    feast_day: string,
    count: number,
    saints: Saint[];
}

@Injectable({
  providedIn: 'root',
})
export class SaintService {

        formatDate(date: Date = new Date()): string {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${month}-${day}`;

    }

        async getDay(date: Date | string = new Date()): Promise<SaintDay> {
        const fileName = date instanceof Date ? this.formatDate(date) : date;

        const response = await fetch(`assets/saints/${fileName}.json`);

        if (!response.ok) {
            throw new Error(`No data for ${fileName}`);
        }

        const saintDay: SaintDay = await response.json();

        saintDay.saints.forEach((saint) => {
            if(saint.image) {
                saint.image = `assets${saint.image}`;
            }
        })

        return saintDay;
        }

}