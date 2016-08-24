(function(__D) {
	'use strict';

	angular
		.module('greyjaysEvaluations', ['ngRoute', 'ui.bootstrap']);

	angular.element(__D).ready(function() {
		angular.bootstrap(__D.getElementById('greyjaysEvaluations'), ['greyjaysEvaluations']);
	});

})(document);