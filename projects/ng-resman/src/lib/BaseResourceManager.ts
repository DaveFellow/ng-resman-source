import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { ResourceManager, ResourceId } from "./Entities";
import { ResourceStatusManager } from "./ResourceStatus";

export abstract class BaseResourceManager<T> implements ResourceManager<T> {
    private prefix: string = '';

    public readonly status: ResourceStatusManager = new ResourceStatusManager;

    constructor(public http: HttpClient) {}

    // URL
    protected buildUrl = (route: string): string => `${this.prefix}/${route}`;

    protected buildListUrl = (customRoute?: string) => 
        this.buildUrl(customRoute || '');
    
    protected buildDetailsUrl = (id: ResourceId, customRoute?: string) => 
        this.buildUrl(customRoute ? `${customRoute}/${id}` : `${id}`);
    
    protected buildCreateUrl = (customRoute?: string) => 
        this.buildUrl(customRoute || 'store');
    
    protected buildUpdateUrl = (id: ResourceId, customRoute?: string) => 
        this.buildUrl(customRoute ? `${customRoute}/${id}` : `update/${id}`);
    
    protected buildDeleteUrl = (id:ResourceId , customRoute?: string) => 
        this.buildUrl(customRoute ? `${customRoute}/${id}` : `delete/${id}`);


    // PREFIX
    public getPrefix = (): string => this.prefix; 

    protected setPrefix(prefix: string): void {
        this.prefix = prefix;
    }


    // RESOURCE ACTIONS
    list(customRoute?: string): Observable<T[]> {
        const url: string = this.buildListUrl(customRoute);
        const request: Observable<Object> = this.http.get(url);

        return this.pipeRequest(request, 'list').pipe(
            map(response => (<HttpResponse<T[]>>response).body as T[])
        );
    }
    
    
    details(id: ResourceId, customRoute?: string): Observable<T> {
        const url: string = this.buildDetailsUrl(id, customRoute);
        const request: Observable<Object> = this.http.get(url);

        return this.pipeRequest(request, 'details').pipe(
            map(response => (<HttpResponse<T>>response).body as T)
        );
    }
    
    
    create(body: Partial<T>, customRoute?: string): Observable<Object> {
        const url: string = this.buildCreateUrl(customRoute);
        const request: Observable<Object> = this.http.post(url, body);

        return this.pipeRequest(request, 'create').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }
    
    
    update(id: ResourceId, body: Partial<T>, customRoute?: string): Observable<Object> {
        const url: string = this.buildUpdateUrl(id, customRoute);
        const request: Observable<Object> = this.http.put(url, body);

        return this.pipeRequest(request, 'update').pipe(
            map(response => (<HttpResponse<Object>>response).body as Object)
        );
    }
    
    
    delete(id: ResourceId, customRoute?: string): Observable<Object> {
        const url: string = this.buildDeleteUrl(id, customRoute);
        const request: Observable<Object> = this.http.delete(url);

        return this.pipeRequest(request, 'delete').pipe(
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