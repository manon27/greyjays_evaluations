(function(__D) {
	'use strict';

	angular
		.module('greyjays.evaluations', ['LocalStorageModule', 'ngRoute', 'ui.bootstrap', 'ngCookies', 'ngMessages']);

	angular.element(__D).ready(function() {
		angular.bootstrap(__D.getElementById('greyjaysEvaluations'), ['greyjays.evaluations']);
	});

})(document);