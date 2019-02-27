"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = list;
function list() {
  var n = 20000;
  var array = [];

  for (var i = 0; i < n; i += 1) {
    array.push({ name: "Item " + (i + 1) + " of " + n });
  }

  // console.log(array);

  return array;
}