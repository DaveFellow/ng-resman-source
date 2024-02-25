import { HttpParams } from "@angular/common/http";
import { RouteIdLocation, ResourceManagerOptions, ResourceResponse, ResourceId, ResourceActionOptions, ResourceManagement } from "./Models";
import { RoutesManager } from "./RoutesManager";

type ResourceManagementProps = ResourceManagerOptions | string;

export function ResourceProps(props: ResourceManagementProps) {
    return function (target: any) {
        if (typeof props === 'string') {
            target.routes = new RoutesManager({
                prefix:     props ?? '',
                idLocation: 'beforePath',
            });
            return;
        }
    
        target.routes = new RoutesManager({
            prefix:     props.prefix ?? '',
            apiUrl:     props.apiUrl,
            idLocation: (props.idLocation ?? 'beforePath') as RouteIdLocation,
        });
        return target;
    }
}