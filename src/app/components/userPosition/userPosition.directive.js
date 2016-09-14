(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.directive("userPosition", userPosition);

	/**
	@name		userPosition
	@desc 		<mon-footer></mon-footer>
	@returns	GUI du footer
	*/

	/** @ngInject */
	function userPosition() {
		var directive = {
			restrict: 'E',
			templateUrl: 'app/components/userPosition/userPosition.tpl.html'
		};
		return directive;
	}

})();
