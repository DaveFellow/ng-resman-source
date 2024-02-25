import { ResourceActionDecorator, ResourceActionOptions } from "./Models";
import { toSignal } from "@angular/core/rxjs-interop";
import { HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResourceManager } from "./ResourceManager";

export function ResourceAction<ResponseT = any, BodyT = ResponseT>(options: ResourceActionOptions): ResourceActionDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value = function (this: ResourceManager<ResponseT>, ...args: any[]) {
            updateOptions(propertyKey, options, args);

            if (options.path === undefined) {
                options.path = propertyKey;
            }

            let request = getRequest<ResponseT>({
                _class: this,
                actionOptions: options,
                body: options.body
            });

            const pipedRequest = this.pipeRequest<ResponseT, BodyT>(request, propertyKey);
    
            return this.useSignals
                ? toSignal<HttpResponse<ResponseT>>(pipedRequest)
                : pipedRequest;
        }
        
        return descriptor;
    }
}

export function GetResource<ResponseT = any>(options: ResourceActionOptions): ResourceActionDecorator {
    return ResourceAction<ResponseT>({...options, type: 'get'});
}

export function PostResource<ResponseT = any, BodyT = ResponseT>(options: ResourceActionOptions): ResourceActionDecorator {
    return ResourceAction<ResponseT, BodyT>({...options, type: 'post'});
}

export function PutResource<ResponseT = any, BodyT = ResponseT>(options: ResourceActionOptions): ResourceActionDecorator {
    return ResourceAction<ResponseT, BodyT>({...options, type: 'put'});
}

export function DeleteResource<ResponseT = any>(options: ResourceActionOptions): ResourceActionDecorator {
    return ResourceAction<ResponseT>({...options, type: 'delete'});
}


function getRequest<ResponseT>(options: {
    _class: ResourceManager,
    actionOptions: ResourceActionOptions,
    body?: any
}): Observable<ResponseT> {
    const { url, params } = options._class.getRequestSettings(options.actionOptions);

    switch(options.actionOptions.type) {
        case 'get': return options._class.http.get<ResponseT>(url, { params });
        case 'post': return options._class.http.post<ResponseT>(url, options.body ?? {}, { params });
        case 'put': return options._class.http.put<ResponseT>(url, options.body ?? {}, { params });
        case 'delete': return options._class.http.delete<ResponseT>(url, { params });
        default: return options._class.http.get<ResponseT>(url, { params });
    }
}

function updateOptions(propertyKey: string, options: ResourceActionOptions, args: any[]): void {
    if (!args.length) return;

    switch(propertyKey) {
        case 'details':
            options.id = args[0];
            break;
        case 'create':
            options.body = args[0];
            break;
        case 'update':
            options.id = args[0];
            options.body = args[1];
            break;
        case 'delete':
            options.id = args[0];
            break;
        default:
            const optionsProps = [ 'type', 'path', 'id', 'idLocation', 'body', 'params' ];

            for (let i = 0; i < Math.max(args.length, 2); i++) {
                if (typeof args[i] !== 'object') continue;
                options = {...options, ...args[i]};
                return;
            }
    }
}