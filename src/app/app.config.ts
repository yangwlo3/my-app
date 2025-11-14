import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { ProductsEffects } from './products/effects/products.effects';
import { provideHttpClient } from '@angular/common/http';
import { productsReducer } from './products/reducers/products.reducer';
import { provideAnimations } from '@angular/platform-browser/animations';
import { searchFormReducer } from './products/reducers/search-form.reducer';
import { searchUserFormReducer } from './users/reducers/search-user.reducer';


console.log('✅ Importing ProductsEffects:', ProductsEffects);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({products: productsReducer, searchForm: searchFormReducer, userSearch: searchUserFormReducer}),
    provideEffects([ProductsEffects]),
    provideStoreDevtools(),
    provideAnimations()
  ]
};
