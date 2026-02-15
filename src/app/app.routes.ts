import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent
      ),
  },
];
