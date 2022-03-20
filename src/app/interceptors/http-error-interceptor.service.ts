import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, of, retry, throwError } from "rxjs";

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .pipe(retry(1),
                catchError((error) => {
                    let handled = false;
                    if (error instanceof HttpErrorResponse) {
                        if (!(error.error instanceof ErrorEvent)) {
                            switch (error.status) {
                                // we have to implement the logic that what we want to do when we got differet status codes.
                                // Currently I just gave navigation to one route which is not implemented. Depending upon our realtime requirement we can implement. 
                                case 401:
                                case 403:
                                case 404:
                                case 500:
                                case 200:
                                case 201:
                                    handled = true;
                                    break;
                            }
                        }
                    }
                    if (handled) {
                        return of(error);
                    } else {
                        return throwError(() => new Error(error));
                    }
                }))
    }

}