Caffeine = require "caffeine-script"
{log} = require "art-foundation"

suite "Caffeine.coffeeScript compiler", ->
  test "default to compiling with CoffeeScript", ->
    assert.eq Caffeine.compile("1+2"), compiled: {js: "(function() {\n  1 + 2;\n\n}).call(this);\n"}

suite "Caffeine.metaCompiler", ->
  test "single-line metaCompiler block", ->
    out = Caffeine.compile """
      ###<> @compiler = "JavaScript"
      1+2
      """
    assert.eq out, compiled: {js: "1+2"}

  test "two single-line metaCompiler blocks", ->
    self.__metaCompilerTest = 123
    out = Caffeine.compile """
      ###<> self.__metaCompilerTest = 999
      ###<> @compiler = "JavaScript"
      1+2
      """
    assert.eq out, compiled: {js: "1+2"}
    assert.eq self.__metaCompilerTest, 999

  test "multi-line metaCompiler block", ->
    self.__metaCompilerTest = 123
    out = Caffeine.compile """
      ###<
      self.__metaCompilerTest = 456
      @compiler = "JavaScript"
      ###>
      1+2
      """
    assert.eq out, compiled: {js: "1+2"}

    assert.eq self.__metaCompilerTest, 456

  test "custom compiler", ->
    out = Caffeine.compile """
      ###<> @compiler = compile: (source) -> compiled: js: "source: \#{source}"
      1+2
      """
    assert.eq out, compiled: js: "source: 1+2"