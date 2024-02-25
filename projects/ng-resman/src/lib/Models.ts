import { Observable } from "rxjs";
import { StatusManager } from "./StatusManager";
import { Signal } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";

export interface ResourceManagement<BaseResponseT> {
    readonly status: StatusManager;

    list<ResponseT = BaseResponseT[]>(): ResourceResponse<ResponseT>;

    details<ResponseT = BaseResponseT>(id: ResourceId):  ResourceResponse<ResponseT>;

    create<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(body: BodyT): ResourceResponse<ResponseT>;

    update<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(id: ResourceId, body: BodyT): ResourceResponse<ResponseT>;

    delete<ResponseT = BaseResponseT>(id: ResourceId): ResourceResponse<ResponseT>;

    pipeRequest?<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(request: Observable<BodyT>): Observable<HttpResponse<ResponseT>>;
}

export type ResourceResponse<T> = Observable<HttpResponse<T>>;
// export type ResourceResponse<T1> = Observable<HttpResponse<T1>> | Signal<HttpResponse<T1>>;

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

export interface ResourceOptions {
    httpClient?: HttpClient,
    apiUrl?: string
    prefix?: string,
    routesOptions?: RoutesOptions,
    useSignals?: boolean,
}

export interface ResourceActionOptions<ResponseT = any, BodyT = ResponseT> {
    type?: 'get' | 'post' | 'put' | 'delete',
    path?: string,
    id?: ResourceId,
    idLocation?: string,
    body?: BodyT,
    params?: {
        [param: string]: any
    }
}

export type ResourceActionDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;