import { ResourceId, RouteIdLocation, RoutesOptions } from "./Models";

interface PathList {
    [key: string]: string
}

export class RoutesManager {
    private readonly apiUrl: string;

    private readonly prefix: string;
    public get getPrefix(): string {
        return this.prefix
    };

    private readonly idLocation: RouteIdLocation;

    constructor(options: RoutesOptions) {
        this.prefix = options.prefix || '';
        this.apiUrl = options.apiUrl || '';
        this.idLocation = options.idLocation || 'beforePath';
    }

    public build(path: string, id?: ResourceId) {
        if (!id)
            return this.buildUrl(path);
        
        const route: string = this.concatId(id, path);
        return this.buildUrl(route);
    }

    public buildUrl(route: string = ''): string {
        const urlArr: string[] = [];

        if (this.apiUrl)
            urlArr.push(this.apiUrl);

        if (this.prefix)
            urlArr.push(this.prefix);

        const url: string = urlArr.reduce((a, b) => `${a}/${b}`);

        return `${url}/${route}`.replace(/\/$/, '');
    }

    public concatId(id: ResourceId, path: string = ''): string {
        const idAfter: boolean = this.idLocation == 'afterPath';

        if (!path)
            return `${id}`;

        return idAfter
            ? `${path}/${id}`
            : `${id}/${path}`;
    }
}