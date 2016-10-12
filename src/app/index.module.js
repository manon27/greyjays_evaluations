(function(__D) {
	'use strict';

	/**
	 * Chargement du module principal
	 * @param {module} ngRoute
	 * @param {module} ui.bootstrap
	 * @param {module} ngCookies
	 * @param {module} ngMessages
	 * @param {module} chart.js
	 */
	angular
		.module('greyjays.evaluations', ['ngRoute', 'ui.bootstrap', 'ngCookies', 'ngMessages', 'chart.js']);

	/**
	 * Chargement du module dans le noeud du dom avec id=greyJaysEvaluations
	 */
	angular.element(__D).ready(function() {
		angular.bootstrap(__D.getElementById('greyjaysEvaluations'), ['greyjays.evaluations']);
	});

})(document);