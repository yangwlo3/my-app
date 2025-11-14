import { createAction, props } from "@ngrx/store";

export const resetSearchForm = createAction(
  '[Search Form] Reset'
);

export const setCategories = createAction(
  '[Search Form] Set Categories',
  props<{ categories: String[] }>()
);
