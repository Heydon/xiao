# ![Xiao](images/xiao.png)

Xiao is a small, accessible, framework agnostic, browser-driven routing system. Make single page applications with progressive enhancement. See the **example** folder for a working demo.

## Install

```
npm i xiao
```

## Include

Xiao is just a small script you include in your web page. You have the option of using the ES5 or slightly smaller but less well-supported ES6 version.

### ES5

```html
<script src="../node_modules/xiao/xiao-es5.min.js"></script>
```

### ES6

```html
<script src="../node_modules/xiao/xiao.min.js"></script>
```

## Routes

In Xiao, routes are just subdocuments of web pages with metadata and (sometimes) methods attached to them. Each is identified by an `id` which corresponds to both a page element (say `id="home"`) and a hash fragment (say `#home`).

Before initializing your Xiao app, you define a routes array. Only the route `id` and route label are mandatory properties.

```js
const routes = [
  {
    id: 'home',
    label: 'Home'
  },
  {
    id: 'about',
    label: 'About my project'
  },
  {
    id: 'upload',
    label: 'Upload a file'
  }
]
```

This routes array is supplied as the first argument of the instantiated Xiao app. The default route — the one the user is directed to when hitting the root of the application — is the second mandatory argument.

```js
const app = new Xiao(routes, 'home')
```

Whether written by hand or via templating, each route is just an element with an `id` in an HTML document:

```html
<div id="home">
  <!-- the (initially) static content of the route -->
</div>
```

On initialization, Xiao gives each element corresponding to a route `role="region"` and an `aria-label` of the route object's `label` property.

```html
<div id="about" role="region" aria-label="About my project">
  <!-- the (initially) static content of the route -->
</div>
```

## Traversing a Xiao routed app

When a user navigates to a hash fragment, Xiao determines if that hash fragment either

* Corresponds to an element that corresponds to a route in the routes array
* Corresponds to an element _inside_ an element that corresponds to a route in the routes array

In default operation, whether you navigate to a route element or a route child element, the previous route element is hidden and the new one revealed. For keyboard accessibility, focus is sent to the newly revealed route element.

### Current links

Links corresponding to currently active routes receive the `aria-current="true"` attribution:

```html
<a href="#home" aria-current="true">Home</a>
```

This identifies current links to assistive technologies and doubles as a styling hook where desired.

```css
nav [aria-current] {
  border-bottom: 2px solid;
}
```

### The `<title>`

It is recommended that the `<title>` value you supply is the name of the app. Xiao appends the label for the specific current route after a separator.

```html
<title>My App | Home</title>
```

## The `arrived` and `departed` methods

You can hook into lifecycle events for routes to perform operations. In Xiao, these are named `arrived` and `departed`. You simply add them as properties on the route object.

```js
{
  id: 'about',
  label: 'About my project'.
  arrived(elem, params, routes) {
    // Add a class, pull in some dynamic content, whatever
  },
  departed(elem, params, routes) {
    // Save some settings, remove some content, whatever
  }
}
```

As you can see, there are three parameters available in each case:

* **elem** (node): the HTML element that corresponds to the route (carries the route `id`)
* **params** (object): Any params passed to the route via a query string (e.g. `?foo=bar&ding=dong` will be passed as `{foo: 'bar', ding: 'dong'}`)
* **routes** (object): The whole routes array, for convenience

## Events

### `reroute`

Whenever a new route is invoked, the `reroute` event is dispatched from `window`. This allows you to affect any part of the page in response to a reroute. Secreted in this `CustomEvent`'s `details` object are the old and new route objects.

```js
window.addEventListener('reroute', e => {
  console.log('Old route:', e.detail.oldRoute)
  console.log('New route:', e.detail.newRoute)
})
```

## Rerouting programmatically

Xiao capitalizes on standard browser behavior, letting you use links and hash fragments to invoke routes. However, there will be times you want to reroute the user programmatically. A redirect maybe. For this, you can use the `reroute` method.

The first argument is the desired route id and the second any params you may want to supply.

```js
app.reroute('login', '?redirect=true')
```

## Settings

The third (optional) argument when instantiating a Xiao app is the settings object. These are the options:

* **separator**: The string used to separate the app's name from the route label in the `<title>` (default: "|")
* **showHide**: Whether to show only one route at a time. If set to `false`, routes are all persistently visible and the browser navigates between them like standard hash fragments (default: `true`)
* **arrived**: Like the arrived method available for individual routes, but applies to all routes (see above)
* **departed**: Like the departed method available for individual routes, but applies to all routes (see above)

## Framework independence

Xiao is just a simple router which respects browser standards. The actual functionality you provide within individual Xiao routes is totally up to you. You can use plain JavaScript, React or Vue components, whatever you like. With Xiao, simple single-page applications can be just that: simple. But you can add as many dependencies and as much code to a Xiao skeleton as you like.
