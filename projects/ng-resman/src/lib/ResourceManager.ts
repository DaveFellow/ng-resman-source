import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ObjectLiteral, QueryParams, Resource, ResourceActionOptions, ResourceId, RoutesOptions } from "./Models";
import { RoutesManager } from "./RoutesManager";
import { StatusManager } from "./StatusManager";

interface RequestSettings {
    url: string,
    params: HttpParams
}

export abstract class ResourceManager<T> implements Resource<T> {
    public readonly status: StatusManager = new StatusManager;

    protected readonly routes: RoutesManager;

    constructor(
        public http: HttpClient,
        public prefix: string = '',
        public routesOptions?: RoutesOptions
    ) {
        this.routes = new RoutesManager({
            prefix:     prefix || routesOptions?.prefix,
            apiUrl:     routesOptions?.apiUrl,
            idLocation: routesOptions?.idLocation
        });
    }

    // RESOURCE ACTIONS
    list<ResponseT>(options: ResourceActionOptions = {}): Observable<ResponseT> {
        const { url, params } = this.getRequestSettings('list', '', options);

        const request: Observable<Object> = this.http.get(url, { params });

        return this.pipeRequest(request, 'list').pipe(
            map(response => response as ResponseT)
        );
    }


    details(id: ResourceId, options: ResourceActionOptions = {}): Observable<T> {
        const { url, params } = this.getRequestSettings('details', id, options);

        const request: Observable<Object> = this.http.get(url, { params });

        return this.pipeRequest(request, 'details').pipe(
            map(response => response as T)
        );
    }


    create<ResponseT>(body: Partial<T>, options: ResourceActionOptions = {}): Observable<ResponseT> {
        const { url, params } = this.getRequestSettings('create', '', options);

        const request: Observable<Object> = this.http.post(url, body, { params });

        return this.pipeRequest(request, 'create').pipe(
            map(response => response as ResponseT)
        );
    }


    update<ResponseT>(id: ResourceId, body: Partial<T>, options: ResourceActionOptions = {}): Observable<ResponseT> {
        const { url, params } = this.getRequestSettings('update', id, options);

        const request: Observable<Object> = this.http.put(url, body, { params });

        return this.pipeRequest(request, 'update').pipe(
            map(response => response as ResponseT)
        );
    }


    destroy<ResponseT>(id: ResourceId, options: ResourceActionOptions = {}): Observable<ResponseT> {
        const { url, params } = this.getRequestSettings('destroy', id, options);

        const request: Observable<Object> = this.http.delete(url, { params });

        return this.pipeRequest(request, 'destroy').pipe(
            map(response => response as ResponseT)
        );
    }


    getRequestSettings(actionName: string, id: ResourceId = '', options: ResourceActionOptions = {}): RequestSettings {
        const { customPath, params } = options;

        const url: string = this.routes.build(actionName, id, customPath);
        const httpParams: HttpParams = new HttpParams({ fromObject: params });

        return { url, params: httpParams };
    }


    // REQUEST PRE-PROCESSING
    pipeRequest(request: Observable<Object>, actionName: string = ''): Observable<unknown> {
        this.status.setLoading(actionName);

        return request.pipe(
            map(response => {
                const httpResponse = response as HttpResponse<T>;
                this.status.setSuccess(actionName);
                return httpResponse;
            }),
            catchError((err, response) => {
                console.error(response);
                this.status.setError(actionName);
                throw err;
            })
        );
    }
}
