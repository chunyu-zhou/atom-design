"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _this = void 0;

function getScrollDom() {
  var element = arguments[0];
  var scrollYStyle = document.defaultView.getComputedStyle(element).overflowY;

  if (element && element.tagName !== 'HTML' && element.tagName !== 'BODY' && element.nodeType === 1 && (scrollYStyle === 'auto' || scrollYStyle === 'scroll')) {
    return element;
  }

  return window;
}

function throttle(fn, delay) {
  var now;
  var preExce = 0;

  var execute = function execute() {
    fn.call();
    preExce = now;
  };

  return function () {
    now = Date.now();

    if (now - preExce > delay) {
      execute();
    } else {
      var timer = setTimeout(function () {
        execute();
        clearTimeout(timer);
      }, delay);
    }
  };
}

function initEvent() {
  this.scrollTarget = getScrollDom(this.el);
  this.scrollEvent = throttle(scrollEvent.bind(this), 2e2);
  this.scrollTarget.addEventListener('scroll', this.scrollEvent, {
    capture: false
  });
}

function scrollEvent() {
  var canExec = false;

  if (this.scrollTarget === this.el) {
    canExec = this.el.scrollHeight <= this.el.clientHeight + this.el.scrollTop + this.distance;
  } else if (this.scrollTarget === window) {
    canExec = 2 * window.pageYOffset + this.el.getBoundingClientRect().top + document.documentElement.clientHeight + this.distance >= document.documentElement.scrollHeight;
  }

  if (canExec) {
    if (!this.lock) {
      this.fn();
      this.lock = true;
    }
  } else {
    if (this.lock) this.lock = false;
  }
}

var _default = {
  loadmore: {
    inserted: function inserted(el, binding) {
      _this.context = {
        el: el,
        fn: binding.value,
        distance: Number(el.getAttribute('distance'))
      };
      initEvent.call(_this.context);
    },
    unbind: function unbind() {
      _this.context.scrollTarget.removeEventListener('scroll', _this.context.scrollEvent);
    }
  }
};
exports.default = _default;