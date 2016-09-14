(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('AuthService', AuthService);

	/**
	*	@name		AuthService
	*	@desc		Service qui va servir pour la gestion des sessions
	*/

	/** @ngInject */
	function AuthService($http, SessionService) {

		/**
		@name	MonService
		@desc	constructeur
		*/
		var MonService = function() {

		};

		/**
		@name	create 
		@desc 	
		@param 	
		*/
		MonService.prototype.login = function (credentials) {
			return $http
				.post('http://localhost/gj_evaluations/login.php', credentials)
				.then(function (response) {
					SessionService.create(response.data.id, response.data.user.id,
					response.data.user.role);
					return response.data.user;
				});
		};

		/**
		@name	isAuthenticated 
		@desc 	
		@param 	
		*/
		MonService.prototype.isAuthenticated = function () {
			return !!SessionService.userId;
		};

		/**
		@name	isAuthorized 
		@desc 	
		@param 	
		*/
		MonService.prototype.isAuthorized = function (authorizedRoles) {
			var self = this;
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (self.isAuthenticated() && authorizedRoles.indexOf(SessionService.userRole) !== -1);
		};

		return new MonService();

	}
})();
