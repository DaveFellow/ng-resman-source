import { BehaviorSubject, Observable, OperatorFunction } from "rxjs";
import { StatusManager } from "./StatusManager";
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Signal } from "@angular/core";

export interface ResourceManagement<BaseResponseT> {
    http: HttpClient;
    status: StatusManager;
    apiUrl: string;
    prefix: string;
    idLocation: RouteIdLocation;
    storeInCache: boolean;

    list<ResponseT = BaseResponseT[]>(params: UrlParams): ResourceResponse<ResponseT>;

    details<ResponseT = BaseResponseT>(id: ResourceId, params: UrlParams):  ResourceResponse<ResponseT>;

    create<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(body: BodyT, params: UrlParams): ResourceResponse<ResponseT>;

    update<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(id: ResourceId, body: BodyT, params: UrlParams): ResourceResponse<ResponseT>;

    delete<ResponseT = BaseResponseT>(id: ResourceId, params: UrlParams): ResourceResponse<ResponseT>;

    pipeRequest<ResponseT = BaseResponseT>(request: ResourceResponse<ResponseT>): ResourceResponse<ResponseT>;

    getRequestSettings(options: ResourceActionOptions): { url: string, params: { [param: string]: any } };
}

export type ResourceResponse<T = any> = Observable<HttpResponse<T>>;

export type ResourceId = string | number;

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface RouteOptions {
    id?: ResourceId,
    path?: string,
    prefix?: string,
    apiUrl?: string,
    idLocation?: RouteIdLocation
}

export type RouteIdLocation = 'afterPath' | 'beforePath';

export interface QueryParams {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}

export interface UrlParams {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}

export type ResourceActionVerb = 'get' | 'post' | 'put' | 'delete';

export type ResourceActionArgsSetup = ('id' | 'body')[];
export interface ResourceActionOptions<ResponseT = any, BodyT = ResponseT> extends RouteOptions {
    type?: ResourceActionVerb,
    body?: BodyT,
    params?: UrlParams,
    argsSetup?: ResourceActionArgsSetup
}

export type ResourceActionDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any;

export type ResourceActionProps = ResourceActionOptions | string | ResourceActionArgsSetup | undefined;

export interface RequestSettings {
    url: string,
    params: HttpParams
}

export interface ResourceCache {
    [key: string]: BehaviorSubject<any>
}

export type Readonly<T> = {
    [K in keyof T]-?: T[K] extends object ? Readonly<T[K]> : T[K]
}

export interface ResourceEffects {
    [key: string]: OperatorFunction<unknown, unknown>[]
}