(() => {
    "use strict";
    var __webpack_modules__ = {
        7967: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.sanitizeUrl = void 0;
            var invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im, htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g, htmlCtrlEntityRegex = /&(newline|tab);/gi, ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim, urlSchemeRegex = /^.+(:|&colon;)/gim, relativeFirstCharacters = [ ".", "/" ];
            exports.sanitizeUrl = function(url) {
                var str, sanitizedUrl = (str = url || "", str.replace(htmlEntitiesRegex, (function(match, dec) {
                    return String.fromCharCode(dec);
                }))).replace(htmlCtrlEntityRegex, "").replace(ctrlCharactersRegex, "").trim();
                if (!sanitizedUrl) return "about:blank";
                if (function(url) {
                    return relativeFirstCharacters.indexOf(url[0]) > -1;
                }(sanitizedUrl)) return sanitizedUrl;
                var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
                if (!urlSchemeParseResults) return sanitizedUrl;
                var urlScheme = urlSchemeParseResults[0];
                return invalidProtocolRegex.test(urlScheme) ? "about:blank" : sanitizedUrl;
            };
        },
        8069: function(__unused_webpack_module, exports, __webpack_require__) {
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
            });
            const communicator_to_native_host_1 = __webpack_require__(9530), background_v1_1 = __webpack_require__(5664), logger_1 = __webpack_require__(8901), set_browser_api_1 = __webpack_require__(2025), is_firefox_1 = __webpack_require__(4743);
            let backgroundScript;
            logger_1.Logger.enable();
            const communicator = new communicator_to_native_host_1.CommunicatorToNativeHost;
            communicator.on("LoadScriptsRequest", (request => {
                const loadRequest = request.parameters;
                return null == backgroundScript || backgroundScript.dispose(), 1 === loadRequest.backgroundVersion && (backgroundScript = new background_v1_1.BackgroundV1(communicator, loadRequest.contentVersion, loadRequest.apiVersion)), 
                logger_1.Logger.disable(), !0;
            })), (0, set_browser_api_1.setBrowserApi)(), (0, is_firefox_1.isFirefox)() && chrome.runtime.onInstalled.addListener((({reason}) => __awaiter(void 0, void 0, void 0, (function*() {
                if ("install" === reason) {
                    const win = yield chrome.windows.create({
                        url: chrome.runtime.getURL("./consent/consent.html"),
                        type: "panel",
                        height: 600,
                        width: 1e3
                    }), interval = setInterval((() => __awaiter(void 0, void 0, void 0, (function*() {
                        var _a;
                        try {
                            yield chrome.windows.get(null !== (_a = win.id) && void 0 !== _a ? _a : 0);
                        } catch (_b) {
                            (yield chrome.storage.local.get("padConsentAccepted")).padConsentAccepted || (yield chrome.management.uninstallSelf()), 
                            clearInterval(interval);
                        }
                    }))), 1e3);
                }
            })))), communicator.connect(), logger_1.Logger.log("Background base script loaded");
        },
        9530: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.CommunicatorToNativeHost = void 0;
            const communicator_1 = __webpack_require__(4248);
            class CommunicatorToNativeHost extends communicator_1.Communicator {
                constructor() {
                    super(...arguments), this.retryTimeout = 1e4, this.applicationName = "com.microsoft.pad.messagehost";
                }
                connectImpl() {
                    return chrome.runtime.connectNative(this.applicationName);
                }
                onDisconnect(port) {
                    super.onDisconnect(port), setTimeout((() => {
                        this.connect();
                    }), this.retryTimeout);
                }
            }
            exports.CommunicatorToNativeHost = CommunicatorToNativeHost;
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
        5664: function(__unused_webpack_module, exports, __webpack_require__) {
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
            }), exports.BackgroundV1 = void 0;
            const urlSanitizer = __webpack_require__(7967), response_1 = __webpack_require__(4374), responseError_1 = __webpack_require__(9669), logger_1 = __webpack_require__(8901), window_removed_notification_1 = __webpack_require__(2012), window_focused_changed_notification_1 = __webpack_require__(6702), window_created_notification_1 = __webpack_require__(7408), is_firefox_1 = __webpack_require__(4743);
            class BackgroundV1 {
                constructor(communicatorToNative, contentScriptVersionToLoad, apiScriptVersionToLoad) {
                    this.communicatorToNative = communicatorToNative, this.contentScriptVersionToLoad = contentScriptVersionToLoad, 
                    this.apiScriptVersionToLoad = apiScriptVersionToLoad, this.portsToTabs = {}, this.registerChromeEvents(), 
                    this.registerHostEvents(), this.addDefaultHandler(), logger_1.Logger.log("Background script V1 loaded");
                }
                static canScriptsBeInjected(tab) {
                    const url = tab.url;
                    return void 0 !== url && !(url.startsWith("chrome://") || url.startsWith("edge://") || url.startsWith("about:"));
                }
                static onGetTab(request) {
                    return chrome.tabs.get(request.tabId);
                }
                static onGetAllWindows() {
                    return chrome.windows.getAll({
                        populate: !0,
                        windowTypes: [ "normal" ]
                    });
                }
                static onGetAllTabs(request) {
                    return chrome.tabs.query({
                        windowId: request.windowId
                    });
                }
                static onActivateTab(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return yield chrome.tabs.update(request.tabId, {
                            active: !0
                        }), !0;
                    }));
                }
                static onRefreshPage(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return yield chrome.tabs.reload(request.tabId, {
                            bypassCache: !0
                        }), !0;
                    }));
                }
                static onNavigateToUrl(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        const url = (0, is_firefox_1.isFirefox)() ? urlSanitizer.sanitizeUrl(request.url) : request.url;
                        return yield chrome.tabs.update(request.tabId, {
                            url
                        }), !0;
                    }));
                }
                static onCreateNewTab(request) {
                    const url = (0, is_firefox_1.isFirefox)() ? urlSanitizer.sanitizeUrl(request.url) : request.url;
                    return chrome.tabs.create({
                        url
                    });
                }
                static onCloseTab(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return yield chrome.tabs.remove(request.tabId), !0;
                    }));
                }
                static onClearCookies(_) {
                    return new Promise((p => {
                        chrome.browsingData.removeCookies({}, (() => p(!0)));
                    }));
                }
                static onClearCache(_) {
                    return new Promise((p => {
                        chrome.browsingData.removeCache({}, (() => p(!0)));
                    }));
                }
                static onSetZoom(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return yield chrome.tabs.setZoom(request.tabId, request.zoom), !0;
                    }));
                }
                static onGetZoom(request) {
                    return chrome.tabs.getZoom(request.tabId);
                }
                static onIsIeMode(request) {
                    var _a;
                    return __awaiter(this, void 0, void 0, (function*() {
                        try {
                            return yield chrome.scripting.executeScript({
                                target: {
                                    tabId: request.tabId
                                },
                                func: () => !0
                            }), !1;
                        } catch (e) {
                            return !0 === (null === (_a = e.message) || void 0 === _a ? void 0 : _a.startsWith("Frame with ID"));
                        }
                    }));
                }
                static onRunJavaScript(request) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        if (!(yield BackgroundV1.attachDebuggerIfNeeded(request.tabId))) throw new Error("Can't attach debugger");
                        return new Promise((resolve => {
                            chrome.debugger.sendCommand({
                                tabId: request.tabId
                            }, "Runtime.evaluate", {
                                expression: request.code
                            }, (result => {
                                chrome.debugger.detach({
                                    tabId: request.tabId
                                }, (() => {
                                    var _a;
                                    resolve((null !== (_a = result.result.value) && void 0 !== _a ? _a : result.result) + "");
                                }));
                            }));
                        }));
                    }));
                }
                static attachDebuggerIfNeeded(tabId) {
                    return new Promise((resolve => chrome.debugger.getTargets((targets => {
                        for (let i = 0; i < targets.length; i++) if (targets[i].tabId === tabId) return targets[i].attached ? void resolve(!1) : void chrome.debugger.attach({
                            tabId
                        }, "1.2", (() => {
                            resolve(!0);
                        }));
                        resolve(!1);
                    }))));
                }
                dispose() {
                    this.unRegisterChromeEvents(), this.unRegisterHostEvents(), this.lastForwardPort = void 0, 
                    this.lastMessage = void 0, this.portsToTabs = {}, logger_1.Logger.log("Background script V1 unloaded");
                }
                setupTabConnection(port, tab) {
                    var _a;
                    const customPort = port, tabId = null !== (_a = tab.id) && void 0 !== _a ? _a : 0;
                    return customPort.windowId = tab.windowId, customPort.tabId = tabId, this.portsToTabs[tabId] = customPort, 
                    port.onDisconnect.addListener((disconnectedPort => {
                        logger_1.Logger.groupLogging((() => {
                            var _a;
                            this.lastForwardPort && this.lastMessage && ("RunScript" === (null === (_a = this.lastMessage) || void 0 === _a ? void 0 : _a.name) ? this.communicatorToNative.post(new response_1.Response(this.lastMessage, "")) : this.communicatorToNative.post(new response_1.Response(this.lastMessage, void 0, new responseError_1.ExceptionError(`Tab with id ${this.lastForwardPort.tabId} is no longer available.`, 1))), 
                            this.lastForwardPort = void 0, this.lastMessage = void 0), this.portsToTabs[tabId] === disconnectedPort ? (logger_1.Logger.log("Removing disconnected tab port from registry"), 
                            this.portsToTabs[tabId] = null, delete this.portsToTabs[tabId]) : logger_1.Logger.warn("Disconnected tab port not found in the registry");
                        }), "Tab port disconnected. Id", tab.id);
                    })), customPort;
                }
                sendMessage(newPort, message) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        return this.lastForwardPort = newPort, this.lastMessage = message, logger_1.Logger.log("Sending message to tab:", newPort.tabId, message), 
                        new Promise((resolve => {
                            const onMessage = m => {
                                logger_1.Logger.log("Received Message: ", m), m.requestId === message.requestId && (newPort.onMessage.removeListener(onMessage), 
                                resolve(m));
                            };
                            newPort.onMessage.addListener(onMessage), newPort.postMessage(message);
                        }));
                    }));
                }
                onMessageReceivedFromNativeHostForContent(message) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        const contentScriptRequest = message;
                        return logger_1.Logger.groupLoggingAsync((() => __awaiter(this, void 0, void 0, (function*() {
                            if (void 0 !== contentScriptRequest && void 0 !== contentScriptRequest.tabId) {
                                let port = this.portsToTabs[contentScriptRequest.tabId];
                                if (null == port) {
                                    logger_1.Logger.log("Connecting to tab", contentScriptRequest.tabId);
                                    const tab = yield chrome.tabs.get(contentScriptRequest.tabId);
                                    if (!BackgroundV1.canScriptsBeInjected(tab)) return;
                                    yield this.injectScripts(contentScriptRequest.tabId), port = this.setupTabConnection(chrome.tabs.connect(contentScriptRequest.tabId, void 0), tab);
                                }
                                return this.sendMessage(port, message);
                            }
                            throw logger_1.Logger.error("Message is not ContentScriptRequest", message), new Error("Request is not ContentScriptRequest");
                        }))), "Default handling for message", message);
                    }));
                }
                injectScripts(tabId) {
                    return __awaiter(this, void 0, void 0, (function*() {
                        const contentScriptPath = `scripts/content.v${this.contentScriptVersionToLoad}.js`, apiScriptPath = `scripts/api.v${this.apiScriptVersionToLoad}.js`;
                        if (logger_1.Logger.log("Injecting scripts to tab: ", tabId), (0, is_firefox_1.isFirefox)()) return yield chrome.tabs.executeScript(tabId, {
                            file: contentScriptPath
                        }), void (yield chrome.tabs.executeScript(tabId, {
                            file: apiScriptPath
                        }));
                        yield chrome.scripting.executeScript({
                            target: {
                                tabId
                            },
                            files: [ contentScriptPath, apiScriptPath ]
                        });
                    }));
                }
                addDefaultHandler() {
                    this.communicatorToNative.addDefaultHandler((message => this.onMessageReceivedFromNativeHostForContent(message)));
                }
                registerHostEvents() {
                    this.communicatorToNative.on("GetTabRequest", (m => __awaiter(this, void 0, void 0, (function*() {
                        return BackgroundV1.onGetTab(m.parameters);
                    })))), this.communicatorToNative.on("GetAllWindowsRequest", (() => __awaiter(this, void 0, void 0, (function*() {
                        return BackgroundV1.onGetAllWindows();
                    })))), this.communicatorToNative.on("GetAllTabsRequest", (m => __awaiter(this, void 0, void 0, (function*() {
                        return BackgroundV1.onGetAllTabs(m.parameters);
                    })))), this.communicatorToNative.on("ActivateTabRequest", (m => BackgroundV1.onActivateTab(m.parameters))), 
                    this.communicatorToNative.on("RefreshPageRequest", (m => BackgroundV1.onRefreshPage(m.parameters))), 
                    this.communicatorToNative.on("NavigateToUrlRequest", (m => BackgroundV1.onNavigateToUrl(m.parameters))), 
                    this.communicatorToNative.on("CreateNewTabRequest", (m => BackgroundV1.onCreateNewTab(m.parameters))), 
                    this.communicatorToNative.on("CloseTabRequest", (m => BackgroundV1.onCloseTab(m.parameters))), 
                    this.communicatorToNative.on("ClearCookiesRequest", (m => BackgroundV1.onClearCookies(m))), 
                    this.communicatorToNative.on("ClearCacheRequest", (m => BackgroundV1.onClearCache(m))), 
                    this.communicatorToNative.on("SetZoomRequest", (m => BackgroundV1.onSetZoom(m.parameters))), 
                    this.communicatorToNative.on("GetZoomRequest", (m => BackgroundV1.onGetZoom(m.parameters))), 
                    this.communicatorToNative.on("IsIEModeTabRequest", (m => BackgroundV1.onIsIeMode(m.parameters))), 
                    (0, is_firefox_1.isFirefox)() || this.communicatorToNative.on("RunJavaScriptRequest", (m => BackgroundV1.onRunJavaScript(m.parameters)));
                }
                unRegisterHostEvents() {
                    this.communicatorToNative.removeHandler("GetTabRequest"), this.communicatorToNative.removeHandler("GetAllWindowsRequest"), 
                    this.communicatorToNative.removeHandler("GetAllTabsRequest"), this.communicatorToNative.removeHandler("ActivateTabRequest"), 
                    this.communicatorToNative.removeHandler("RefreshPageRequest"), this.communicatorToNative.removeHandler("NavigateToUrlRequest"), 
                    this.communicatorToNative.removeHandler("CreateNewTabRequest"), this.communicatorToNative.removeHandler("CloseTabRequest"), 
                    this.communicatorToNative.removeHandler("ClearCookiesRequest"), this.communicatorToNative.removeHandler("ClearCacheRequest"), 
                    this.communicatorToNative.removeHandler("SetZoomRequest"), this.communicatorToNative.removeHandler("GetZoomRequest"), 
                    this.communicatorToNative.removeHandler("IsIEModeTabRequest"), (0, is_firefox_1.isFirefox)() || this.communicatorToNative.removeHandler("RunJavaScriptRequest");
                }
                onWindowCreated(window) {
                    var _a;
                    console.log(`Window created. WindowId: ${window.id}`), this.communicatorToNative.post(new window_created_notification_1.WindowCreatedNotification(null !== (_a = window.id) && void 0 !== _a ? _a : 0));
                }
                onWindowFocusChanged(windowId) {
                    windowId !== chrome.windows.WINDOW_ID_NONE && (console.log(`Window focused. WindowId: ${windowId}`), 
                    this.communicatorToNative.post(new window_focused_changed_notification_1.WindowFocusedChangedNotification(windowId)));
                }
                onWindowRemoved(windowId) {
                    console.log(`Window removed. WindowId: ${windowId}`), this.communicatorToNative.post(new window_removed_notification_1.WindowRemovedNotification(windowId));
                }
                unRegisterChromeEvents() {
                    chrome.windows.onCreated.removeListener(this.onWindowCreatedCallback), chrome.windows.onFocusChanged.removeListener(this.onWindowFocusChangedCallback), 
                    chrome.windows.onRemoved.removeListener(this.onWindowRemovedCallback);
                }
                registerChromeEvents() {
                    const script = this;
                    this.onWindowCreatedCallback = window => script.onWindowCreated(window), this.onWindowFocusChangedCallback = windowId => script.onWindowFocusChanged(windowId), 
                    this.onWindowRemovedCallback = windowId => script.onWindowRemoved(windowId), chrome.windows.onCreated.addListener(this.onWindowCreatedCallback), 
                    chrome.windows.onFocusChanged.addListener(this.onWindowFocusChangedCallback), chrome.windows.onRemoved.addListener(this.onWindowRemovedCallback);
                }
            }
            exports.BackgroundV1 = BackgroundV1;
        },
        2752: (__unused_webpack_module, exports) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.Notification = void 0;
            exports.Notification = class {
                constructor(notify) {
                    this.notify = notify, this.name = "notify", this.requestId = "";
                }
            };
        },
        7408: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.WindowCreatedNotification = void 0;
            const notification_1 = __webpack_require__(2752);
            class WindowCreatedNotification extends notification_1.Notification {
                constructor(windowId) {
                    super("window_created"), this.windowId = windowId;
                }
            }
            exports.WindowCreatedNotification = WindowCreatedNotification;
        },
        6702: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.WindowFocusedChangedNotification = void 0;
            const notification_1 = __webpack_require__(2752);
            class WindowFocusedChangedNotification extends notification_1.Notification {
                constructor(windowId) {
                    super("window_focused"), this.windowId = windowId;
                }
            }
            exports.WindowFocusedChangedNotification = WindowFocusedChangedNotification;
        },
        2012: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.WindowRemovedNotification = void 0;
            const notification_1 = __webpack_require__(2752);
            class WindowRemovedNotification extends notification_1.Notification {
                constructor(windowId) {
                    super("window_removed"), this.windowId = windowId;
                }
            }
            exports.WindowRemovedNotification = WindowRemovedNotification;
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
        },
        2025: (__unused_webpack_module, exports, __webpack_require__) => {
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.setBrowserApi = void 0;
            const is_firefox_1 = __webpack_require__(4743), logger_1 = __webpack_require__(8901);
            exports.setBrowserApi = function() {
                (0, is_firefox_1.isFirefox)() && (logger_1.Logger.log("Set browser for Firefox usage"), 
                chrome = browser);
            };
        }
    }, __webpack_module_cache__ = {};
    (function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            exports: {}
        };
        return __webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.exports;
    })(8069);
})();