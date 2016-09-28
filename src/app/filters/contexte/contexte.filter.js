(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.filter('formaterContexte', formaterContexte);

	/** @ngInject */
	function formaterContexte() {
		return function(input) {
			var str = '';
			if (input === 0) {
				str += 'Entraînement';
			} else if (input === 1) {
				str += 'Match';
			}
			return str;
		};
	}
})();
