const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

module.exports = function loadBrowserModule(filename, globalName) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.resolve(__dirname, '..', '..', filename), 'utf8'), context);
  return context.window[globalName];
};
