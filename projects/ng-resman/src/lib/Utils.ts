import { ResourceId, RouteIdLocation, RouteOptions } from "./Models";

type UrlSegment = string | ResourceId;

export function buildUrl(route: RouteOptions): string {
    const {
        apiUrl = '',
        prefix = '',
        id = '',
        idLocation = 'beforePath',
        path = ''
    } = route;

    const urlArr: UrlSegment[] = [];

    urlArr.push(apiUrl.trim());
    urlArr.push(prefix.trim());
    urlArr.push(`${id}`.trim());
    urlArr.push(path.trim());

    if (idLocation === 'afterPath') {
        urlArr[2] = path
        urlArr[3] = id;
    }

    const validSegments = urlArr.filter(segment => segment);
    const arrayIsEmpty: boolean = validSegments.length === 0;

    if (arrayIsEmpty)
        return '';

    const url: UrlSegment = validSegments.reduce((a, b) => `${a}/${b}`);

    return `${url}`
        .replace(/\/$/, '')
        .replace(/\s+/, '');
}