import { Status } from "./Models"

interface StatusList {
    [key: string]: Status
}

export class StatusManager {
    private statusList: StatusList = {
        list:    'idle',
        details: 'idle',
        create:  'idle',
        update:  'idle',
        destroy:  'idle'
    }

    public get = (actionName: string): Status => this.statusList[actionName];

    public set(actionName: string, status: Status): void {
        if (!actionName) return;
        this.statusList[actionName] = status;
    }

    public isIdle = (actionName: string): boolean => this.get(actionName) == 'idle';
    
    public isLoading = (actionName: string): boolean => this.get(actionName) == 'loading';
    
    public isSuccess = (actionName: string): boolean => this.get(actionName) == 'success';
    
    public isError = (actionName: string): boolean => this.get(actionName) == 'error';

    public setIdle = (actionName: string): void => this.set(actionName, 'idle');

    public setLoading = (actionName: string): void => this.set(actionName, 'loading');

    public setSuccess = (actionName: string): void => this.set(actionName, 'success');

    public setError = (actionName: string): void => this.set(actionName, 'error');
}