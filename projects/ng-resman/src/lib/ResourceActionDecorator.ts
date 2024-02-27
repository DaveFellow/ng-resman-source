import { ResourceActionDecorator, ResourceActionOptions, ResourceResponse } from "./Models";
import { HttpResponse } from "@angular/common/http";
import { ResourceManager } from "./ResourceManager";

type ResourceActionProps = ResourceActionOptions | string;

export function ResourceAction<ResponseT = any>(options: ResourceActionOptions): ResourceActionDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        descriptor.value = function(this: ResourceManager<ResponseT>, ...args: any[]) {
            options = updateOptions(propertyKey, options, args);

            if (options.path === undefined) {
                options.path = propertyKey;
            }
        
            let request;

            const { url, params } = this.getRequestSettings(options);

            switch(options.type) {
                case 'post':
                    request = this.http.post<HttpResponse<ResponseT>>(url, options.body ?? {}, { params }); break;
                case 'put': 
                    request = this.http.put<HttpResponse<ResponseT>>(url, options.body ?? {}, { params }); break;
                case 'delete': 
                    request = this.http.delete<HttpResponse<ResponseT>>(url, { params }); break;
                default: 
                    request = this.http.get<HttpResponse<ResponseT>>(url, { params }); break;
            }
        
            return this.pipeRequest<ResponseT>(request);
        }
    }
}

export function GetResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    if (typeof props === 'string') {
        return ResourceAction<ResponseT>({
            path: props,
            type: 'get'
        });
    }
    return ResourceAction<ResponseT>({...props, type: 'get'});
}

export function PostResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    if (typeof props === 'string') {
        return ResourceAction<ResponseT>({
            path: props,
            type: 'post'
        });
    }

    return ResourceAction<ResponseT>({...props, type: 'post'});
}

export function PutResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    if (typeof props === 'string') {
        return ResourceAction<ResponseT>({
            path: props,
            type: 'put'
        });
    }

    return ResourceAction<ResponseT>({...props, type: 'put'});
}

export function DeleteResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    if (typeof props === 'string') {
        return ResourceAction<ResponseT>({
            path: props,
            type: 'delete'
        });
    }

    return ResourceAction<ResponseT>({...props, type: 'delete'});
}

function updateOptions(propertyKey: string, options: ResourceActionOptions, args: any[]): ResourceActionOptions {
    if (!args.length)
        return options;

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

            for (let i = 0; i < Math.min(args.length, 2); i++) {
                if (typeof args[i] !== 'object') continue;
                options = {...options, ...args[i]};
                break;
            }
    }
    return options;
}