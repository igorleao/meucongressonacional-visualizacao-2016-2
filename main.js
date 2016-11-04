'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gastos = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _d = require('d3');

var _crossfilter = require('crossfilter');

var crossfilter = _interopRequireWildcard(_crossfilter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Gastos = function () {
  function Gastos() {
    _classCallCheck(this, Gastos);

    self.PATH = "../data/politicodw.csv";
    d3.csv(PATH, function (error, data) {
      self.DATA = crossfilter(data);
    });
  }

  _createClass(Gastos, [{
    key: 'filter',
    value: function filter() {}
  }, {
    key: 'notify',
    value: function notify() {}
  }]);

  return Gastos;
}();

var gastos = exports.gastos = new Gastos();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function Main() {
  _classCallCheck(this, Main);
};
