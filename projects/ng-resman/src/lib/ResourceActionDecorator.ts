import { ResourceActionArgsSetup, ResourceActionDecorator, ResourceActionOptions, ResourceActionProps, ResourceActionVerb } from "./Models";
import { HttpResponse } from "@angular/common/http";
import { ResourceManager } from "./ResourceManager";

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
        
            return this.pipeRequest<ResponseT>(request, propertyKey);
        }
    }
}

export function GetResource<ResponseT = any>(propsPathOrArgsSetup?: ResourceActionProps, argsSetup?: ResourceActionArgsSetup): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('get', propsPathOrArgsSetup, argsSetup);
}

export function PostResource<ResponseT = any>(propsPathOrArgsSetup?: ResourceActionProps, argsSetup?: ResourceActionArgsSetup): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('post', propsPathOrArgsSetup, argsSetup);
}

export function PutResource<ResponseT = any>(propsPathOrArgsSetup?: ResourceActionProps, argsSetup?: ResourceActionArgsSetup): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('put', propsPathOrArgsSetup, argsSetup);
}

export function DeleteResource<ResponseT = any>(propsPathOrArgsSetup?: ResourceActionProps, argsSetup?: ResourceActionArgsSetup): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('delete', propsPathOrArgsSetup, argsSetup);
}

function getConfiguredResourceAction<ResponseT>(type: ResourceActionVerb, props: ResourceActionProps, argsSetup: ResourceActionArgsSetup = []): ResourceActionDecorator {
    if (Array.isArray(props))
        return ResourceAction<ResponseT>({argsSetup: props, type});
    
    if (typeof props === 'string')
        return ResourceAction<ResponseT>({ path: props as string, type, argsSetup })

    if (!props)
        return ResourceAction<ResponseT>({ type, argsSetup })

    return ResourceAction<ResponseT>({...props, type, argsSetup: props.argsSetup ?? []});
}

function updateOptions(action: string, options: ResourceActionOptions, args: any[]): ResourceActionOptions {
    if (!args.length)
        return options;

    const argsSetup = options.argsSetup ?? [];

    options.params = args[argsSetup.length];

    if (options.params && typeof options.params !== 'object') {
        options.params = {};
        console.warn(`Argument corresponding to params in request from method '${action}' must be type a literal object`);
    }

    if (!argsSetup.length)
        return options;
    
    const indexes = {
        id: -1,
        body: -1
    }

    for (let i = 0; i < Math.min(argsSetup.length, 2); i++) {
        indexes[argsSetup[i]] = i;
    }

    options.id = validateId(args[indexes.id], action);
    options.body = validateBody(args[indexes.body], action);

    return options;
}

function validateBody(body: any[], action: string) {
    if (!body)
        return undefined;

    if (typeof body !== 'object') {
        console.warn(`Argument corresponding to 'body' in request from method '${action}' must be a literal object`);
        return {};
    }
    return body;
}

function validateId(id: any, action: string) {
    if (!id)
        return undefined;

    if (typeof id !== 'string' && typeof id !== 'number') {
        console.warn(`Argument corresponding to 'body' in request from method '${action}' must be a literal object`);
        return undefined;
    }
    return id;
}