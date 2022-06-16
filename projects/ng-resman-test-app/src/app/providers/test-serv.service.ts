import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceManager } from 'dist/ng-resman';

@Injectable({
  providedIn: 'root'
})
export class TestServService extends ResourceManager<Object> {

  constructor(override http: HttpClient) {
    super(http, 'test2test', {
      apiUrl: 'http://localhost:8000'
    });
  }
}
