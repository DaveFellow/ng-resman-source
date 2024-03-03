import { Injectable } from '@angular/core';
import { GetResource, ResourceActionOptions, ResourceManager } from 'dist/ng-resman';
import { Observable, map } from 'rxjs';

interface PokemonData {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class TestServService extends ResourceManager<PokemonData> {
  override readonly prefix = 'pokemon';

  // override storeInCache = false;

  override readonly effects = {
    list: [
      map((a: any) => a.results)
    ],
    getPokemon: [map(a => {
      console.log('side effect for GET POKEMON');
      return a;
    })]
  }

  constructor() {
    super();
    this.setActionDefaults('getPokemon');
  }

  @GetResource('', ['id'])
  public getPokemon(id: string) {
    return new Observable<PokemonData>();
  }
}
