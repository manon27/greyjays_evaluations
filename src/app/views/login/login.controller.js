(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('LoginController', LoginController);

	/** @ngInject */
	function LoginController($scope, $location, SessionService) {

		var login = $scope;

		login.user = {};

		login.connecter = function() {
			if ((login.user.username === 'admin') && (login.user.password === 'admin')) {
				SessionService.create(123456789,12,"admin");
				$location.url('/admin');
			} else if ((login.user.username === 'user') && (login.user.password === 'user')) {
				SessionService.create(123456789,12,"user");
				$location.url('/main');
			} else {
				$location.url('/login');
			}
		};

	}

})();
