import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { FormGroupState, NgrxFormsModule} from "ngrx-forms";
import { SearchFormValue } from '../reducers/search-user.reducer';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    TableModule,
    AsyncPipe,
    NgIf,
    NgrxFormsModule
]
})

export class UsersTableComponent{
  @Input() filteredUsers: any[] = [];
  @Input() users: any[] = [];
  @Input() loading = false;
  @Input() dialogVisible = false;
  @Input() editMode = false;
  @Input() searchForm$: Observable<FormGroupState<SearchFormValue>> | null = null;
  @Input() userForm!: FormGroup;

  @Output() search = new EventEmitter<void>();
  @Output() onOpenAddDialog = new EventEmitter<void>();
  @Output() onFetchUsers = new EventEmitter<void>();
  @Output() onOpenEditDialog = new EventEmitter<any>();
  @Output() conConfirmDelete = new EventEmitter<number>();
  @Output() onSaveUser = new EventEmitter<void>();

  onSearch(){
    this.search.emit();
  }

  openAddDialog(){
    this.onOpenAddDialog.emit();
  }

  fetchUsers(){
    this.onFetchUsers.emit();
  }

  openEditDialog(user: any){
    this.onOpenEditDialog.emit(user);
  }

  confirmDelete(id: number){
    this.conConfirmDelete.emit(id);
  }

  saveUser(){
    this.onSaveUser.emit();
  }
}
