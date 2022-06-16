# Resource Manager for Angular

This is an API resource management library for Angular to make working with APIs more straightforward and much less verbose.

It brings a set of built-in methods for basic resource actions, Observables-based request status management per action and some features to customize the way to make each request.

## How to use
Just extend the *ResourceManagement* class into your resource service and pass an *HttpClient* object and an (optional but mostly necessary) prefix in the constructor using the *super* keyword and... that's it.

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

Now you can make request in your controllers (or any other entity of your application) using some of the following methods:

    .list()
    .details(ID)
    .create()
    .update(ID)
    .destroy(ID)

Each of these function return an *Observable* that can be subscribe as you prefer.

I highly suggest using this library alongside an *HTTPInterceptor* in order to avoid putting the API base URL in the prefix parameter.

## Status
The *status* object will manage the life cycle of each action request.

    this.resourceService.status

Each action has its own status management which can be accessed by using the *.status* property on the resource service. For example:

    this.resourceService.status.get('list')
    this.resourceService.status.set('create', 'success')

The *.get()* and *.set()* methods are basically getter and setter for each action status, in which are include all the basic actions listed above, though you can also add your own action status if necessary.

The *.get()* method will return a *Status* type value, which can be:
- idle
- loading
- success
- error

The status of each of the built-in actions is automatically updated during the request process and can be used in your controllers to perform instructions depending on each request life cycle moment.

There are other methods that will check whether an action in a specific state or not, each accept the name of the action as a parameter (put as an example bellow):

    .status.isIdle('list')
    .status.isLoading('create')
    .status.isSuccess('details')
    .status.isError('destroy')

The *.set()* method will accept the name of an action as first parameter and the status as second parameter, though there are shortcuts methods for setting specific status, these only accept the name of the action as a parameter:

    .status.setIdle('list')
    .status.setLoading('create)
    .status.setSuccess('details')
    .status.setError('destroy')

DISCLAIMER: The *status* object doesn't contain the response's state/data of each request, since that should be handled at the developer discretion. Its only purpose is to serve as an indication for the life cycle moment of each request to the developer.


## Routes
The *routes* object can be used to manage the requests URL setup.

    this.resourceService.routes

The routes can be gotten using the *.build()* method, which will accept the name of an action as first parameter, an optional *id* as second parameter and optional custom path third parameter. The returned route CAN have the following structures:

    {PREFIX}
    {PREFIX}/{ID}
    {PREFIX}/{ID}/{PATH} 
    {PREFIX}/{PATH}/{ID} <-- If configured using routes options. More Below.

This method is designed to work only with set path values. For using any string, there's the *buildUrl()* method, more about it below.

Whenever a *customRoute* parameter is specified in any method (including the *.build()* method), it will substitute the PATH in the structure.

Also, by default, no action has a path set so it won't be shown until it gets specified in the desired action.

### Action Path
You can get each action specific path using the *.getPath()* method, which accepts the name of an action as a parameter:

    .routes.getPath('update')
    .routes.getPath('list')

This function will mostly return an empty string, unless a path per action is specified using:

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
An string that will be put in the left side of the path, right before the prefix. Each route of the resource service will be built using this property.

This should be used to avoid putting it inside the prefix itself, though as stated before, it's highly recommended using an *HttpInterceptor* for this task, unless the specific resource service will connect to a different Url.


### prefix
This is just the route prefix put in a different place. If specified, it will be ignored anyway unless the second parameter on the *super* keyword is not truthy.


### idLocation
This accepts an *RouteIdLocation* type of value ('afterPath' and 'beforePath') and will configure the position of the id (if present) on the route, relative to the path segment. For example:

    {PREFIX}/{ID}/{PATH} <-- beforePath
    {PREFIX}/{PATH}/{ID} <-- afterPath.


### Custom Path per request

You can add an optional string parameter to each action method so it will use that one instead of the globally specified path:

    this.resourceService.details(5, 'custom-path')
    this.resourceService.create('custom-path')


### Build Route alternative routes
About buildUrl() method.
About concatId() method.


## Building custom actions
Template method for custom actions:
Remember to set an idle status to the action as a good practice in the constructor.

[AÑADIR AQUÍ UN MÉTODO DE EJEMPLO QUE SE PUEDA COPIAR Y PEGAR]


## Requests pre-processing
About pipeRequest() method.