# v0.4.6. What's new?
(DISCLAIMER: This update breaks many things from previous version)

I made a complete re-design of this library compared to previous version, taking into consideration all the stuff I've been considering for a long time after I first created it. All the details are bellow in the how to use section.

A quick summary:

- Removed constructor dependency for Resource Manager setup

- Redesigned custom actions declaration, now based on decorators with multiple new possibilities

- Redesigned basic properties setting, they now have to be re-declared with the *override* keyword in the class body

- Now HttpClient depency is set with the *inject()* method in the base class

- Cache system to store latest sucessful response result of each action

- Support for global side effects setup for each action

# Resource Manager for Angular
This is an API resource management library for Angular to make working with APIs more straightforward and less verbose.

It brings a set of built-in methods for basic resource actions, Observables-based request, status management per action and some features to customize the way we make each request.

## How to use
Just extend the *ResourceManagement* class into your resource service and pass an *HttpClient* object and an (optional, but mostly necessary) prefix in the constructor using the *super* keyword and... that's it.

Alternatively, you can just copy and edit this structure into your resource service:

    import { Injectable } from '@angular/core';
    import { ResourceManager } from '@davefellow/ng-resource-manager';

    @Injectable({
        providedIn: 'root'
    })
    export class TestService extends ResourceManager<CustomType> {
        // ...
    }

Now you can make request in your controllers (or anywere inside your application) using any of the following methods:

- .list()
- .details(id)
- .create(body)
- .update(id, body)
- .destroy(id)

Each of these function return an *Observable* that can be subscribe as you prefer. For example, :

    this.testService.list().subscribe();
    this.testService.details(654).subscribe();
    this.testService.create({ name: 'Angela', email: 'angewomon@digitalworld.com' }).subscribe();
    this.testService.update(154, { email: 'louise1234@gmail.com' }).subscribe();
    this.testService.delete(596).subscribe();

Note that the type parameter in *ResourceManager* has an *CustomType* generic type passed, but it can be whatever type of response you want your *list*, *details*, *create* and *update* requests objects to return. The *list* action will return an array of objects of that type while the *details* action will return an object of that type directly.

All of the methods can return a different type if you pass it to each of them specifically as in the first generic type argument, so they should expect to return that type specifically instead the one passed to the class. This also applies to the *delete* action, which has an *unknown* type by default.

The *details*, *update* and *destroy* actions require an *id* parameter typed as *ResourceId*, which is just an union "string | number" type.

Both *create* and *update* also require a body argument. The first generic type argument of both (which defaults to class generic type passed) not only tells TypeScript to expect the return type but also the body argument type (with all properties optional in this case). That can be easily overriden by a second generic type argument.

``I highly suggest using this library alongside an *HTTPInterceptor* in order to avoid setting the apiUrl for each Resource Manager service.``

## Configuring the Resource Manager service
There are some class properties that must be overriden in order for the Resource Manager service to build the URLs of our requests properly. Those are:

- apiUrl: string
- prefix: string
- idLocation: RouteIdLocation

You can re-declare them with the *override* keyword to set them globally in the class:

    override readonly apiUrl = 'https://mydomain/api';
    override readonly prefix = 'customers';
    override readonly idLocation = 'beforePath';

``I highly suggest to make them *readonly* to avoid any unwanted external manipulation``

Or by setting them in each resource action options when you create a custom action (more about it later), for more granular use.

More about each property:

### apiUrl
An string that will be put in the beginning of the route, right before the prefix. Each route of the resource service will be built using this property.

This should be used to avoid putting it inside the prefix itself, though as stated before, it's highly recommended using an *HttpInterceptor* for this task, unless we want the specific resource service to connect to a different base Url.

### prefix
This is just the route prefix, it's basically the object name like 'customers', 'users', 'posts', etc.

### idLocation
This accepts an *RouteIdLocation* type of value (a string of two values: 'afterPath' and 'beforePath') and will configure the position of the id (if present) in the route, relative to the path segment. For example:

- {prefix}/{id}/{path} <-- beforePath
- {prefix}/{path}/{id} <-- afterPath.

It always defaults to 'beforePath', so you wouldn't need to set it manually if it already meets your endpoint requirements.

## Final URL example
Bellow is an example of how the final URL looks like, it includes all the previous properties plus some more specific to the Resource Actions (*path* and *id*):

- {apiUrl}{prefix}
- {apiUrl}{prefix}/{id}
- {apiUrl}{prefix}/{id}/{path}
- {apiUrl}{prefix}/{path}/{id} <-- If idLocation is set to 'afterPath'. More Below.

## Custom Resource Actions
Many times we want to make custom actions outside of the built-in ones (list, create, etc.) and also keep the routes building and status management of the resource manager, in that case we can create a method that returns an Observable, decorated with any of the Resource Action Decorators depending on your need:

