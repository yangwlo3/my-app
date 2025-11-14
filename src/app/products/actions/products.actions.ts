import { createAction, props } from "@ngrx/store";
import { Product } from "../models/product.model";

//===Load Products===
export const loadProducts = createAction(
  '[Products Page] Load Products'
);

export const loadProductsSuccess = createAction(
  '[Products API] Load Products Success',
  props<{ products: Product[] }>()
); //call API

export const loadProductsFailure = createAction(
  '[Products API] Load Products Failure',
  props<{ error: any }>()
); //save retrieved products in Store

//===Add Product===
export const addProduct = createAction(
  '[Products Dialog] Add Product',
  props<{ product: Product }>()
); //call API

export const addProductSuccess = createAction(
  '[Products API] Add Product Success',
  props<{ product: Product }>()
); //add product to Store state

export const addProductFailure = createAction(
  '[Products API] Add Product Failure',
  props<{ error: any }>()
)

//===Update Product===
export const updateProduct = createAction(
  '[Products Dialog] Update Product',
  props<{ product: Product }>()
);

export const updateProductSuccess = createAction(
  '[Products API] Update Product Success',
  props<{ product: Product }>()
);

export const updateProductFailure = createAction(
  '[Products API] Update Product Failure',
  props<{ error: any }>()
);

//===Delete product===
export const deleteProduct = createAction(
  '[Products Table] Delete Product',
  props<{ id: number }>()
); //call API

export const deleteProductSuccess = createAction(
  '[Products API] Delete Product Success',
  props<{ id: number }>()
); //API success, reducer change data state in Store to remove the product

export const deleteProductFailure = createAction(
  '[Products API] Delete Product Failure',
  props<{ error: any }>()
);

//===Dialog State===
export const openDialog = createAction(
  '[Products Page] Open Dialog',
  props<{product?: Product | null}>() //null for Add, product for Edit
); //set dialogVisible = true

export const closeDialog = createAction(
  '[Products Dialog] Close Dialog'
); //set dialogVisible = false

//Categories dropdown list in product form
export const setCategories = createAction(
  '[Product Form] Set Categories',
  props<{ categories: String[] }>()
);

//
