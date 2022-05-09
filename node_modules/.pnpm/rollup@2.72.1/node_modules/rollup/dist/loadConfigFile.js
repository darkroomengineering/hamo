/*
  @license
	Rollup.js v2.72.1
	Sat, 07 May 2022 19:04:43 GMT - commit 8c6e0f319b792ea52fe979888593b6523315ae93

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
'use strict';

const loadConfigFile = require('./shared/loadConfigFile.js');
require('fs');
require('path');
require('process');
require('url');
require('./shared/rollup.js');
require('perf_hooks');
require('crypto');
require('events');
require('tty');
require('./shared/mergeOptions.js');



module.exports = loadConfigFile.loadAndParseConfigFile;
//# sourceMappingURL=loadConfigFile.js.map
