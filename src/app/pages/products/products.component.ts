import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../core/models/product.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ConfirmDialogModule, InputTextareaModule, DialogModule, TableModule, ToastModule, ReactiveFormsModule, HttpClientModule, NgIf, ProgressSpinnerModule, ButtonModule, InputTextModule, NgClass],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  editMode = false;
  dialogVisible = false;

  searchForm = this.fb.group({
    query: ['']
  });

  productForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    title: this.fb.control<string>('', [Validators.required]),
    price: this.fb.control<number>(0, [Validators.required]),
    description: this.fb.control<string>(''),
    category: this.fb.control<string>('')
  });

  constructor(private fb: FormBuilder, private productsService: ProductsService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.fetchProducts();

    this.searchForm.get('query')?.valueChanges.subscribe((val) => {
      this.applyFilter(val || '');
    });

    //enable or disable description based on category
    this.productForm.get('category')?.valueChanges.subscribe((categoryValue) => {
      const descriptionControl = this.productForm.get('description');

      if (categoryValue && categoryValue.trim() != '') {
        descriptionControl?.enable();
      } else {
        descriptionControl?.disable();
      }
    });

    //initially disable description
    const initialCategory = this.productForm.get('category')?.value;
    if (!initialCategory || initialCategory.trim() === '') {
      this.productForm.get('description')?.disable();
    }
  }

  fetchProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Loaded', detail: 'Products loaded successfully!' });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products.' });
        console.error('Error fetching products', err);
      }
    });
  }

  applyFilter(query: string) {
    const lower = query.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
    );
  }

  openAddDialog() {
    this.productForm.reset();
    this.editMode = false;
    this.dialogVisible = true;
    this.productForm.get('title')?.enable();
  }

  openEditDialog(product: Product) {
    this.productForm.patchValue(product);
    this.editMode = true;
    this.dialogVisible = true;
    this.productForm.get('title')?.disable();
  }

  saveProduct() {
    //check if form is valid
    if(this.productForm.invalid){ //validation based on form group
      this.productForm.markAllAsTouched(); //show all validation errors include error from HTML
      this.messageService.add({severity: 'warn', summary: 'Validation error', detail: 'Please fill in all required fields.'});
      return; //stop execution
    }

    const formValue = this.productForm.getRawValue() as Product; //getRawValue because title field is disabled when updating

    if (this.editMode) {
      //update product
      this.productsService.updateProduct(formValue).subscribe({
        next: (updated) => {
          const index = this.products.findIndex(p => p.id === updated.id);
          if (index > -1) {
            this.products[index] = updated;
            this.filteredProducts = [...this.products];
          }
          this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Product updated successfully!' });
          this.dialogVisible = false; //close dialog after success
          //this.fetchProducts();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product.' });
        }
      })
    } else {
      //add product
      this.productsService.addProduct(formValue).subscribe({
        next: (newProduct) => {
          this.products.push(newProduct);
          this.filteredProducts = [...this.products]; //move inside next
          this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Product added successfully!' });
          this.dialogVisible = false;
          //this.fetchProducts();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product.' });
        }
      });
    }
  }

  confirmDelete(productId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteProduct(productId);
      }
    })
  }

  deleteProduct(productId: number) {
    this.productsService.deleteProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== productId);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== productId);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Product ID ${productId} deleted successfully`
        });
      },
      error: (err) => {
        console.error('Deleted failed', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete product'
        });
      }
    });
  }
}
