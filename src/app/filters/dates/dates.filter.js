(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.filter('formaterDate', formaterDate);

	/** @ngInject */
	function formaterDate() {
		return function(input, format) {
			var maDate = new Date(input);
			var lesMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
			var lesJours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
			var str = '';
			if (format == 'mois ANNEE') {
				str += lesMois[maDate.getMonth()] + ' ' + maDate.getFullYear();
			} else if (format == 'jour mois annee') {
				str += maDate.getDate() + ' ' + lesMois[maDate.getMonth()].toLowerCase() + ' ' + maDate.getFullYear();
			} else if (format == 'hh mm') {
				str += maDate.getHours() + 'h';
				if (maDate.getMinutes() < 10) { str += '0'; }
				str += maDate.getMinutes();
			} else if (format == 'libelle jour') {
				str += lesJours[maDate.getDay()] + ' ' + maDate.getDate();
			} else if (format == 'libelle jour mois') {
				str += lesJours[maDate.getDay()] + ' ' + maDate.getDate() + ' ' + lesMois[maDate.getMonth()].toLowerCase();
			} else if (format == 'mois') {
				str += lesMois[maDate.getMonth()];
			}
			return str;
		};
	}
})();
