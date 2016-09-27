/* eslint-env jquery */
import E from './eqcol';

$.fn.eqcol = function (opts) {
	return this.each((index, element) => {
		const $this = $(element);
		const options = $.extend({}, typeof opts === 'object' && opts);

		let instance = $this.data('eqcolizer');

		if (!instance) {
			$this.data('eqcolizer', (instance = new E(element, options)));
		}

		if (typeof opts === 'string') {
			instance[opts]();
		}
	});
};
