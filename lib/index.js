"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _puppeteer = _interopRequireDefault(require("puppeteer"));
// https://github.com/DevExpress/testcafe/blob/master/src/browser/provider/built-in/locally-installed.js
// import browserTools from 'testcafe-browser-tools';

var openedPages = {};
var timeoutId;
var reloadPages = function reloadPages() {
  console.log("sts::reloading pages", openedPages);
  var allPages = Object.values(openedPages).map(function (page) {
    return page.reload();
  });
  return Promise.all(allPages).then(function () {
    return console.log("sts::reloaded");
  });
};
var startReloadPagesTimer = function startReloadPagesTimer(timeout) {
  stopReloadPagesTimer(timeoutId);
  timeoutId = setTimeout(function () {
    reloadPages();
  }, timeout);
  console.log("sts::startReloadPagesTimer, id=" + timeoutId + " time=" + timeout);
  return timeoutId;
};
var stopReloadPagesTimer = function stopReloadPagesTimer() {
  console.log("sts::stopReloadPagesTimer, id=" + timeoutId);
  clearTimeout(timeoutId);
};
function extractRegexp(s, regexp) {
  var arr = regexp.exec(s) || [null, null];
  return arr[1];
}
function getWidthHeight(browserArgs) {
  var widthHeight = browserArgs.find(function (item) {
    return item.startsWith("width");
  });
  var width = extractRegexp(widthHeight, /width=(\d*);/g);
  var height = extractRegexp(widthHeight, /height=(\d*)/g);
  return {
    width: width,
    height: height
  };
}

// https://github.com/puppeteer/puppeteer/issues/1834
// https://bugs.chromium.org/p/chromium/issues/detail?id=1085829
// https://github.com/puppeteer/puppeteer
var _default = {
  reloadPages: reloadPages,
  startReloadPagesTimer: startReloadPagesTimer,
  stopReloadPagesTimer: stopReloadPagesTimer,
  isMultiBrowser: true,
  // Multiple browsers support

  browser: null,
  openBrowser: function openBrowser(id, pageUrl, browserName) {
    var _this = this;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var browserArgs, _getWidthHeight, width, height, launchArgs, page;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            console.log("puppeteersts::openBrowser");
            browserArgs = browserName.split(':');
            if (_this.browser) {
              _context.next = 15;
              break;
            }
            _getWidthHeight = getWidthHeight(browserArgs), width = _getWidthHeight.width, height = _getWidthHeight.height;
            width = width || 1280;
            width = parseInt(width);
            height = height || 720;
            height = parseInt(height);
            console.log("puppeteersts:: width=".concat(width, " height=").concat(height));
            launchArgs = {
              timeout: 60000,
              args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage', "--window-size=".concat(width, ",").concat(height)],
              headless: browserArgs.includes("headless"),
              defaultViewport: {
                width: width,
                height: height
              }
            };
            console.log("puppeteersts::opening browser, launchArgs: ", launchArgs);
            _context.next = 13;
            return _puppeteer["default"].launch(launchArgs);
          case 13:
            _this.browser = _context.sent;
            console.log("puppeteersts::browser opened");
          case 15:
            console.log("puppeteersts::opening page");
            _context.next = 18;
            return _this.browser.newPage();
          case 18:
            page = _context.sent;
            console.log("puppeteersts::page opened");
            console.log("puppeteersts::opening url=" + pageUrl);
            _context.next = 23;
            return page["goto"](pageUrl);
          case 23:
            openedPages[id] = page;
            console.log("puppeteersts::url opened");
          case 25:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  closeBrowser: function closeBrowser(id) {
    var _this2 = this;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            console.log("puppeteersts::closing browser");
            stopReloadPagesTimer();
            delete openedPages[id];
            _context2.next = 5;
            return _this2.browser.close();
          case 5:
            _this2.browser = null;
            console.log("puppeteersts::browser closed");
          case 7:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  isValidBrowserName: function isValidBrowserName() {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            console.log("puppeteersts::isValidBrowserName");
            return _context3.abrupt("return", true);
          case 2:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  resizeWindow: function resizeWindow(id, width, height) {
    var _arguments = arguments;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            console.log("puppeteersts::resizeWindow ", _arguments);
            _context4.next = 3;
            return openedPages[id].setViewport({
              width: width,
              height: height
            });
          case 3:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))();
  },
  takeScreenshot: function takeScreenshot(id, screenshotPath) {
    var _arguments2 = arguments;
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            console.log("puppeteersts::takeScreenshot ", _arguments2);
            _context5.next = 3;
            return openedPages[id].screenshot({
              path: screenshotPath
            });
          case 3:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }))();
  }
};
exports["default"] = _default;
module.exports = exports.default;