(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.run(runBlock);

	/** @ngInject */
	function runBlock($location, $rootScope, AUTH_EVENTS, AuthService) {
		$rootScope.$on('$routeChangeStart', function (event, next) {
			if (!angular.isString(next.redirectTo)) {
				var authorizedRoles = next.roles.authorizedRoles;
				if (!AuthService.isAuthorized(authorizedRoles)) {
					//event.preventDefault();
					if (AuthService.isAuthenticated()) {
						// user is not allowed
						$location.path('/login');
					} else {
						// user is not logged in
						$location.path('/login');
					}
				}
			}
		});
	}

})();
