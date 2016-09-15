(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.service('SessionService', SessionService);

	/**
	*	@name		SessionService
	*	@desc		Service qui va servir pour la gestion des sessions
	*/

	/** @ngInject */
	function SessionService($cookies) {

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
		MonService.prototype.create  = function(sessionId, userId, userRole) {
			this.id = sessionId;
			this.userId = userId;
			this.userRole = userRole;
			$cookies.putObject("gjSession", {'sessionId':sessionId, 'userId':userId, 'userRole':userRole});
		};

		/**
		@name	destroy 
		@desc 	
		@param 	
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
