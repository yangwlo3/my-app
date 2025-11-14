import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SEARCH_FORM_ID, SearchFormState } from "../reducers/search-user.reducer";

export const selectSearchFormState = createFeatureSelector<SearchFormState>(SEARCH_FORM_ID)

export const selectSearchFormValue = createSelector(
  selectSearchFormState,
  (state) => state.searchForm
);
