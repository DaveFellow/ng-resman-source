import { TestBed } from '@angular/core/testing';
import { Status } from '../Entities';
import { RoutesManager } from '../RoutesManager';

const apiUrl: string = 'http://test';

describe('RoutesManager', () => {
  let routesManager: RoutesManager;

  beforeEach(() => {
    routesManager = new RoutesManager({
      prefix: 'test'
    })
  })

  it('should be created', () => {
    expect(routesManager).toBeTruthy();
  });

  it('should build route', () => {
    expect(routesManager.build('list')).toBe(``);
  })

  it('should build route with API URL', () => {
    routesManager = getWithApiUrl();
    expect(routesManager.build('list')).toBe(`${apiUrl}/`);
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

  it('should build default path with id AFTER', () => {
    routesManager.setPath('destroy', 'test')
    const path = routesManager.concatId(1, routesManager.getPath('destroy'));
    expect(path).toBe('test/1');
  })

  it('should build default path with id BEFORE', () => {
    routesManager = new RoutesManager({
      idLocation: 'beforePath'
    })
    routesManager.setPath('destroy', 'test')
    const path = routesManager.concatId(1, routesManager.getPath('destroy'));
    expect(path).toBe('1/test');
  })

  it('should build custom path with id AFTER', () => {
    const path = routesManager.concatId(1, 'custom-destroy');
    expect(path).toBe('custom-destroy/1');
  })

  it('should build custom path with id BEFORE', () => {
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