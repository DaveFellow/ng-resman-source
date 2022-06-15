import { Observable } from "rxjs";
import { ResourceStatusManager } from "./ResourceStatus";

export interface ResourceManager<T> {
    readonly status: ResourceStatusManager;

    list(): Observable<Object>;
    
    details(id: ResourceId): Observable<T>;
    
    create(body: T): Observable<Object>;
    
    update(id: ResourceId, body: T): Observable<Object>;
    
    delete(id: ResourceId): Observable<Object>;

    pipeRequest?<T>(request: Observable<Object>): Observable<unknown>;
}

export type ResourceId = string | number;

export type ResourceStatus = 'idle' | 'loading' | 'success' | 'error';