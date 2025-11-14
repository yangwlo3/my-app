import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

//this class can be injected into other classes as a dependency
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = 'https://fakestoreapi.com/products';

  constructor(private http: HttpClient){console.log('ProductsService initialized');}

  //Observable => notify changes of state
  getProducts(): Observable<Product[]>{
    console.log('Service: getProducts called');
    return this.http.get<Product[]>(this.apiUrl);
  }

  deleteProduct(id: number): Observable<void>{
    return this.http.delete<void>( `${this.apiUrl}/${id}`);
  }

  updateProduct(product: Product): Observable<Product>{
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  addProduct(product: Product): Observable<Product>{
    return this.http.post<Product>(this.apiUrl, product);
  }
}
