let Caf = require("caffeine-script-runtime");
Caf.defMod(module, () => {
  let RegExp = global.RegExp;
  return {
    deescapeSpaces: function(string) {
      return string.replace(/\\ /g, " ");
    },
    escapeNewLines: function(string) {
      return string.replace(/\n/g, "\\n");
    },
    escapeUnEscapedQuotes: function(string, quote = '"') {
      return string.replace(
        RegExp(`([^${quote}\\\\]*(?:\\\\.[^${quote}\\\\]*)*)${quote}`, "g"),
        `$1${quote}`
      );
    }
  };
});
