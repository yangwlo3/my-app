import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { User } from '../../core/models/user.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from "primeng/inputtext";
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { UsersTableComponent } from "../components/users-table.component"
import { SearchFormValue } from '../reducers/search-user.reducer';
import { FormGroupState } from 'ngrx-forms';
import * as SearchUserSelector from '../selectors/search-user.selectors'
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, UsersTableComponent, DialogModule, NgIf, TableModule, ButtonModule, ReactiveFormsModule, InputTextModule, ConfirmDialogModule, ToastModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users-page.container.html'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  filteredUsers: User[] = [];
  editMode = false;
  dialogVisible = false;

  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService,
    private store: Store
  ) {
    this.searchForm$ = this.store.select(SearchUserSelector.selectSearchFormValue)
  }

  searchForm$: Observable<FormGroupState<SearchFormValue>>;

  userForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    username: this.fb.control<string>(''),
    email: this.fb.control<string>(''),
    password: this.fb.control<string>(''),
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  //subscription is async
  onSearch() {
    this.searchForm$
      .subscribe(searchFormState => {
        const value = searchFormState.value.query;
        console.log('Search Value:', value)
        if (!value) {
          this.filteredUsers = this.users;
          return;
        }
        //check if it is string or number
        const searchValue = isNaN(Number(value)) ? value : Number(value);
        console.log('Search type:', typeof searchValue, 'Value:', searchValue);
        this.applyFilter(searchValue);
      })
  }

  fetchUsers() {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.filteredUsers = data;
        this.users = data;
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Loaded', detail: 'Users loaded successfully!' });
      },

      error: (err) => {
        console.error('Error fetching users', err);
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users.' });
      }
    });
  }

  applyFilter(searchValue: string | number) {
    console.log('Applying filter with:', searchValue);
    console.log('Users array:', this.users);

    if (typeof searchValue === 'number') {
      this.filteredUsers = this.users.filter(u => u.id === searchValue);
    } else {
      this.filteredUsers = this.users.filter(u => u.username.toLowerCase().includes(searchValue.toLowerCase()));
    }
    console.log('Filtered users:', this.filteredUsers);
  }

  openAddDialog() {
    this.userForm.reset();
    this.editMode = false;
    this.dialogVisible = true;
  }

  openEditDialog(user: User) {
    this.userForm.patchValue(user);
    this.editMode = true;
    this.dialogVisible = true;
  }

  saveUser() {
    const formValue = this.userForm.value as User;

    if (this.editMode) {
      //update user
      this.usersService.updateUser(formValue).subscribe({
        next: (updated) => {
          const index = this.users.findIndex(p => p.id === updated.id);
          if (index > -1) {
            this.users[index] = updated;
            this.filteredUsers = [...this.users];
          }
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'User update successfully!' });
          this.dialogVisible = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user.' });
        }
      })
    } else {
      //add product
      this.usersService.addUser(formValue).subscribe({
        next: (newUser) => {
          const response = {
            ...formValue,
            id: newUser.id
          };
          this.users.push(response);
          this.filteredUsers = [...this.users];
          this.messageService.add({ severity: 'success', summary: 'Added', detail: 'User added successfully!' });
          this.dialogVisible = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add user.' });
        }
      });
    }
  }

  deleteUser(userId: number) {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
        this.filteredUsers = [...this.users];
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `User ID ${userId} deleted successfully`
        });
      },
      error: (err) => {
        console.error('Deleted failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user'
        });
      }
    });
  }
  confirmDelete(userId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteUser(userId);
      }
    })
  }
}

