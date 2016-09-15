(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.config(routeConfig);


	function routeConfig($routeProvider, AUTH_ROLES) {

		$routeProvider
		.when('/main', {
			templateUrl: 'app/views/main/main.html',
			controller: 'MainController',
			controllerAs: 'main',
			roles: {authorizedRoles: [AUTH_ROLES.admin, AUTH_ROLES.user]}
		})
		.when('/admin', {
			templateUrl: 'app/views/admin/admin.html',
			controller: 'AdminController',
			controllerAs: 'admin',
			roles: {authorizedRoles: [AUTH_ROLES.admin]}
		})
		.when('/login', {
			templateUrl: 'app/views/login/login.html',
			controller: 'LoginController',
			controllerAs: 'login'
		})
		.when('/logout', {
			templateUrl: 'app/views/logout/logout.html',
			controller: 'LogoutController',
			controllerAs: 'logout'
		})
		.otherwise({
			redirectTo: '/login'
		});
	}

})();
