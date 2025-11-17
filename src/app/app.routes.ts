import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/contact-list/contact-list').then(m => m.ContactList)
  },
  {
    path: 'contact/new',
    loadComponent: () => import('./components/contact-form/contact-form').then(m => m.ContactForm)
  },
  {
    path: 'contact/edit/:id',
    loadComponent: () => import('./components/contact-form/contact-form').then(m => m.ContactForm)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
