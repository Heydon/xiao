# module-boilerplate

To get up and running quickly with js modules supporting custom events and listeners.

## Usage

1. Download this repository's files into a new, empty repository
2. Search and replace "example-module" with the new module's real name in `package.json`
3. `npm install`
4. Rename main JS file similarly
5. Start adding to that main JS file, following comments

## Initialization

```js
var exampleElement = document.querySelector('body')

var exampleInstance = new ExampleModule(exampleElement, { exampleParam: 'example value' })
```

## Usage for the example `assplode` event

The `example-module.js` file includes an example `assplode` method, written like so:

```js
ExampleModule.prototype.assplode = function (thingToAssplode) {
  // Make it "assplode"
  this.elem.textContent = thingToAssplode.toUpperCase() + 'ASSPLODED!'

  // Fire the assplode event.
  // If so desired, you can pass the parameter
  this._fire('assplode', thingToAssplode)

  return this
}
```

You can use this internally like so:

```js
this.assplode('planet')
```

Then you can subscribe to and handle the event with the `on` method.

```js
exampleInstance.on('assplode', function (thingToAssplode) {
  alert('You assploded a' + thingToAssplode)
})
```
