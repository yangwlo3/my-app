import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgrxFormsModule, FormGroupState } from 'ngrx-forms';
import { SearchFormValue } from '../reducers/search-form.reducer';
import { DropdownModule } from 'primeng/dropdown';
import { ProductFormValue } from '../reducers/products.reducer';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    NgrxFormsModule,
    DropdownModule,
  ]
})
export class ProductsTableComponent {
  //@Input makes property receivable from container component
  @Input() products: Product[] = [];
  @Input() loading = false;
  @Input() dialogVisible = false;
  @Input() editMode = false;
  //@Input() productForm!: FormGroup;
  @Input() searchForm: FormGroupState<SearchFormValue> | null = null;
  @Input() productForm: FormGroupState<ProductFormValue> | null = null;

  //@Output makes component.ts workable
  @Output() deleteProduct = new EventEmitter<number>();
  @Output() openAddDialog = new EventEmitter<void>();
  @Output() openEditDialog = new EventEmitter<Product>();
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveProduct = new EventEmitter<void>();
  @Output() resetSearchForm = new EventEmitter<void>();

  onOpenAddDialog() {
    this.openAddDialog.emit();
  }

  onOpenEditDialog(product: Product) {
    this.openEditDialog.emit(product);
  }

  onSaveProduct() {
    this.saveProduct.emit();
  }

  onDeleteProduct(id: number) {
    this.deleteProduct.emit(id);
  }

  onCloseDialog() {
    this.closeDialog.emit();
  }

  onResetSearchForm(){
    this.resetSearchForm.emit();
  }
}
