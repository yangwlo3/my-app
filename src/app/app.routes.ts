import { Routes } from '@angular/router';
import { UsersComponent } from './users/containers/users-page.container';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products',
    loadChildren: () =>
      import('./products/products.module').then((m) => m.ProductsModule)
  },
  { path: 'users', component: UsersComponent }
];
