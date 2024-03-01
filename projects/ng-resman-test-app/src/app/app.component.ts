import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TestServService } from './providers/test-serv.service';
import { ResourceManager } from 'ng-resman';

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
    this.testServ.list().subscribe();
    this.testServ.details('ditto').subscribe();
    this.testServ.create({name: 'tangela', number: 123}).subscribe();
    this.testServ.update('caterpie', {name: 'Butterfree', number: 14}).subscribe();
    this.testServ.delete('ditto').subscribe();
    // this.testServ.getPokemon({id: 'pikachu'}).subscribe();
  }
}