import { Injectable } from '@angular/core';
import { ResourceActionOptions, ResourceManager } from 'dist/ng-resman';
import { GetResource } from 'projects/ng-resman/src/lib/ResourceActionDecorator';
import { ResourceProps } from 'projects/ng-resman/src/lib/ResourceManagerDecorator';
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
@ResourceProps('pokemon')
export class TestServService extends ResourceManager<PokemonData> {
  @GetResource()
  public getPokemon(options: ResourceActionOptions) {
    return new Observable<PokemonData>;
  }
}
