import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResourceManager } from '@davefellow/ng-resource-manager';

@Injectable({
  providedIn: 'root'
})
export class TestServService extends BaseResourceManager<Object> {

  constructor(override http: HttpClient) {
    super(http);
    this.setPrefix('test-test-test');
  }
}
