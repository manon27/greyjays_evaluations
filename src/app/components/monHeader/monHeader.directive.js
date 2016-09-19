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
			scope.interfaceAdmin=false;
			scope.user_role='';
			if (typeof $cookies.getObject("gjSession") !== 'undefined') {
				scope.user_role = $cookies.getObject("gjSession").userRole;
				scope.interfaceAdmin = ($location.path().indexOf('admin') > 0);
			}
		}
	}

})();
