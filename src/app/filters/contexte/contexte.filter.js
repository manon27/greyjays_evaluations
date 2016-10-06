(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.filter('formaterTexte', formaterTexte);

	/** @ngInject */
	function formaterTexte() {
		return function(input, champs) {
			var str = '';
			if (input === 0) {
				if (champs === 'inmatch') str += 'Entraînement';
				if (champs === 'mesurable') str += 'Non';
			} else if (input === 1) {
				if (champs === 'inmatch') str += 'Match';
				if (champs === 'mesurable') str += 'Oui (+)';
			} else if (input === 2) {
				if (champs === 'mesurable') str += 'Oui (-)';
			}
			return str;
		};
	}
})();
