Caf.defMod(module, () => {let require = global.require, module = global.module; let Foundation, BabelBridge, log, a, w, m, defineModule, compactFlatten, present, isFunction, BaseObject, inspect, isString, Parser, Nodes, Extensions, RuleNode, Rules, SemanticTree, RootStn; Foundation = require("art-foundation"); BabelBridge = require("babel-bridge"); ({log, a, w, m, defineModule, compactFlatten, present, isFunction, BaseObject, inspect, isString} = Foundation); ({Parser, Nodes, Extensions} = BabelBridge); ({RuleNode} = Nodes); Rules = require("./Rules"); SemanticTree = require("./SemanticTree"); ({RootStn} = require("./SemanticTree")); return defineModule(module, function() {return CafParseNodeBaseClass = Caf.defClass(class CafParseNodeBaseClass extends Nodes.Node {}, function() {this.prototype.isImplicitArray = function() {return !!this.getImplicitArray();}; return this;});});});