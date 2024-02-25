import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ResourceManagement, ResourceActionOptions, ResourceId, ResourceResponse, RoutesOptions } from "./Models";
import { RoutesManager } from "./RoutesManager";
import { StatusManager } from "./StatusManager";
import { Signal, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { GetResource, PostResource } from "./ResourceManagerDecorators";

interface RequestSettings {
    url: string,
    params: HttpParams
}

export abstract class ResourceManager<BaseResponseT = any, BaseBodyT = BaseResponseT> implements ResourceManagement<BaseResponseT> {
    public readonly status: StatusManager = new StatusManager;

    public readonly http: HttpClient;

    public readonly routes: RoutesManager;

    constructor(
        public httpClient?: HttpClient,
        public prefix?: string,
        public routesOptions?: RoutesOptions,
        public useSignals?: boolean
    ) {
        this.http = this.httpClient ?? inject(HttpClient);

        this.routes = new RoutesManager({
            prefix:     prefix || routesOptions?.prefix || '',
            apiUrl:     routesOptions?.apiUrl,
            idLocation: routesOptions?.idLocation
        });
    }

    @GetResource({ path: '' })
    list<ResponseT = BaseResponseT[]>(): ResourceResponse<ResponseT> {
        return new Observable;
    }

    @GetResource({ path: '' })
    details<ResponseT = BaseResponseT>(id: ResourceId): ResourceResponse<ResponseT> {
        return new Observable;
    }

    @PostResource({ path: '' })
    create<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(body: BodyT): ResourceResponse<ResponseT> {
        return new Observable;
    }

    @PostResource({ path: '' })
    update<ResponseT = BaseResponseT, BodyT = Partial<ResponseT>>(id: ResourceId, body: BodyT): ResourceResponse<ResponseT> {
        return new Observable;
    }

    @PostResource({ path: '' })
    delete<ResponseT>(id: ResourceId): ResourceResponse<ResponseT> {
        return new Observable;
    }

    getRequestSettings(options: ResourceActionOptions = {}): RequestSettings {
        const { path, params, id } = options;

        const url: string = this.routes.build(path ?? '', id);
        const httpParams: HttpParams = new HttpParams({ fromObject: params });

        return { url, params: httpParams };
    }

    pipeRequest<ResponseT = BaseResponseT, BodyT = ResponseT>(request: Observable<BodyT | any>, actionName: string = ''): Observable<HttpResponse<ResponseT>> {
        this.status.setLoading(actionName);

        return request.pipe(
            map(response => {
                const httpResponse = response;
                this.status.setSuccess(actionName);
                return httpResponse;
            }),
            catchError((err, response) => {
                this.status.setError(actionName);
                throw err;
            })
        );
    }
}
