(function() {
  'use strict';

  angular
    .module('greyjaysEvaluations')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
