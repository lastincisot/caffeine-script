# generated by Neptune Namespaces v3.x.x
# file: tests/CaffeineScript/namespace.coffee

module.exports = (require '../namespace').addNamespace 'CaffeineScript', class CaffeineScript extends Neptune.PackageNamespace
  @version: require('../../../package.json').version
require './CafSourceMap/namespace';
require './Parser/namespace';
require './Preprocessors/namespace';
require './Semantics/namespace'