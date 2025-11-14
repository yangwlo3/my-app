import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SearchFormState, SEARCH_FORM_ID } from "../reducers/search-form.reducer";

export const selectSearchFormState = createFeatureSelector<SearchFormState>(SEARCH_FORM_ID);

// select FormGroupState itself
export const selectSearchForm = createSelector(
  selectSearchFormState,
  (state) => state.form
);

// extra (not used)
// form value (query + category)
export const selectSearchFormValue = createSelector(
  selectSearchForm,
  (form) => form.value
);

export const selectSearchQuery = createSelector(
  selectSearchFormValue,
  (value) => value.query
);

export const selectSearchCategory = createSelector(
  selectSearchFormValue,
  (value) => value.category
);
