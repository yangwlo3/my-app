import { createReducer,on } from "@ngrx/store";
import { createFormGroupState, FormGroupState, onNgrxForms, setValue, updateGroup, wrapReducerWithFormStateUpdate } from "ngrx-forms";
import * as SearchFormActions from "../actions/search-user.actions"

export interface SearchFormValue {
  query: string;
}

export interface SearchFormState {
  searchForm: FormGroupState<SearchFormValue>
}

export const SEARCH_FORM_ID = 'userSearch';

export const initialFormState: SearchFormState = {
  searchForm: createFormGroupState<SearchFormValue>(
    SEARCH_FORM_ID,
    {
      query: ''
    }
  )
}

export const searchUserFormReducer = wrapReducerWithFormStateUpdate(
  createReducer(
    initialFormState,
    onNgrxForms(),

    on(SearchFormActions.filterUsers, (state, { search }) => ({
      ...state,
      searchForm: setValue(state.searchForm, {query: search})
    }))
  ),

  (state) => state.searchForm,
  updateGroup<SearchFormValue>({})
);
