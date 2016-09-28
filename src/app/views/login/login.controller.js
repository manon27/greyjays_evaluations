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
			if ((login.user.username === 'coach') && (login.user.password === '123456')) {
				SessionService.create(123456789,12,"coach");
				$location.url('/coach');
			} else if ((login.user.username === 'evaluateur') && (login.user.password === '123456')) {
				SessionService.create(123456789,12,"evaluateur");
				$location.url('/evaluateur');
			} else if ((login.user.username === 'joueur') && (login.user.password === '123456')) {
				SessionService.create(123456789,12,"joueur");
				$location.url('/joueur');
			} else {
				$location.url('/login');
			}
		};

	}

})();
