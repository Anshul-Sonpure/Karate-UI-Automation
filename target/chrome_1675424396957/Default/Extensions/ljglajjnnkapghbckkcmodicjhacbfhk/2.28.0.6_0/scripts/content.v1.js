(() => {
    "use strict";
    var __webpack_modules__ = {
        1360: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.CommunicatorToBackgroundScript = void 0;
            const communicator_1 = __webpack_require__(4248);
            class CommunicatorToBackgroundScript extends communicator_1.Communicator {
                constructor(port) {
                    super(), this.port = port;
                }
                connectImpl() {
                    return this.port;
                }
            }
            exports.CommunicatorToBackgroundScript = CommunicatorToBackgroundScript;
        },
        4248: function(__unused_webpack_module, exports, __webpack_require__) {
            var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))((function(resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator.throw(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        var value;
                        result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }))).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                }));
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.Communicator = void 0;
            const response_1 = __webpack_require__(4374), logger_1 = __webpack_require__(8901), responseError_1 = __webpack_require__(9669);
            exports.Communicator = class {
                constructor() {
                    this.handler = {}, this.GENERAL_EXCEPTION_CODE = 3;
                }
                on(functionName, handler) {
                    this.handler[functionName] = handler;
                }
                removeHandler(name) {
                    delete this.handler[name];
                }
                addDefaultHandler(handler) {
                    this.defaultHandler = handler;
                }
                post(request) {
                    logger_1.Logger.log("===> Sending message: ", request), this.msgPort.postMessage(request);
                }
                connect() {
                    try {
                        this.initializeConnectedPort(this.connectImpl());
                    } catch (e) {
                        logger_1.Logger.warn("Connection to port failed:", e);
                    }
                }
                onConnect(port) {
                    this.initializeConnectedPort(port);
                }
                initializeConnectedPort(port) {
                    this.msgPort = port;
                    const script = this;
                    this.msgPort.onMessage.addListener((m => __awaiter(this, void 0, void 0, (function*() {
                        return script.onMessageReceived(m);
                    })))), this.msgPort.onDisconnect.addListener((p => script.onDisconnect(p)));
                }
                onDisconnect(port) {
                    logger_1.Logger.warn(`Message Port has been disconnected. ${port}`);
                }
                onMessageReceived(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        if (void 0 !== request) return logger_1.Logger.groupLogging((() => __awaiter(this, void 0, void 0, (function*() {
                            var _a;
                            let handler = this.handler[request.name];
                            void 0 === handler && (logger_1.Logger.log("~ Request:", request.requestId, request.name, " using default handler"), 
                            handler = this.defaultHandler);
                            try {
                                let result = handler(request);
                                if (void 0 === result && (result = new response_1.Response(request, !0)), null === result) return logger_1.Logger.log("+ Response to:", request.requestId, "===> :", result), 
                                void this.msgPort.postMessage(new response_1.Response(request, null));
                                if (void 0 !== result.then && "function" == typeof result.then && (result = yield result), 
                                (null == result ? void 0 : result.requestId) === request.requestId) return logger_1.Logger.log("+ Response to:", request.requestId, "===> :", result), 
                                void this.msgPort.postMessage(result);
                                logger_1.Logger.log("+ Response to:", request.requestId, "===> :", result), this.msgPort.postMessage(new response_1.Response(request, result));
                            } catch (e) {
                                logger_1.Logger.error("- Error to:", request.requestId, "===> :", e), this.msgPort.postMessage(new response_1.Response(request, void 0, new responseError_1.ExceptionError(e.name, null !== (_a = e.errorCode) && void 0 !== _a ? _a : this.GENERAL_EXCEPTION_CODE, e.message, e.stack)));
                            }
                        }))), "Received request:", request.requestId, request.name, "=>", request.parameters, "Full:", request);
                    }));
                }
            };
        },
        4374: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.Response = void 0;
            exports.Response = class {
                constructor(request, result, error) {
                    this.result = result, this.error = error, this.requestId = request.requestId, this.name = request.name;
                }
            };
        },
        9669: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.ExceptionError = void 0;
            exports.ExceptionError = class {
                constructor(name, errorCode, message, stack) {
                    this.name = name, this.errorCode = errorCode, this.message = message, this.stack = stack;
                }
            };
        },
        4743: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.isFirefox = void 0, exports.isFirefox = function() {
                return void 0 !== globalThis.mozInnerScreenX;
            };
        },
        8901: function(__unused_webpack_module, exports) {
            var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
                return new (P || (P = Promise))((function(resolve, reject) {
                    function fulfilled(value) {
                        try {
                            step(generator.next(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function rejected(value) {
                        try {
                            step(generator.throw(value));
                        } catch (e) {
                            reject(e);
                        }
                    }
                    function step(result) {
                        var value;
                        result.done ? resolve(result.value) : (value = result.value, value instanceof P ? value : new P((function(resolve) {
                            resolve(value);
                        }))).then(fulfilled, rejected);
                    }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                }));
            };
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.Logger = void 0;
            class Logger {
                static enable() {
                    try {
                        (null !== globalThis && void 0 !== globalThis ? globalThis : window).padLoggerEnabled = !0, 
                        console.log("Logger is enabled");
                    } catch (e) {
                        console.error("Error during enabling logger", e);
                    }
                }
                static disable() {
                    try {
                        (null !== globalThis && void 0 !== globalThis ? globalThis : window).padLoggerEnabled = !1, 
                        console.log("Logger is disabled");
                    } catch (e) {
                        console.error("Error during disabling logger", e);
                    }
                }
                static log(...data) {
                    Logger.isEnabled() && console.log(...data);
                }
                static group(...label) {
                    Logger.isEnabled() && console.group(...label);
                }
                static groupEnd() {
                    Logger.isEnabled() && console.groupEnd();
                }
                static error(...data) {
                    Logger.isEnabled() && console.error(...data);
                }
                static warn(...data) {
                    Logger.isEnabled() && console.warn(...data);
                }
                static groupLogging(callback, ...label) {
                    Logger.group(...label);
                    try {
                        callback();
                    } finally {
                        Logger.groupEnd();
                    }
                }
                static groupLoggingAsync(callback, ...label) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        Logger.group(...label);
                        try {
                            return yield callback();
                        } finally {
                            Logger.groupEnd();
                        }
                    }));
                }
                static isEnabled() {
                    var _a;
                    try {
                        return null !== (_a = (null !== globalThis && void 0 !== globalThis ? globalThis : window).padLoggerEnabled) && void 0 !== _a && _a;
                    } catch (e) {
                        return console.error("Error during checking if logger is enabled", e), !0;
                    }
                }
            }
            exports.Logger = Logger;
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.exports;
    }
    (() => {
        const communicator_to_background_script_1 = __webpack_require__(1360), logger_1 = __webpack_require__(8901), is_firefox_1 = __webpack_require__(4743);
        let communicatorToBackground;
        window.onunload = _ => {}, logger_1.Logger.enable(), chrome.runtime.onConnect.addListener((port => {
            communicatorToBackground = new communicator_to_background_script_1.CommunicatorToBackgroundScript(port), 
            communicatorToBackground.on("TravelThruHistoryRequest", (message => (message.parameters.backwards ? window.history.back() : window.history.forward(), 
            !0))), communicatorToBackground.on("GetDimensionsRequest", (_ => {
                var _a, _b;
                const result = {
                    totalWidth: null === (_a = document.scrollingElement) || void 0 === _a ? void 0 : _a.scrollWidth,
                    totalHeight: null === (_b = document.scrollingElement) || void 0 === _b ? void 0 : _b.scrollHeight,
                    screenWidth: document.documentElement.clientWidth,
                    screenHeight: document.documentElement.clientHeight,
                    viewHeight: window.innerHeight,
                    viewWidth: window.innerWidth,
                    devicePixelRatio
                };
                return (0, is_firefox_1.isFirefox)() && (result.viewTop = window.mozInnerScreenY, 
                result.viewLeft = window.mozInnerScreenX - 6), result;
            })), communicatorToBackground.addDefaultHandler((message => {
                const request = message;
                if (void 0 !== request) {
                    const method = window.PAD_JS_API[request.name];
                    if (void 0 !== method) return method(request.parameters);
                }
            })), communicatorToBackground.connect();
        })), logger_1.Logger.log("Content script V1 loaded"), logger_1.Logger.disable();
    })();
})();