import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, OperatorFunction } from "rxjs";
import { ResourceManagement, ResourceActionOptions, ResourceId, ResourceResponse, RouteIdLocation, RequestSettings, UrlParams, ResourceCache, ResourceEffects, RouteOptions } from "./Models";
import { buildUrl } from "./Utils";
import { StatusManager } from "./StatusManager";
import { inject, signal } from "@angular/core";
import { DeleteResource, GetResource, PostResource, PutResource } from "./ResourceActionDecorator";

export abstract class ResourceManager<BaseResponseT = any> implements ResourceManagement<BaseResponseT> {
    public readonly status: StatusManager = new StatusManager;
    public readonly http: HttpClient = inject(HttpClient);
    
    public apiUrl: string = '';
    public prefix: string = '';
    public idLocation: RouteIdLocation = 'beforePath';
    public effects: ResourceEffects = {}
    
    private cache: ResourceCache = {}
    public storeInCache: boolean = true;

    protected get routeOptions(): RouteOptions {
        return {
            prefix: this.prefix,
            apiUrl: this.apiUrl,
            idLocation: this.idLocation
        }
    }

    protected get route() {
        return buildUrl(this.routeOptions);
    }

    @GetResource('')
    list<ResponseT = BaseResponseT[]>(params?: UrlParams): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>();
    }

    @GetResource('', ['id'])
    details<ResponseT = BaseResponseT>(id: ResourceId, params?: UrlParams): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>();
    }

    @PostResource('', ['body'])
    create<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(body: BodyT, params?: UrlParams): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>();
    }

    @PutResource('', ['id', 'body'])
    update<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(id: ResourceId, body: BodyT, params?: UrlParams): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>();
    }

    @DeleteResource('', ['id'])
    delete<ResponseT>(id: ResourceId, params?: UrlParams): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>();
    }

    getRequestSettings(options: ResourceActionOptions = {}): RequestSettings {
        const {
            path,
            params,
            id,
            prefix = this.prefix,
            apiUrl = this.apiUrl,
            idLocation = this.idLocation
        } = options;

        const url: string = buildUrl({ id, path, prefix, apiUrl, idLocation });

        return { url, params: new HttpParams({ fromObject: params }) };
    }

    private setCached<T = any>(actionName: string, data: T): void {
        if (!this.storeInCache) return;
        const cachedData = this.cached<T>(actionName);
        if (cachedData) {
            cachedData.next(data);
            return;
        }
        this.cache[actionName] = new BehaviorSubject<T>(data);
    } 

    cached<T = unknown>(actionName: string): BehaviorSubject<T> | undefined {
        return this.cache[actionName] as BehaviorSubject<T>;
    }

    protected setActionDefaults(actionName: string, initialCachedData?: any): void {
        if (this.cached(actionName) !== undefined || this.status.get(actionName) !== undefined) {
            return;
        }
        this.status.setIdle(actionName);
        this.setCached(actionName, initialCachedData);
    }

    pipeRequest<ResponseT = BaseResponseT>(request: ResourceResponse<ResponseT>, actionName: string = ''): ResourceResponse<ResponseT> {
        this.status.setLoading(actionName);
        const effects = (this.effects[actionName] ?? []) as [];

        const pipedRequest = request.pipe(
            map((response) => {
                this.status.setSuccess(actionName);
                return response;
            }),
            catchError((err) => {
                this.status.setError(actionName);
                throw err;
            }),
            ...effects
        );

        return pipedRequest.pipe(
            map((result) => {
                this.setCached(actionName, result)
                return result;
            })
        )
    }
}
