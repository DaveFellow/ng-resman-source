import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ResourceManagement, ResourceActionOptions, ResourceId, ResourceResponse, ResourceProps, RouteIdLocation, RequestSettings } from "./Models";
import { RoutesManager } from "./RoutesManager";
import { StatusManager } from "./StatusManager";
import { inject } from "@angular/core";
import { ResourceAction, DeleteResource, GetResource, PostResource, PutResource } from "./ResourceActionDecorator";

export abstract class ResourceManager<BaseResponseT = any> implements ResourceManagement<BaseResponseT> {
    public readonly status: StatusManager = new StatusManager;
    public readonly http: HttpClient = inject(HttpClient);
    public routes: RoutesManager;

    constructor(props: ResourceProps) {
        if (typeof props === 'string') {
            this.routes = new RoutesManager({
                prefix:     props ?? '',
                idLocation: 'beforePath',
            });
            return;
        }
    
        this.routes = new RoutesManager({
            prefix:     props.prefix ?? '',
            apiUrl:     props.apiUrl ?? '',
            idLocation: props.idLocation ?? 'beforePath',
        });
    }

    @GetResource()
    list<ResponseT = BaseResponseT[]>(): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>;
    }

    @GetResource()
    details<ResponseT = BaseResponseT>(id: ResourceId): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>;
    }

    @PostResource()
    create<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(body: BodyT): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>;
    }

    @PutResource()
    update<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(id: ResourceId, body: BodyT): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>;
    }

    @DeleteResource()
    delete<ResponseT>(id: ResourceId): ResourceResponse<ResponseT> {
        return new Observable<HttpResponse<ResponseT>>;
    }

    getRequestSettings(options: ResourceActionOptions = {}): RequestSettings {
        const { path, params, id } = options;

        const url: string = this.routes.build(path ?? '', id);
        const httpParams: HttpParams = new HttpParams({ fromObject: params });

        return { url, params: httpParams };
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
