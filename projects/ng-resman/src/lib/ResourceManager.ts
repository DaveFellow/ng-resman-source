import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { Resource, ResourceId, RoutesOptions } from "./Entities";
import { RoutesManager } from "./RoutesManager";
import { StatusManager } from "./StatusManager";

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
    list(customRoute?: string): Observable<T[]> {
        const url: string = this.routes.build('list', customRoute);
        const request: Observable<Object> = this.http.get(url);

        return this.pipeRequest(request, 'list').pipe(
            map(response => (<HttpResponse<T[]>>response).body as T[])
        );
    }
    
    
    details(id: ResourceId, customRoute?: string): Observable<T> {
        const url: string = this.routes.build('details', id, customRoute);
        const request: Observable<Object> = this.http.get(url);

        return this.pipeRequest(request, 'details').pipe(
            map(response => (<HttpResponse<T>>response).body as T)
        );
    }
    
    
    create(body: Partial<T>, customRoute?: string): Observable<Object> {
        const url: string = this.routes.build('create', customRoute);
        const request: Observable<Object> = this.http.post(url, body);

        return this.pipeRequest(request, 'create').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }
    
    
    update(id: ResourceId, body: Partial<T>, customRoute?: string): Observable<Object> {
        const url: string = this.routes.build('update', id, customRoute);
        const request: Observable<Object> = this.http.put(url, body);

        return this.pipeRequest(request, 'update').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }
    
    
    destroy(id: ResourceId, customRoute?: string): Observable<Object> {
        const url: string = this.routes.build('destroy', id, customRoute);
        const request: Observable<Object> = this.http.delete(url);

        return this.pipeRequest(request, 'destroy').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
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