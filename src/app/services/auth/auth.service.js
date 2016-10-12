(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('AuthService', AuthService);

	/**
	 * Service qui va servir pour la gestion des authentifications
	 */

	/** @ngInject */
	function AuthService($q, $http, $cookies, $location, APPLICATION_PARAMS, APPLICATION_ENV, SessionService, JoueurService, _) {

		/**
		 * constructeur
		 */
		var MonService = function() {

		};

		/**
		 * Authentification
		 * @param {Object} credentials - paramètres d'identification
		 */
		MonService.prototype.connecter = function (credentials) {
			var promise1 = $q.when('start');
			var promise2 = promise1.then(function () {
				return $http({
					url: APPLICATION_PARAMS[APPLICATION_ENV].RESOURCE_URL + 'login',
					method: 'POST',
					data: credentials
				});
			});
			var promise3 = promise2.then(function () {
				return JoueurService.getAll();
			});
			promise3.then(function() {
				var allJ = JoueurService.all;
				var joueurConnecte = _.filter(allJ, function(joueur) {
					return joueur.email === credentials.username;
				});
				if (joueurConnecte.length !== 1) {
					$location.url('/login');
					return;
				}
				SessionService.create(Math.random()*100000, joueurConnecte[0].id, joueurConnecte[0].role);
				if (joueurConnecte[0].role === 'joueur') {
					$location.url('/' + joueurConnecte[0].role + '/' + joueurConnecte[0].id);
				} else {
					$location.url('/' + joueurConnecte[0].role);
				}
			});
		};

		/**
		 * Déconnecter
		 */
		MonService.prototype.deconnecter = function () {
			var promise1 = $q.when('start');
			var promise2 = promise1.then(function () {
				return $http({
					url: APPLICATION_PARAMS[APPLICATION_ENV].RESOURCE_URL + 'logout',
					method: 'POST',
					data: {"action":"logout"}
				});
			});
			promise2.then(function () {
				SessionService.destroy();
				$location.url('/');
			});
		};

		/**
		 * Vérifier si la session existe
		 * @returns {boolean} 	
		 */
		MonService.prototype.isAuthenticated = function () {
			return !!SessionService.userId;
		};

		/**
		 * Vérifier si le rôle correspond
		 * @param {string[]} authorizedRoles - rôles autorisés
		 * @return {boolean}
		 */
		MonService.prototype.isAuthorized = function (authorizedRoles) {
			var self = this;
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			if ($cookies.getObject("gjSession")) {
				return (authorizedRoles.indexOf($cookies.getObject("gjSession").userRole) !== -1);
			}
			return (self.isAuthenticated() && authorizedRoles.indexOf(SessionService.userRole) !== -1);
		};

		return new MonService();

	}
})();
