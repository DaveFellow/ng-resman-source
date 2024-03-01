import { ResourceActionDecorator, ResourceActionOptions, ResourceActionProps, ResourceActionVerb } from "./Models";
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
        
            return this.pipeRequest<ResponseT>(request);
        }
    }
}

export function GetResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('get', props);
}

export function PostResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('post', props);
}

export function PutResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('put', props);
}

export function DeleteResource<ResponseT = any>(props: ResourceActionProps = ''): ResourceActionDecorator {
    return getConfiguredResourceAction<ResponseT>('delete', props);
}

/**
 * Verificar si 'props' es iterable
 */
function getConfiguredResourceAction<ResponseT>(type: ResourceActionVerb, props: ResourceActionProps): ResourceActionDecorator {
    return typeof props === 'string'
        ? ResourceAction<ResponseT>({ path: props, type })
        : ResourceAction<ResponseT>({...props, type});
}

/**
 * Debe añadirse la posibilidad aquí de leer una propiedad en 'options' que define cuál de los
 * argumentos es 'id' y cuál es 'body', en caso de haberlos.
 * 
 * Eso eliminaría la necesidad de este switch con opciones fijas.
 * 
 * También debe verificar si 'options' es iterable, en ese caso buscará los strings 'id' y 'body'
 * y tomará sus índices para buscar el argumento correspondiente a cada uno en 'args'
 */
function updateOptions(action: string, options: ResourceActionOptions, args: any[]): ResourceActionOptions {
    if (!args.length)
        return options;

    switch(action) {
        case 'list':
            options.params = args[0];
            break;
        case 'details':
            options.id = args[0];
            options.params = args[1];
            break;
        case 'create':
            options.body = args[0];
            options.params = args[1];
            break;
        case 'update':
            options.id = args[0];
            options.body = args[1];
            options.params = args[2];
            break;
        case 'delete':
            options.id = args[0];
            options.params = args[1];
            break;
        default:
            for (let i = 0; i < Math.min(args.length, 2); i++) {
                if (typeof args[i] !== 'object') continue;
                options = {...options, ...args[i]};
                break;
            }
    }
    return options;
}