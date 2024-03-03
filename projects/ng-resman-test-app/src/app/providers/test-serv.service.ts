import { Injectable } from '@angular/core';
import { GetResource, ResourceActionOptions, ResourceManager } from 'dist/ng-resman';
import { Observable } from 'rxjs';

interface PokemonData {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class TestServService extends ResourceManager<PokemonData> {
  override readonly prefix = 'pokemon';

  @GetResource('', ['id'])
  public getPokemon(id: string) {
    return new Observable<PokemonData>();
  }
}
