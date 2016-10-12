(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('SessionService', SessionService);

	/**
	 * Service qui va servir pour la gestion des sessions
	 * @param {service} $cookies - service de gestion des cookies
	 * @returns {service}
	 */

	/** @ngInject */
	function SessionService($cookies) {

		/**
		 * Constructeur
		 */
		var MonService = function() {

		};

		/**
		 * Création d'une session par stockage dans un cookie
		 * @param {string} sessionId - identifiant de session
		 * @param {Number} userId - identifiant de l'utilisateur
		 * @param {string} userRole - role de l'utilisateur
		 */
		MonService.prototype.create  = function(sessionId, userId, userRole) {
			this.id = sessionId;
			this.userId = userId;
			this.userRole = userRole;
			$cookies.putObject("gjSession", {'sessionId':sessionId, 'userId':userId, 'userRole':userRole});
		};

		/**
		 * Destruction de la session
		 */
		MonService.prototype.destroy  = function() {
			this.id = null;
			this.userId = null;
			this.userRole = null;
			$cookies.remove("gjSession");
		};

		return new MonService();

	}
})();
