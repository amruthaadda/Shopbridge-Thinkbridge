import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Product } from 'src/app/product/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Using JSON server as a backend for this project;
  // To start the JSON server(runs on 3000 port) give a command "npm run json:server" (Added json:server in scripts of package.json)

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this.http.get('http://localhost:3000/products');
  }
  
  saveProduct(product: Product): Observable<any> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify(product);
    return this.http.post( 'http://localhost:3000/products', body, {headers: headers});
  }

  getProductById(productId: number) {
    return this.http.get('http://localhost:3000/products/' + productId);
  }

  updateProduct(product: Product, productId: number) {
    return this.http.put('http://localhost:3000/products/' + productId , product);
  }

  deleteProduct(productId: number) {
    return this.http.delete('http://localhost:3000/products/' + productId);
  }
}
