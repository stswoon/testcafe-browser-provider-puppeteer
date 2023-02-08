"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _puppeteer = _interopRequireDefault(require("puppeteer"));
var timeoutId;
var intervalId;
var _default = {
  // Multiple browsers support
  isMultiBrowser: true,
  browser: null,
  openedPages: {},
  // Required - must be implemented
  // Browser control
  openBrowser: function openBrowser(id, pageUrl, browserName, retry) {
    var _this = this;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var browserArgs, launchArgs, noSandboxArgs, userArgs, params, executablePath, page, emulationArg, _emulationArg$split, _emulationArg$split2, emulationDevice, device, tmp;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            browserArgs = browserName.split(':');
            if (_this.browser) {
              _context3.next = 10;
              break;
            }
            launchArgs = {
              timeout: 10000
            };
            noSandboxArgs = ['--no-sandbox', '--disable-setuid-sandbox'];
            if (browserArgs.indexOf('no_sandbox') !== -1) launchArgs.args = noSandboxArgs;else if (browserName.indexOf('?') !== -1) {
              userArgs = browserName.split('?');
              params = userArgs[0];
              if (params === 'no_sandbox') launchArgs.args = noSandboxArgs;
              executablePath = userArgs[1];
              if (executablePath.length > 0) launchArgs.executablePath = executablePath;
            }
            console.log("sts::open browser");
            _context3.next = 8;
            return _puppeteer["default"].launch(launchArgs);
          case 8:
            _this.browser = _context3.sent;
            console.log("sts::browser opened");
          case 10:
            console.log("sts::open page");
            _context3.next = 13;
            return _this.browser.newPage();
          case 13:
            page = _context3.sent;
            console.log("sts::page opened");
            emulationArg = browserArgs.find(function (v) {
              return /^emulate/.test(v);
            });
            if (!Boolean(emulationArg)) {
              _context3.next = 23;
              break;
            }
            _emulationArg$split = emulationArg.split('='), _emulationArg$split2 = (0, _slicedToArray2["default"])(_emulationArg$split, 2), emulationDevice = _emulationArg$split2[1];
            device = _puppeteer["default"].devices[emulationDevice];
            if (device) {
              _context3.next = 21;
              break;
            }
            throw new Error('Emulation device is not supported');
          case 21:
            _context3.next = 23;
            return page.emulate(device);
          case 23:
            timeoutId = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
              var tmp;
              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    console.info("sts::reload");
                    //await this.closeBrowser(id)
                    //await this.openBrowser(id, pageUrl, browserName, true)
                    _context2.next = 3;
                    return page.reload();
                  case 3:
                    console.info("sts::reloaded");
                    timeoutId = setTimeout( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
                      return _regenerator["default"].wrap(function _callee$(_context) {
                        while (1) switch (_context.prev = _context.next) {
                          case 0:
                            console.info("sts::reload");
                            //await this.closeBrowser(id)
                            //await this.openBrowser(id, pageUrl, browserName, true)
                            _context.next = 3;
                            return page.reload();
                          case 3:
                            console.info("sts::reloaded");
                          case 4:
                          case "end":
                            return _context.stop();
                        }
                      }, _callee);
                    })));
                    tmp = 10;
                    clearInterval(intervalId);
                    intervalId = setInterval(function () {
                      tmp--;
                      console.log("reloaded after " + tmp + "min");
                    }, 60 * 1000);
                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            })), 10 * 60 * 1000);
            tmp = 10;
            intervalId = setInterval(function () {
              tmp--;
              console.log("reloaded after " + tmp + "min");
            }, 60 * 1000);
            console.log("sts::goto url=" + pageUrl);
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              var gotoTimeout = setTimeout(function () {
                console.error("sts::gotoTimeout");
                if (retry) {
                  console.error("sts::retry already used");
                  reject("sts::gotoTimeout");
                } else {
                  console.log("sts::retry");
                  _this.closeBrowser(id).then(function () {
                    return _this.openBrowser(id, pageUrl, browserName, true);
                  }).then(function () {
                    return resolve();
                  });
                }
              }, 30 * 1000);
              page["goto"](pageUrl).then(function () {
                console.log("sts::url opened");
                clearTimeout(gotoTimeout);
                _this.openedPages[id] = page;
                resolve();
              })["catch"](function (e) {
                console.error("sts::error", e);
                clearTimeout(gotoTimeout);
                reject(e);
              });
            }));
          case 28:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  closeBrowser: function closeBrowser(id) {
    var _this2 = this;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            delete _this2.openedPages[id];
            _context4.next = 5;
            return _this2.browser.close();
          case 5:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))();
  },
  isValidBrowserName: function isValidBrowserName() {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", true);
          case 1:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }))();
  },
  // Extra methods
  resizeWindow: function resizeWindow(id, width, height) {
    var _this3 = this;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _this3.openedPages[id].setViewport({
              width: width,
              height: height
            });
          case 2:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }))();
  },
  takeScreenshot: function takeScreenshot(id, screenshotPath) {
    var _this4 = this;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return _this4.openedPages[id].screenshot({
              path: screenshotPath
            });
          case 2:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  }
};
exports["default"] = _default;
module.exports = exports.default;