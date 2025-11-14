import { createFormGroupState, updateGroup, wrapReducerWithFormStateUpdate, onNgrxForms, FormGroupState } from "ngrx-forms";
import { createReducer, on } from "@ngrx/store";
import * as SearchFormActions from '../actions/search-form.actions'

export interface SearchFormValue {
  query: string;
  category: string;
}

export interface SearchFormState {
  form: FormGroupState<SearchFormValue>
}

export const SEARCH_FORM_ID = 'searchForm';

export const initialFormState = createFormGroupState<SearchFormValue>(
  SEARCH_FORM_ID,
  {
    query: '',
    category: '',
  }
);

export const initialState: SearchFormState = {
  form: initialFormState,
};

export const searchFormReducer = wrapReducerWithFormStateUpdate(
  createReducer(
    initialState,
    onNgrxForms(),

    on(SearchFormActions.resetSearchForm, (state) => ({
      ...state,
      form: initialFormState,
    })),

    //set search category options
    on(SearchFormActions.setCategories, (state, { categories }) => ({
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
  updateGroup<SearchFormValue>({})
);
