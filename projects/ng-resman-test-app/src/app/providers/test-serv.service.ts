import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceId, ResourceManager, ResourceResponse } from 'dist/ng-resman';
import { GetResource, ResourceAction } from 'projects/ng-resman/src/lib/ResourceManagerDecorators';
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

  constructor(override httpClient: HttpClient) {
    super(httpClient, 'pokemon', {
      apiUrl: 'https://pokeapi.co/api/v2'
    });
  }

  public releasePayment(paymentId: ResourceId): Observable<Object> {
    const path: string = this.routes.concatId(paymentId, 'release');

    const url: string = this.routes.buildUrl(path);

    const request: Observable<Object> = this.httpClient.get(url);

    return this.pipeRequest(request, 'release-payment') as Observable<Object>;
  }

  @GetResource({
    id: 'pikachu',
    path: ''
  })
  public getPokemon(foo: string, bar: number, asd: Object) {
    return new Observable<PokemonData>;
  }
}
