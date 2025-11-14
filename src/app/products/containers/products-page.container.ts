import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import * as ProductsActions from '../actions/products.actions';
import * as fromSearchForm from '../selectors/search-form.selectors';
import * as fromProducts from '../selectors/products.selectors'
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProductsTableComponent } from '../components/products-table.component';
import { AsyncPipe } from '@angular/common';
import { FormGroupState, MarkAsTouchedAction, DisableAction } from 'ngrx-forms';
import { SearchFormValue } from '../reducers/search-form.reducer';
import * as SearchFormActions from '../actions/search-form.actions'
import { ProductFormValue, PRODUCT_FORM_ID } from '../reducers/products.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.container.html',
  standalone: true,
  imports: [
    ProductsTableComponent,
    ToastModule,
    ConfirmDialogModule,
    AsyncPipe
  ],
  providers: [MessageService, ConfirmationService]
})
export class ProductsPageContainer implements OnInit {
  // Observables from store
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  dialogVisible$: Observable<boolean>;
  selectedProduct$: Observable<Product | null>;
  searchForm$: Observable<FormGroupState<SearchFormValue>>;
  productForm$: Observable<FormGroupState<ProductFormValue>>;

  // Local state for form and UI
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];
  editMode = false;

  /*
  productForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    title: this.fb.control<string>('', [Validators.required]),
    price: this.fb.control<number>(0, [Validators.required]),
    description: this.fb.control<string>(''),
    category: this.fb.control<string>('')
  });
  */

  constructor(
    private store: Store,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.products$ = this.store.select(fromProducts.selectAllProducts);
    this.loading$ = this.store.select(fromProducts.selectLoading);
    this.dialogVisible$ = this.store.select(fromProducts.selectDialogVisible);
    this.selectedProduct$ = this.store.select(fromProducts.selectSelectedProduct);
    this.searchForm$ = this.store.select(fromSearchForm.selectSearchForm);
    this.productForm$ = this.store.select(fromProducts.selectProductForm);
  }

  ngOnInit() {
    this.store.dispatch(ProductsActions.loadProducts());

    // Debug: Check if categories are in the form
    this.productForm$.subscribe(form => {
      console.log('📋 Product Form userDefinedProperties:', form.userDefinedProperties);
      console.log('📋 Categories in form:', form.userDefinedProperties?.['categories']);
    });

    this.products$.subscribe(products => {
      console.log('Products from store:', products);
      this.allProducts = products;
      this.filteredProducts = products;
    });

    // when user typing, search form state changed and automatically update Store "onNgrxForms()"
    // when searchForm$ emits new value, onSearchChange execute again
    // cause: subscription
    this.searchForm$.subscribe(form => {
      if (!form || !form.value) return;

      const query = form.value.query?.trim().toLowerCase() || '';
      const category = form.value.category?.trim().toLowerCase() || '';

      if (query || category) {
        this.onSearchChange(query, category);
      } else {
        this.filteredProducts = this.allProducts;
      }
    });

    // Enable/disable description based on category
    /*
    this.productForm.get('category')?.valueChanges.subscribe((categoryValue) => {
      const descriptionControl = this.productForm.get('description');
      if (categoryValue && categoryValue.trim() !== '') {
        descriptionControl?.enable();
      } else {
        descriptionControl?.disable();
      }
    });
    */

    // Initially disable description
    /*
    const initialCategory = this.productForm.get('category')?.value;
    if (!initialCategory || initialCategory.trim() === '') {
      this.productForm.get('description')?.disable();
    }
    */

    // Watch for selected product (for edit mode)
    // Set form values using ngrx-forms action
    this.selectedProduct$.subscribe(product => {
      if (product) {
        this.editMode = true;
        // Disable title field using ngrx-forms action
        this.store.dispatch(new DisableAction(`${PRODUCT_FORM_ID}.title`));
      }
    });
  }

  onSearchChange(query: string, category: string) {
    this.filteredProducts = this.allProducts.filter(p => {
      const matchesQuery = !query || p.title.toLowerCase().includes(query);
      const matchesCategory = !category || p.category.toLowerCase().includes(category);
      return matchesQuery && matchesCategory; // both must match if both are provided
    });
  }

  onOpenAddDialog() {
    this.editMode = false;
    this.store.dispatch(ProductsActions.openDialog({ product: null }));
  }

  onOpenEditDialog(product: Product) {
    this.editMode = true;
    this.store.dispatch(ProductsActions.openDialog({ product }));
  }

  onSaveProduct() {
    // Subscribe to get current form state
    this.productForm$.pipe(take(1)).subscribe(form => {
      console.log('Form state after opening add dialog:', {
        isValid: form.isValid,
        isInvalid: form.isInvalid,
        isTouched: form.isTouched,
        isDirty: form.isDirty,
        isSubmitted: form.isSubmitted,
        titleControl: {
          value: form.controls.title.value,
          isValid: form.controls.title.isValid,
          isTouched: form.controls.title.isTouched,
          errors: form.controls.title.errors
        }
      });
      if (form.isInvalid) {
        this.store.dispatch(new MarkAsTouchedAction(form.id));
        this.messageService.add({
          severity: 'warn',
          summary: 'Validation error',
          detail: 'Please fill in all required fields.'
        });
        return;
      }

      const formValue = form.value as Product;

      if (this.editMode) {
        this.store.dispatch(ProductsActions.updateProduct({ product: formValue }));
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Product updated successfully!'
        });
      } else {
        this.store.dispatch(ProductsActions.addProduct({ product: formValue }));
        this.messageService.add({
          severity: 'success',
          summary: 'Added',
          detail: 'Product added successfully!'
        });
      }
    })
  }

  onDeleteProduct(productId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(ProductsActions.deleteProduct({ id: productId }));
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Product ID ${productId} deleted successfully`
        });
      }
    });
  }

  onCloseDialog() {
    this.store.dispatch(ProductsActions.closeDialog());
  }

  onResetSearchForm() {
    this.store.dispatch(SearchFormActions.resetSearchForm());
    this.filteredProducts = this.allProducts;
    console.log('Reset button clicked.');
  }
}
