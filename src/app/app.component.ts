import { Component, OnInit } from '@angular/core';
import { LoaderService } from './interceptors/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'shopBridge';
  showLoader!: boolean;
  constructor(private loaderService: LoaderService){}
  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    this.loaderService.isLoading.subscribe((value: boolean)=> this.showLoader = value);
  }
}
