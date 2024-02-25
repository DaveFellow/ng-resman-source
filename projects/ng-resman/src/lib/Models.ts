import { Observable } from "rxjs";
import { StatusManager } from "./StatusManager";
import { Signal } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { RoutesManager } from "./RoutesManager";

export interface ResourceManagement<BaseResponseT> {
    status: StatusManager;

    http: HttpClient;

    routes: RoutesManager;

    list<ResponseT = BaseResponseT[]>(): ResourceResponse<ResponseT>;

    details<ResponseT = BaseResponseT>(id: ResourceId):  ResourceResponse<ResponseT>;

    create<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(body: BodyT): ResourceResponse<ResponseT>;

    update<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(id: ResourceId, body: BodyT): ResourceResponse<ResponseT>;

    delete<ResponseT = BaseResponseT>(id: ResourceId): ResourceResponse<ResponseT>;

    pipeRequest<ResponseT = BaseResponseT>(request: ResourceResponse<ResponseT>): ResourceResponse<ResponseT>;

    getRequestSettings(options: ResourceActionOptions): { url: string, params: { [param: string]: any } }
}

export type ResourceResponse<T = any> = Observable<HttpResponse<T>>;

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

export interface ResourceManagerOptions {
    apiUrl?: string,
    prefix?: string,
    idLocation?: string,
    httpClient?: HttpClient,
}

export interface ResourceActionOptions<ResponseT = any, BodyT = ResponseT> {
    type?: 'get' | 'post' | 'put' | 'delete',
    path?: string,
    id?: ResourceId,
    body?: BodyT,
    params?: {
        [param: string]: any
    }
}

export type ResourceActionDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;