- @ResourceAction()
- @GetResource()
- @PostResource()
- @PutResource()
- @DeleteResource()

Each of these decorators return an *HttpRequest* observable respective to the decorator type you use, except for *@ResourceAction*, which is the underlying decorator of all the other four.

These decorators can be passed an argument of the type *ResourceActionProps*, which is an union type that accepts *ResourceActionOptions*, *string* or *ResourceActionArgsSetup*. I know this may feel confusing but let's quickly explain each:

### ResourceActionOptions 
This is the most complete option, the other two are just abbreviated methods.

This is an object that accepts the following properties (all of them optional):

- type: ResourceActionVerb
- path: string
- id: ResourceId
- body: BodyT
- params: UrlParams
- argsSetup: ResourceActionArgsSetup
- prefix: string
- apiUrl: string
- idLocation: RouteIdLocation

Most of the time it's not necessary to pass most of them, but let's look at an example:

    @GetResource({
        apiUrl: 'https://mydomain/api',
        prefix: 'customers',
        idLocation: 'beforePath',
        path: 'get-premium-only'
        params: {
            param1: true,
            param2: '$600'
        }
    });
    public requestPremiumCustomers() {
        return new Observable<Customer>();
    }

In the case of *apiUrl*, *prefix* and *idLocation*, the ones set in this object will override the values set at class level, so most of the time we can just ignore them unless we have very specific requirements for a single resource action. More about the rest bellow:

#### type
Of type *ResourceActionVerb* which only accepts a string of the following values: get, post, put, delete.

It won't make any effect except for the *@ResourceAction* decorator that needs it for functioning.

#### path
It's the final segment of the request URL, it can be before or after the *id* depending of *idLocation* value.

Some special rules to this property applies depending on how you set it:

- If it's set as an empty string (''), it will be ignored for building the URL

- If it's *undefined* (manually or left unset), then the method name will be used as *path* value

Also, it can be set alternatively, more about it later.

#### id and body 
They're just the *id* and *body* passed for the request. You can hardcode a value here for these properties but as their use should depend on application's flow, it makes no sense to do so, they're here for internal use (or for debugging if you want to use them like that).

Instead, they can be set by a method argument if you configure them in the *argsSetup* property. More about it in its respective section bellow.

#### params
It's an "key: value" pairs object. Any property added will be sent as query params in the request. For example:

    const options: ResourceActionOptions = {
        params: {
            page: 2,
            sort_by: 'name',
            show: 15
        }
    };

...Will add the following segment to the final URL: '?id=98&premium=true'.

    this.resourceService.list()
    // /my-prefix?page=2&sort_by=name&show=15

As a general rule, the first argument of the decorated method right after the *id* and *body* arguments (see more in the next section) will automatically be used to set this property value, so:

- In the case that *id* OR *body* arguments are configured, then the second argument will automatically be used to set this property value.

- In the case that both *id* AND *body* arguments are configured, then the third argument in will be used instead.

- In the case none are configured, the first argument will be used to set this property value.

For the three rules from above to apply, the argument needs to be a literal object.

#### argsSetup
It's an array that accept two possible string values: 'id' and 'body'.

It can be any or both, and depending on the order of each value in the array, the indexes of the *id* and *body* arguments in the decorated method will be taken to set the values for *id* and *body* internally for the request. So, for example, we have this:

    @PutResource({
        // ...
        argsSetup: ['id', 'body']
    })
    public myDecoratedMethod(id: string, body: MyReturnType) {
        // ...
    }

That means that the first argument value will be taken for the *id* property and the second argument value for *body* property in the *ResourceActionOptions* object which will then be used in the request setup. Here's are some configurations examples:

- ['body', 'id']: The *body* value will be taken from method argument and the *id* value from the second one

- [ 'body' ]: The *body* value will be taken from first argument, and no *id* argument is configured

- [ 'id' ]: The *id* value will be taken from first argument, and no *body* argument is configured

- [], *null*, *undefined* or *unset*: No argument will be taken to set *id* or *body* values

In the case a value of type different than *string* or *number* is put in place of an *id* argument, it will be invalid and the *id* property will be *undefined* internally. Same for *body* if the value is not of type *object* (a literal object or array).

This setup also overrides any *id* or *body* value set manually in the decorator's object.

### Alternative Decorators Setup
You can set a custom action with some less verbose setups for the decorators (except for *@ResourceAction*). So instead of passing a full ResourceActionOptions object you can do it the following ways:

#### By leaving it empty
Many times the path can be used a the method name (say, it has no dashes), in that case you can just leave the decorator without argument and the decorated method name will be used as value for the *path* property:

    @GetResource()
    public members() {
        return new Observable<Member[]>()
    }

