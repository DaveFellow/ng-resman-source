import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ResourceManagement, ResourceActionOptions, ResourceId, ResourceResponse, RouteIdLocation, RequestSettings, UrlParams } from "./Models";
import { buildUrl } from "./Utils";
import { StatusManager } from "./StatusManager";
import { inject } from "@angular/core";
import { DeleteResource, GetResource, PostResource, PutResource } from "./ResourceActionDecorator";

export abstract class ResourceManager<BaseResponseT = any> implements ResourceManagement<BaseResponseT> {
    public readonly status: StatusManager = new StatusManager;
    public readonly http: HttpClient = inject(HttpClient);

    public apiUrl: string = '';
    public prefix: string = '';
    public idLocation: RouteIdLocation = 'beforePath';

    protected get routeOptions() {
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
console.log(url);

        return { url, params: new HttpParams({ fromObject: params }) };
    }

    pipeRequest<ResponseT = BaseResponseT>(request: ResourceResponse<ResponseT>, actionName: string = ''): ResourceResponse<ResponseT> {
        this.status.setLoading(actionName);

        return request.pipe(
            map((response) => {
                this.status.setSuccess(actionName);
                return response;
            }),
            catchError((err) => {
                this.status.setError(actionName);
                throw err;
            })
        );
    }
}
