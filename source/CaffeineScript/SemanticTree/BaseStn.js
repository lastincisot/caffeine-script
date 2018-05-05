"use strict";
let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  return Caf.importInvoke(
    [
      "BaseClass",
      "objectWithout",
      "toInspectedObjects",
      "objectKeyCount",
      "compactFlatten",
      "log",
      "JSON",
      "Error",
      "isString",
      "merge"
    ],
    [global, require("../StandardImport")],
    (
      BaseClass,
      objectWithout,
      toInspectedObjects,
      objectKeyCount,
      compactFlatten,
      log,
      JSON,
      Error,
      isString,
      merge
    ) => {
      let createObjectTreeFactory, SourceNode, binary, BaseStn;
      return (
        ({ createObjectTreeFactory } = require("art-object-tree-factory")),
        ({ SourceNode } = require("source-map")),
        ({ binary } = require("art-binary")),
        (BaseStn = Caf.defClass(
          class BaseStn extends BaseClass {
            constructor(props, children = [], pretransformedStn) {
              let cafTemp, cafBase;
              super(...arguments);
              this.children = children;
              this.pretransformedStn = pretransformedStn;
              this.parseTreeNode =
                (cafTemp =
                  Caf.exists((cafBase = this.pretransformedStn)) &&
                  cafBase.parseTreeNode) != null
                  ? cafTemp
                  : props.parseTreeNode;
              this.pretransformedStn || (this.pretransformedStn = this);
              this.props = objectWithout(props, "parseTreeNode");
              this.initLabeledChildren();
            }
          },
          function(BaseStn, classSuper, instanceSuper) {
            let sourceNodeLineColumnScratch, applyRequiredParens, applyParens;
            this.abstractClass();
            this.setter("parseTreeNode");
            this.getter({
              parseTreeNode: function() {
                let cafTemp, cafBase;
                return (cafTemp = this._parseTreeNode) != null
                  ? cafTemp
                  : Caf.exists((cafBase = this.parent)) &&
                      cafBase.parseTreeNode;
              }
            });
            this.prototype.initLabeledChildren = function() {
              this.labeledChildren = this.children && {};
              return Caf.each2(this.children, child => {
                let label, pluralLabel, cafBase;
                child.parent = this;
                ({ label, pluralLabel } = child);
                this.labeledChildren[label] = child;
                return pluralLabel
                  ? (
                      (cafBase = this.labeledChildren)[pluralLabel] ||
                      (cafBase[pluralLabel] = [])
                    ).push(child)
                  : undefined;
              });
            };
            this.prototype.getInspectedProps = function() {
              return objectWithout(this.props, "label", "pluralLabel");
            };
            this.getter({
              sourceOffset: function() {
                return this.parseTreeNode.offset;
              },
              parser: function() {
                return this.parseTreeNode.parser.rootParser;
              },
              sourceFile: function() {
                return this.parser.sourceFile;
              },
              label: function() {
                return this.props.label;
              },
              pluralLabel: function() {
                return this.props.pluralLabel;
              },
              root: function() {
                let cafTemp, cafBase;
                return (cafTemp =
                  Caf.exists((cafBase = this.parent)) && cafBase.root) != null
                  ? cafTemp
                  : this;
              },
              inspectedObjects: function() {
                let label, props, name, a;
                ({ label } = this);
                props = this.getInspectedProps();
                name = this.class.getName();
                if (label) {
                  name = `${Caf.toString(label)}.${Caf.toString(name)}`;
                }
                return {
                  [`${Caf.toString(name)}`]:
                    this.children.length === 0
                      ? toInspectedObjects(props)
                      : ((a = []),
                        objectKeyCount(props) > 0 ? a.push(props) : undefined,
                        a.concat(
                          Caf.array(this.children, c => c.inspectedObjects)
                        ))
                };
              },
              type: function() {
                return this.class.type;
              }
            });
            this.postCreate = function() {
              let s;
              s = this.getName().split(/Stn$/);
              this.type = s[0];
              return classSuper.postCreate.apply(this, arguments);
            };
            this.newInstance = function(props, children) {
              return new this(props, children);
            };
            this.postCreateConcreteClass = function(options) {
              let classModuleState, hotReloadEnabled;
              ({ classModuleState, hotReloadEnabled } = options);
              classSuper.postCreateConcreteClass.apply(this, arguments);
              return require("../StnRegistry").register(
                createObjectTreeFactory({ class: this }, (props, children) =>
                  this.newInstance(props, children)
                )
              );
            };
            this.prototype.findParent = function(stnTypePattern) {
              let parent, found;
              ({ parent } = this);
              found = null;
              while (parent && !found) {
                if (parent.type.match(stnTypePattern)) {
                  found = parent;
                } else {
                  ({ parent } = parent);
                }
              }
              return found;
            };
            this.prototype.find = function(
              stnTypePattern,
              stnTypeStopPattern,
              _foundList = []
            ) {
              Caf.each2(
                this.children,
                child =>
                  stnTypePattern.test(child.type)
                    ? _foundList.push(child)
                    : !(
                        Caf.exists(stnTypeStopPattern) &&
                        stnTypeStopPattern.test(child.type)
                      )
                      ? child.find(
                          stnTypePattern,
                          stnTypeStopPattern,
                          _foundList
                        )
                      : undefined
              );
              return _foundList.length === 0 ? null : _foundList;
            };
            sourceNodeLineColumnScratch = {};
            this.getter({
              sourceFile: function() {
                let cafTemp, cafBase;
                return (cafTemp =
                  Caf.exists((cafBase = this.parseTreeNode)) &&
                  cafBase.sourceFile) != null
                  ? cafTemp
                  : "caffeine-script";
              },
              newSourceNode: function() {
                let line, column;
                ({ line, column } = this.parseTreeNode.getSourceLineColumn(
                  sourceNodeLineColumnScratch
                ));
                return new SourceNode(
                  line + 1,
                  column,
                  this.parseTreeNode.sourceFile
                );
              }
            });
            this.prototype.createSourceNode = function(...args) {
              return this.newSourceNode.add(compactFlatten(args));
            };
            this.prototype.toSourceNode = function(options) {
              log.warn(
                `WARNING: toSourceNode not overridden in ${Caf.toString(
                  this.class.name
                )}. Falling back to old toJs().`
              );
              return this.createSourceNode(this.toJs(options));
            };
            this.prototype.toJsUsingSourceNode = function(options = {}) {
              let inlineMap, sourceMap, sourceFile, sourceNode, code, map;
              ({
                inlineMap,
                sourceMap,
                sourceFile = this.sourceFile
              } = options);
              sourceNode = this.toSourceNode(options);
              return inlineMap || sourceMap
                ? (({ code, map } = sourceNode.toStringWithSourceMap({
                    file: sourceFile
                  })),
                  inlineMap
                    ? {
                        js: `${Caf.toString(
                          code
                        )}\n//# sourceMappingURL=${Caf.toString(
                          binary(JSON.stringify(map.toString())).toDataUri(
                            "application/json",
                            true
                          )
                        )}\n//# sourceURL=${Caf.toString(sourceFile)}`
                      }
                    : { js: code, sourceMap: map })
                : { js: sourceNode.toString() };
            };
            this.prototype.childrenToSourceNodes = function(joiner, options) {
              return this.stnArrayToSourceNodes(this.children, joiner, options);
            };
            this.prototype.stnArrayToSourceNodes = function(
              stnArray,
              joiner,
              options
            ) {
              let out;
              return Caf.array(
                stnArray,
                (c, i) => {
                  if (joiner != null && i > 0) {
                    out.push(joiner);
                  }
                  return c.toSourceNode(options);
                },
                null,
                (out = [])
              );
            };
            this.prototype.doSourceNode = function(...body) {
              return this.createSourceNode("(() => {", body, "})()");
            };
            null;
            this.prototype.toJs = function(options) {
              return (() => {
                throw new Error(
                  `must override one of the toJs* functions: ${Caf.toString(
                    this.className
                  )}`
                );
              })();
            };
            this.prototype.childrenToJs = function(joiner = "", options) {
              return Caf.array(this.children, c => c.toJs(options)).join(
                joiner
              );
            };
            this.prototype.doJs = function(args, body) {
              if (args) {
                throw "TODO";
              }
              if (!isString(body)) {
                body = body.toFunctionBodyJs();
              }
              return `(() => {${Caf.toString(body)};})()`;
            };
            this.prototype.toFunctionBodyJsArray = function(
              returnAction = true
            ) {
              return returnAction
                ? [`return ${Caf.toString(this.toJsExpression())}`]
                : [this.toJs()];
            };
            this.prototype.toFunctionBodyJs = function(returnAction = true) {
              return this.toFunctionBodyJsArray(returnAction).join("");
            };
            this.prototype.toJsExpression = function(options) {
              return this.toJs(merge(options, { expression: true }));
            };
            this.prototype.toInterpolatedJsStringPart = function() {
              return `\${Caf.toString(${Caf.toString(this.toJsExpression())})}`;
            };
            this.prototype.transformChildren = function() {
              let ret;
              ret = null;
              Caf.each2(this.children, (child, i) => {
                let newChild;
                return child !== (newChild = child.transform())
                  ? (ret != null ? ret : (ret = this.children.slice()),
                    (newChild.props.label = child.label),
                    (ret[i] = newChild))
                  : undefined;
              });
              return ret || this.children;
            };
            this.prototype.postTransform = function() {
              return this;
            };
            this.prototype.decorate = function() {};
            this.prototype.newTransformedInstance = function(
              newProps,
              newChildren
            ) {
              return new this.class(newProps, newChildren, this);
            };
            this.prototype.transform = function() {
              let newChildren;
              this.decorate();
              return (this.children !== (newChildren = this.transformChildren())
                ? this.newTransformedInstance(this.props, newChildren)
                : this
              )
                .postTransform()
                .setDefaultParseTreeNode(this.parseTreeNode);
            };
            this.prototype.setDefaultParseTreeNode = function(parseTreeNode) {
              if (!this.parseTreeNode) {
                this.parseTreeNode = parseTreeNode;
                Caf.each2(this.children, child =>
                  child.setDefaultParseTreeNode(parseTreeNode)
                );
              }
              return this;
            };
            this.prototype.needsParens = true;
            this.prototype.needsParensAsStatement = false;
            this.prototype.getNeedsParens = function() {
              return this.needsParens;
            };
            this.prototype.getNeedsParensAsStatement = function() {
              return this.needsParensAsStatement;
            };
            this.applyRequiredParens = applyRequiredParens = function(expr) {
              return `(${Caf.toString(expr)})`;
            };
            this.prototype.applyRequiredParens = applyRequiredParens;
            this.applyParens = applyParens = function(expr) {
              return expr.match(
                /^(\([^)]*\)|\[[^\]]*\]|([!~-]*[_a-z0-9.]*)(\([^)]*\))?)$/i
              )
                ? expr
                : `(${Caf.toString(expr)})`;
            };
            this.prototype.applyParens = applyParens;
            this.prototype.validate = function() {};
            this.prototype.validateAll = function() {
              let e;
              try {
                this.validate();
              } catch (cafError) {
                e = cafError;
                throw this.parseTreeNode.parser.generateCompileError({
                  failureIndex: this.sourceOffset,
                  errorType: "Validation",
                  message: e.message,
                  info: e.info
                });
              }
              Caf.each2(this.children, child => child.validateAll());
              return this;
            };
            this.prototype.updateScope = function(scope) {
              this.scope = scope;
              return Caf.each2(this.children, child =>
                child.updateScope(this.scope)
              );
            };
          }
        ))
      );
    }
  );
});
