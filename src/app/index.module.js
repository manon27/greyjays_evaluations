/**
 * @license greyjaysEvaluations
 * (c) 2016 Manon
 * Version : 1.0.0
 * https://github.com/manon27/greyjays_evaluations
 * License: MIT
 */
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
		.module('greyjays.evaluations', ['ngRoute', 'ui.bootstrap', 'ngCookies', 'ngMessages', 'ngSanitize', 'chart.js']);

	/**
	 * Chargement du module dans le noeud du dom avec id=greyJaysEvaluations
	 */
	angular.element(__D).ready(function() {
		angular.bootstrap(__D.getElementById('greyjaysEvaluations'), ['greyjays.evaluations']);
	});

})(document);