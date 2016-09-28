(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("monHeader", monHeader);

	/**
	@name		monHeader
	@desc 		<mon-header></mon-header>
	@returns	GUI du footer
	*/

	/** @ngInject */
	function monHeader($location, $cookies) {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/monHeader/monHeader.tpl.html',
			link: linkF
		};
		return directive;

		function linkF(scope) {
			scope.interfaceCoach=false;
			scope.interfaceEvaluateur=false;
			scope.interfaceJoueur=false;
			scope.user_role='';
			if (typeof $cookies.getObject("gjSession") !== 'undefined') {
				scope.user_role = $cookies.getObject("gjSession").userRole;
				scope.interfaceCoach = ($location.path().indexOf('coach') > 0);
				scope.interfaceEvaluateur = ($location.path().indexOf('evaluateur') > 0);
				scope.interfaceJoueur = ($location.path().indexOf('joueur') > 0);
			}
		}
	}

})();
