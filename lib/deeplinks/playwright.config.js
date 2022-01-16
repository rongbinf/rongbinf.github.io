"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var test_1 = require("@playwright/test");
var port = 25381;
var config = {
    webServer: {
        command: "python3 -m http.server ".concat(port),
        port: port,
        timeout: 1000,
        reuseExistingServer: true
    },
    forbidOnly: !!process.env.CI,
    retries: 0,
    use: {
        trace: 'on-first-retry'
    },
    projects: [
        {
            name: 'firefox',
            use: __assign({}, test_1.devices['Desktop Firefox'])
        },
        {
            name: 'chromium',
            use: __assign({}, test_1.devices['Desktop Chrome'])
        },
    ]
};
exports["default"] = config;
