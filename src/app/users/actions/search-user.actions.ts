import { createAction, props } from "@ngrx/store";

export const filterUsers = createAction(
  '[User API] Search User', props<{search: string}>()
);
