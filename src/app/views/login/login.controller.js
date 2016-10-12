(function() {
	'use strict';

	angular
	.module('greyjays.evaluations')
	.controller('LoginController', LoginController);

	/**
	 * Controlleur pour la page de login
	 * @param {Object} $scope
	 * @param {service} AuthService - Service pour l'authentification
	 */

	/** @ngInject */
	function LoginController($scope, AuthService) {

		var login = $scope;

		login.user = {};

		/**
		 * Se connecter
		 */
		login.connecter = function() {
			var credits = {};
			credits.username = login.user.username;
			credits.password = login.user.password;
			AuthService.connecter(credits);
		};

	}

})();
