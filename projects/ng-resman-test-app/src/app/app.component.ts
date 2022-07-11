import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TestServService } from './providers/test-serv.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-resman-test-app';

  constructor(public testServ: TestServService) {
  }

  ngOnInit(): void {
    this.testServ.create({}).subscribe();
  }
}