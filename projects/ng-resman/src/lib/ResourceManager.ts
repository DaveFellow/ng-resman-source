import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { QueryParams, Resource, ResourceActionOptions, ResourceId, RoutesOptions } from "./Entities";
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
    list(options: ResourceActionOptions = {}): Observable<T[]> {
        const { url, params } = this.getRequestSettings('list', '', options);
        
        const request: Observable<Object> = this.http.get(url, { params });

        return this.pipeRequest(request, 'list').pipe(
            map(response => (<HttpResponse<T[]>>response).body as T[])
        );
    }

    
    details(id: ResourceId, options: ResourceActionOptions = {}): Observable<T> {
        const { url, params } = this.getRequestSettings('details', id, options);
        
        const request: Observable<Object> = this.http.get(url, { params });

        return this.pipeRequest(request, 'details').pipe(
            map(response => (<HttpResponse<T>>response).body as T)
        );
    }
    
    
    create(body: Partial<T>, options: ResourceActionOptions = {}): Observable<Object> {
        const { url, params } = this.getRequestSettings('create', '', options);
        
        const request: Observable<Object> = this.http.post(url, body, { params });

        return this.pipeRequest(request, 'create').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }
    
    
    update(id: ResourceId, body: Partial<T>, options: ResourceActionOptions = {}): Observable<Object> {
        const { url, params } = this.getRequestSettings('update', id, options);

        const request: Observable<Object> = this.http.put(url, body, { params });

        return this.pipeRequest(request, 'update').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }
    
    
    destroy(id: ResourceId, options: ResourceActionOptions = {}): Observable<Object> {
        const { url, params } = this.getRequestSettings('destroy', id, options);

        const request: Observable<Object> = this.http.delete(url, { params });

        return this.pipeRequest(request, 'destroy').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }


    getRequestSettings(actionName: string, id: ResourceId = '', options: ResourceActionOptions = {}): RequestSettings {
        const { customPath, params } = options;

        const url: string = this.routes.build(actionName, id, customPath);
        const httpParams: HttpParams = new HttpParams({ fromObject: params });

        return { url, params: httpParams };
    }


    // REQUEST PRE-PROCESSING
    pipeRequest<T>(request: Observable<Object>, actionName: string = ''): Observable<unknown> {
        this.status.setLoading(actionName);

        return request.pipe(
            map(response => {
                const httpResponse = response as HttpResponse<T>;
                this.status.setSuccess(actionName);
                return httpResponse.body;
            }),
            catchError((err, response) => {
                console.error(response);
                this.status.setError(actionName);
                throw err;
            })
        );
    }
}