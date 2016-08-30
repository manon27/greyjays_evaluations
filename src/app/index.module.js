(function(__D) {
	'use strict';

	angular
		.module('greyjays.evaluations', ['ngRoute', 'ui.bootstrap']);

	angular.element(__D).ready(function() {
		angular.bootstrap(__D.getElementById('greyjaysEvaluations'), ['greyjays.evaluations']);
	});

})(document);