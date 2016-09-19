(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.run(runBlock);

	/** @ngInject */
	function runBlock($location, $rootScope, AuthService) {
		var root = $rootScope;
		root.$on('$routeChangeStart', function (event, next) {
			if (typeof next.roles !== 'undefined') {
				var authorizedRoles = next.roles.authorizedRoles;
				if (!AuthService.isAuthorized(authorizedRoles)) {
					$location.path('/logout');
				}
			}
		});
	}

})();
