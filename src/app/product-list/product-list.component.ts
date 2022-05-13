import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../product/product';
import { ProductService } from '../product-service/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { take } from 'rxjs';
import { LoaderService } from '../interceptors/loader.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

  config: any;
  tableHeaders: string[] = ['Name', 'Description', 'Price', 'Colour', 'Battery', 'Actions','ImageURL'];
  productsList: Product[] = [];
  constructor(private productService: ProductService, private router: Router, public dialog: MatDialog,
    public loaderService: LoaderService) {
    this.config = {
      itemsPerPage: 6,
      currentPage: 1,
      totalItems: this.productsList?.length
    };
  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  pageChanged(event: any) {
    this.config.currentPage = event;
  }

  getAllProducts() {
    this.loaderService.isLoading.next(true);
    this.productService.getAllProducts().subscribe((data: any) => {
      this.productsList = data;
      this.loaderService.isLoading.next(false);
    });
  }

  onEdit(product: Product) {
    this.router.navigate(['/edit'], { queryParams: { id: product.id } });
  }

  onDelete(productId: number) {
    // document.getElementById('products-list')?.classList.add('dialog-body');
    this.openDialog("Are you sure you want to delete the product ?", productId);
  }
  onViewClick(product : Product) {
    this.router.navigate(['/view'], { queryParams: { id: product.id } });
  }

  openDialog(message: string, id: number) {
    const config = {
      width: 'auto',
      height: 'auto',
      data: {
        message, buttonText: { ok: 'Yes', cancel: 'No' }
      }
    };
    this.dialog.open(ConfirmationDialogComponent, config).afterClosed().pipe(take(1)).subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loaderService.isLoading.next(true);
        this.productService.deleteProduct(id).subscribe((data: any) => {
          this.loaderService.isLoading.next(false);
        });
        this.getAllProducts();
      }
    });
  }
}
