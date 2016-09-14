(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("logged", logged);

	/**
	@name		logged
	@desc 		<logged></logged>
	@param		Service pour la Session
	@returns	GUI de loguer / pas loguer
	*/

	/** @ngInject */
	function logged(SessionService) {
		var directive = {
			restrict: 'E',
			scope: {},
			templateUrl: 'app/components/logged/logged.tpl.html',
			link: linkF
		};
		return directive;
		
		function linkF(scope) {

			scope.role = SessionService.userRole;			

		}
	}

})();
