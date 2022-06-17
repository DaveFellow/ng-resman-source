import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceId, ResourceManager } from 'dist/ng-resman';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestServService extends ResourceManager<Object> {

  constructor(override http: HttpClient) {
    super(http, 'test2test', {
      apiUrl: 'http://localhost:8000'
    });
  }

  public releasePayment(paymentId: ResourceId): Observable<Object> {
    const path: string = this.routes.concatId(paymentId, 'release');

    const url: string = this.routes.buildUrl(path);

    const request: Observable<Object> = this.http.get(url);

    return this.pipeRequest(request, 'release-payment') as Observable<Object>;
}
}
