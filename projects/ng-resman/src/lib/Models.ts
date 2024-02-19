import { Observable } from "rxjs";
import { StatusManager } from "./StatusManager";

export interface Resource<T> {
    readonly status: StatusManager;

    list(): Observable<unknown>;

    details(id: ResourceId): Observable<T>;

    create(body: T): Observable<unknown>;

    update(id: ResourceId, body: T): Observable<unknown>;

    destroy(id: ResourceId): Observable<unknown>;

    pipeRequest?<T>(request: Observable<unknown>): Observable<unknown>;
}

export type ResourceId = string | number;

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface RoutesOptions {
    prefix?: string,
    apiUrl?: string,
    idLocation?: RouteIdLocation
}

export type RouteIdLocation = 'afterPath' | 'beforePath';

export interface QueryParams {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}

export interface ResourceActionOptions {
    customPath?: string,
    params?: {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>
    }
}

export interface ObjectLiteral {
  [key: string]: any;
}
