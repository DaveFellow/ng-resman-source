import { Injectable } from '@angular/core';
import { ResourceActionOptions, ResourceManager, RouteIdLocation } from 'dist/ng-resman';
import { GetResource } from 'projects/ng-resman/src/lib/ResourceActionDecorator';
import { Observable } from 'rxjs';

interface PokemonData {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class TestServService extends ResourceManager<PokemonData> {
  override prefix = 'pokemon';

  @GetResource()
  public getPokemon(options: ResourceActionOptions) {
    return new Observable<PokemonData>();
  }
}
