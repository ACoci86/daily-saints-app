import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: 'today', loadComponent: () => import('./home/home.page').then((m) => m.HomePage) },
      { path: 'calendar', loadComponent: () => import('./calendar/calendar.page').then((m) => m.CalendarPage) },
      { path: 'favorites', loadComponent: () => import('./favorites/favorites.page').then((m) => m.FavoritesPage) },
      { path: 'more', loadComponent: () => import('./more/more.page').then((m) => m.MorePage) },
      { path: '', redirectTo: 'today', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/today',
    pathMatch: 'full',
  },
];
