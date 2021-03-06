import elemDataset from 'elem-dataset';
import CustomEvt from 'customevent';

const NAME = 'eqcol';

const DEFAULTS = {
	useTallest: true,
	minHeight: 0,
	byRow: true,
	groupAttr: `data-${NAME}`,
	watchAttr: `data-${NAME}-watch`
};

const EVENT = {
	before: 'equal',
	after: 'equaled'
};

const slice = Array.prototype.slice;

class Eqcol {

	constructor(element, options) {
		this._element = element;
		this._options = Object.assign({}, DEFAULTS, elemDataset(this._element), options);
	}

	equalize() {
		let items = this._getItems();

		if (items.length === 0) {
			return;
		}

		const length = items.length;
		const preEqualize = new CustomEvt(EVENT.before, {
			cancelable: true,
			detail: {
				length
			}
		});

		this._element.dispatchEvent(preEqualize);
		if (preEqualize.defaultPrevented) {
			return;
		}

		// Reset heights
		this._reset(items);

		while (items.length > 0) {
			let cols = slice.call(items);

            // Keep unselected columns
			const temp = [];

			if (this._options.byRow) {
				const that = this;

				// Get top offset of first item in the row
				const offset = items[0].getBoundingClientRect().top;

				// Get all columns with the same offset
				cols = cols.filter(item => {
					if (that._getHeight(item) > 0) {
						if (item.getBoundingClientRect().top === offset) {
							return true;
						}

						temp.push(item);
					}

					return false;
				});
			}

			if (cols.length === 1) {
				const height = this._getHeight(cols[0]);

				if (height < this._options.minHeight) {
					cols[0].style.height = `${this._options.minHeight}px`;

				} else {
					cols[0].style.height = 'auto';
				}

			} else if (cols.length > 1) {
				const heights = cols.map(this._getHeight);

				let max = this._options.useTallest ?
					Math.max.apply(null, heights) :
					Math.min.apply(null, heights);

				// Make sure the height is greater than minHeight
				max = Math.max(this._options.minHeight, max);

				cols.forEach(item => {
					item.style.height = `${max}px`;
				});
			}

			// Copy unselected columns to items
			items = temp;
		}

		const postEqualize = new CustomEvt(EVENT.after, {
			detail: {
				length
			}
		});

		this._element.dispatchEvent(postEqualize);
	}

	destroy() {
		this._reset();
	}

	_getHeight(col) {
		return col.offsetHeight;
	}

	_getItems() {
		const group = this._element.getAttribute(`${this._options.groupAttr}`) || '';

		return this._element.querySelectorAll(`[${this._options.watchAttr}="${group}"]`);
	}

	_reset(items = this._getItems()) {
		slice.call(items).forEach(item => {
			item.style.height = 'auto';
		});
	}
}

export default function (element, options) {
	if (typeof element === 'string') {
		element = document.querySelectorAll(element);
	}

	const items = element instanceof NodeList ? slice.call(element) : [...element];

	for (const item of items) {
		const instance = new Eqcol(item, typeof options === 'object' && options);

		if (typeof options === 'string') {
			instance[options]();

		} else {
			setTimeout(() => instance.equalize());
		}
	}

	return items;
}
