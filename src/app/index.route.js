(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.config(routeConfig);

	function routeConfig($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'app/main/main.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.otherwise({
			redirectTo: '/'
		});
	}

})();
