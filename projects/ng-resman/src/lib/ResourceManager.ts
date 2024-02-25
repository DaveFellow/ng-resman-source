import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Resource, ResourceActionOptions, ResourceId, RoutesOptions } from "./Models";
import { RoutesManager } from "./RoutesManager";
import { StatusManager } from "./StatusManager";
import { Signal, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";

interface RequestSettings {
    url: string,
    params: HttpParams
}

export abstract class ResourceManager<T> implements Resource<T> {
    public readonly status: StatusManager = new StatusManager;

    private readonly http: HttpClient = this.httpClient ?? inject(HttpClient);

    protected readonly routes: RoutesManager;

    constructor(
        public httpClient?: HttpClient,
        public prefix?: string,
        public routesOptions?: RoutesOptions,
        public useSignals?: boolean
    ) {
        this.routes = new RoutesManager({
            prefix:     prefix || routesOptions?.prefix || '',
            apiUrl:     routesOptions?.apiUrl,
            idLocation: routesOptions?.idLocation
        });
    }

    // RESOURCE ACTIONS
    list<ResponseT = T[]>(options: ResourceActionOptions = {}): Observable<HttpResponse<ResponseT>> | Signal<HttpResponse<ResponseT>> {
        const { url, params } = this.getRequestSettings('list', '', options);

        const request = this.http.get<ResponseT>(url, { params });

        return this.pipeRequest<ResponseT>(request, 'list');
    }


    details<ResponseT = T>(id: ResourceId, options: ResourceActionOptions = {}): Observable<HttpResponse<ResponseT>> {
        const { url, params } = this.getRequestSettings('details', id, options);

        const request = this.http.get<ResponseT>(url, { params });

        return this.pipeRequest<ResponseT>(request, 'details');
    }


    create<ResponseT = T, BodyT = Partial<T>>(body: BodyT, options: ResourceActionOptions = {}): Observable<HttpResponse<ResponseT>> {
        const { url, params } = this.getRequestSettings('create', '', options);

        const request: Observable<Object> = this.http.post(url, body, { params });

        return this.pipeRequest(request, 'create');
    }


    update<ResponseT = T, BodyT = Partial<T>>(id: ResourceId, body: BodyT, options: ResourceActionOptions = {}): Observable<HttpResponse<ResponseT>> {
        const { url, params } = this.getRequestSettings('update', id, options);

        const request = this.http.put<ResponseT>(url, body, { params });

        return this.pipeRequest(request, 'update');
    }


    delete<ResponseT>(id: ResourceId, options: ResourceActionOptions = {}): Observable<HttpResponse<ResponseT>> {
        const { url, params } = this.getRequestSettings('delete', id, options);

        const request = this.http.delete<ResponseT>(url, { params });

        return this.pipeRequest(request, 'delete');
    }


    getRequestSettings(actionName: string, id: ResourceId = '', options: ResourceActionOptions = {}): RequestSettings {
        const { customPath, params } = options;

        const url: string = this.routes.build(actionName, id, customPath);
        const httpParams: HttpParams = new HttpParams({ fromObject: params });

        return { url, params: httpParams };
    }


    // REQUEST PRE-PROCESSING
    // Hacer que esta función se aplique por medio de un Decorador
    pipeRequest<ResponseT = T, BodyT = T>(request: Observable<BodyT | any>, actionName: string = ''): Observable<HttpResponse<ResponseT>> {
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
