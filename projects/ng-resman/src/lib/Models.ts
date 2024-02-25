import { Observable } from "rxjs";
import { StatusManager } from "./StatusManager";
import { Signal } from "@angular/core";
import { HttpResponse } from "@angular/common/http";

export interface Resource<T> {
    readonly status: StatusManager;

    list<ResponseT = T[]>(): Observable<HttpResponse<ResponseT>> | Signal<HttpResponse<ResponseT>>;

    details<ResponseT = T>(id: ResourceId):  Observable<HttpResponse<ResponseT>> | Signal<HttpResponse<ResponseT>>;

    create<ResponseT = T, BodyT = Partial<T>>(body: BodyT): Observable<HttpResponse<ResponseT>> | Signal<HttpResponse<ResponseT>>;

    update<ResponseT = T, BodyT = Partial<T>>(id: ResourceId, body: BodyT): Observable<HttpResponse<ResponseT>> | Signal<HttpResponse<ResponseT>>;

    delete<ResponseT = T>(id: ResourceId): Observable<HttpResponse<ResponseT>> | Signal<HttpResponse<ResponseT>>;

    pipeRequest?<ResponseT = T, BodyT = Partial<T>>(request: Observable<BodyT>): Observable<HttpResponse<ResponseT>>;
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