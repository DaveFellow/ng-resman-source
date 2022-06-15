import { ResourceStatus } from "./Entities"

interface StatusList {
    [key: string]: ResourceStatus
}

export class ResourceStatusManager {
    private statusList: StatusList = {
        list: 'idle',
        details: 'idle',
        create: 'idle',
        update: 'idle',
        delete: 'idle'
    }

    public get = (name: string): ResourceStatus => this.statusList[name];

    public set(name: string, status: ResourceStatus): void {
        if (!name) return;
        this.statusList[name] = status;
    }

    public isIdle = (name: string): boolean => this.get(name) == 'idle';
    
    public isLoading = (name: string): boolean => this.get(name) == 'loading';
    
    public isSuccess = (name: string): boolean => this.get(name) == 'success';
    
    public isError = (name: string): boolean => this.get(name) == 'error';
    

    public setIdle(name: string): void {
        this.set(name, 'idle');
    }

    public setLoading(name: string): void {
        this.set(name, 'loading');
    }

    public setSuccess(name: string): void {
        this.set(name, 'success');
    }

    public setError(name: string): void {
        this.set(name, 'error');
    }
}