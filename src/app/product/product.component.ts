import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../interceptors/loader.service';
import { ProductService } from '../product-service/product.service';
import { Product } from './product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productForm!: FormGroup;
  editMode: boolean = false;
  productId!: number;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router,
    private activatedRoute: ActivatedRoute, public loaderService: LoaderService) { }

  ngOnInit(): void {
    
    this.productForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      colour: new FormControl('', [Validators.required]),
      battery: new FormControl('', [Validators.required]),
      imageURL: new FormControl('',[Validators.required],)
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id']) {
        this.loaderService.isLoading.next(true);
        this.productService.getProductById(params['id']).subscribe((respose: Product) => {
          this.productId = params['id'];
          this.productForm.patchValue({
            name: respose.name,
            description: respose.description,
            price: respose.price,
            colour: respose.colour,
            battery: respose.battery,
            imageURL: respose.imageURL
          });
          this.editMode = true;
          this.loaderService.isLoading.next(false);
        });
      }
    });
  }

  onSubmit() {
    this.loaderService.isLoading.next(true);
    if (this.editMode) {
      this.productService.updateProduct(this.productForm.value, this.productId).subscribe((data: any) => {
        this.loaderService.isLoading.next(false);
      });
    } else {
      this.productService.saveProduct(this.productForm.value).subscribe((data: any) => {
        this.loaderService.isLoading.next(false);
      });
    }
    this.productForm.reset();
    // this.router.navigate(['/']);
    window.location.assign('/');
  }

  onKeyPress(event: any) {
    const regex = /^[0-9.,]*$/
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }
}
