import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProductsActions from '../actions/products.actions'
import * as SearchFormActions from '../actions/search-form.actions'
import { ProductsService } from "../services/products.services";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";

@Injectable()
export class ProductsEffects {
  constructor(private actions$: Actions, private productsService: ProductsService) {
    console.log('🔥 ProductsEffects constructor called');
  }

  //"$" => Observable
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.productsService.getProducts().pipe(
          switchMap(products => {
            const categories = Array.from(new Set(products.map(c => c.category)));
            console.log('✅ Extracted categories:', categories);
            return [
              ProductsActions.loadProductsSuccess({ products }),
              ProductsActions.setCategories({categories}),
              SearchFormActions.setCategories({ categories }),
            ];
          }),
          catchError(error => {
            return of(ProductsActions.loadProductsFailure({ error: error.message }));
          })
        )
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.addProduct),
      mergeMap(({ product }) =>
        this.productsService.addProduct(product).pipe(
          map(newProduct => ProductsActions.addProductSuccess({ product: newProduct })),
          catchError(error => of(ProductsActions.addProductFailure({ error })))
        )
      )
    )
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProduct),
      mergeMap(({ product }) =>
        this.productsService.updateProduct(product).pipe(
          map(updated => ProductsActions.updateProductSuccess({ product: updated })),
          catchError(error => of(ProductsActions.updateProductFailure({ error })))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.deleteProduct),
      mergeMap(({ id }) =>
        this.productsService.deleteProduct(id).pipe(
          map(() => ProductsActions.deleteProductSuccess({ id })),
          catchError(error => of(ProductsActions.deleteProductFailure({ error })))
        )
      )
    )
  );
}
