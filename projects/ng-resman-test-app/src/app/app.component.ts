import { HttpParams, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TestServService } from './providers/test-serv.service';
import { ResourceManager } from 'ng-resman';

type PokemonData = {}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-resman-test-app';

  get listData() {
    return this.testServ.cached<PokemonData[]>('list');
  }

  constructor(public testServ: TestServService) {}

  ngOnInit(): void {
    console.log('CACHED LIST BEFORE: ', this.listData);
    this.testServ.list().subscribe(r => {
      console.log('CACHED LIST: ', this.listData?.getValue());
    });
    this.testServ.details('ditto').subscribe();
    // this.testServ.create({name: 'tangela', number: 123}).subscribe();
    // this.testServ.update('caterpie', {name: 'Butterfree', number: 14}).subscribe();
    // this.testServ.delete('ditto').subscribe();
    this.testServ.getPokemon('pikachu').subscribe();    
  }
}