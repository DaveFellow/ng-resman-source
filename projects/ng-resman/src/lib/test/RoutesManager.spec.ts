import { TestBed } from '@angular/core/testing';
import { Status } from '../Models';
import { RoutesManager } from '../RoutesManager';

const apiUrl: string = 'http://test';

describe('RoutesManager', () => {
  let routesManager: RoutesManager;

  beforeEach(() => {
    routesManager = new RoutesManager({
      prefix: 'test',
      idLocation: 'afterPath',
      apiUrl: ''
    })
  })

  it('should be created', () => {
    expect(routesManager).toBeTruthy();
  });

  it('should build route', () => {
    expect(routesManager.build('list')).toBe(`test`);
  })

  it('should build route with API URL', () => {
    routesManager = getWithApiUrl();
    expect(routesManager.build('list')).toBe(`${apiUrl}/test`);
  })

  it('should build alternative route', () => {
    expect(routesManager.buildUrl('list')).toBe(`test/list`);
  })

  it('should build alternative route with API URL', () => {
    routesManager = getWithApiUrl();
    expect(routesManager.buildUrl('list')).toBe(`${apiUrl}/test/list`);
  })

  it('should get Path', () => {
    expect(routesManager.getPath('list')).toBe('');
  })

  it('should set Path', () => {
    routesManager.setPath('list', 'test-list');
    expect(routesManager.getPath('list')).toBe('test-list');
  })

  it('should set additional Path', () => {
    routesManager.setPath('additional', 'test-additional');
    expect(routesManager.getPath('additional')).toBe('test-additional');
  })

  it('should not set Path', () => {
    routesManager.setPath('', 'test-list');
    expect(routesManager.getPath('')).toBeUndefined();
  })

  it('should concat default path with id AFTER', () => {
    routesManager.setPath('destroy', 'test')
    const path = routesManager.concatId(1, routesManager.getPath('destroy'));
    expect(path).toBe('test/1');
  })

  it('should concat default path with id BEFORE', () => {
    routesManager = new RoutesManager({
      idLocation: 'beforePath'
    })
    routesManager.setPath('destroy', 'test')
    const path = routesManager.concatId(1, routesManager.getPath('destroy'));
    expect(path).toBe('1/test');
  })

  it('should concat custom path with id AFTER', () => {
    routesManager = new RoutesManager({
      idLocation: 'afterPath'
    })
    routesManager.setPath('destroy', 'destroy')
    const path = routesManager.concatId(1, 'destroy');
    expect(path).toBe('destroy/1');
  })

  it('should concat custom path with id BEFORE', () => {
    routesManager = new RoutesManager({
      idLocation: 'beforePath'
    })
    routesManager.setPath('destroy', 'destroy')
    const path = routesManager.concatId(1, 'destroy');
    expect(path).toBe('1/destroy');
  })

  it('should build path with ONLY id', () => {
    const path = routesManager.concatId(1, '');
    expect(path).toBe('1');
  })
  
});

function getWithApiUrl(): RoutesManager {
  return new RoutesManager({
    prefix: 'test',
    apiUrl
  })
}