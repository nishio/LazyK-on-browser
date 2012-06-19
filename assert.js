goog.provide('nhiro.assert');
/**
 * @param {boolean} condition condition.
 * @param {string=} opt_message message.
 */
nhiro.assert = (function() {
    function _show(opt_message) {
        if (window.console) {
            // show message
            window.console.log('Assertion Failure');
            if (opt_message) window.console.log('Message: ' + opt_message);
            // show stacktrace
            if (window.console.trace) window.console.trace(undefined);
            if (Error().stack) window.console.log(Error().stack);
        }
    }

    /**
     * @param {boolean} condition condition.
     * @param {string=} opt_message message.
     */
    function assert(condition, opt_message) {
        if (!condition) {
            _show(opt_message);
            // breakpoint
            debugger;
        }
    }

    /**
     * @param {string=} opt_message message.
     */
    function not_here(opt_message) {
        _show(opt_message);
        // breakpoint
        debugger;
    }
    assert.not_here = not_here;

    return assert;
})();
