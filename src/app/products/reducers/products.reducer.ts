import { createReducer, on } from "@ngrx/store";
import * as ProductsActions from '../actions/products.actions';
import { Product } from "../models/product.model";
import { reset, createFormGroupState, updateGroup, wrapReducerWithFormStateUpdate, enable, disable, FormGroupState, onNgrxForms, setValue, validate } from "ngrx-forms";
import { required } from 'ngrx-forms/validation'

export interface ProductFormValue {
  id: number | null;
  title: string;
  price: number;
  description: string;
  category: string;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: any;
  dialogVisible: boolean;
  selectedProduct: Product | null;
  form: FormGroupState<ProductFormValue> //---NgRx Form---
}

export const PRODUCT_FORM_ID = 'productForm';

export const initialFormState = createFormGroupState<ProductFormValue>(
  PRODUCT_FORM_ID,
  {
    id: null,
    title: '',
    category: '',
    price: 0,
    description: '',
  }
);

//---apply validators to initial state
const validatedFormState = updateGroup<ProductFormValue>({
  title: validate(required),
  price: validate(required)
})(initialFormState);

export const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  dialogVisible: false,
  selectedProduct: null,
  form: validatedFormState
};

//---helper to reset form while preserving userDefinedProperties
//to avoid null userDefinedProperties: categories when open add product dialog which also cause product form state reset
const resetFormWithCategories = (currentForm: FormGroupState<ProductFormValue>) => {
  const resetForm = reset(validatedFormState);
  return{
    ...resetForm,
    userDefinedProperties: currentForm.userDefinedProperties
  }
}

export const productsReducer = wrapReducerWithFormStateUpdate(
  createReducer(
    initialState,
    onNgrxForms(),

    //---Load Products---
    on(ProductsActions.loadProducts, state => ({ ...state, loading: true })),
    on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
      ...state,
      loading: false,
      products
    })),
    on(ProductsActions.loadProductsFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    })),

    //---Add Product---
    on(ProductsActions.addProductSuccess, (state, { product }) => ({
      ...state,
      products: [...state.products, product],
      dialogVisible: false,
      selectedProduct: null,
      form: resetFormWithCategories(state.form)
    })),

    //---Update Product---
    on(ProductsActions.updateProductSuccess, (state, { product }) => ({
      ...state,
      products: state.products.map(p => p.id === product.id ? product : p),
      dialogVisible: false,
      selectedProduct: null,
      form: resetFormWithCategories(state.form)
    })),

    //---Delete Product---
    on(ProductsActions.deleteProductSuccess, (state, { id }) => ({
      ...state,
      products: state.products.filter(p => p.id !== id)
    })),

    //---Dialog open---
    on(ProductsActions.openDialog, (state, { product }) => ({
      ...state,
      dialogVisible: true,
      selectedProduct: product || null,
      form: product
        ? setValue(state.form, product)
        : resetFormWithCategories(state.form)
    })),

    //---Dialog close---
    on(ProductsActions.closeDialog, state => ({
      ...state,
      dialogVisible: false,
      selectedProduct: null,
      form: resetFormWithCategories(state.form)
    })),

    //---set search category options
    on(ProductsActions.setCategories, (state, {categories}) => ({
      ...state,
      form: {
        ...state.form,
        userDefinedProperties: {
          ...state.form.userDefinedProperties,
          categories
        }
      }
    }))
  ),
  (state) => state.form,
  updateGroup<ProductFormValue>({
    title: validate(required),
    price: validate(required),
    description: (desc, parent) =>
      parent.value.category.trim() ? enable(desc) : disable(desc)
  })
);
