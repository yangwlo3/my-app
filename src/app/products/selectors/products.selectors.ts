import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ProductsState } from "../reducers/products.reducer";

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(
  selectProductsState,
  (state) => {
    console.log('selectAllProducts state:', state);
    return state ? state.products : [];
  }
);

export const selectLoading = createSelector(
  selectProductsState,
  state => state.loading
);

export const selectDialogVisible = createSelector(
  selectProductsState,
  state => state.dialogVisible
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  state => state.selectedProduct
);

export const selectProductForm = createSelector(
  selectProductsState,
  state => state.form
)
