import { Injectable } from '@angular/core';
import { ResourceActionOptions, ResourceManager } from 'dist/ng-resman';
import { GetResource } from 'projects/ng-resman/src/lib/ResourceActionDecorator';
import { Observable } from 'rxjs';

interface PokemonData {
  [key: string]: any
}

interface DigimonData {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class TestServService extends ResourceManager<PokemonData> {
  constructor() {
    super({
      apiUrl: 'https://pokeapi.co/api/v2',
      prefix: 'pokemon',
    });
  }

  @GetResource()
  public getPokemon(options: ResourceActionOptions) {
    return new Observable<PokemonData>;
  }
}
