import { HttpParams } from "@angular/common/http";
import { RouteIdLocation, ResourceManagerOptions, ResourceResponse, ResourceId, ResourceActionOptions, ResourceManagement, ResourceProps } from "./Models";
import { RoutesManager } from "./RoutesManager";
import { ResourceManager } from "./ResourceManager";

interface ClassType {
    new (...args: any[]): any
}

export function ResourceProps(props: ResourceProps) {
    return function(target: any) {
        if (typeof props === 'string') {
            target.prototype.routes = new RoutesManager({
                prefix:     props ?? '',
                idLocation: 'beforePath',
            });
            return;
        }
    
        target.prototype.routes = new RoutesManager({
            prefix:     props.prefix ?? '',
            apiUrl:     props.apiUrl,
            idLocation: (props.idLocation ?? 'beforePath') as RouteIdLocation,
        });
    }
}

