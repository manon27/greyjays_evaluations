(function() {
	'use strict';

	angular
		.module('greyjays.evaluations')
		.run(runBlock);

	/** @ngInject */
	function runBlock($log) {
		$log.debug('runBlock end');
	}

})();
