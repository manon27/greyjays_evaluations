(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.filter('formaterTexte', formaterTexte);

	/** @ngInject */
	function formaterTexte() {
		return function(input, champs) {
			var str = '';
			if (input === null) {

			} else if (input === 0) {
				if (champs === 'inmatch') str += 'Entraînement';
				if (champs === 'mesurable') str += 'L\'action n\'est pas dénombrable (mesurée par un nombre).';
			} else if (input === 1) {
				if (champs === 'inmatch') str += 'Match';
				if (champs === 'mesurable') str += 'La note augmente si la mesure augmente (ex: distance).';
			} else if (input === 2) {
				if (champs === 'mesurable') str += 'La note augmente si la mesure diminue (ex: chrono).';
			} else {
				str += input.replace(/(?:\r\n|\r|\n)/g, '<br />');
			}
			return str;
		};
	}
})();