Same can be achieved by passing an *undefined* value (but why you'd do that?).

#### By passing a string
Many the time you only need to add (or skip) the path segment to the request endpoint and it can't be used directly as a method name (or you just want to use a different value for whatever reason), in that case you can pass a string as an argument in the decorator and that value would be used to set the *path* value. For example:

    @GetResource('my-filtered-list')
    public getFilteredList(params: ParamsCustomType) {
        return new Observable<CustomType>()
    }

If you pass an empty string, it will skip the path segment entirely (as in the built-in actions, for example).

#### By passing an array
Sometimes you want to just configure the *id* and *body* arguments and are ok with leaving the method name for the path segment, in that case you can just pass an array the same way you do for the *argsSetup*:

    @GetResource(['id', 'body'])
    public setMember(id: string, body: Member) {
        return new Observable<Member>()
    }

#### By passing an empty string AND an array
If you still want the benefits of an abbreviated declaration but need the benefit of custom path and arguments setup (kinda greedy, but I have you covered!), you can do it this way:

    @GetResource('orders', ['id'])
    public getOrdersFromCustomer(id: string) {
        return new Observable<Order[]>()
    }

## Status
The *status* object will manage the life cycle of each action request.

    this.resourceService.status

Each action has its own status management which can be accessed by using the *status* property on the resource service. For example:

    this.resourceService.status.get('list')
    this.resourceService.status.set('create', 'success')

The *get* and *set* methods are basically getter and setter for each action status, in which are include all the basic actions listed above, though you can also add your own action status if necessary.

The *get* method will return a *Status* type value, which can have one of the following string values:
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

The *.set* method will accept the name of an action as first parameter and the status as second parameter, though there are shortcuts methods for setting specific status per action, these only accept the name of the action as a parameter:

    .status.setIdle('list')
    .status.setLoading('create)
    .status.setSuccess('details')
    .status.setError('destroy')

Arbitrary action names can also be set as a parameter, in that case an status with that name will be created. For example, if we set:

    .status.setLoading('customAction')

Then we can do:

    .status.get('customAction')

And it will return 'loading' as a value.

``DISCLAIMER: The *status* object doesn't contain the response's state/data of each request, since that should be handled at the developer discretion. Its only purpose is to serve as an indication for the life cycle moment of each request.``

## Side Effects
As sometimes your data isn't exactly coming in the most convenient way, instead of having to pipe your actions everywhere you use it (or worse, pass a callback to the *subscribe* method), you can globally apply side effects to each desired action.

You do so by overriding the *effects* property and passing an array of OperatorFunction (map, switchMap, catchError, etc.):

    override readonly effects = {
        list: [
            map((response: CustomType) => response.results)
        ],
        savePokemonInOaksPC: [map((response: StandardMessage) => {
            console.log('Saved on your PC');
            return response;
        })]
    }

In those cases, whenever you subscribe to the *list* action and get successful response, you won't get the full data that's coming from your API but only the "results* object of it. In the case of the *savePokemonInOaksPC* action, you should log a string to your console.

The advantage of this approach instead of individually piping each action observable is that it's globally applied to your action calls everywhere, and of course, you can still pipe them in your components or wherever you use them as you need.

## Cache
Every action, by default, cache their latest successful response data, so you can get access to it at any given moment without having to worry about manually store it in your components or in any other service member.

You can access it by using the *cached* method and passing the action (method) name:

    this.testServ.cached('list')
    this.testServ.cached('create')
    this.testServ.cached('customAction')

This returns a *BehaviorSubject* object typed as *unknown*, so make sure to pass a generic type argument to *cached* method in order to have the proper type for its data:

    this.testServ.cached<MappedList>('getMappedList')

You can then use *getValue* method in order to get the data in an imperative context:

    this.mappedList = this.testServ.cached<MappedList>('getMappedList')?.getValue()

Or subscribe to it or use *async pipe* in the template, do as you need.

Also, the data is stored after the side *effects* are applied.

### Disable cached data
If for whatever reason you don't want your successful responses data to be cached in your service, you can always override the *storeInCache* property:

    override readonly storeInCache = false;

This will disable the caching so now when you try to access any cached data from that resource manager service, you'll get an *undefined* data.

``DISCLAIMER: The cached data is *NOT* a state management system, it should be considered read-only considering it's prone to change on every sucessful request. If you intend to manipulate the data, store it in another class property so you'll have full control``

## Defaults settings for custom actions
You should set an initial idle status to any custom action, so we avoid having a *null* status whenever we want to check for its value before the any subscription is done.

Also, sometimes you need a default cached data to work with while you wait for your first action request (like an empty array in your list).

You can comfortably do so with the *setActionDefaults* method. Do it in the service *constructor* as a good practice, so your resource manager is ready before your component is initialized: 

    constructor() {
        super();
        this.setActionDefaults('release-payment', []);
    }

This sets the action status to *'idle'* and, if the second argument is present, also sets a default cache value.

This method evaluates if a the status or the cached has changed before performing any action, to prevent you from accidentally reset an action state after the service was injected.