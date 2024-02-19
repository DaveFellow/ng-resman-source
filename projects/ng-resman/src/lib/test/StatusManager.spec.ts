import { TestBed } from '@angular/core/testing';
import { Status } from '../Models';

import { StatusManager } from '../StatusManager';

describe('StatusManager', () => {
  let statusManager: StatusManager = new StatusManager;

  beforeEach(() => {
    statusManager.set('list', 'idle');
    statusManager.set('details', 'idle');
    statusManager.set('create', 'idle');
    statusManager.set('update', 'idle');
    statusManager.set('destroy', 'idle');
  })

  it('should be created', () => {
    expect(statusManager).toBeTruthy();
  });

  it('should get single status', () => {
    const status: Status = statusManager.get('list');
    expect(status).toBeTruthy();
  })

  it('should set default status', () => {
    statusManager.set('details', 'success');
    const status: Status = statusManager.get('details');
    expect(status).toBe('success');
  })

  it('should set custom status', () => {
    statusManager.set('custom-status', 'success');
    const status: Status = statusManager.get('custom-status');
    expect(status).toBe('success');
  })

  it('should set idle status', () => {
    statusManager.setSuccess('create');
    statusManager.setIdle('create');
    const status: Status = statusManager.get('create');
    expect(status).toBe('idle');
  })

  it('should set loading status', () => {
    statusManager.setLoading('create');
    const status: Status = statusManager.get('create');
    expect(status).toBe('loading');
  })

  it('should set success status', () => {
    statusManager.setSuccess('create');
    const status: Status = statusManager.get('create');
    expect(status).toBe('success');
  })

  it('should set error status', () => {
    statusManager.setError('create');
    const status: Status = statusManager.get('create');
    expect(status).toBe('error');
  })

  it('should be idle', () => {
    expect(statusManager.isIdle('update')).toBeTrue();
  })

  it('should be loading', () => {
    statusManager.setLoading('details');
    expect(statusManager.isLoading('details')).toBeTrue();
  })

  it('should be success', () => {
    statusManager.setSuccess('create');
    expect(statusManager.isSuccess('create')).toBeTrue();
  })

  it('should be error', () => {
    statusManager.setError('destroy');
    expect(statusManager.isError('destroy')).toBeTrue();
  })

  it('should NOT be idle', () => {
    statusManager.setLoading('update');
    expect(statusManager.isIdle('update')).toBeFalse();
  })

  it('should NOT be loading', () => {
    statusManager.setSuccess('details');
    expect(statusManager.isLoading('details')).toBeFalse();
  })

  it('should NOT be success', () => {
    statusManager.setError('create');
    expect(statusManager.isSuccess('create')).toBeFalse();
  })

  it('should NOT be error', () => {
    statusManager.setIdle('destroy');
    expect(statusManager.isError('destroy')).toBeFalse();
  })

});
