import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoaderService } from "./loader.service";

export class LoaderInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

    constructor(private loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let showLoader = true;
        if (showLoader) {
            this.requests.push(req);
            this.loaderService.isLoading.next(true);
            return Observable.create((observer: any) => {
                const subscription = next.handle(req).subscribe(event => {
                    if (event instanceof HttpResponse) {
                        this.removeRequest(req);
                        observer.next(event);
                    }
                },
                    err => { this.removeRequest(req); observer.error(err); },
                    () => { this.removeRequest(req); observer.complete(); });

                return () => {
                    this.removeRequest(req);
                    subscription.unsubscribe();
                };
            });

        } else {
            return next.handle(req);
        }
    }

    removeRequest(req: HttpRequest<any>) {
        const i = this.requests.indexOf(req);
        if (i >= 0) {
            this.requests.splice(i, 1);
        }
        this.loaderService.isLoading.next(this.requests.length > 0);
    }


}