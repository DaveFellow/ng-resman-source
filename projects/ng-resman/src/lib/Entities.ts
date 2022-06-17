import { Observable } from "rxjs";
import { StatusManager } from "./StatusManager";

export interface Resource<T> {
    readonly status: StatusManager;

    list(): Observable<Object>;
    
    details(id: ResourceId): Observable<T>;
    
    create(body: T): Observable<Object>;
    
    update(id: ResourceId, body: T): Observable<Object>;
    
    destroy(id: ResourceId): Observable<Object>;

    pipeRequest?<T>(request: Observable<Object>): Observable<unknown>;
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