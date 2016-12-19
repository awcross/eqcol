# eqcol

> Equal effing columns


## Install

Browserify

```
$ npm install --save eqcol
```

Bower

```
$ bower install --save eqcol
```

```html
<script src="bower_components/eqcol/dist/eqcol.min.js"></script>
```


## Usage

#### Basic usage

```html
<div class="row" data-eqcol>
	<div class="col-md-4" data-eqcol-watch>
		...
	</div>
	<div class="col-md-4" data-eqcol-watch>
		...
	</div>
	<div class="col-md-4" data-eqcol-watch>
		...
	</div>
</div>
```

```js
import eqcol from 'eqcol';

const row = document.querySelector('.row');
eqcol(row, {
	// options...
});
```

#### Nesting

```html
<div class="row" data-eqcol="foo">
	<div class="col-md-4" data-eqcol-watch="foo">
		...
	</div>
	<div class="col-md-4" data-eqcol-watch="foo">
		<div class="row" data-eqcol="bar">
			<div class="col-sm-6" data-eqcol-watch="bar">
				...
			</div>
			<div class="col-sm-6" data-eqcol-watch="bar">
				...
			</div>
		</div>
	</div>
	<div class="col-md-4" data-eqcol-watch="foo">
		...
	</div>
</div>
```

```js
import eqcol from 'eqcol';

const rows = document.querySelectorAll('.row');
eqcol(rows, {
	// options...
});
```


### API

#### eqcol(element [, options])

Initializes and equalizes the specified element(s). Returns an array of `Eqcol` objects.

##### element

Type: `string` || `Element` || `NodeList`

The container of the element(s) to be equalized. For instance, the parent row of the targeted columns.

##### options

Type: `object`

Optionally pass an object with the any of the following values.

| Name       | Type    | Default          | Description                                                |
|:-----------|:--------|:-----------------|:-----------------------------------------------------------|
| byRow      | boolean | true             | Matches each rows' child elements height only              |
| minHeight  | integer | 0                | The minimum height of each column                          |
| useTallest | boolean | true             | Whether to use the tallest column as height of all columns |
| groupAttr  | string  | data-eqcol       | Passed a unique ID of each container                       |
| watchAttr  | string  | data-eqcol-watch | Passed the value of its matching unique parent ID          |


### Methods

###### `eqcol(element, 'equalize')`

Call the `equalize` function directly.

###### `eqcol(element, 'destroy')`

Reset all of the columns back to `auto` height.


### Events

There are two events that are exposed.

| Name    | Description                                  |
|:--------|:---------------------------------------------|
| equal   | Fired right before the columns are equalized |
| equaled | Fired after the columns are equalized        |

```js
const rows = eqcol('.row', options);

rows.forEach(row => {
	row.addEventListener('equaled', () => {
		// do stuff after equalize has finished
	});
});
```

## License

MIT © [Alex Cross](https://alexcross.io)
