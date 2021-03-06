# Resource Manager for Angular
This is an API resource management library for Angular to make working with APIs more straightforward and less verbose.

It brings a set of built-in methods for basic resource actions, Observables-based request, status management per action and some features to customize the way we make each request.

## How to use
Just extend the *ResourceManagement* class into your resource service and pass an *HttpClient* object and an (optional, but mostly necessary) prefix in the constructor using the *super* keyword and... that's it.

Alternatively, you can just copy and edit this structure into your resource service:

    import { HttpClient } from '@angular/common/http';
    import { Injectable } from '@angular/core';
    import { ResourceManager } from '@davefellow/ng-resource-mananer';

    @Injectable({
        providedIn: 'root'
    })
    export class TestService extends ResourceManager<Object> {

    constructor(override http: HttpClient) {
        super(http, 'my-prefix');
    }

Now you can make request in your controllers (or anywere inside your application) using any of the following methods:

    .list()
    .details(ID)
    .create()
    .update(ID)
    .destroy(ID)

Each of these function return an *Observable* that can be subscribe as you prefer. The *details*, *update* and *destroy* actions require an *id* parameter typed as *ResourceId*, which is just an union "string | number" type.

Note that the type parameter in *ResourceManager* has an *Object* type passed, but it can be whatever type of response you want your *list* and *details* requests objects to return. The *list* action will return an array of objects of that type while the *details* action will return an object of that type directly.

I highly suggest using this library alongside an *HTTPInterceptor* in order to avoid putting the API base URL in the prefix parameter.

## Status
The *status* object will manage the life cycle of each action request.

    this.resourceService.status

Each action has its own status management which can be accessed by using the *.status* property on the resource service. For example:

    this.resourceService.status.get('list')
    this.resourceService.status.set('create', 'success')

The *.get()* and *.set()* methods are basically getter and setter for each action status, in which are include all the basic actions listed above, though you can also add your own action status if necessary.

The *.get()* method will return a *Status* type value, which can have one of the following string values:
- idle
- loading
- success
- error

The status of each of the built-in actions is automatically updated during the request process and can be used in your controllers to perform instructions depending on the life cycle moment of each request.

There are other methods that will check whether an action is in a specific status or not, each accept the name of the action as a parameter (put as an example bellow):

    .status.isIdle('list')
    .status.isLoading('create')
    .status.isSuccess('details')
    .status.isError('destroy')

The *.set()* method will accept the name of an action as first parameter and the status as second parameter, though there are shortcuts methods for setting specific status per action, these only accept the name of the action as a parameter:

    .status.setIdle('list')
    .status.setLoading('create)
    .status.setSuccess('details')
    .status.setError('destroy')

Arbitrary action names can also be set as a parameter, in that case an status with that name will be created. For example, if we set:

    .status.setLoading('custom-action')

Then we can do:

    .status.get('custom-action')

And it will return 'loading' as a value.

``DISCLAIMER: The *status* object doesn't contain the response's state/data of each request, since that should be handled at the developer discretion. Its only purpose is to serve as an indication for the life cycle moment of each request.``


## Routes
The *routes* object can be used to manage the requests URL setup.

    this.resourceService.routes

The routes can be built using the *.build()* method, which will accept the name of an action as a first parameter, an optional *id* as a second parameter and an optional custom path as third parameter. The returned route CAN have one of the following structures:

    {PREFIX}
    {PREFIX}/{ID}
    {PREFIX}/{ID}/{PATH}
    {PREFIX}/{PATH}/{ID} <-- If configured using routes options. More Below.

This method is designed to work only with already set paths. For building any arbitrary string, there's the *buildUrl()* method, more about it below.

Whenever a *customPath* parameter is specified in any method (including in the *.build()* method), it will substitute the PATH in the structure.

Also, by default, all action paths are empty strings until they are specified in the desired action.

### Action Path
You can get each action specific path using the *.getPath()* method, which accepts the name of an action as a parameter:

    .routes.getPath('update')
    .routes.getPath('list')

This method will mostly return an empty string, unless a path per action is specified using:

    routes.setPath('list', 'custom-list')

The *.setPath()* method will accept the name of an action as first parameter and the new path as second parameter path added to each call made to that action in the resource service.

### Routes options
The *routes* object can be configured by passing a *RoutesOptions* object as a third parameter in the resource service constructor:

    constructor(override http: HttpClient) {
        const options: RoutesOptions = {
            apiUrl: 'http://localhost:8000'
            idLocation: 'afterPath'
        }

        super(http, 'my-prefix', options);
    }

More regarding each option below.

#### apiUrl
An string that will be put in the beginning of the route, right before the prefix. Each route of the resource service will be built using this property.

This should be used to avoid putting it inside the prefix itself, though as stated before, it's highly recommended using an *HttpInterceptor* for this task, unless we want the specific resource service to connect to a different base Url.


#### prefix
This is just the route prefix put in a different place. If specified, it will be ignored anyway unless the second parameter on the *super* keyword is not truthy.


#### idLocation
This accepts an *RouteIdLocation* type of value ('afterPath' and 'beforePath') and will configure the position of the id (if present) in the route, relative to the path segment. For example:

    {PREFIX}/{ID}/{PATH} <-- beforePath
    {PREFIX}/{PATH}/{ID} <-- afterPath.


### Built-in actions options
Each built-in action can accept an optional *options* parameter, as a last parameter.

This is a *ResourceActionOptions* object that can have the one of the following properties:
#### customPath
It's an arbitrary *string* type property. It will substitute the set path in the specific request call where it's set, for example:

    const options: ResourceActionOptions = {
        customPath: 'custom-path'
    };

    this.resourceService.details(5, options)
    // /my-prefix/5/custom-path

    this.resourceService.create(options)
    // /my-prefix/custom-path


#### params
It's an "key: value" pairs object. Any property added will be sent as query params in the request. For example:

    const options: ResourceActionOptions = {
        params: {
            page: 2,
            sort_by: 'name',
            show: 15
        }
    };

    this.resourceService.list()
    // /my-prefix?page=2&sort_by=name&show=15


### Build Routes with Arbitrary Path
To build a route with an arbitrary path, use the *buildUrl()* method, which accepts a *route* string parameter as an argument and returns the formatted value:

    this.resourceService.routes.buildUrl(`my-custom-path`)

The above example could return one of the following values, given a "my-prefix" *prefix* and/or a "http://localhost:8000" *apiUrl* options configured in the resource *routes* object:

    /my-prefix/my-custom-path
    http://localhost:8000/my-prefix/my-custom-path

If you want to concatenate a resource id in the path, you can directly do it in the *route* parameter or by passing a previously formatted string using the *concatId()* method, which will concatenate the id to the path depending on the *idLocation* property set in the *routes* object.

This method will accept an *id* as a first argument and *path* as a second argument, this would be the structure of the value it returns:

    {ID}/{PATH} <-- when idLocation is set to 'beforePath'
    {PATH}/{ID} <-- when idLocation is set to 'afterPath'.

So, as an example of how both *builtUrl()* and *concatId()* methods could work together, we could do something like this:

    const path: string = this.routes.concatId(13, 'my-custom-path');
    const route: string = this.routes.buildUrl(path);

    // my-prefix/13/my-custom-path


## Requests pre-processing
Each request is pre-processed (piped) for managing its status along its life cycle. For that, they use the *pipeRequest()* method, which accepts *request* as a first parameter and an *actionName* as a second parameter:

    const request: Observable<Object> = this.http.get(url);
    const pipedRequest: Observable<Object> = this.pipeRequest(request, 'custom-request');

The first parameter (*request*) is the request as is, it is literally the *Observable* returned by any of the HttpClient request method (*.get()*, *.post()*, etc.).

the second parameter (*actionName*) will be used to manage the status of the action, so following the above example:

    this.resourceService.status.isLoading('custom-action');
    this.resourceService.status.setSuccess('custom-action');

The *pipeRequest()* method will return an *Observable\<Object\>* that can be subscribed for making the request.

The status of the action is also automatically managed on subscription by the *pipeRequest()* method so you won't have to perform further actions, unless you want to, by piping the returned observables (for example):

    this.pipeRequest(request, 'custom-action').pipe(
        map( ... ),
        debounceTime( ... ),
        catchError( ... )
    );

## Building custom actions
Many times we want to make custom actions outside of the built-in ones (list, create, etc.) and also keep the routes building and status management of the resource manager, in that case we can make use of everything explained above... but if you're lazy like I am, here's a quick template you can use and modify as you require:

    public releasePayment(paymentId: ResourceId): Observable<Object> {
        const path: string = this.routes.concatId(paymentId, 'release');

        const url: string = this.routes.buildUrl(path);

        const request: Observable<Object> = this.http.get(url);

        return this.pipeRequest(request, 'release-payment') as Observable<Object>;
    }

Remember to set an idle status to this custom action in the constructor as a good practice, so we avoid having a *null* status whenever we want to check for its value before the any subscription is done:

    constructor(override http: HttpClient) {
        super(http, 'my-prefix');
        this.status.setIdle('release-payment')
    }