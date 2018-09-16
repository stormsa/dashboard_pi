/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "78d2b87c6a65ba213a4b"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(17)(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (false) {
  module.exports = require('./cjs/react.production.min.js');
} else {
  module.exports = __webpack_require__(18);
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (true) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(1);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (true) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  var invariant = __webpack_require__(2);
  var warning = __webpack_require__(3);
  var ReactPropTypesSecret = __webpack_require__(10);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (true) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (true) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (false) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = require('./cjs/react-dom.production.min.js');
} else {
  module.exports = __webpack_require__(19);
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (true) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(61)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyObject = {};

if (true) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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AEAACABAAIAAEACAAAABIABAAAACQACAAAAEgAAAAQAIAAEAAgAQAAIABAAIAAQACAAQAAgAEAAgABAAIABAACAAQACAAEAAgAAAAYAAAAEAAgABAAIABAACAAQACAABIABAAIAAEACAAAABIAAAAQACQAAAAgAEgAAAAeAggAAQACAAAAEgAEAAAAJAAIAAAASAAAABAAIAAQACAAQAAgAEAAgABAAIABAACAAQACAAEAAgAEAAIABAAIAAQACAAAABgAAAAQACAAEAAgAEgAAABAAIAAEACAAQAAIAEAAgAAQA4CCAABAAIAAAASAAQAAAAkAAgAAABIAAAAEAAsASFgAgAEAAIABAAIAAQACAAAABgAAAAQACAAEAAgAEAAIABAAIAAQACAAQAAgAEAAgABAAIABAAAgAQACAABAAgAAAASAAAAEAAkAAAAIABIAAAAEACAABAAIAEAACAAQAIAAEAAgAEAACQACAAAABgAAAAQACAAEAAgAEAAIABAAIAAQACAAQAAgAEAAgABAAIAAgUbdcfcToSd874l1F2e/ws0u/sOPfschjFn8GzkUQAJC1qgSAnzUIAEAAAAIABIAAAAQACAABAAgAEAACABAAIAAEACAAQAAIAEAAgAAQAIAAAAEgAAABAAJAAIAAcBBAAAgAEACAABAAIAAAASAAQAAAAkAAgAAABIAAAAEACAABAAIAEAACAAQAIAAEAAgAQAAAAgAEgAAABAAIAAEACAAQAAIAEAAgAAQAIABAAAgAQACAABAAgAAAASAAAAEAAkAAAAIABIAAgEr6/4AsKhoD/k7GAAAAAElFTkSuQmCC"

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classnames = __webpack_require__(62);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    CAROUSEL: function CAROUSEL(isSlider) {
        return (0, _classnames2.default)({
            "carousel": true,
            "carousel-slider": isSlider
        });
    },

    WRAPPER: function WRAPPER(isSlider, axis) {
        return (0, _classnames2.default)({
            "thumbs-wrapper": !isSlider,
            "slider-wrapper": isSlider,
            "axis-horizontal": axis === "horizontal",
            "axis-vertical": axis !== "horizontal"
        });
    },

    SLIDER: function SLIDER(isSlider, isSwiping) {
        return (0, _classnames2.default)({
            "thumbs": !isSlider,
            "slider": isSlider,
            "animated": !isSwiping
        });
    },

    ITEM: function ITEM(isSlider, selected) {
        return (0, _classnames2.default)({
            "thumb": !isSlider,
            "slide": isSlider,
            "selected": selected
        });
    },

    ARROW_PREV: function ARROW_PREV(disabled) {
        return (0, _classnames2.default)({
            "control-arrow control-prev": true,
            "control-disabled": disabled
        });
    },

    ARROW_NEXT: function ARROW_NEXT(disabled) {
        return (0, _classnames2.default)({
            "control-arrow control-next": true,
            "control-disabled": disabled
        });
    },

    DOT: function DOT(selected) {
        return (0, _classnames2.default)({
            "dot": true,
            'selected': selected
        });
    }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (position, axis) {
    var positionCss = axis === 'horizontal' ? [position, 0, 0] : [0, position, 0];
    var transitionProp = 'translate3d';

    var translatedPosition = '(' + positionCss.join(',') + ')';

    return transitionProp + translatedPosition;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(63)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./react-swipe'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.reactSwipe);
    global.index = mod.exports;
  }
})(this, function (exports, _reactSwipe) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _reactSwipe2 = _interopRequireDefault(_reactSwipe);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = _reactSwipe2.default;
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(7);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(8);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _cssClasses = __webpack_require__(13);

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _dimensions = __webpack_require__(64);

var _CSSTranslate = __webpack_require__(14);

var _CSSTranslate2 = _interopRequireDefault(_CSSTranslate);

var _reactEasySwipe = __webpack_require__(15);

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Thumbs = function (_Component) {
    _inherits(Thumbs, _Component);

    function Thumbs(props) {
        _classCallCheck(this, Thumbs);

        var _this = _possibleConstructorReturn(this, (Thumbs.__proto__ || Object.getPrototypeOf(Thumbs)).call(this, props));

        _this.updateSizes = function () {
            if (!_this.state.initialized) {
                return;
            }

            var total = _this.props.children.length;
            _this.wrapperSize = _this.itemsWrapper.clientWidth;
            _this.itemSize = _this.props.thumbWidth ? _this.props.thumbWidth : (0, _dimensions.outerWidth)(_this.refs.thumb0);
            _this.visibleItems = Math.floor(_this.wrapperSize / _this.itemSize);
            _this.lastPosition = total - _this.visibleItems;
            _this.showArrows = _this.visibleItems < total;
        };

        _this.setMountState = function () {
            _this.setState({ hasMount: true });
            _this.updateSizes();
        };

        _this.handleClickItem = function (index, item) {
            var handler = _this.props.onSelectItem;

            if (typeof handler === 'function') {
                handler(index, item);
            }
        };

        _this.onSwipeStart = function () {
            _this.setState({
                swiping: true
            });
        };

        _this.onSwipeEnd = function () {
            _this.setState({
                swiping: false
            });
        };

        _this.onSwipeMove = function (deltaX) {
            var leftBoundry = 0;
            var list = _reactDom2.default.findDOMNode(_this.itemList);
            var wrapperSize = list.clientWidth;
            var visibleItems = Math.floor(wrapperSize / _this.itemSize);

            var currentPosition = -_this.state.firstItem * _this.itemSize;
            var lastLeftBoundry = -_this.visibleItems * _this.itemSize;

            // prevent user from swiping left out of boundaries
            if (currentPosition === leftBoundry && deltaX > 0) {
                deltaX = 0;
            }

            // prevent user from swiping right out of boundaries
            if (currentPosition === lastLeftBoundry && deltaX < 0) {
                deltaX = 0;
            }

            var position = currentPosition + 100 / (wrapperSize / deltaX) + '%';

            // if 3d isn't available we will use left to move
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
                list.style[prop] = (0, _CSSTranslate2.default)(position, _this.props.axis);
            });
        };

        _this.slideRight = function (positions) {
            _this.moveTo(_this.state.firstItem - (typeof positions === 'Number' ? positions : 1));
        };

        _this.slideLeft = function (positions) {
            _this.moveTo(_this.state.firstItem + (typeof positions === 'Number' ? positions : 1));
        };

        _this.moveTo = function (position) {
            // position can't be lower than 0
            position = position < 0 ? 0 : position;
            // position can't be higher than last postion
            position = position >= _this.lastPosition ? _this.lastPosition : position;

            _this.setState({
                firstItem: position,
                // if it's not a slider, we don't need to set position here
                selectedItem: _this.state.selectedItem
            });
        };

        _this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            firstItem: _this.getFirstItem(props.selectedItem),
            images: []
        };
        return _this;
    }

    _createClass(Thumbs, [{
        key: 'componentDidMount',
        value: function componentDidMount(nextProps) {
            if (!this.props.children) {
                return;
            }

            this.setupThumbs();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props, state) {
            if (props.selectedItem !== this.state.selectedItem) {
                this.setState({
                    selectedItem: props.selectedItem,
                    firstItem: this.getFirstItem(props.selectedItem)
                });
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (!prevProps.children && this.props.children && !this.state.initialized) {
                this.setupThumbs();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroyThumbs();
        }
    }, {
        key: 'setupThumbs',
        value: function setupThumbs() {
            // as the widths are calculated, we need to resize
            // the carousel when the window is resized
            window.addEventListener("resize", this.updateSizes);
            // issue #2 - image loading smaller
            window.addEventListener("DOMContentLoaded", this.updateSizes);

            var images = this.getImages();

            if (!images) {
                return;
            }

            this.setState({
                initialized: true,
                images: images
            });

            // when the component is rendered we need to calculate
            // the container size to adjust the responsive behaviour
            this.updateSizes();
        }
    }, {
        key: 'destroyThumbs',
        value: function destroyThumbs() {
            // removing listeners
            window.removeEventListener("resize", this.updateSizes);
            window.removeEventListener("DOMContentLoaded", this.updateSizes);
        }
    }, {
        key: 'getImages',
        value: function getImages() {
            var images = _react2.default.Children.map(this.props.children, function (item, index) {
                var img = item;

                // if the item is not an image, try to find the first image in the item's children.
                if (item.type !== "img") {
                    img = _react2.default.Children.toArray(item.props.children).filter(function (children) {
                        return children.type === "img";
                    })[0];
                }

                if (!img || img.length === 0) {
                    return null;
                }

                return img;
            });

            if (images.filter(function (image) {
                return image !== null;
            }).length === 0) {
                console.warn('No images found! Can\'t build the thumb list without images. If you don\'t need thumbs, set showThumbs={false} in the Carousel. Note that it\'s not possible to get images rendered inside custom components. More info at https://github.com/leandrowd/react-responsive-carousel/blob/master/TROUBLESHOOTING.md');

                return null;
            }

            return images;
        }
    }, {
        key: 'getFirstItem',
        value: function getFirstItem(selectedItem) {
            if (!this.showArrows) {
                return 0;
            }

            var firstItem = selectedItem;

            if (selectedItem >= this.lastPosition) {
                firstItem = this.lastPosition;
            }

            if (selectedItem < this.state.firstItem + this.visibleItems) {
                firstItem = this.state.firstItem;
            }

            if (selectedItem < this.state.firstItem) {
                firstItem = selectedItem;
            }

            return firstItem;
        }
    }, {
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return this.state.images.map(function (img, index) {
                var itemClass = _cssClasses2.default.ITEM(false, index === _this2.state.selectedItem && _this2.state.hasMount);

                var thumbProps = {
                    key: index,
                    ref: 'thumb' + index,
                    className: itemClass,
                    onClick: _this2.handleClickItem.bind(_this2, index, _this2.props.children[index])
                };

                if (index === 0) {
                    img = _react2.default.cloneElement(img, {
                        onLoad: _this2.setMountState
                    });
                }

                return _react2.default.createElement(
                    'li',
                    thumbProps,
                    img
                );
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            if (!this.props.children || this.state.images.length === 0) {
                return null;
            }

            // show left arrow?
            var hasPrev = this.showArrows && this.state.firstItem > 0;
            // show right arrow
            var hasNext = this.showArrows && this.state.firstItem < this.lastPosition;
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = -this.state.firstItem * this.itemSize + 'px';

            var transformProp = (0, _CSSTranslate2.default)(currentPosition, this.props.axis);

            var transitionTime = this.props.transitionTime + 'ms';

            itemListStyles = {
                'WebkitTransform': transformProp,
                'MozTransform': transformProp,
                'MsTransform': transformProp,
                'OTransform': transformProp,
                'transform': transformProp,
                'msTransform': transformProp,
                'WebkitTransitionDuration': transitionTime,
                'MozTransitionDuration': transitionTime,
                'MsTransitionDuration': transitionTime,
                'OTransitionDuration': transitionTime,
                'transitionDuration': transitionTime,
                'msTransitionDuration': transitionTime
            };

            return _react2.default.createElement(
                'div',
                { className: _cssClasses2.default.CAROUSEL(false) },
                _react2.default.createElement(
                    'div',
                    { className: _cssClasses2.default.WRAPPER(false), ref: function ref(node) {
                            return _this3.itemsWrapper = node;
                        } },
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_PREV(!hasPrev), onClick: this.slideRight }),
                    _react2.default.createElement(
                        _reactEasySwipe2.default,
                        { tagName: 'ul',
                            selectedItem: this.state.selectedItem,
                            className: _cssClasses2.default.SLIDER(false, this.state.swiping),
                            onSwipeLeft: this.slideLeft,
                            onSwipeRight: this.slideRight,
                            onSwipeMove: this.onSwipeMove,
                            onSwipeStart: this.onSwipeStart,
                            onSwipeEnd: this.onSwipeEnd,
                            style: itemListStyles,
                            ref: function ref(node) {
                                return _this3.itemList = node;
                            } },
                        this.renderItems()
                    ),
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_NEXT(!hasNext), onClick: this.slideLeft })
                )
            );
        }
    }]);

    return Thumbs;
}(_react.Component);

Thumbs.displayName = 'Thumbs';
Thumbs.propsTypes = {
    children: _propTypes2.default.element.isRequired,
    transitionTime: _propTypes2.default.number,
    selectedItem: _propTypes2.default.number,
    thumbWidth: _propTypes2.default.number
};
Thumbs.defaultProps = {
    selectedItem: 0,
    transitionTime: 350,
    axis: 'horizontal'
};
exports.default = Thumbs;

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_css__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__registerServiceWorker__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Dashboard__ = __webpack_require__(34);






__WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__Dashboard__["a" /* default */], null), document.getElementById('root'));
Object(__WEBPACK_IMPORTED_MODULE_3__registerServiceWorker__["a" /* default */])();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.2.0
 * react.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var _assign = __webpack_require__(5);
var emptyObject = __webpack_require__(9);
var invariant = __webpack_require__(2);
var warning = __webpack_require__(3);
var emptyFunction = __webpack_require__(1);
var checkPropTypes = __webpack_require__(6);

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.2.0';

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable === 'undefined') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var constructor = publicInstance.constructor;
    var componentName = constructor && (constructor.displayName || constructor.name) || 'ReactClass';
    var warningKey = componentName + '.' + callerName;
    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }
    warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, componentName);
    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

/**
 * Base class helpers for the updating state of a component.
 */
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
Component.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
        return undefined;
      }
    });
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function PureComponent(props, context, updater) {
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
_assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

function AsyncComponent(props, context, updater) {
  // Duplicated from Component.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

var asyncComponentPrototype = AsyncComponent.prototype = new ComponentDummy();
asyncComponentPrototype.constructor = AsyncComponent;
// Avoid an extra prototype jump for these methods.
_assign(asyncComponentPrototype, Component.prototype);
asyncComponentPrototype.unstable_isAsyncReactComponent = true;
asyncComponentPrototype.render = function () {
  return this.props.children;
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown;
var specialPropRefWarningShown;

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
function createElement(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}

/**
 * Return a function that produces ReactElements of a given type.
 * See https://reactjs.org/docs/react-api.html#createfactory
 */


function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
}

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */
function cloneElement(element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}

/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var ReactDebugCurrentFrame = {};

{
  // Component that is being worked on
  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var impl = ReactDebugCurrentFrame.getCurrentStack;
    if (impl) {
      return impl();
    }
    return null;
  };
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */
function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

var POOL_SIZE = 10;
var traverseContextPool = [];
function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
  if (traverseContextPool.length) {
    var traverseContext = traverseContextPool.pop();
    traverseContext.result = mapResult;
    traverseContext.keyPrefix = keyPrefix;
    traverseContext.func = mapFunction;
    traverseContext.context = mapContext;
    traverseContext.count = 0;
    return traverseContext;
  } else {
    return {
      result: mapResult,
      keyPrefix: keyPrefix,
      func: mapFunction,
      context: mapContext,
      count: 0
    };
  }
}

function releaseTraverseContext(traverseContext) {
  traverseContext.result = null;
  traverseContext.keyPrefix = null;
  traverseContext.func = null;
  traverseContext.context = null;
  traverseContext.count = 0;
  if (traverseContextPool.length < POOL_SIZE) {
    traverseContextPool.push(traverseContext);
  }
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_CALL_TYPE:
          case REACT_RETURN_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', ReactDebugCurrentFrame.getStackAddendum());
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
      }
      var childrenString = '' + children;
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  releaseTraverseContext(traverseContext);
}

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, emptyFunction.thatReturnsNull, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

var describeComponentFrame = function (name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
};

function getComponentName(fiber) {
  var type = fiber.type;

  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    return type.displayName || type.name;
  }
  return null;
}

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

{
  var currentlyValidatingElement = null;

  var propTypesMisspellWarningShown = false;

  var getDisplayName = function (element) {
    if (element == null) {
      return '#empty';
    } else if (typeof element === 'string' || typeof element === 'number') {
      return '#text';
    } else if (typeof element.type === 'string') {
      return element.type;
    } else if (element.type === REACT_FRAGMENT_TYPE) {
      return 'React.Fragment';
    } else {
      return element.type.displayName || element.type.name || 'Unknown';
    }
  };

  var getStackAddendum = function () {
    var stack = '';
    if (currentlyValidatingElement) {
      var name = getDisplayName(currentlyValidatingElement);
      var owner = currentlyValidatingElement._owner;
      stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner));
    }
    stack += ReactDebugCurrentFrame.getStackAddendum() || '';
    return stack;
  };

  var VALID_FRAGMENT_PROPS = new Map([['children', true], ['key', true]]);
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentName(ReactCurrentOwner.current);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName(element._owner) + '.';
  }

  currentlyValidatingElement = element;
  {
    warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getStackAddendum());
  }
  currentlyValidatingElement = null;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  var propTypes = componentClass.propTypes;
  if (propTypes) {
    currentlyValidatingElement = element;
    checkPropTypes(propTypes, element.props, 'prop', name, getStackAddendum);
    currentlyValidatingElement = null;
  } else if (componentClass.PropTypes !== undefined && !propTypesMisspellWarningShown) {
    propTypesMisspellWarningShown = true;
    warning(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
  }
}

/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */
function validateFragmentProps(fragment) {
  currentlyValidatingElement = fragment;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(fragment.props)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (!VALID_FRAGMENT_PROPS.has(key)) {
        warning(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.%s', key, getStackAddendum());
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (fragment.ref !== null) {
    warning(false, 'Invalid attribute `ref` supplied to `React.Fragment`.%s', getStackAddendum());
  }

  currentlyValidatingElement = null;
}

function createElementWithValidation(type, props, children) {
  var validType = typeof type === 'string' || typeof type === 'function' || typeof type === 'symbol' || typeof type === 'number';
  // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.
  if (!validType) {
    var info = '';
    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendum(props);
    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    info += getStackAddendum() || '';

    warning(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info);
  }

  var element = createElement.apply(this, arguments);

  // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.
  if (element == null) {
    return element;
  }

  // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)
  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (typeof type === 'symbol' && type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}

function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  // Legacy hook TODO: Warn if this is accessed
  validatedFactory.type = type;

  {
    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}

function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);
  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }
  validatePropTypes(newElement);
  return newElement;
}

var React = {
  Children: {
    map: mapChildren,
    forEach: forEachChildren,
    count: countChildren,
    toArray: toArray,
    only: onlyChild
  },

  Component: Component,
  PureComponent: PureComponent,
  unstable_AsyncComponent: AsyncComponent,

  Fragment: REACT_FRAGMENT_TYPE,

  createElement: createElementWithValidation,
  cloneElement: cloneElementWithValidation,
  createFactory: createFactoryWithValidation,
  isValidElement: isValidElement,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  }
};

{
  _assign(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
    // These should not be included in production.
    ReactDebugCurrentFrame: ReactDebugCurrentFrame,
    // Shim for React DOM 16.0.0 which still destructured (but not used) this.
    // TODO: remove in React 17.0.
    ReactComponentTreeHook: {}
  });
}



var React$2 = Object.freeze({
	default: React
});

var React$3 = ( React$2 && React ) || React$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var react = React$3['default'] ? React$3['default'] : React$3;

module.exports = react;
  })();
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** @license React v16.2.0
 * react-dom.development.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */





if (true) {
  (function() {
'use strict';

var React = __webpack_require__(0);
var invariant = __webpack_require__(2);
var warning = __webpack_require__(3);
var ExecutionEnvironment = __webpack_require__(20);
var _assign = __webpack_require__(5);
var emptyFunction = __webpack_require__(1);
var EventListener = __webpack_require__(21);
var getActiveElement = __webpack_require__(22);
var shallowEqual = __webpack_require__(23);
var containsNode = __webpack_require__(24);
var focusNode = __webpack_require__(27);
var emptyObject = __webpack_require__(9);
var checkPropTypes = __webpack_require__(6);
var hyphenateStyleName = __webpack_require__(28);
var camelizeStyleName = __webpack_require__(30);

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

!React ? invariant(false, 'ReactDOM was loaded before React. Make sure you load the React package before loading ReactDOM.') : void 0;

// These attributes should be all lowercase to allow for
// case insensitive checks
var RESERVED_PROPS = {
  children: true,
  dangerouslySetInnerHTML: true,
  defaultValue: true,
  defaultChecked: true,
  innerHTML: true,
  suppressContentEditableWarning: true,
  suppressHydrationWarning: true,
  style: true
};

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_PROPERTY: 0x1,
  HAS_BOOLEAN_VALUE: 0x4,
  HAS_NUMERIC_VALUE: 0x8,
  HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,
  HAS_STRING_BOOLEAN_VALUE: 0x40,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMAttributeNamespaces: object mapping React attribute name to the DOM
   * attribute namespace URL. (Attribute names not specified use no namespace.)
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function (domPropertyConfig) {
    var Injection = DOMPropertyInjection;
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    for (var propName in Properties) {
      !!properties.hasOwnProperty(propName) ? invariant(false, "injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.", propName) : void 0;

      var lowerCased = propName.toLowerCase();
      var propConfig = Properties[propName];

      var propertyInfo = {
        attributeName: lowerCased,
        attributeNamespace: null,
        propertyName: propName,
        mutationMethod: null,

        mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
        hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
        hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
        hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
        hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE),
        hasStringBooleanValue: checkMask(propConfig, Injection.HAS_STRING_BOOLEAN_VALUE)
      };
      !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? invariant(false, "DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s", propName) : void 0;

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];

        propertyInfo.attributeName = attributeName;
      }

      if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
        propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
      }

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        propertyInfo.mutationMethod = DOMMutationMethods[propName];
      }

      // Downcase references to whitelist properties to check for membership
      // without case-sensitivity. This allows the whitelist to pick up
      // `allowfullscreen`, which should be written using the property configuration
      // for `allowFullscreen`
      properties[propName] = propertyInfo;
    }
  }
};

/* eslint-disable max-len */
var ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
/* eslint-enable max-len */
var ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";


var ROOT_ATTRIBUTE_NAME = 'data-reactroot';

/**
 * Map from property "standard name" to an object with info about how to set
 * the property in the DOM. Each object contains:
 *
 * attributeName:
 *   Used when rendering markup or with `*Attribute()`.
 * attributeNamespace
 * propertyName:
 *   Used on DOM node instances. (This includes properties that mutate due to
 *   external factors.)
 * mutationMethod:
 *   If non-null, used instead of the property or `setAttribute()` after
 *   initial render.
 * mustUseProperty:
 *   Whether the property must be accessed and mutated as an object property.
 * hasBooleanValue:
 *   Whether the property should be removed when set to a falsey value.
 * hasNumericValue:
 *   Whether the property must be numeric or parse as a numeric and should be
 *   removed when set to a falsey value.
 * hasPositiveNumericValue:
 *   Whether the property must be positive numeric or parse as a positive
 *   numeric and should be removed when set to a falsey value.
 * hasOverloadedBooleanValue:
 *   Whether the property can be used as a flag as well as with a value.
 *   Removed when strictly equal to false; present without a value when
 *   strictly equal to true; present with a value otherwise.
 */
var properties = {};

/**
 * Checks whether a property name is a writeable attribute.
 * @method
 */
function shouldSetAttribute(name, value) {
  if (isReservedProp(name)) {
    return false;
  }
  if (name.length > 2 && (name[0] === 'o' || name[0] === 'O') && (name[1] === 'n' || name[1] === 'N')) {
    return false;
  }
  if (value === null) {
    return true;
  }
  switch (typeof value) {
    case 'boolean':
      return shouldAttributeAcceptBooleanValue(name);
    case 'undefined':
    case 'number':
    case 'string':
    case 'object':
      return true;
    default:
      // function, symbol
      return false;
  }
}

function getPropertyInfo(name) {
  return properties.hasOwnProperty(name) ? properties[name] : null;
}

function shouldAttributeAcceptBooleanValue(name) {
  if (isReservedProp(name)) {
    return true;
  }
  var propertyInfo = getPropertyInfo(name);
  if (propertyInfo) {
    return propertyInfo.hasBooleanValue || propertyInfo.hasStringBooleanValue || propertyInfo.hasOverloadedBooleanValue;
  }
  var prefix = name.toLowerCase().slice(0, 5);
  return prefix === 'data-' || prefix === 'aria-';
}

/**
 * Checks to see if a property name is within the list of properties
 * reserved for internal React operations. These properties should
 * not be set on an HTML element.
 *
 * @private
 * @param {string} name
 * @return {boolean} If the name is within reserved props
 */
function isReservedProp(name) {
  return RESERVED_PROPS.hasOwnProperty(name);
}

var injection = DOMPropertyInjection;

var MUST_USE_PROPERTY = injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = injection.HAS_BOOLEAN_VALUE;
var HAS_NUMERIC_VALUE = injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE = injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE = injection.HAS_OVERLOADED_BOOLEAN_VALUE;
var HAS_STRING_BOOLEAN_VALUE = injection.HAS_STRING_BOOLEAN_VALUE;

var HTMLDOMPropertyConfig = {
  // When adding attributes to this list, be sure to also add them to
  // the `possibleStandardNames` module to ensure casing and incorrect
  // name warnings.
  Properties: {
    allowFullScreen: HAS_BOOLEAN_VALUE,
    // specifies target context for links with `preload` type
    async: HAS_BOOLEAN_VALUE,
    // Note: there is a special case that prevents it from being written to the DOM
    // on the client side because the browsers are inconsistent. Instead we call focus().
    autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    capture: HAS_OVERLOADED_BOOLEAN_VALUE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    cols: HAS_POSITIVE_NUMERIC_VALUE,
    contentEditable: HAS_STRING_BOOLEAN_VALUE,
    controls: HAS_BOOLEAN_VALUE,
    'default': HAS_BOOLEAN_VALUE,
    defer: HAS_BOOLEAN_VALUE,
    disabled: HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: HAS_STRING_BOOLEAN_VALUE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    hidden: HAS_BOOLEAN_VALUE,
    loop: HAS_BOOLEAN_VALUE,
    // Caution; `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`.
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    noValidate: HAS_BOOLEAN_VALUE,
    open: HAS_BOOLEAN_VALUE,
    playsInline: HAS_BOOLEAN_VALUE,
    readOnly: HAS_BOOLEAN_VALUE,
    required: HAS_BOOLEAN_VALUE,
    reversed: HAS_BOOLEAN_VALUE,
    rows: HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: HAS_NUMERIC_VALUE,
    scoped: HAS_BOOLEAN_VALUE,
    seamless: HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    size: HAS_POSITIVE_NUMERIC_VALUE,
    start: HAS_NUMERIC_VALUE,
    // support for projecting regular DOM Elements via V1 named slots ( shadow dom )
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: HAS_STRING_BOOLEAN_VALUE,
    // Style must be explicitly set in the attribute list. React components
    // expect a style object
    style: 0,
    // Keep it in the whitelist because it is case-sensitive for SVG.
    tabIndex: 0,
    // itemScope is for for Microdata support.
    // See http://schema.org/docs/gs.html
    itemScope: HAS_BOOLEAN_VALUE,
    // These attributes must stay in the white-list because they have
    // different attribute names (see DOMAttributeNames below)
    acceptCharset: 0,
    className: 0,
    htmlFor: 0,
    httpEquiv: 0,
    // Attributes with mutation methods must be specified in the whitelist
    // Set the string boolean flag to allow the behavior
    value: HAS_STRING_BOOLEAN_VALUE
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMMutationMethods: {
    value: function (node, value) {
      if (value == null) {
        return node.removeAttribute('value');
      }

      // Number inputs get special treatment due to some edge cases in
      // Chrome. Let everything else assign the value attribute as normal.
      // https://github.com/facebook/react/issues/7253#issuecomment-236074326
      if (node.type !== 'number' || node.hasAttribute('value') === false) {
        node.setAttribute('value', '' + value);
      } else if (node.validity && !node.validity.badInput && node.ownerDocument.activeElement !== node) {
        // Don't assign an attribute if validation reports bad
        // input. Chrome will clear the value. Additionally, don't
        // operate on inputs that have focus, otherwise Chrome might
        // strip off trailing decimal places and cause the user's
        // cursor position to jump to the beginning of the input.
        //
        // In ReactDOMInput, we have an onBlur event that will trigger
        // this function again when focus is lost.
        node.setAttribute('value', '' + value);
      }
    }
  }
};

var HAS_STRING_BOOLEAN_VALUE$1 = injection.HAS_STRING_BOOLEAN_VALUE;


var NS = {
  xlink: 'http://www.w3.org/1999/xlink',
  xml: 'http://www.w3.org/XML/1998/namespace'
};

/**
 * This is a list of all SVG attributes that need special casing,
 * namespacing, or boolean value assignment.
 *
 * When adding attributes to this list, be sure to also add them to
 * the `possibleStandardNames` module to ensure casing and incorrect
 * name warnings.
 *
 * SVG Attributes List:
 * https://www.w3.org/TR/SVG/attindex.html
 * SMIL Spec:
 * https://www.w3.org/TR/smil
 */
var ATTRS = ['accent-height', 'alignment-baseline', 'arabic-form', 'baseline-shift', 'cap-height', 'clip-path', 'clip-rule', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'dominant-baseline', 'enable-background', 'fill-opacity', 'fill-rule', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'glyph-name', 'glyph-orientation-horizontal', 'glyph-orientation-vertical', 'horiz-adv-x', 'horiz-origin-x', 'image-rendering', 'letter-spacing', 'lighting-color', 'marker-end', 'marker-mid', 'marker-start', 'overline-position', 'overline-thickness', 'paint-order', 'panose-1', 'pointer-events', 'rendering-intent', 'shape-rendering', 'stop-color', 'stop-opacity', 'strikethrough-position', 'strikethrough-thickness', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke-width', 'text-anchor', 'text-decoration', 'text-rendering', 'underline-position', 'underline-thickness', 'unicode-bidi', 'unicode-range', 'units-per-em', 'v-alphabetic', 'v-hanging', 'v-ideographic', 'v-mathematical', 'vector-effect', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'word-spacing', 'writing-mode', 'x-height', 'xlink:actuate', 'xlink:arcrole', 'xlink:href', 'xlink:role', 'xlink:show', 'xlink:title', 'xlink:type', 'xml:base', 'xmlns:xlink', 'xml:lang', 'xml:space'];

var SVGDOMPropertyConfig = {
  Properties: {
    autoReverse: HAS_STRING_BOOLEAN_VALUE$1,
    externalResourcesRequired: HAS_STRING_BOOLEAN_VALUE$1,
    preserveAlpha: HAS_STRING_BOOLEAN_VALUE$1
  },
  DOMAttributeNames: {
    autoReverse: 'autoReverse',
    externalResourcesRequired: 'externalResourcesRequired',
    preserveAlpha: 'preserveAlpha'
  },
  DOMAttributeNamespaces: {
    xlinkActuate: NS.xlink,
    xlinkArcrole: NS.xlink,
    xlinkHref: NS.xlink,
    xlinkRole: NS.xlink,
    xlinkShow: NS.xlink,
    xlinkTitle: NS.xlink,
    xlinkType: NS.xlink,
    xmlBase: NS.xml,
    xmlLang: NS.xml,
    xmlSpace: NS.xml
  }
};

var CAMELIZE = /[\-\:]([a-z])/g;
var capitalize = function (token) {
  return token[1].toUpperCase();
};

ATTRS.forEach(function (original) {
  var reactName = original.replace(CAMELIZE, capitalize);

  SVGDOMPropertyConfig.Properties[reactName] = 0;
  SVGDOMPropertyConfig.DOMAttributeNames[reactName] = original;
});

injection.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
injection.injectDOMPropertyConfig(SVGDOMPropertyConfig);

var ReactErrorUtils = {
  // Used by Fiber to simulate a try-catch.
  _caughtError: null,
  _hasCaughtError: false,

  // Used by event system to capture/rethrow the first error.
  _rethrowError: null,
  _hasRethrowError: false,

  injection: {
    injectErrorUtils: function (injectedErrorUtils) {
      !(typeof injectedErrorUtils.invokeGuardedCallback === 'function') ? invariant(false, 'Injected invokeGuardedCallback() must be a function.') : void 0;
      invokeGuardedCallback = injectedErrorUtils.invokeGuardedCallback;
    }
  },

  /**
   * Call a function while guarding against errors that happens within it.
   * Returns an error if it throws, otherwise null.
   *
   * In production, this is implemented using a try-catch. The reason we don't
   * use a try-catch directly is so that we can swap out a different
   * implementation in DEV mode.
   *
   * @param {String} name of the guard to use for logging or debugging
   * @param {Function} func The function to invoke
   * @param {*} context The context to use when calling the function
   * @param {...*} args Arguments for function
   */
  invokeGuardedCallback: function (name, func, context, a, b, c, d, e, f) {
    invokeGuardedCallback.apply(ReactErrorUtils, arguments);
  },

  /**
   * Same as invokeGuardedCallback, but instead of returning an error, it stores
   * it in a global so it can be rethrown by `rethrowCaughtError` later.
   * TODO: See if _caughtError and _rethrowError can be unified.
   *
   * @param {String} name of the guard to use for logging or debugging
   * @param {Function} func The function to invoke
   * @param {*} context The context to use when calling the function
   * @param {...*} args Arguments for function
   */
  invokeGuardedCallbackAndCatchFirstError: function (name, func, context, a, b, c, d, e, f) {
    ReactErrorUtils.invokeGuardedCallback.apply(this, arguments);
    if (ReactErrorUtils.hasCaughtError()) {
      var error = ReactErrorUtils.clearCaughtError();
      if (!ReactErrorUtils._hasRethrowError) {
        ReactErrorUtils._hasRethrowError = true;
        ReactErrorUtils._rethrowError = error;
      }
    }
  },

  /**
   * During execution of guarded functions we will capture the first error which
   * we will rethrow to be handled by the top level error handler.
   */
  rethrowCaughtError: function () {
    return rethrowCaughtError.apply(ReactErrorUtils, arguments);
  },

  hasCaughtError: function () {
    return ReactErrorUtils._hasCaughtError;
  },

  clearCaughtError: function () {
    if (ReactErrorUtils._hasCaughtError) {
      var error = ReactErrorUtils._caughtError;
      ReactErrorUtils._caughtError = null;
      ReactErrorUtils._hasCaughtError = false;
      return error;
    } else {
      invariant(false, 'clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.');
    }
  }
};

var invokeGuardedCallback = function (name, func, context, a, b, c, d, e, f) {
  ReactErrorUtils._hasCaughtError = false;
  ReactErrorUtils._caughtError = null;
  var funcArgs = Array.prototype.slice.call(arguments, 3);
  try {
    func.apply(context, funcArgs);
  } catch (error) {
    ReactErrorUtils._caughtError = error;
    ReactErrorUtils._hasCaughtError = true;
  }
};

{
  // In DEV mode, we swap out invokeGuardedCallback for a special version
  // that plays more nicely with the browser's DevTools. The idea is to preserve
  // "Pause on exceptions" behavior. Because React wraps all user-provided
  // functions in invokeGuardedCallback, and the production version of
  // invokeGuardedCallback uses a try-catch, all user exceptions are treated
  // like caught exceptions, and the DevTools won't pause unless the developer
  // takes the extra step of enabling pause on caught exceptions. This is
  // untintuitive, though, because even though React has caught the error, from
  // the developer's perspective, the error is uncaught.
  //
  // To preserve the expected "Pause on exceptions" behavior, we don't use a
  // try-catch in DEV. Instead, we synchronously dispatch a fake event to a fake
  // DOM node, and call the user-provided callback from inside an event handler
  // for that fake event. If the callback throws, the error is "captured" using
  // a global event handler. But because the error happens in a different
  // event loop context, it does not interrupt the normal program flow.
  // Effectively, this gives us try-catch behavior without actually using
  // try-catch. Neat!

  // Check that the browser supports the APIs we need to implement our special
  // DEV version of invokeGuardedCallback
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
    var fakeNode = document.createElement('react');

    var invokeGuardedCallbackDev = function (name, func, context, a, b, c, d, e, f) {
      // Keeps track of whether the user-provided callback threw an error. We
      // set this to true at the beginning, then set it to false right after
      // calling the function. If the function errors, `didError` will never be
      // set to false. This strategy works even if the browser is flaky and
      // fails to call our global error handler, because it doesn't rely on
      // the error event at all.
      var didError = true;

      // Create an event handler for our fake event. We will synchronously
      // dispatch our fake event using `dispatchEvent`. Inside the handler, we
      // call the user-provided callback.
      var funcArgs = Array.prototype.slice.call(arguments, 3);
      function callCallback() {
        // We immediately remove the callback from event listeners so that
        // nested `invokeGuardedCallback` calls do not clash. Otherwise, a
        // nested call would trigger the fake event handlers of any call higher
        // in the stack.
        fakeNode.removeEventListener(evtType, callCallback, false);
        func.apply(context, funcArgs);
        didError = false;
      }

      // Create a global error event handler. We use this to capture the value
      // that was thrown. It's possible that this error handler will fire more
      // than once; for example, if non-React code also calls `dispatchEvent`
      // and a handler for that event throws. We should be resilient to most of
      // those cases. Even if our error event handler fires more than once, the
      // last error event is always used. If the callback actually does error,
      // we know that the last error event is the correct one, because it's not
      // possible for anything else to have happened in between our callback
      // erroring and the code that follows the `dispatchEvent` call below. If
      // the callback doesn't error, but the error event was fired, we know to
      // ignore it because `didError` will be false, as described above.
      var error = void 0;
      // Use this to track whether the error event is ever called.
      var didSetError = false;
      var isCrossOriginError = false;

      function onError(event) {
        error = event.error;
        didSetError = true;
        if (error === null && event.colno === 0 && event.lineno === 0) {
          isCrossOriginError = true;
        }
      }

      // Create a fake event type.
      var evtType = 'react-' + (name ? name : 'invokeguardedcallback');

      // Attach our event handlers
      window.addEventListener('error', onError);
      fakeNode.addEventListener(evtType, callCallback, false);

      // Synchronously dispatch our fake event. If the user-provided function
      // errors, it will trigger our global error handler.
      var evt = document.createEvent('Event');
      evt.initEvent(evtType, false, false);
      fakeNode.dispatchEvent(evt);

      if (didError) {
        if (!didSetError) {
          // The callback errored, but the error event never fired.
          error = new Error('An error was thrown inside one of your components, but React ' + "doesn't know what it was. This is likely due to browser " + 'flakiness. React does its best to preserve the "Pause on ' + 'exceptions" behavior of the DevTools, which requires some ' + "DEV-mode only tricks. It's possible that these don't work in " + 'your browser. Try triggering the error in production mode, ' + 'or switching to a modern browser. If you suspect that this is ' + 'actually an issue with React, please file an issue.');
        } else if (isCrossOriginError) {
          error = new Error("A cross-origin error was thrown. React doesn't have access to " + 'the actual error object in development. ' + 'See https://fb.me/react-crossorigin-error for more information.');
        }
        ReactErrorUtils._hasCaughtError = true;
        ReactErrorUtils._caughtError = error;
      } else {
        ReactErrorUtils._hasCaughtError = false;
        ReactErrorUtils._caughtError = null;
      }

      // Remove our event listeners
      window.removeEventListener('error', onError);
    };

    invokeGuardedCallback = invokeGuardedCallbackDev;
  }
}

var rethrowCaughtError = function () {
  if (ReactErrorUtils._hasRethrowError) {
    var error = ReactErrorUtils._rethrowError;
    ReactErrorUtils._rethrowError = null;
    ReactErrorUtils._hasRethrowError = false;
    throw error;
  }
};

/**
 * Injectable ordering of event plugins.
 */
var eventPluginOrder = null;

/**
 * Injectable mapping from names to event plugin modules.
 */
var namesToPlugins = {};

/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!eventPluginOrder) {
    // Wait until an `eventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var pluginModule = namesToPlugins[pluginName];
    var pluginIndex = eventPluginOrder.indexOf(pluginName);
    !(pluginIndex > -1) ? invariant(false, 'EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.', pluginName) : void 0;
    if (plugins[pluginIndex]) {
      continue;
    }
    !pluginModule.extractEvents ? invariant(false, 'EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.', pluginName) : void 0;
    plugins[pluginIndex] = pluginModule;
    var publishedEvents = pluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? invariant(false, 'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.', eventName, pluginName) : void 0;
    }
  }
}

/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
  !!eventNameDispatchConfigs.hasOwnProperty(eventName) ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.', eventName) : void 0;
  eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
    return true;
  }
  return false;
}

/**
 * Publishes a registration name that is used to identify dispatched events.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, pluginModule, eventName) {
  !!registrationNameModules[registrationName] ? invariant(false, 'EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.', registrationName) : void 0;
  registrationNameModules[registrationName] = pluginModule;
  registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

  {
    var lowerCasedName = registrationName.toLowerCase();
    possibleRegistrationNames[lowerCasedName] = registrationName;

    if (registrationName === 'onDoubleClick') {
      possibleRegistrationNames.ondblclick = registrationName;
    }
  }
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */

/**
 * Ordered list of injected plugins.
 */
var plugins = [];

/**
 * Mapping from event name to dispatch config
 */
var eventNameDispatchConfigs = {};

/**
 * Mapping from registration name to plugin module
 */
var registrationNameModules = {};

/**
 * Mapping from registration name to event name
 */
var registrationNameDependencies = {};

/**
 * Mapping from lowercase registration names to the properly cased version,
 * used to warn in the case of missing event handlers. Available
 * only in true.
 * @type {Object}
 */
var possibleRegistrationNames = {};
// Trust the developer to only use possibleRegistrationNames in true

/**
 * Injects an ordering of plugins (by plugin name). This allows the ordering
 * to be decoupled from injection of the actual plugins so that ordering is
 * always deterministic regardless of packaging, on-the-fly injection, etc.
 *
 * @param {array} InjectedEventPluginOrder
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginOrder}
 */
function injectEventPluginOrder(injectedEventPluginOrder) {
  !!eventPluginOrder ? invariant(false, 'EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.') : void 0;
  // Clone the ordering so it cannot be dynamically mutated.
  eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
  recomputePluginOrdering();
}

/**
 * Injects plugins to be used by `EventPluginHub`. The plugin names must be
 * in the ordering injected by `injectEventPluginOrder`.
 *
 * Plugins can be injected as part of page initialization or on-the-fly.
 *
 * @param {object} injectedNamesToPlugins Map from names to plugin modules.
 * @internal
 * @see {EventPluginHub.injection.injectEventPluginsByName}
 */
function injectEventPluginsByName(injectedNamesToPlugins) {
  var isOrderingDirty = false;
  for (var pluginName in injectedNamesToPlugins) {
    if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
      continue;
    }
    var pluginModule = injectedNamesToPlugins[pluginName];
    if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
      !!namesToPlugins[pluginName] ? invariant(false, 'EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.', pluginName) : void 0;
      namesToPlugins[pluginName] = pluginModule;
      isOrderingDirty = true;
    }
  }
  if (isOrderingDirty) {
    recomputePluginOrdering();
  }
}

var EventPluginRegistry = Object.freeze({
	plugins: plugins,
	eventNameDispatchConfigs: eventNameDispatchConfigs,
	registrationNameModules: registrationNameModules,
	registrationNameDependencies: registrationNameDependencies,
	possibleRegistrationNames: possibleRegistrationNames,
	injectEventPluginOrder: injectEventPluginOrder,
	injectEventPluginsByName: injectEventPluginsByName
});

var getFiberCurrentPropsFromNode = null;
var getInstanceFromNode = null;
var getNodeFromInstance = null;

var injection$2 = {
  injectComponentTree: function (Injected) {
    getFiberCurrentPropsFromNode = Injected.getFiberCurrentPropsFromNode;
    getInstanceFromNode = Injected.getInstanceFromNode;
    getNodeFromInstance = Injected.getNodeFromInstance;

    {
      warning(getNodeFromInstance && getInstanceFromNode, 'EventPluginUtils.injection.injectComponentTree(...): Injected ' + 'module is missing getNodeFromInstance or getInstanceFromNode.');
    }
  }
};






var validateEventDispatches;
{
  validateEventDispatches = function (event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchInstances = event._dispatchInstances;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;

    var instancesIsArr = Array.isArray(dispatchInstances);
    var instancesLen = instancesIsArr ? dispatchInstances.length : dispatchInstances ? 1 : 0;

    warning(instancesIsArr === listenersIsArr && instancesLen === listenersLen, 'EventPluginUtils: Invalid `event`.');
  };
}

/**
 * Dispatch the event to the listener.
 * @param {SyntheticEvent} event SyntheticEvent to handle
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @param {function} listener Application-level callback
 * @param {*} inst Internal component instance
 */
function executeDispatch(event, simulated, listener, inst) {
  var type = event.type || 'unknown-event';
  event.currentTarget = getNodeFromInstance(inst);
  ReactErrorUtils.invokeGuardedCallbackAndCatchFirstError(type, listener, undefined, event);
  event.currentTarget = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, simulated) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchInstances = event._dispatchInstances;
  {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and Instances are two parallel arrays that are always in sync.
      executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
    }
  } else if (dispatchListeners) {
    executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
  }
  event._dispatchListeners = null;
  event._dispatchInstances = null;
}

/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */


/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return {*} The return value of executing the single dispatch.
 */


/**
 * @param {SyntheticEvent} event
 * @return {boolean} True iff number of dispatches accumulated is greater than 0.
 */

/**
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  !(next != null) ? invariant(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : void 0;

  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  if (Array.isArray(current)) {
    if (Array.isArray(next)) {
      current.push.apply(current, next);
      return current;
    }
    current.push(next);
    return current;
  }

  if (Array.isArray(next)) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

/**
 * @param {array} arr an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 * @param {function} cb Callback invoked with each element or a collection.
 * @param {?} [scope] Scope used as `this` in a callback.
 */
function forEachAccumulated(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
}

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @param {boolean} simulated If the event is simulated (changes exn behavior)
 * @private
 */
var executeDispatchesAndRelease = function (event, simulated) {
  if (event) {
    executeDispatchesInOrder(event, simulated);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};
var executeDispatchesAndReleaseSimulated = function (e) {
  return executeDispatchesAndRelease(e, true);
};
var executeDispatchesAndReleaseTopLevel = function (e) {
  return executeDispatchesAndRelease(e, false);
};

function isInteractive(tag) {
  return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
}

function shouldPreventMouseEvent(name, type, props) {
  switch (name) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
      return !!(props.disabled && isInteractive(type));
    default:
      return false;
  }
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */

/**
 * Methods for injecting dependencies.
 */
var injection$1 = {
  /**
   * @param {array} InjectedEventPluginOrder
   * @public
   */
  injectEventPluginOrder: injectEventPluginOrder,

  /**
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   */
  injectEventPluginsByName: injectEventPluginsByName
};

/**
 * @param {object} inst The instance, which is the source of events.
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @return {?function} The stored callback.
 */
function getListener(inst, registrationName) {
  var listener;

  // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not
  // live here; needs to be moved to a better place soon
  var stateNode = inst.stateNode;
  if (!stateNode) {
    // Work in progress (ex: onload events in incremental mode).
    return null;
  }
  var props = getFiberCurrentPropsFromNode(stateNode);
  if (!props) {
    // Work in progress.
    return null;
  }
  listener = props[registrationName];
  if (shouldPreventMouseEvent(registrationName, inst.type, props)) {
    return null;
  }
  !(!listener || typeof listener === 'function') ? invariant(false, 'Expected `%s` listener to be a function, instead got a value of `%s` type.', registrationName, typeof listener) : void 0;
  return listener;
}

/**
 * Allows registered plugins an opportunity to extract events from top-level
 * native browser events.
 *
 * @return {*} An accumulation of synthetic events.
 * @internal
 */
function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events;
  for (var i = 0; i < plugins.length; i++) {
    // Not every plugin in the ordering may be loaded at runtime.
    var possiblePlugin = plugins[i];
    if (possiblePlugin) {
      var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
      if (extractedEvents) {
        events = accumulateInto(events, extractedEvents);
      }
    }
  }
  return events;
}

/**
 * Enqueues a synthetic event that should be dispatched when
 * `processEventQueue` is invoked.
 *
 * @param {*} events An accumulation of synthetic events.
 * @internal
 */
function enqueueEvents(events) {
  if (events) {
    eventQueue = accumulateInto(eventQueue, events);
  }
}

/**
 * Dispatches all synthetic events on the event queue.
 *
 * @internal
 */
function processEventQueue(simulated) {
  // Set `eventQueue` to null before processing it so that we can tell if more
  // events get enqueued while processing.
  var processingEventQueue = eventQueue;
  eventQueue = null;

  if (!processingEventQueue) {
    return;
  }

  if (simulated) {
    forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
  } else {
    forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
  }
  !!eventQueue ? invariant(false, 'processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.') : void 0;
  // This would be a good time to rethrow if any of the event handlers threw.
  ReactErrorUtils.rethrowCaughtError();
}

var EventPluginHub = Object.freeze({
	injection: injection$1,
	getListener: getListener,
	extractEvents: extractEvents,
	enqueueEvents: enqueueEvents,
	processEventQueue: processEventQueue
});

var IndeterminateComponent = 0; // Before we know whether it is functional or class
var FunctionalComponent = 1;
var ClassComponent = 2;
var HostRoot = 3; // Root of a host tree. Could be nested inside another node.
var HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
var HostComponent = 5;
var HostText = 6;
var CallComponent = 7;
var CallHandlerPhase = 8;
var ReturnComponent = 9;
var Fragment = 10;

var randomKey = Math.random().toString(36).slice(2);
var internalInstanceKey = '__reactInternalInstance$' + randomKey;
var internalEventHandlersKey = '__reactEventHandlers$' + randomKey;

function precacheFiberNode$1(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}

/**
 * Given a DOM node, return the closest ReactDOMComponent or
 * ReactDOMTextComponent instance ancestor.
 */
function getClosestInstanceFromNode(node) {
  if (node[internalInstanceKey]) {
    return node[internalInstanceKey];
  }

  // Walk up the tree until we find an ancestor whose instance we have cached.
  var parents = [];
  while (!node[internalInstanceKey]) {
    parents.push(node);
    if (node.parentNode) {
      node = node.parentNode;
    } else {
      // Top of the tree. This node must not be part of a React tree (or is
      // unmounted, potentially).
      return null;
    }
  }

  var closest = void 0;
  var inst = node[internalInstanceKey];
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber, this will always be the deepest root.
    return inst;
  }
  for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
    closest = inst;
  }

  return closest;
}

/**
 * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
 * instance, or null if the node was not rendered by this React.
 */
function getInstanceFromNode$1(node) {
  var inst = node[internalInstanceKey];
  if (inst) {
    if (inst.tag === HostComponent || inst.tag === HostText) {
      return inst;
    } else {
      return null;
    }
  }
  return null;
}

/**
 * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
 * DOM node.
 */
function getNodeFromInstance$1(inst) {
  if (inst.tag === HostComponent || inst.tag === HostText) {
    // In Fiber this, is just the state node right now. We assume it will be
    // a host component or host text.
    return inst.stateNode;
  }

  // Without this first invariant, passing a non-DOM-component triggers the next
  // invariant for a missing parent, which is super confusing.
  invariant(false, 'getNodeFromInstance: Invalid argument.');
}

function getFiberCurrentPropsFromNode$1(node) {
  return node[internalEventHandlersKey] || null;
}

function updateFiberProps$1(node, props) {
  node[internalEventHandlersKey] = props;
}

var ReactDOMComponentTree = Object.freeze({
	precacheFiberNode: precacheFiberNode$1,
	getClosestInstanceFromNode: getClosestInstanceFromNode,
	getInstanceFromNode: getInstanceFromNode$1,
	getNodeFromInstance: getNodeFromInstance$1,
	getFiberCurrentPropsFromNode: getFiberCurrentPropsFromNode$1,
	updateFiberProps: updateFiberProps$1
});

function getParent(inst) {
  do {
    inst = inst['return'];
    // TODO: If this is a HostRoot we might want to bail out.
    // That is depending on if we want nested subtrees (layers) to bubble
    // events to their parent. We could also go through parentNode on the
    // host node but that wouldn't work for React Native and doesn't let us
    // do the portal feature.
  } while (inst && inst.tag !== HostComponent);
  if (inst) {
    return inst;
  }
  return null;
}

/**
 * Return the lowest common ancestor of A and B, or null if they are in
 * different trees.
 */
function getLowestCommonAncestor(instA, instB) {
  var depthA = 0;
  for (var tempA = instA; tempA; tempA = getParent(tempA)) {
    depthA++;
  }
  var depthB = 0;
  for (var tempB = instB; tempB; tempB = getParent(tempB)) {
    depthB++;
  }

  // If A is deeper, crawl up.
  while (depthA - depthB > 0) {
    instA = getParent(instA);
    depthA--;
  }

  // If B is deeper, crawl up.
  while (depthB - depthA > 0) {
    instB = getParent(instB);
    depthB--;
  }

  // Walk in lockstep until we find a match.
  var depth = depthA;
  while (depth--) {
    if (instA === instB || instA === instB.alternate) {
      return instA;
    }
    instA = getParent(instA);
    instB = getParent(instB);
  }
  return null;
}

/**
 * Return if A is an ancestor of B.
 */


/**
 * Return the parent instance of the passed-in instance.
 */
function getParentInstance(inst) {
  return getParent(inst);
}

/**
 * Simulates the traversal of a two-phase, capture/bubble event dispatch.
 */
function traverseTwoPhase(inst, fn, arg) {
  var path = [];
  while (inst) {
    path.push(inst);
    inst = getParent(inst);
  }
  var i;
  for (i = path.length; i-- > 0;) {
    fn(path[i], 'captured', arg);
  }
  for (i = 0; i < path.length; i++) {
    fn(path[i], 'bubbled', arg);
  }
}

/**
 * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
 * should would receive a `mouseEnter` or `mouseLeave` event.
 *
 * Does not invoke the callback on the nearest common ancestor because nothing
 * "entered" or "left" that element.
 */
function traverseEnterLeave(from, to, fn, argFrom, argTo) {
  var common = from && to ? getLowestCommonAncestor(from, to) : null;
  var pathFrom = [];
  while (true) {
    if (!from) {
      break;
    }
    if (from === common) {
      break;
    }
    var alternate = from.alternate;
    if (alternate !== null && alternate === common) {
      break;
    }
    pathFrom.push(from);
    from = getParent(from);
  }
  var pathTo = [];
  while (true) {
    if (!to) {
      break;
    }
    if (to === common) {
      break;
    }
    var _alternate = to.alternate;
    if (_alternate !== null && _alternate === common) {
      break;
    }
    pathTo.push(to);
    to = getParent(to);
  }
  for (var i = 0; i < pathFrom.length; i++) {
    fn(pathFrom[i], 'bubbled', argFrom);
  }
  for (var _i = pathTo.length; _i-- > 0;) {
    fn(pathTo[_i], 'captured', argTo);
  }
}

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(inst, event, propagationPhase) {
  var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(inst, registrationName);
}

/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing even a
 * single one.
 */

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(inst, phase, event) {
  {
    warning(inst, 'Dispatching inst must not be null');
  }
  var listener = listenerAtPhase(inst, event, phase);
  if (listener) {
    event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
    event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
  }
}

/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We cannot perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
  }
}

/**
 * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
 */
function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    var targetInst = event._targetInst;
    var parentInst = targetInst ? getParentInstance(targetInst) : null;
    traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
  }
}

/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
function accumulateDispatches(inst, ignoredDirection, event) {
  if (inst && event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(inst, registrationName);
    if (listener) {
      event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
      event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
    }
  }
}

/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event._targetInst, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}

function accumulateTwoPhaseDispatchesSkipTarget(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
}

function accumulateEnterLeaveDispatches(leave, enter, from, to) {
  traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
}

function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}

var EventPropagators = Object.freeze({
	accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
	accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
	accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches,
	accumulateDirectDispatches: accumulateDirectDispatches
});

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
  }
  return contentKey;
}

/**
 * This helper object stores information about text content of a target node,
 * allowing comparison of content before and after a given event.
 *
 * Identify the node where selection currently begins, then observe
 * both its text content and its current position in the DOM. Since the
 * browser may natively replace the target node during composition, we can
 * use its position to find its replacement.
 *
 *
 */
var compositionState = {
  _root: null,
  _startText: null,
  _fallbackText: null
};

function initialize(nativeEventTarget) {
  compositionState._root = nativeEventTarget;
  compositionState._startText = getText();
  return true;
}

function reset() {
  compositionState._root = null;
  compositionState._startText = null;
  compositionState._fallbackText = null;
}

function getData() {
  if (compositionState._fallbackText) {
    return compositionState._fallbackText;
  }

  var start;
  var startValue = compositionState._startText;
  var startLength = startValue.length;
  var end;
  var endValue = getText();
  var endLength = endValue.length;

  for (start = 0; start < startLength; start++) {
    if (startValue[start] !== endValue[start]) {
      break;
    }
  }

  var minEnd = startLength - start;
  for (end = 1; end <= minEnd; end++) {
    if (startValue[startLength - end] !== endValue[endLength - end]) {
      break;
    }
  }

  var sliceTail = end > 1 ? 1 - end : undefined;
  compositionState._fallbackText = endValue.slice(start, sliceTail);
  return compositionState._fallbackText;
}

function getText() {
  if ('value' in compositionState._root) {
    return compositionState._root.value;
  }
  return compositionState._root[getTextContentAccessor()];
}

/* eslint valid-typeof: 0 */

var didWarnForAddedNewProperty = false;
var isProxySupported = typeof Proxy === 'function';
var EVENT_POOL_SIZE = 10;

var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: null,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function (event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {*} targetInst Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @param {DOMEventTarget} nativeEventTarget Target node.
 */
function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
  {
    // these have a getter/setter for warnings
    delete this.nativeEvent;
    delete this.preventDefault;
    delete this.stopPropagation;
  }

  this.dispatchConfig = dispatchConfig;
  this._targetInst = targetInst;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    {
      delete this[propName]; // this has a getter/setter for warnings
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      if (propName === 'target') {
        this.target = nativeEventTarget;
      } else {
        this[propName] = nativeEvent[propName];
      }
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
  return this;
}

_assign(SyntheticEvent.prototype, {
  preventDefault: function () {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    if (!event) {
      return;
    }

    if (event.preventDefault) {
      event.preventDefault();
    } else if (typeof event.returnValue !== 'unknown') {
      event.returnValue = false;
    }
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function () {
    var event = this.nativeEvent;
    if (!event) {
      return;
    }

    if (event.stopPropagation) {
      event.stopPropagation();
    } else if (typeof event.cancelBubble !== 'unknown') {
      // The ChangeEventPlugin registers a "propertychange" event for
      // IE. This event does not support bubbling or cancelling, and
      // any references to cancelBubble throw "Member not found".  A
      // typeof check of "unknown" circumvents this issue (and is also
      // IE specific).
      event.cancelBubble = true;
    }

    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function () {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function () {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      {
        Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
      }
    }
    for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
      this[shouldBeReleasedProperties[i]] = null;
    }
    {
      Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
      Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', emptyFunction));
      Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', emptyFunction));
    }
  }
});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function (Class, Interface) {
  var Super = this;

  var E = function () {};
  E.prototype = Super.prototype;
  var prototype = new E();

  _assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = _assign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;
  addEventPoolingTo(Class);
};

/** Proxying after everything set on SyntheticEvent
 * to resolve Proxy issue on some WebKit browsers
 * in which some Event properties are set to undefined (GH#10010)
 */
{
  if (isProxySupported) {
    /*eslint-disable no-func-assign */
    SyntheticEvent = new Proxy(SyntheticEvent, {
      construct: function (target, args) {
        return this.apply(target, Object.create(target.prototype), args);
      },
      apply: function (constructor, that, args) {
        return new Proxy(constructor.apply(that, args), {
          set: function (target, prop, value) {
            if (prop !== 'isPersistent' && !target.constructor.Interface.hasOwnProperty(prop) && shouldBeReleasedProperties.indexOf(prop) === -1) {
              warning(didWarnForAddedNewProperty || target.isPersistent(), "This synthetic event is reused for performance reasons. If you're " + "seeing this, you're adding a new property in the synthetic event object. " + 'The property is never released. See ' + 'https://fb.me/react-event-pooling for more information.');
              didWarnForAddedNewProperty = true;
            }
            target[prop] = value;
            return true;
          }
        });
      }
    });
    /*eslint-enable no-func-assign */
  }
}

addEventPoolingTo(SyntheticEvent);

/**
 * Helper to nullify syntheticEvent instance properties when destructing
 *
 * @param {String} propName
 * @param {?object} getVal
 * @return {object} defineProperty object
 */
function getPooledWarningPropertyDefinition(propName, getVal) {
  var isFunction = typeof getVal === 'function';
  return {
    configurable: true,
    set: set,
    get: get
  };

  function set(val) {
    var action = isFunction ? 'setting the method' : 'setting the property';
    warn(action, 'This is effectively a no-op');
    return val;
  }

  function get() {
    var action = isFunction ? 'accessing the method' : 'accessing the property';
    var result = isFunction ? 'This is a no-op function' : 'This is set to null';
    warn(action, result);
    return getVal;
  }

  function warn(action, result) {
    var warningCondition = false;
    warning(warningCondition, "This synthetic event is reused for performance reasons. If you're seeing this, " + "you're %s `%s` on a released/nullified synthetic event. %s. " + 'If you must keep the original synthetic event around, use event.persist(). ' + 'See https://fb.me/react-event-pooling for more information.', action, propName, result);
  }
}

function getPooledEvent(dispatchConfig, targetInst, nativeEvent, nativeInst) {
  var EventConstructor = this;
  if (EventConstructor.eventPool.length) {
    var instance = EventConstructor.eventPool.pop();
    EventConstructor.call(instance, dispatchConfig, targetInst, nativeEvent, nativeInst);
    return instance;
  }
  return new EventConstructor(dispatchConfig, targetInst, nativeEvent, nativeInst);
}

function releasePooledEvent(event) {
  var EventConstructor = this;
  !(event instanceof EventConstructor) ? invariant(false, 'Trying to release an event instance  into a pool of a different type.') : void 0;
  event.destructor();
  if (EventConstructor.eventPool.length < EVENT_POOL_SIZE) {
    EventConstructor.eventPool.push(event);
  }
}

function addEventPoolingTo(EventConstructor) {
  EventConstructor.eventPool = [];
  EventConstructor.getPooled = getPooledEvent;
  EventConstructor.release = releasePooledEvent;
}

var SyntheticEvent$1 = SyntheticEvent;

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticCompositionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent$1.augmentClass(SyntheticCompositionEvent, CompositionEventInterface);

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
var InputEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticInputEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent$1.augmentClass(SyntheticInputEvent, InputEventInterface);

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var canUseCompositionEvent = ExecutionEnvironment.canUseDOM && 'CompositionEvent' in window;

var documentMode = null;
if (ExecutionEnvironment.canUseDOM && 'documentMode' in document) {
  documentMode = document.documentMode;
}

// Webkit offers a very useful `textInput` event that can be used to
// directly represent `beforeInput`. The IE `textinput` event is not as
// useful, so we don't use it.
var canUseTextInputEvent = ExecutionEnvironment.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. Japanese ideographic
// spaces, for instance (\u3000) are not recorded correctly.
var useFallbackCompositionData = ExecutionEnvironment.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
function isPresto() {
  var opera = window.opera;
  return typeof opera === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
}

var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

// Events and their corresponding property names.
var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: 'onBeforeInput',
      captured: 'onBeforeInputCapture'
    },
    dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
  },
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionEnd',
      captured: 'onCompositionEndCapture'
    },
    dependencies: ['topBlur', 'topCompositionEnd', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionStart',
      captured: 'onCompositionStartCapture'
    },
    dependencies: ['topBlur', 'topCompositionStart', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: 'onCompositionUpdate',
      captured: 'onCompositionUpdateCapture'
    },
    dependencies: ['topBlur', 'topCompositionUpdate', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
  }
};

// Track whether we've ever handled a keypress on the space key.
var hasSpaceKeypress = false;

/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
function isKeypressCommand(nativeEvent) {
  return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
  // ctrlKey && altKey is equivalent to AltGr, and is not a command.
  !(nativeEvent.ctrlKey && nativeEvent.altKey);
}

/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case 'topCompositionStart':
      return eventTypes.compositionStart;
    case 'topCompositionEnd':
      return eventTypes.compositionEnd;
    case 'topCompositionUpdate':
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionStart(topLevelType, nativeEvent) {
  return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackCompositionEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case 'topKeyUp':
      // Command keys insert or clear IME input.
      return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
    case 'topKeyDown':
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return nativeEvent.keyCode !== START_KEYCODE;
    case 'topKeyPress':
    case 'topMouseDown':
    case 'topBlur':
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Google Input Tools provides composition data via a CustomEvent,
 * with the `data` property populated in the `detail` object. If this
 * is available on the event object, use it. If not, this is a plain
 * composition event and we have nothing special to extract.
 *
 * @param {object} nativeEvent
 * @return {?string}
 */
function getDataFromCustomEvent(nativeEvent) {
  var detail = nativeEvent.detail;
  if (typeof detail === 'object' && 'data' in detail) {
    return detail.data;
  }
  return null;
}

// Track the current IME composition status, if any.
var isComposing = false;

/**
 * @return {?object} A SyntheticCompositionEvent.
 */
function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var eventType;
  var fallbackData;

  if (canUseCompositionEvent) {
    eventType = getCompositionEventType(topLevelType);
  } else if (!isComposing) {
    if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionStart;
    }
  } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
    eventType = eventTypes.compositionEnd;
  }

  if (!eventType) {
    return null;
  }

  if (useFallbackCompositionData) {
    // The current composition is stored statically and must not be
    // overwritten while composition continues.
    if (!isComposing && eventType === eventTypes.compositionStart) {
      isComposing = initialize(nativeEventTarget);
    } else if (eventType === eventTypes.compositionEnd) {
      if (isComposing) {
        fallbackData = getData();
      }
    }
  }

  var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

  if (fallbackData) {
    // Inject data generated from fallback path into the synthetic event.
    // This matches the property of native CompositionEventInterface.
    event.data = fallbackData;
  } else {
    var customData = getDataFromCustomEvent(nativeEvent);
    if (customData !== null) {
      event.data = customData;
    }
  }

  accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * @param {TopLevelTypes} topLevelType Record from `BrowserEventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The string corresponding to this `beforeInput` event.
 */
function getNativeBeforeInputChars(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case 'topCompositionEnd':
      return getDataFromCustomEvent(nativeEvent);
    case 'topKeyPress':
      /**
       * If native `textInput` events are available, our goal is to make
       * use of them. However, there is a special case: the spacebar key.
       * In Webkit, preventing default on a spacebar `textInput` event
       * cancels character insertion, but it *also* causes the browser
       * to fall back to its default spacebar behavior of scrolling the
       * page.
       *
       * Tracking at:
       * https://code.google.com/p/chromium/issues/detail?id=355103
       *
       * To avoid this issue, use the keypress event as if no `textInput`
       * event is available.
       */
      var which = nativeEvent.which;
      if (which !== SPACEBAR_CODE) {
        return null;
      }

      hasSpaceKeypress = true;
      return SPACEBAR_CHAR;

    case 'topTextInput':
      // Record the characters to be added to the DOM.
      var chars = nativeEvent.data;

      // If it's a spacebar character, assume that we have already handled
      // it at the keypress level and bail immediately. Android Chrome
      // doesn't give us keycodes, so we need to blacklist it.
      if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
        return null;
      }

      return chars;

    default:
      // For other native event types, do nothing.
      return null;
  }
}

/**
 * For browsers that do not provide the `textInput` event, extract the
 * appropriate string to use for SyntheticInputEvent.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @param {object} nativeEvent Native browser event.
 * @return {?string} The fallback string for this `beforeInput` event.
 */
function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
  // If we are currently composing (IME) and using a fallback to do so,
  // try to extract the composed characters from the fallback object.
  // If composition event is available, we extract a string only at
  // compositionevent, otherwise extract it at fallback events.
  if (isComposing) {
    if (topLevelType === 'topCompositionEnd' || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
      var chars = getData();
      reset();
      isComposing = false;
      return chars;
    }
    return null;
  }

  switch (topLevelType) {
    case 'topPaste':
      // If a paste event occurs after a keypress, throw out the input
      // chars. Paste events should not lead to BeforeInput events.
      return null;
    case 'topKeyPress':
      /**
       * As of v27, Firefox may fire keypress events even when no character
       * will be inserted. A few possibilities:
       *
       * - `which` is `0`. Arrow keys, Esc key, etc.
       *
       * - `which` is the pressed key code, but no char is available.
       *   Ex: 'AltGr + d` in Polish. There is no modified character for
       *   this key combination and no character is inserted into the
       *   document, but FF fires the keypress for char code `100` anyway.
       *   No `input` event will occur.
       *
       * - `which` is the pressed key code, but a command combination is
       *   being used. Ex: `Cmd+C`. No character is inserted, and no
       *   `input` event will occur.
       */
      if (!isKeypressCommand(nativeEvent)) {
        // IE fires the `keypress` event when a user types an emoji via
        // Touch keyboard of Windows.  In such a case, the `char` property
        // holds an emoji character like `\uD83D\uDE0A`.  Because its length
        // is 2, the property `which` does not represent an emoji correctly.
        // In such a case, we directly return the `char` property instead of
        // using `which`.
        if (nativeEvent.char && nativeEvent.char.length > 1) {
          return nativeEvent.char;
        } else if (nativeEvent.which) {
          return String.fromCharCode(nativeEvent.which);
        }
      }
      return null;
    case 'topCompositionEnd':
      return useFallbackCompositionData ? null : nativeEvent.data;
    default:
      return null;
  }
}

/**
 * Extract a SyntheticInputEvent for `beforeInput`, based on either native
 * `textInput` or fallback behavior.
 *
 * @return {?object} A SyntheticInputEvent.
 */
function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var chars;

  if (canUseTextInputEvent) {
    chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
  } else {
    chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
  }

  // If no characters are being inserted, no BeforeInput event should
  // be fired.
  if (!chars) {
    return null;
  }

  var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);

  event.data = chars;
  accumulateTwoPhaseDispatches(event);
  return event;
}

/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 *
 * This plugin is also responsible for emitting `composition` events, thus
 * allowing us to share composition fallback code for both `beforeInput` and
 * `composition` event types.
 */
var BeforeInputEventPlugin = {
  eventTypes: eventTypes,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
  }
};

// Use to restore controlled state after a change event has fired.

var fiberHostComponent = null;

var ReactControlledComponentInjection = {
  injectFiberControlledHostComponent: function (hostComponentImpl) {
    // The fiber implementation doesn't use dynamic dispatch so we need to
    // inject the implementation.
    fiberHostComponent = hostComponentImpl;
  }
};

var restoreTarget = null;
var restoreQueue = null;

function restoreStateOfTarget(target) {
  // We perform this translation at the end of the event loop so that we
  // always receive the correct fiber here
  var internalInstance = getInstanceFromNode(target);
  if (!internalInstance) {
    // Unmounted
    return;
  }
  !(fiberHostComponent && typeof fiberHostComponent.restoreControlledState === 'function') ? invariant(false, 'Fiber needs to be injected to handle a fiber target for controlled events. This error is likely caused by a bug in React. Please file an issue.') : void 0;
  var props = getFiberCurrentPropsFromNode(internalInstance.stateNode);
  fiberHostComponent.restoreControlledState(internalInstance.stateNode, internalInstance.type, props);
}

var injection$3 = ReactControlledComponentInjection;

function enqueueStateRestore(target) {
  if (restoreTarget) {
    if (restoreQueue) {
      restoreQueue.push(target);
    } else {
      restoreQueue = [target];
    }
  } else {
    restoreTarget = target;
  }
}

function restoreStateIfNeeded() {
  if (!restoreTarget) {
    return;
  }
  var target = restoreTarget;
  var queuedTargets = restoreQueue;
  restoreTarget = null;
  restoreQueue = null;

  restoreStateOfTarget(target);
  if (queuedTargets) {
    for (var i = 0; i < queuedTargets.length; i++) {
      restoreStateOfTarget(queuedTargets[i]);
    }
  }
}

var ReactControlledComponent = Object.freeze({
	injection: injection$3,
	enqueueStateRestore: enqueueStateRestore,
	restoreStateIfNeeded: restoreStateIfNeeded
});

// Used as a way to call batchedUpdates when we don't have a reference to
// the renderer. Such as when we're dispatching events or if third party
// libraries need to call batchedUpdates. Eventually, this API will go away when
// everything is batched by default. We'll then have a similar API to opt-out of
// scheduled work and instead do synchronous work.

// Defaults
var fiberBatchedUpdates = function (fn, bookkeeping) {
  return fn(bookkeeping);
};

var isNestingBatched = false;
function batchedUpdates(fn, bookkeeping) {
  if (isNestingBatched) {
    // If we are currently inside another batch, we need to wait until it
    // fully completes before restoring state. Therefore, we add the target to
    // a queue of work.
    return fiberBatchedUpdates(fn, bookkeeping);
  }
  isNestingBatched = true;
  try {
    return fiberBatchedUpdates(fn, bookkeeping);
  } finally {
    // Here we wait until all updates have propagated, which is important
    // when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    // Then we restore state of any controlled component.
    isNestingBatched = false;
    restoreStateIfNeeded();
  }
}

var ReactGenericBatchingInjection = {
  injectFiberBatchedUpdates: function (_batchedUpdates) {
    fiberBatchedUpdates = _batchedUpdates;
  }
};

var injection$4 = ReactGenericBatchingInjection;

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  color: true,
  date: true,
  datetime: true,
  'datetime-local': true,
  email: true,
  month: true,
  number: true,
  password: true,
  range: true,
  search: true,
  tel: true,
  text: true,
  time: true,
  url: true,
  week: true
};

function isTextInputElement(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

  if (nodeName === 'input') {
    return !!supportedInputTypes[elem.type];
  }

  if (nodeName === 'textarea') {
    return true;
  }

  return false;
}

/**
 * HTML nodeType values that represent the type of the node
 */

var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;
var DOCUMENT_FRAGMENT_NODE = 11;

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;

  // Normalize SVG <use> element events #4963
  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  }

  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === TEXT_NODE ? target.parentNode : target;
}

var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature = document.implementation && document.implementation.hasFeature &&
  // always returns true in newer browsers as per the standard.
  // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
  document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM || capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

function isCheckable(elem) {
  var type = elem.type;
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (type === 'checkbox' || type === 'radio');
}

function getTracker(node) {
  return node._valueTracker;
}

function detachTracker(node) {
  node._valueTracker = null;
}

function getValueFromNode(node) {
  var value = '';
  if (!node) {
    return value;
  }

  if (isCheckable(node)) {
    value = node.checked ? 'true' : 'false';
  } else {
    value = node.value;
  }

  return value;
}

function trackValueOnNode(node) {
  var valueField = isCheckable(node) ? 'checked' : 'value';
  var descriptor = Object.getOwnPropertyDescriptor(node.constructor.prototype, valueField);

  var currentValue = '' + node[valueField];

  // if someone has already defined a value or Safari, then bail
  // and don't track value will cause over reporting of changes,
  // but it's better then a hard failure
  // (needed for certain tests that spyOn input values and Safari)
  if (node.hasOwnProperty(valueField) || typeof descriptor.get !== 'function' || typeof descriptor.set !== 'function') {
    return;
  }

  Object.defineProperty(node, valueField, {
    enumerable: descriptor.enumerable,
    configurable: true,
    get: function () {
      return descriptor.get.call(this);
    },
    set: function (value) {
      currentValue = '' + value;
      descriptor.set.call(this, value);
    }
  });

  var tracker = {
    getValue: function () {
      return currentValue;
    },
    setValue: function (value) {
      currentValue = '' + value;
    },
    stopTracking: function () {
      detachTracker(node);
      delete node[valueField];
    }
  };
  return tracker;
}

function track(node) {
  if (getTracker(node)) {
    return;
  }

  // TODO: Once it's just Fiber we can move this to node._wrapperState
  node._valueTracker = trackValueOnNode(node);
}

function updateValueIfChanged(node) {
  if (!node) {
    return false;
  }

  var tracker = getTracker(node);
  // if there is no tracker at this point it's unlikely
  // that trying again will succeed
  if (!tracker) {
    return true;
  }

  var lastValue = tracker.getValue();
  var nextValue = getValueFromNode(node);
  if (nextValue !== lastValue) {
    tracker.setValue(nextValue);
    return true;
  }
  return false;
}

var eventTypes$1 = {
  change: {
    phasedRegistrationNames: {
      bubbled: 'onChange',
      captured: 'onChangeCapture'
    },
    dependencies: ['topBlur', 'topChange', 'topClick', 'topFocus', 'topInput', 'topKeyDown', 'topKeyUp', 'topSelectionChange']
  }
};

function createAndAccumulateChangeEvent(inst, nativeEvent, target) {
  var event = SyntheticEvent$1.getPooled(eventTypes$1.change, inst, nativeEvent, target);
  event.type = 'change';
  // Flag this event loop as needing state restore.
  enqueueStateRestore(target);
  accumulateTwoPhaseDispatches(event);
  return event;
}
/**
 * For IE shims
 */
var activeElement = null;
var activeElementInst = null;

/**
 * SECTION: handle `change` event
 */
function shouldUseChangeEvent(elem) {
  var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = createAndAccumulateChangeEvent(activeElementInst, nativeEvent, getEventTarget(nativeEvent));

  // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.
  batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  enqueueEvents(event);
  processEventQueue(false);
}

function getInstIfValueChanged(targetInst) {
  var targetNode = getNodeFromInstance$1(targetInst);
  if (updateValueIfChanged(targetNode)) {
    return targetInst;
  }
}

function getTargetInstForChangeEvent(topLevelType, targetInst) {
  if (topLevelType === 'topChange') {
    return targetInst;
  }
}

/**
 * SECTION: handle `input` event
 */
var isInputEventSupported = false;
if (ExecutionEnvironment.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events.
  isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 9);
}

/**
 * (For IE <=9) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
function startWatchingForValueChange(target, targetInst) {
  activeElement = target;
  activeElementInst = targetInst;
  activeElement.attachEvent('onpropertychange', handlePropertyChange);
}

/**
 * (For IE <=9) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent('onpropertychange', handlePropertyChange);
  activeElement = null;
  activeElementInst = null;
}

/**
 * (For IE <=9) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }
  if (getInstIfValueChanged(activeElementInst)) {
    manualDispatchChangeEvent(nativeEvent);
  }
}

function handleEventsForInputEventPolyfill(topLevelType, target, targetInst) {
  if (topLevelType === 'topFocus') {
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(target, targetInst);
  } else if (topLevelType === 'topBlur') {
    stopWatchingForValueChange();
  }
}

// For IE8 and IE9.
function getTargetInstForInputEventPolyfill(topLevelType, targetInst) {
  if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    return getInstIfValueChanged(activeElementInst);
  }
}

/**
 * SECTION: handle `click` event
 */
function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  var nodeName = elem.nodeName;
  return nodeName && nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
}

function getTargetInstForClickEvent(topLevelType, targetInst) {
  if (topLevelType === 'topClick') {
    return getInstIfValueChanged(targetInst);
  }
}

function getTargetInstForInputOrChangeEvent(topLevelType, targetInst) {
  if (topLevelType === 'topInput' || topLevelType === 'topChange') {
    return getInstIfValueChanged(targetInst);
  }
}

function handleControlledInputBlur(inst, node) {
  // TODO: In IE, inst is occasionally null. Why?
  if (inst == null) {
    return;
  }

  // Fiber and ReactDOM keep wrapper state in separate places
  var state = inst._wrapperState || node._wrapperState;

  if (!state || !state.controlled || node.type !== 'number') {
    return;
  }

  // If controlled, assign the value attribute to the current value on blur
  var value = '' + node.value;
  if (node.getAttribute('value') !== value) {
    node.setAttribute('value', value);
  }
}

/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
var ChangeEventPlugin = {
  eventTypes: eventTypes$1,

  _isInputEventSupported: isInputEventSupported,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;

    var getTargetInstFunc, handleEventFunc;
    if (shouldUseChangeEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForChangeEvent;
    } else if (isTextInputElement(targetNode)) {
      if (isInputEventSupported) {
        getTargetInstFunc = getTargetInstForInputOrChangeEvent;
      } else {
        getTargetInstFunc = getTargetInstForInputEventPolyfill;
        handleEventFunc = handleEventsForInputEventPolyfill;
      }
    } else if (shouldUseClickEvent(targetNode)) {
      getTargetInstFunc = getTargetInstForClickEvent;
    }

    if (getTargetInstFunc) {
      var inst = getTargetInstFunc(topLevelType, targetInst);
      if (inst) {
        var event = createAndAccumulateChangeEvent(inst, nativeEvent, nativeEventTarget);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(topLevelType, targetNode, targetInst);
    }

    // When blurring, set the value attribute for number inputs
    if (topLevelType === 'topBlur') {
      handleControlledInputBlur(targetInst, targetNode);
    }
  }
};

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
var DOMEventPluginOrder = ['ResponderEventPlugin', 'SimpleEventPlugin', 'TapEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin'];

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: null,
  detail: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent$1.augmentClass(SyntheticUIEvent, UIEventInterface);

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  Alt: 'altKey',
  Control: 'ctrlKey',
  Meta: 'metaKey',
  Shift: 'shiftKey'
};

// IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.
function modifierStateGetter(keyArg) {
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  pageX: null,
  pageY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState,
  button: null,
  buttons: null,
  relatedTarget: function (event) {
    return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

var eventTypes$2 = {
  mouseEnter: {
    registrationName: 'onMouseEnter',
    dependencies: ['topMouseOut', 'topMouseOver']
  },
  mouseLeave: {
    registrationName: 'onMouseLeave',
    dependencies: ['topMouseOut', 'topMouseOver']
  }
};

var EnterLeaveEventPlugin = {
  eventTypes: eventTypes$2,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   */
  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    if (topLevelType === 'topMouseOver' && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== 'topMouseOut' && topLevelType !== 'topMouseOver') {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (nativeEventTarget.window === nativeEventTarget) {
      // `nativeEventTarget` is probably a window object.
      win = nativeEventTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = nativeEventTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from;
    var to;
    if (topLevelType === 'topMouseOut') {
      from = targetInst;
      var related = nativeEvent.relatedTarget || nativeEvent.toElement;
      to = related ? getClosestInstanceFromNode(related) : null;
    } else {
      // Moving to a node from outside the window.
      from = null;
      to = targetInst;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromNode = from == null ? win : getNodeFromInstance$1(from);
    var toNode = to == null ? win : getNodeFromInstance$1(to);

    var leave = SyntheticMouseEvent.getPooled(eventTypes$2.mouseLeave, from, nativeEvent, nativeEventTarget);
    leave.type = 'mouseleave';
    leave.target = fromNode;
    leave.relatedTarget = toNode;

    var enter = SyntheticMouseEvent.getPooled(eventTypes$2.mouseEnter, to, nativeEvent, nativeEventTarget);
    enter.type = 'mouseenter';
    enter.target = toNode;
    enter.relatedTarget = fromNode;

    accumulateEnterLeaveDispatches(leave, enter, from, to);

    return [leave, enter];
  }
};

/**
 * `ReactInstanceMap` maintains a mapping from a public facing stateful
 * instance (key) and the internal representation (value). This allows public
 * methods to accept the user facing instance as an argument and map them back
 * to internal methods.
 *
 * Note that this module is currently shared and assumed to be stateless.
 * If this becomes an actual Map, that will break.
 */

/**
 * This API should be called `delete` but we'd have to make sure to always
 * transform these to strings for IE support. When this transform is fully
 * supported we can rename it.
 */


function get(key) {
  return key._reactInternalFiber;
}

function has(key) {
  return key._reactInternalFiber !== undefined;
}

function set(key, value) {
  key._reactInternalFiber = value;
}

var ReactInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

var ReactCurrentOwner = ReactInternals.ReactCurrentOwner;
var ReactDebugCurrentFrame = ReactInternals.ReactDebugCurrentFrame;

function getComponentName(fiber) {
  var type = fiber.type;

  if (typeof type === 'string') {
    return type;
  }
  if (typeof type === 'function') {
    return type.displayName || type.name;
  }
  return null;
}

// Don't change these two values:
var NoEffect = 0; //           0b00000000
var PerformedWork = 1; //      0b00000001

// You can change the rest (and add more).
var Placement = 2; //          0b00000010
var Update = 4; //             0b00000100
var PlacementAndUpdate = 6; // 0b00000110
var Deletion = 8; //           0b00001000
var ContentReset = 16; //      0b00010000
var Callback = 32; //          0b00100000
var Err = 64; //               0b01000000
var Ref = 128; //              0b10000000

var MOUNTING = 1;
var MOUNTED = 2;
var UNMOUNTED = 3;

function isFiberMountedImpl(fiber) {
  var node = fiber;
  if (!fiber.alternate) {
    // If there is no alternate, this might be a new tree that isn't inserted
    // yet. If it is, then it will have a pending insertion effect on it.
    if ((node.effectTag & Placement) !== NoEffect) {
      return MOUNTING;
    }
    while (node['return']) {
      node = node['return'];
      if ((node.effectTag & Placement) !== NoEffect) {
        return MOUNTING;
      }
    }
  } else {
    while (node['return']) {
      node = node['return'];
    }
  }
  if (node.tag === HostRoot) {
    // TODO: Check if this was a nested HostRoot when used with
    // renderContainerIntoSubtree.
    return MOUNTED;
  }
  // If we didn't hit the root, that means that we're in an disconnected tree
  // that has been unmounted.
  return UNMOUNTED;
}

function isFiberMounted(fiber) {
  return isFiberMountedImpl(fiber) === MOUNTED;
}

function isMounted(component) {
  {
    var owner = ReactCurrentOwner.current;
    if (owner !== null && owner.tag === ClassComponent) {
      var ownerFiber = owner;
      var instance = ownerFiber.stateNode;
      warning(instance._warnedAboutRefsInRender, '%s is accessing isMounted inside its render() function. ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', getComponentName(ownerFiber) || 'A component');
      instance._warnedAboutRefsInRender = true;
    }
  }

  var fiber = get(component);
  if (!fiber) {
    return false;
  }
  return isFiberMountedImpl(fiber) === MOUNTED;
}

function assertIsMounted(fiber) {
  !(isFiberMountedImpl(fiber) === MOUNTED) ? invariant(false, 'Unable to find node on an unmounted component.') : void 0;
}

function findCurrentFiberUsingSlowPath(fiber) {
  var alternate = fiber.alternate;
  if (!alternate) {
    // If there is no alternate, then we only need to check if it is mounted.
    var state = isFiberMountedImpl(fiber);
    !(state !== UNMOUNTED) ? invariant(false, 'Unable to find node on an unmounted component.') : void 0;
    if (state === MOUNTING) {
      return null;
    }
    return fiber;
  }
  // If we have two possible branches, we'll walk backwards up to the root
  // to see what path the root points to. On the way we may hit one of the
  // special cases and we'll deal with them.
  var a = fiber;
  var b = alternate;
  while (true) {
    var parentA = a['return'];
    var parentB = parentA ? parentA.alternate : null;
    if (!parentA || !parentB) {
      // We're at the root.
      break;
    }

    // If both copies of the parent fiber point to the same child, we can
    // assume that the child is current. This happens when we bailout on low
    // priority: the bailed out fiber's child reuses the current child.
    if (parentA.child === parentB.child) {
      var child = parentA.child;
      while (child) {
        if (child === a) {
          // We've determined that A is the current branch.
          assertIsMounted(parentA);
          return fiber;
        }
        if (child === b) {
          // We've determined that B is the current branch.
          assertIsMounted(parentA);
          return alternate;
        }
        child = child.sibling;
      }
      // We should never have an alternate for any mounting node. So the only
      // way this could possibly happen is if this was unmounted, if at all.
      invariant(false, 'Unable to find node on an unmounted component.');
    }

    if (a['return'] !== b['return']) {
      // The return pointer of A and the return pointer of B point to different
      // fibers. We assume that return pointers never criss-cross, so A must
      // belong to the child set of A.return, and B must belong to the child
      // set of B.return.
      a = parentA;
      b = parentB;
    } else {
      // The return pointers point to the same fiber. We'll have to use the
      // default, slow path: scan the child sets of each parent alternate to see
      // which child belongs to which set.
      //
      // Search parent A's child set
      var didFindChild = false;
      var _child = parentA.child;
      while (_child) {
        if (_child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }
        if (_child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }
        _child = _child.sibling;
      }
      if (!didFindChild) {
        // Search parent B's child set
        _child = parentB.child;
        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }
          if (_child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }
          _child = _child.sibling;
        }
        !didFindChild ? invariant(false, 'Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.') : void 0;
      }
    }

    !(a.alternate === b) ? invariant(false, 'Return fibers should always be each others\' alternates. This error is likely caused by a bug in React. Please file an issue.') : void 0;
  }
  // If the root is not a host container, we're in a disconnected tree. I.e.
  // unmounted.
  !(a.tag === HostRoot) ? invariant(false, 'Unable to find node on an unmounted component.') : void 0;
  if (a.stateNode.current === a) {
    // We've determined that A is the current branch.
    return fiber;
  }
  // Otherwise B has to be current branch.
  return alternate;
}

function findCurrentHostFiber(parent) {
  var currentParent = findCurrentFiberUsingSlowPath(parent);
  if (!currentParent) {
    return null;
  }

  // Next we'll drill down this component to find the first HostComponent/Text.
  var node = currentParent;
  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      return node;
    } else if (node.child) {
      node.child['return'] = node;
      node = node.child;
      continue;
    }
    if (node === currentParent) {
      return null;
    }
    while (!node.sibling) {
      if (!node['return'] || node['return'] === currentParent) {
        return null;
      }
      node = node['return'];
    }
    node.sibling['return'] = node['return'];
    node = node.sibling;
  }
  // Flow needs the return null here, but ESLint complains about it.
  // eslint-disable-next-line no-unreachable
  return null;
}

function findCurrentHostFiberWithNoPortals(parent) {
  var currentParent = findCurrentFiberUsingSlowPath(parent);
  if (!currentParent) {
    return null;
  }

  // Next we'll drill down this component to find the first HostComponent/Text.
  var node = currentParent;
  while (true) {
    if (node.tag === HostComponent || node.tag === HostText) {
      return node;
    } else if (node.child && node.tag !== HostPortal) {
      node.child['return'] = node;
      node = node.child;
      continue;
    }
    if (node === currentParent) {
      return null;
    }
    while (!node.sibling) {
      if (!node['return'] || node['return'] === currentParent) {
        return null;
      }
      node = node['return'];
    }
    node.sibling['return'] = node['return'];
    node = node.sibling;
  }
  // Flow needs the return null here, but ESLint complains about it.
  // eslint-disable-next-line no-unreachable
  return null;
}

var CALLBACK_BOOKKEEPING_POOL_SIZE = 10;
var callbackBookkeepingPool = [];

/**
 * Find the deepest React component completely containing the root of the
 * passed-in instance (for use when entire React trees are nested within each
 * other). If React trees are not nested, returns null.
 */
function findRootContainerNode(inst) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  while (inst['return']) {
    inst = inst['return'];
  }
  if (inst.tag !== HostRoot) {
    // This can happen if we're in a detached tree.
    return null;
  }
  return inst.stateNode.containerInfo;
}

// Used to store ancestor hierarchy in top level callback
function getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst) {
  if (callbackBookkeepingPool.length) {
    var instance = callbackBookkeepingPool.pop();
    instance.topLevelType = topLevelType;
    instance.nativeEvent = nativeEvent;
    instance.targetInst = targetInst;
    return instance;
  }
  return {
    topLevelType: topLevelType,
    nativeEvent: nativeEvent,
    targetInst: targetInst,
    ancestors: []
  };
}

function releaseTopLevelCallbackBookKeeping(instance) {
  instance.topLevelType = null;
  instance.nativeEvent = null;
  instance.targetInst = null;
  instance.ancestors.length = 0;
  if (callbackBookkeepingPool.length < CALLBACK_BOOKKEEPING_POOL_SIZE) {
    callbackBookkeepingPool.push(instance);
  }
}

function handleTopLevelImpl(bookKeeping) {
  var targetInst = bookKeeping.targetInst;

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = targetInst;
  do {
    if (!ancestor) {
      bookKeeping.ancestors.push(ancestor);
      break;
    }
    var root = findRootContainerNode(ancestor);
    if (!root) {
      break;
    }
    bookKeeping.ancestors.push(ancestor);
    ancestor = getClosestInstanceFromNode(root);
  } while (ancestor);

  for (var i = 0; i < bookKeeping.ancestors.length; i++) {
    targetInst = bookKeeping.ancestors[i];
    _handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
  }
}

// TODO: can we stop exporting these?
var _enabled = true;
var _handleTopLevel = void 0;

function setHandleTopLevel(handleTopLevel) {
  _handleTopLevel = handleTopLevel;
}

function setEnabled(enabled) {
  _enabled = !!enabled;
}

function isEnabled() {
  return _enabled;
}

/**
 * Traps top-level events by using event bubbling.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @param {string} handlerBaseName Event name (e.g. "click").
 * @param {object} element Element on which to attach listener.
 * @return {?object} An object with a remove function which will forcefully
 *                  remove the listener.
 * @internal
 */
function trapBubbledEvent(topLevelType, handlerBaseName, element) {
  if (!element) {
    return null;
  }
  return EventListener.listen(element, handlerBaseName, dispatchEvent.bind(null, topLevelType));
}

/**
 * Traps a top-level event by using event capturing.
 *
 * @param {string} topLevelType Record from `BrowserEventConstants`.
 * @param {string} handlerBaseName Event name (e.g. "click").
 * @param {object} element Element on which to attach listener.
 * @return {?object} An object with a remove function which will forcefully
 *                  remove the listener.
 * @internal
 */
function trapCapturedEvent(topLevelType, handlerBaseName, element) {
  if (!element) {
    return null;
  }
  return EventListener.capture(element, handlerBaseName, dispatchEvent.bind(null, topLevelType));
}

function dispatchEvent(topLevelType, nativeEvent) {
  if (!_enabled) {
    return;
  }

  var nativeEventTarget = getEventTarget(nativeEvent);
  var targetInst = getClosestInstanceFromNode(nativeEventTarget);
  if (targetInst !== null && typeof targetInst.tag === 'number' && !isFiberMounted(targetInst)) {
    // If we get an event (ex: img onload) before committing that
    // component's mount, ignore it for now (that is, treat it as if it was an
    // event on a non-React tree). We might also consider queueing events and
    // dispatching them after the mount.
    targetInst = null;
  }

  var bookKeeping = getTopLevelCallbackBookKeeping(topLevelType, nativeEvent, targetInst);

  try {
    // Event queue being processed in the same cycle allows
    // `preventDefault`.
    batchedUpdates(handleTopLevelImpl, bookKeeping);
  } finally {
    releaseTopLevelCallbackBookKeeping(bookKeeping);
  }
}

var ReactDOMEventListener = Object.freeze({
	get _enabled () { return _enabled; },
	get _handleTopLevel () { return _handleTopLevel; },
	setHandleTopLevel: setHandleTopLevel,
	setEnabled: setEnabled,
	isEnabled: isEnabled,
	trapBubbledEvent: trapBubbledEvent,
	trapCapturedEvent: trapCapturedEvent,
	dispatchEvent: dispatchEvent
});

/**
 * Generate a mapping of standard vendor prefixes using the defined style property and event name.
 *
 * @param {string} styleProp
 * @param {string} eventName
 * @returns {object}
 */
function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

  return prefixes;
}

/**
 * A list of event names to a configurable list of vendor prefixes.
 */
var vendorPrefixes = {
  animationend: makePrefixMap('Animation', 'AnimationEnd'),
  animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
  animationstart: makePrefixMap('Animation', 'AnimationStart'),
  transitionend: makePrefixMap('Transition', 'TransitionEnd')
};

/**
 * Event names that have already been detected and prefixed (if applicable).
 */
var prefixedEventNames = {};

/**
 * Element to check for prefixes on.
 */
var style = {};

/**
 * Bootstrap if a DOM exists.
 */
if (ExecutionEnvironment.canUseDOM) {
  style = document.createElement('div').style;

  // On some platforms, in particular some releases of Android 4.x,
  // the un-prefixed "animation" and "transition" properties are defined on the
  // style object but the events that fire will still be prefixed, so we need
  // to check if the un-prefixed events are usable, and if not remove them from the map.
  if (!('AnimationEvent' in window)) {
    delete vendorPrefixes.animationend.animation;
    delete vendorPrefixes.animationiteration.animation;
    delete vendorPrefixes.animationstart.animation;
  }

  // Same as above
  if (!('TransitionEvent' in window)) {
    delete vendorPrefixes.transitionend.transition;
  }
}

/**
 * Attempts to determine the correct vendor prefixed event name.
 *
 * @param {string} eventName
 * @returns {string}
 */
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName];
  } else if (!vendorPrefixes[eventName]) {
    return eventName;
  }

  var prefixMap = vendorPrefixes[eventName];

  for (var styleProp in prefixMap) {
    if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
      return prefixedEventNames[eventName] = prefixMap[styleProp];
    }
  }

  return '';
}

/**
 * Types of raw signals from the browser caught at the top level.
 *
 * For events like 'submit' which don't consistently bubble (which we
 * trap at a lower node than `document`), binding at `document` would
 * cause duplicate events so we don't include them here.
 */
var topLevelTypes$1 = {
  topAbort: 'abort',
  topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
  topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
  topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
  topBlur: 'blur',
  topCancel: 'cancel',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topChange: 'change',
  topClick: 'click',
  topClose: 'close',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topLoadedData: 'loadeddata',
  topLoad: 'load',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topScroll: 'scroll',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topSelectionChange: 'selectionchange',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTextInput: 'textInput',
  topTimeUpdate: 'timeupdate',
  topToggle: 'toggle',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting',
  topWheel: 'wheel'
};

var BrowserEventConstants = {
  topLevelTypes: topLevelTypes$1
};

function runEventQueueInBatch(events) {
  enqueueEvents(events);
  processEventQueue(false);
}

/**
 * Streams a fired top-level event to `EventPluginHub` where plugins have the
 * opportunity to create `ReactEvent`s to be dispatched.
 */
function handleTopLevel(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
  var events = extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
  runEventQueueInBatch(events);
}

var topLevelTypes = BrowserEventConstants.topLevelTypes;

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactDOMEventListener, which is injected and can therefore support
 *    pluggable event sources. This is the only work that occurs in the main
 *    thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var alreadyListeningTo = {};
var reactTopListenersCounter = 0;

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = '_reactListenersID' + ('' + Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * We listen for bubbled touch events on the document object.
 *
 * Firefox v8.01 (and possibly others) exhibited strange behavior when
 * mounting `onmousemove` events at some node that was not the document
 * element. The symptoms were that if your mouse is not moving over something
 * contained within that mount point (for example on the background) the
 * top-level listeners for `onmousemove` won't be called. However, if you
 * register the `mousemove` on the document object, then it will of course
 * catch all `mousemove`s. This along with iOS quirks, justifies restricting
 * top-level listeners to the document object only, at least for these
 * movement types of events and possibly all events.
 *
 * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
 *
 * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
 * they bubble to document.
 *
 * @param {string} registrationName Name of listener (e.g. `onClick`).
 * @param {object} contentDocumentHandle Document which owns the container
 */
function listenTo(registrationName, contentDocumentHandle) {
  var mountAt = contentDocumentHandle;
  var isListening = getListeningForDocument(mountAt);
  var dependencies = registrationNameDependencies[registrationName];

  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];
    if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      if (dependency === 'topScroll') {
        trapCapturedEvent('topScroll', 'scroll', mountAt);
      } else if (dependency === 'topFocus' || dependency === 'topBlur') {
        trapCapturedEvent('topFocus', 'focus', mountAt);
        trapCapturedEvent('topBlur', 'blur', mountAt);

        // to make sure blur and focus event listeners are only attached once
        isListening.topBlur = true;
        isListening.topFocus = true;
      } else if (dependency === 'topCancel') {
        if (isEventSupported('cancel', true)) {
          trapCapturedEvent('topCancel', 'cancel', mountAt);
        }
        isListening.topCancel = true;
      } else if (dependency === 'topClose') {
        if (isEventSupported('close', true)) {
          trapCapturedEvent('topClose', 'close', mountAt);
        }
        isListening.topClose = true;
      } else if (topLevelTypes.hasOwnProperty(dependency)) {
        trapBubbledEvent(dependency, topLevelTypes[dependency], mountAt);
      }

      isListening[dependency] = true;
    }
  }
}

function isListeningToAllDependencies(registrationName, mountAt) {
  var isListening = getListeningForDocument(mountAt);
  var dependencies = registrationNameDependencies[registrationName];
  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i];
    if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
      return false;
    }
  }
  return true;
}

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType === TEXT_NODE) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

/**
 * @param {DOMElement} outerNode
 * @return {?object}
 */
function getOffsets(outerNode) {
  var selection = window.getSelection && window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode,
      anchorOffset = selection.anchorOffset,
      focusNode$$1 = selection.focusNode,
      focusOffset = selection.focusOffset;

  // In Firefox, anchorNode and focusNode can be "anonymous divs", e.g. the
  // up/down buttons on an <input type="number">. Anonymous divs do not seem to
  // expose properties, triggering a "Permission denied error" if any of its
  // properties are accessed. The only seemingly possible way to avoid erroring
  // is to access a property that typically works for non-anonymous divs and
  // catch any error that may otherwise arise. See
  // https://bugzilla.mozilla.org/show_bug.cgi?id=208427

  try {
    /* eslint-disable no-unused-expressions */
    anchorNode.nodeType;
    focusNode$$1.nodeType;
    /* eslint-enable no-unused-expressions */
  } catch (e) {
    return null;
  }

  return getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode$$1, focusOffset);
}

/**
 * Returns {start, end} where `start` is the character/codepoint index of
 * (anchorNode, anchorOffset) within the textContent of `outerNode`, and
 * `end` is the index of (focusNode, focusOffset).
 *
 * Returns null if you pass in garbage input but we should probably just crash.
 *
 * Exported only for testing.
 */
function getModernOffsetsFromPoints(outerNode, anchorNode, anchorOffset, focusNode$$1, focusOffset) {
  var length = 0;
  var start = -1;
  var end = -1;
  var indexWithinAnchor = 0;
  var indexWithinFocus = 0;
  var node = outerNode;
  var parentNode = null;

  outer: while (true) {
    var next = null;

    while (true) {
      if (node === anchorNode && (anchorOffset === 0 || node.nodeType === TEXT_NODE)) {
        start = length + anchorOffset;
      }
      if (node === focusNode$$1 && (focusOffset === 0 || node.nodeType === TEXT_NODE)) {
        end = length + focusOffset;
      }

      if (node.nodeType === TEXT_NODE) {
        length += node.nodeValue.length;
      }

      if ((next = node.firstChild) === null) {
        break;
      }
      // Moving from `node` to its first child `next`.
      parentNode = node;
      node = next;
    }

    while (true) {
      if (node === outerNode) {
        // If `outerNode` has children, this is always the second time visiting
        // it. If it has no children, this is still the first loop, and the only
        // valid selection is anchorNode and focusNode both equal to this node
        // and both offsets 0, in which case we will have handled above.
        break outer;
      }
      if (parentNode === anchorNode && ++indexWithinAnchor === anchorOffset) {
        start = length;
      }
      if (parentNode === focusNode$$1 && ++indexWithinFocus === focusOffset) {
        end = length;
      }
      if ((next = node.nextSibling) !== null) {
        break;
      }
      node = parentNode;
      parentNode = node.parentNode;
    }

    // Moving from `node` to its next sibling `next`.
    node = next;
  }

  if (start === -1 || end === -1) {
    // This should never happen. (Would happen if the anchor/focus nodes aren't
    // actually inside the passed-in node.)
    return null;
  }

  return {
    start: start,
    end: end
  };
}

/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programmatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setOffsets(node, offsets) {
  if (!window.getSelection) {
    return;
  }

  var selection = window.getSelection();
  var length = node[getTextContentAccessor()].length;
  var start = Math.min(offsets.start, length);
  var end = offsets.end === undefined ? start : Math.min(offsets.end, length);

  // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.
  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    if (selection.rangeCount === 1 && selection.anchorNode === startMarker.node && selection.anchorOffset === startMarker.offset && selection.focusNode === endMarker.node && selection.focusOffset === endMarker.offset) {
      return;
    }
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */

function hasSelectionCapabilities(elem) {
  var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
  return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
}

function getSelectionInformation() {
  var focusedElem = getActiveElement();
  return {
    focusedElem: focusedElem,
    selectionRange: hasSelectionCapabilities(focusedElem) ? getSelection$1(focusedElem) : null
  };
}

/**
 * @restoreSelection: If any selection information was potentially lost,
 * restore it. This is useful when performing operations that could remove dom
 * nodes and place them back in, resulting in focus being lost.
 */
function restoreSelection(priorSelectionInformation) {
  var curFocusedElem = getActiveElement();
  var priorFocusedElem = priorSelectionInformation.focusedElem;
  var priorSelectionRange = priorSelectionInformation.selectionRange;
  if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
    if (hasSelectionCapabilities(priorFocusedElem)) {
      setSelection(priorFocusedElem, priorSelectionRange);
    }

    // Focusing a node can change the scroll position, which is undesirable
    var ancestors = [];
    var ancestor = priorFocusedElem;
    while (ancestor = ancestor.parentNode) {
      if (ancestor.nodeType === ELEMENT_NODE) {
        ancestors.push({
          element: ancestor,
          left: ancestor.scrollLeft,
          top: ancestor.scrollTop
        });
      }
    }

    focusNode(priorFocusedElem);

    for (var i = 0; i < ancestors.length; i++) {
      var info = ancestors[i];
      info.element.scrollLeft = info.left;
      info.element.scrollTop = info.top;
    }
  }
}

/**
 * @getSelection: Gets the selection bounds of a focused textarea, input or
 * contentEditable node.
 * -@input: Look up selection bounds of this input
 * -@return {start: selectionStart, end: selectionEnd}
 */
function getSelection$1(input) {
  var selection = void 0;

  if ('selectionStart' in input) {
    // Modern browser with input or textarea.
    selection = {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  } else {
    // Content editable or old IE textarea.
    selection = getOffsets(input);
  }

  return selection || { start: 0, end: 0 };
}

/**
 * @setSelection: Sets the selection bounds of a textarea or input and focuses
 * the input.
 * -@input     Set selection bounds of this input or textarea
 * -@offsets   Object of same form that is returned from get*
 */
function setSelection(input, offsets) {
  var start = offsets.start,
      end = offsets.end;

  if (end === undefined) {
    end = start;
  }

  if ('selectionStart' in input) {
    input.selectionStart = start;
    input.selectionEnd = Math.min(end, input.value.length);
  } else {
    setOffsets(input, offsets);
  }
}

var skipSelectionChangeEvent = ExecutionEnvironment.canUseDOM && 'documentMode' in document && document.documentMode <= 11;

var eventTypes$3 = {
  select: {
    phasedRegistrationNames: {
      bubbled: 'onSelect',
      captured: 'onSelectCapture'
    },
    dependencies: ['topBlur', 'topContextMenu', 'topFocus', 'topKeyDown', 'topKeyUp', 'topMouseDown', 'topMouseUp', 'topSelectionChange']
  }
};

var activeElement$1 = null;
var activeElementInst$1 = null;
var lastSelection = null;
var mouseDown = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getSelection(node) {
  if ('selectionStart' in node && hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (window.getSelection) {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent, nativeEventTarget) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement()) {
    return null;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement$1);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent$1.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement$1;

    accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }

  return null;
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {
  eventTypes: eventTypes$3,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var doc = nativeEventTarget.window === nativeEventTarget ? nativeEventTarget.document : nativeEventTarget.nodeType === DOCUMENT_NODE ? nativeEventTarget : nativeEventTarget.ownerDocument;
    // Track whether all listeners exists for this plugin. If none exist, we do
    // not extract events. See #3639.
    if (!doc || !isListeningToAllDependencies('onSelect', doc)) {
      return null;
    }

    var targetNode = targetInst ? getNodeFromInstance$1(targetInst) : window;

    switch (topLevelType) {
      // Track the input node that has focus.
      case 'topFocus':
        if (isTextInputElement(targetNode) || targetNode.contentEditable === 'true') {
          activeElement$1 = targetNode;
          activeElementInst$1 = targetInst;
          lastSelection = null;
        }
        break;
      case 'topBlur':
        activeElement$1 = null;
        activeElementInst$1 = null;
        lastSelection = null;
        break;
      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case 'topMouseDown':
        mouseDown = true;
        break;
      case 'topContextMenu':
      case 'topMouseUp':
        mouseDown = false;
        return constructSelectEvent(nativeEvent, nativeEventTarget);
      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't). IE's event fires out of order with respect
      // to key and input events on deletion, so we discard it.
      //
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      // This is also our approach for IE handling, for the reason above.
      case 'topSelectionChange':
        if (skipSelectionChangeEvent) {
          break;
        }
      // falls through
      case 'topKeyDown':
      case 'topKeyUp':
        return constructSelectEvent(nativeEvent, nativeEventTarget);
    }

    return null;
  }
};

/**
 * @interface Event
 * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
 */
var AnimationEventInterface = {
  animationName: null,
  elapsedTime: null,
  pseudoElement: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticAnimationEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent$1.augmentClass(SyntheticAnimationEvent, AnimationEventInterface);

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: function (event) {
    return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent$1.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {number} Normalized `charCode` property.
 */
function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode;

    // FF does not set `charCode` for the Enter-key, check against `keyCode`.
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  }

  // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  Esc: 'Escape',
  Spacebar: ' ',
  Left: 'ArrowLeft',
  Up: 'ArrowUp',
  Right: 'ArrowRight',
  Down: 'ArrowDown',
  Del: 'Delete',
  Win: 'OS',
  Menu: 'ContextMenu',
  Apps: 'ContextMenu',
  Scroll: 'ScrollLock',
  MozPrintableKey: 'Unidentified'
};

/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
  '8': 'Backspace',
  '9': 'Tab',
  '12': 'Clear',
  '13': 'Enter',
  '16': 'Shift',
  '17': 'Control',
  '18': 'Alt',
  '19': 'Pause',
  '20': 'CapsLock',
  '27': 'Escape',
  '32': ' ',
  '33': 'PageUp',
  '34': 'PageDown',
  '35': 'End',
  '36': 'Home',
  '37': 'ArrowLeft',
  '38': 'ArrowUp',
  '39': 'ArrowRight',
  '40': 'ArrowDown',
  '45': 'Insert',
  '46': 'Delete',
  '112': 'F1',
  '113': 'F2',
  '114': 'F3',
  '115': 'F4',
  '116': 'F5',
  '117': 'F6',
  '118': 'F7',
  '119': 'F8',
  '120': 'F9',
  '121': 'F10',
  '122': 'F11',
  '123': 'F12',
  '144': 'NumLock',
  '145': 'ScrollLock',
  '224': 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.

    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== 'Unidentified') {
      return key;
    }
  }

  // Browser does not implement `key`, polyfill as much of it as we can.
  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent);

    // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }
  return '';
}

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function (event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.

    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    return 0;
  },
  keyCode: function (event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.

    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  },
  which: function (event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var DragEventInterface = {
  dataTransfer: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

/**
 * @interface Event
 * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
 * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
 */
var TransitionEventInterface = {
  propertyName: null,
  elapsedTime: null,
  pseudoElement: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticTransitionEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticEvent$1.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticEvent$1.augmentClass(SyntheticTransitionEvent, TransitionEventInterface);

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function (event) {
    return 'deltaX' in event ? event.deltaX : // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
    'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
  },
  deltaY: function (event) {
    return 'deltaY' in event ? event.deltaY : // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
    'wheelDeltaY' in event ? -event.wheelDeltaY : // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
    'wheelDelta' in event ? -event.wheelDelta : 0;
  },
  deltaZ: null,

  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
  return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

/**
 * Turns
 * ['abort', ...]
 * into
 * eventTypes = {
 *   'abort': {
 *     phasedRegistrationNames: {
 *       bubbled: 'onAbort',
 *       captured: 'onAbortCapture',
 *     },
 *     dependencies: ['topAbort'],
 *   },
 *   ...
 * };
 * topLevelEventsToDispatchConfig = {
 *   'topAbort': { sameConfig }
 * };
 */
var eventTypes$4 = {};
var topLevelEventsToDispatchConfig = {};
['abort', 'animationEnd', 'animationIteration', 'animationStart', 'blur', 'cancel', 'canPlay', 'canPlayThrough', 'click', 'close', 'contextMenu', 'copy', 'cut', 'doubleClick', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'focus', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'progress', 'rateChange', 'reset', 'scroll', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'toggle', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart', 'transitionEnd', 'volumeChange', 'waiting', 'wheel'].forEach(function (event) {
  var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
  var onEvent = 'on' + capitalizedEvent;
  var topEvent = 'top' + capitalizedEvent;

  var type = {
    phasedRegistrationNames: {
      bubbled: onEvent,
      captured: onEvent + 'Capture'
    },
    dependencies: [topEvent]
  };
  eventTypes$4[event] = type;
  topLevelEventsToDispatchConfig[topEvent] = type;
});

// Only used in DEV for exhaustiveness validation.
var knownHTMLTopLevelTypes = ['topAbort', 'topCancel', 'topCanPlay', 'topCanPlayThrough', 'topClose', 'topDurationChange', 'topEmptied', 'topEncrypted', 'topEnded', 'topError', 'topInput', 'topInvalid', 'topLoad', 'topLoadedData', 'topLoadedMetadata', 'topLoadStart', 'topPause', 'topPlay', 'topPlaying', 'topProgress', 'topRateChange', 'topReset', 'topSeeked', 'topSeeking', 'topStalled', 'topSubmit', 'topSuspend', 'topTimeUpdate', 'topToggle', 'topVolumeChange', 'topWaiting'];

var SimpleEventPlugin = {
  eventTypes: eventTypes$4,

  extractEvents: function (topLevelType, targetInst, nativeEvent, nativeEventTarget) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case 'topKeyPress':
        // Firefox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }
      /* falls through */
      case 'topKeyDown':
      case 'topKeyUp':
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case 'topBlur':
      case 'topFocus':
        EventConstructor = SyntheticFocusEvent;
        break;
      case 'topClick':
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
      /* falls through */
      case 'topDoubleClick':
      case 'topMouseDown':
      case 'topMouseMove':
      case 'topMouseUp':
      // TODO: Disabled elements should not respond to mouse events
      /* falls through */
      case 'topMouseOut':
      case 'topMouseOver':
      case 'topContextMenu':
        EventConstructor = SyntheticMouseEvent;
        break;
      case 'topDrag':
      case 'topDragEnd':
      case 'topDragEnter':
      case 'topDragExit':
      case 'topDragLeave':
      case 'topDragOver':
      case 'topDragStart':
      case 'topDrop':
        EventConstructor = SyntheticDragEvent;
        break;
      case 'topTouchCancel':
      case 'topTouchEnd':
      case 'topTouchMove':
      case 'topTouchStart':
        EventConstructor = SyntheticTouchEvent;
        break;
      case 'topAnimationEnd':
      case 'topAnimationIteration':
      case 'topAnimationStart':
        EventConstructor = SyntheticAnimationEvent;
        break;
      case 'topTransitionEnd':
        EventConstructor = SyntheticTransitionEvent;
        break;
      case 'topScroll':
        EventConstructor = SyntheticUIEvent;
        break;
      case 'topWheel':
        EventConstructor = SyntheticWheelEvent;
        break;
      case 'topCopy':
      case 'topCut':
      case 'topPaste':
        EventConstructor = SyntheticClipboardEvent;
        break;
      default:
        {
          if (knownHTMLTopLevelTypes.indexOf(topLevelType) === -1) {
            warning(false, 'SimpleEventPlugin: Unhandled event type, `%s`. This warning ' + 'is likely caused by a bug in React. Please file an issue.', topLevelType);
          }
        }
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent$1;
        break;
    }
    var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
    accumulateTwoPhaseDispatches(event);
    return event;
  }
};

setHandleTopLevel(handleTopLevel);

/**
 * Inject modules for resolving DOM hierarchy and plugin ordering.
 */
injection$1.injectEventPluginOrder(DOMEventPluginOrder);
injection$2.injectComponentTree(ReactDOMComponentTree);

/**
 * Some important event plugins included by default (without having to require
 * them).
 */
injection$1.injectEventPluginsByName({
  SimpleEventPlugin: SimpleEventPlugin,
  EnterLeaveEventPlugin: EnterLeaveEventPlugin,
  ChangeEventPlugin: ChangeEventPlugin,
  SelectEventPlugin: SelectEventPlugin,
  BeforeInputEventPlugin: BeforeInputEventPlugin
});

var enableAsyncSubtreeAPI = true;
var enableAsyncSchedulingByDefaultInReactDOM = false;
// Exports ReactDOM.createRoot
var enableCreateRoot = false;
var enableUserTimingAPI = true;

// Mutating mode (React DOM, React ART, React Native):
var enableMutatingReconciler = true;
// Experimental noop mode (currently unused):
var enableNoopReconciler = false;
// Experimental persistent mode (CS):
var enablePersistentReconciler = false;

// Helps identify side effects in begin-phase lifecycle hooks and setState reducers:
var debugRenderPhaseSideEffects = false;

// Only used in www builds.

var valueStack = [];

{
  var fiberStack = [];
}

var index = -1;

function createCursor(defaultValue) {
  return {
    current: defaultValue
  };
}



function pop(cursor, fiber) {
  if (index < 0) {
    {
      warning(false, 'Unexpected pop.');
    }
    return;
  }

  {
    if (fiber !== fiberStack[index]) {
      warning(false, 'Unexpected Fiber popped.');
    }
  }

  cursor.current = valueStack[index];

  valueStack[index] = null;

  {
    fiberStack[index] = null;
  }

  index--;
}

function push(cursor, value, fiber) {
  index++;

  valueStack[index] = cursor.current;

  {
    fiberStack[index] = fiber;
  }

  cursor.current = value;
}

function reset$1() {
  while (index > -1) {
    valueStack[index] = null;

    {
      fiberStack[index] = null;
    }

    index--;
  }
}

var describeComponentFrame = function (name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
};

function describeFiber(fiber) {
  switch (fiber.tag) {
    case IndeterminateComponent:
    case FunctionalComponent:
    case ClassComponent:
    case HostComponent:
      var owner = fiber._debugOwner;
      var source = fiber._debugSource;
      var name = getComponentName(fiber);
      var ownerName = null;
      if (owner) {
        ownerName = getComponentName(owner);
      }
      return describeComponentFrame(name, source, ownerName);
    default:
      return '';
  }
}

// This function can only be called with a work-in-progress fiber and
// only during begin or complete phase. Do not call it under any other
// circumstances.
function getStackAddendumByWorkInProgressFiber(workInProgress) {
  var info = '';
  var node = workInProgress;
  do {
    info += describeFiber(node);
    // Otherwise this return pointer might point to the wrong tree:
    node = node['return'];
  } while (node);
  return info;
}

function getCurrentFiberOwnerName() {
  {
    var fiber = ReactDebugCurrentFiber.current;
    if (fiber === null) {
      return null;
    }
    var owner = fiber._debugOwner;
    if (owner !== null && typeof owner !== 'undefined') {
      return getComponentName(owner);
    }
  }
  return null;
}

function getCurrentFiberStackAddendum() {
  {
    var fiber = ReactDebugCurrentFiber.current;
    if (fiber === null) {
      return null;
    }
    // Safe because if current fiber exists, we are reconciling,
    // and it is guaranteed to be the work-in-progress version.
    return getStackAddendumByWorkInProgressFiber(fiber);
  }
  return null;
}

function resetCurrentFiber() {
  ReactDebugCurrentFrame.getCurrentStack = null;
  ReactDebugCurrentFiber.current = null;
  ReactDebugCurrentFiber.phase = null;
}

function setCurrentFiber(fiber) {
  ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackAddendum;
  ReactDebugCurrentFiber.current = fiber;
  ReactDebugCurrentFiber.phase = null;
}

function setCurrentPhase(phase) {
  ReactDebugCurrentFiber.phase = phase;
}

var ReactDebugCurrentFiber = {
  current: null,
  phase: null,
  resetCurrentFiber: resetCurrentFiber,
  setCurrentFiber: setCurrentFiber,
  setCurrentPhase: setCurrentPhase,
  getCurrentFiberOwnerName: getCurrentFiberOwnerName,
  getCurrentFiberStackAddendum: getCurrentFiberStackAddendum
};

// Prefix measurements so that it's possible to filter them.
// Longer prefixes are hard to read in DevTools.
var reactEmoji = '\u269B';
var warningEmoji = '\u26D4';
var supportsUserTiming = typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

// Keep track of current fiber so that we know the path to unwind on pause.
// TODO: this looks the same as nextUnitOfWork in scheduler. Can we unify them?
var currentFiber = null;
// If we're in the middle of user code, which fiber and method is it?
// Reusing `currentFiber` would be confusing for this because user code fiber
// can change during commit phase too, but we don't need to unwind it (since
// lifecycles in the commit phase don't resemble a tree).
var currentPhase = null;
var currentPhaseFiber = null;
// Did lifecycle hook schedule an update? This is often a performance problem,
// so we will keep track of it, and include it in the report.
// Track commits caused by cascading updates.
var isCommitting = false;
var hasScheduledUpdateInCurrentCommit = false;
var hasScheduledUpdateInCurrentPhase = false;
var commitCountInCurrentWorkLoop = 0;
var effectCountInCurrentCommit = 0;
var isWaitingForCallback = false;
// During commits, we only show a measurement once per method name
// to avoid stretch the commit phase with measurement overhead.
var labelsInCurrentCommit = new Set();

var formatMarkName = function (markName) {
  return reactEmoji + ' ' + markName;
};

var formatLabel = function (label, warning$$1) {
  var prefix = warning$$1 ? warningEmoji + ' ' : reactEmoji + ' ';
  var suffix = warning$$1 ? ' Warning: ' + warning$$1 : '';
  return '' + prefix + label + suffix;
};

var beginMark = function (markName) {
  performance.mark(formatMarkName(markName));
};

var clearMark = function (markName) {
  performance.clearMarks(formatMarkName(markName));
};

var endMark = function (label, markName, warning$$1) {
  var formattedMarkName = formatMarkName(markName);
  var formattedLabel = formatLabel(label, warning$$1);
  try {
    performance.measure(formattedLabel, formattedMarkName);
  } catch (err) {}
  // If previous mark was missing for some reason, this will throw.
  // This could only happen if React crashed in an unexpected place earlier.
  // Don't pile on with more errors.

  // Clear marks immediately to avoid growing buffer.
  performance.clearMarks(formattedMarkName);
  performance.clearMeasures(formattedLabel);
};

var getFiberMarkName = function (label, debugID) {
  return label + ' (#' + debugID + ')';
};

var getFiberLabel = function (componentName, isMounted, phase) {
  if (phase === null) {
    // These are composite component total time measurements.
    return componentName + ' [' + (isMounted ? 'update' : 'mount') + ']';
  } else {
    // Composite component methods.
    return componentName + '.' + phase;
  }
};

var beginFiberMark = function (fiber, phase) {
  var componentName = getComponentName(fiber) || 'Unknown';
  var debugID = fiber._debugID;
  var isMounted = fiber.alternate !== null;
  var label = getFiberLabel(componentName, isMounted, phase);

  if (isCommitting && labelsInCurrentCommit.has(label)) {
    // During the commit phase, we don't show duplicate labels because
    // there is a fixed overhead for every measurement, and we don't
    // want to stretch the commit phase beyond necessary.
    return false;
  }
  labelsInCurrentCommit.add(label);

  var markName = getFiberMarkName(label, debugID);
  beginMark(markName);
  return true;
};

var clearFiberMark = function (fiber, phase) {
  var componentName = getComponentName(fiber) || 'Unknown';
  var debugID = fiber._debugID;
  var isMounted = fiber.alternate !== null;
  var label = getFiberLabel(componentName, isMounted, phase);
  var markName = getFiberMarkName(label, debugID);
  clearMark(markName);
};

var endFiberMark = function (fiber, phase, warning$$1) {
  var componentName = getComponentName(fiber) || 'Unknown';
  var debugID = fiber._debugID;
  var isMounted = fiber.alternate !== null;
  var label = getFiberLabel(componentName, isMounted, phase);
  var markName = getFiberMarkName(label, debugID);
  endMark(label, markName, warning$$1);
};

var shouldIgnoreFiber = function (fiber) {
  // Host components should be skipped in the timeline.
  // We could check typeof fiber.type, but does this work with RN?
  switch (fiber.tag) {
    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case ReturnComponent:
    case Fragment:
      return true;
    default:
      return false;
  }
};

var clearPendingPhaseMeasurement = function () {
  if (currentPhase !== null && currentPhaseFiber !== null) {
    clearFiberMark(currentPhaseFiber, currentPhase);
  }
  currentPhaseFiber = null;
  currentPhase = null;
  hasScheduledUpdateInCurrentPhase = false;
};

var pauseTimers = function () {
  // Stops all currently active measurements so that they can be resumed
  // if we continue in a later deferred loop from the same unit of work.
  var fiber = currentFiber;
  while (fiber) {
    if (fiber._debugIsCurrentlyTiming) {
      endFiberMark(fiber, null, null);
    }
    fiber = fiber['return'];
  }
};

var resumeTimersRecursively = function (fiber) {
  if (fiber['return'] !== null) {
    resumeTimersRecursively(fiber['return']);
  }
  if (fiber._debugIsCurrentlyTiming) {
    beginFiberMark(fiber, null);
  }
};

var resumeTimers = function () {
  // Resumes all measurements that were active during the last deferred loop.
  if (currentFiber !== null) {
    resumeTimersRecursively(currentFiber);
  }
};

function recordEffect() {
  if (enableUserTimingAPI) {
    effectCountInCurrentCommit++;
  }
}

function recordScheduleUpdate() {
  if (enableUserTimingAPI) {
    if (isCommitting) {
      hasScheduledUpdateInCurrentCommit = true;
    }
    if (currentPhase !== null && currentPhase !== 'componentWillMount' && currentPhase !== 'componentWillReceiveProps') {
      hasScheduledUpdateInCurrentPhase = true;
    }
  }
}

function startRequestCallbackTimer() {
  if (enableUserTimingAPI) {
    if (supportsUserTiming && !isWaitingForCallback) {
      isWaitingForCallback = true;
      beginMark('(Waiting for async callback...)');
    }
  }
}

function stopRequestCallbackTimer(didExpire) {
  if (enableUserTimingAPI) {
    if (supportsUserTiming) {
      isWaitingForCallback = false;
      var warning$$1 = didExpire ? 'React was blocked by main thread' : null;
      endMark('(Waiting for async callback...)', '(Waiting for async callback...)', warning$$1);
    }
  }
}

function startWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    }
    // If we pause, this is the fiber to unwind from.
    currentFiber = fiber;
    if (!beginFiberMark(fiber, null)) {
      return;
    }
    fiber._debugIsCurrentlyTiming = true;
  }
}

function cancelWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    }
    // Remember we shouldn't complete measurement for this fiber.
    // Otherwise flamechart will be deep even for small updates.
    fiber._debugIsCurrentlyTiming = false;
    clearFiberMark(fiber, null);
  }
}

function stopWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    }
    // If we pause, its parent is the fiber to unwind from.
    currentFiber = fiber['return'];
    if (!fiber._debugIsCurrentlyTiming) {
      return;
    }
    fiber._debugIsCurrentlyTiming = false;
    endFiberMark(fiber, null, null);
  }
}

function stopFailedWorkTimer(fiber) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming || shouldIgnoreFiber(fiber)) {
      return;
    }
    // If we pause, its parent is the fiber to unwind from.
    currentFiber = fiber['return'];
    if (!fiber._debugIsCurrentlyTiming) {
      return;
    }
    fiber._debugIsCurrentlyTiming = false;
    var warning$$1 = 'An error was thrown inside this error boundary';
    endFiberMark(fiber, null, warning$$1);
  }
}

function startPhaseTimer(fiber, phase) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    clearPendingPhaseMeasurement();
    if (!beginFiberMark(fiber, phase)) {
      return;
    }
    currentPhaseFiber = fiber;
    currentPhase = phase;
  }
}

function stopPhaseTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    if (currentPhase !== null && currentPhaseFiber !== null) {
      var warning$$1 = hasScheduledUpdateInCurrentPhase ? 'Scheduled a cascading update' : null;
      endFiberMark(currentPhaseFiber, currentPhase, warning$$1);
    }
    currentPhase = null;
    currentPhaseFiber = null;
  }
}

function startWorkLoopTimer(nextUnitOfWork) {
  if (enableUserTimingAPI) {
    currentFiber = nextUnitOfWork;
    if (!supportsUserTiming) {
      return;
    }
    commitCountInCurrentWorkLoop = 0;
    // This is top level call.
    // Any other measurements are performed within.
    beginMark('(React Tree Reconciliation)');
    // Resume any measurements that were in progress during the last loop.
    resumeTimers();
  }
}

function stopWorkLoopTimer(interruptedBy) {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    var warning$$1 = null;
    if (interruptedBy !== null) {
      if (interruptedBy.tag === HostRoot) {
        warning$$1 = 'A top-level update interrupted the previous render';
      } else {
        var componentName = getComponentName(interruptedBy) || 'Unknown';
        warning$$1 = 'An update to ' + componentName + ' interrupted the previous render';
      }
    } else if (commitCountInCurrentWorkLoop > 1) {
      warning$$1 = 'There were cascading updates';
    }
    commitCountInCurrentWorkLoop = 0;
    // Pause any measurements until the next loop.
    pauseTimers();
    endMark('(React Tree Reconciliation)', '(React Tree Reconciliation)', warning$$1);
  }
}

function startCommitTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    isCommitting = true;
    hasScheduledUpdateInCurrentCommit = false;
    labelsInCurrentCommit.clear();
    beginMark('(Committing Changes)');
  }
}

function stopCommitTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }

    var warning$$1 = null;
    if (hasScheduledUpdateInCurrentCommit) {
      warning$$1 = 'Lifecycle hook scheduled a cascading update';
    } else if (commitCountInCurrentWorkLoop > 0) {
      warning$$1 = 'Caused by a cascading update in earlier commit';
    }
    hasScheduledUpdateInCurrentCommit = false;
    commitCountInCurrentWorkLoop++;
    isCommitting = false;
    labelsInCurrentCommit.clear();

    endMark('(Committing Changes)', '(Committing Changes)', warning$$1);
  }
}

function startCommitHostEffectsTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    effectCountInCurrentCommit = 0;
    beginMark('(Committing Host Effects)');
  }
}

function stopCommitHostEffectsTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    var count = effectCountInCurrentCommit;
    effectCountInCurrentCommit = 0;
    endMark('(Committing Host Effects: ' + count + ' Total)', '(Committing Host Effects)', null);
  }
}

function startCommitLifeCyclesTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    effectCountInCurrentCommit = 0;
    beginMark('(Calling Lifecycle Methods)');
  }
}

function stopCommitLifeCyclesTimer() {
  if (enableUserTimingAPI) {
    if (!supportsUserTiming) {
      return;
    }
    var count = effectCountInCurrentCommit;
    effectCountInCurrentCommit = 0;
    endMark('(Calling Lifecycle Methods: ' + count + ' Total)', '(Calling Lifecycle Methods)', null);
  }
}

{
  var warnedAboutMissingGetChildContext = {};
}

// A cursor to the current merged context object on the stack.
var contextStackCursor = createCursor(emptyObject);
// A cursor to a boolean indicating whether the context has changed.
var didPerformWorkStackCursor = createCursor(false);
// Keep track of the previous context object that was on the stack.
// We use this to get access to the parent context after we have already
// pushed the next context provider, and now need to merge their contexts.
var previousContext = emptyObject;

function getUnmaskedContext(workInProgress) {
  var hasOwnContext = isContextProvider(workInProgress);
  if (hasOwnContext) {
    // If the fiber is a context provider itself, when we read its context
    // we have already pushed its own child context on the stack. A context
    // provider should not "see" its own child context. Therefore we read the
    // previous (parent) context instead for a context provider.
    return previousContext;
  }
  return contextStackCursor.current;
}

function cacheContext(workInProgress, unmaskedContext, maskedContext) {
  var instance = workInProgress.stateNode;
  instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
  instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
}

function getMaskedContext(workInProgress, unmaskedContext) {
  var type = workInProgress.type;
  var contextTypes = type.contextTypes;
  if (!contextTypes) {
    return emptyObject;
  }

  // Avoid recreating masked context unless unmasked context has changed.
  // Failing to do this will result in unnecessary calls to componentWillReceiveProps.
  // This may trigger infinite loops if componentWillReceiveProps calls setState.
  var instance = workInProgress.stateNode;
  if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
    return instance.__reactInternalMemoizedMaskedChildContext;
  }

  var context = {};
  for (var key in contextTypes) {
    context[key] = unmaskedContext[key];
  }

  {
    var name = getComponentName(workInProgress) || 'Unknown';
    checkPropTypes(contextTypes, context, 'context', name, ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
  }

  // Cache unmasked context so we can avoid recreating masked context unless necessary.
  // Context is created before the class component is instantiated so check for instance.
  if (instance) {
    cacheContext(workInProgress, unmaskedContext, context);
  }

  return context;
}

function hasContextChanged() {
  return didPerformWorkStackCursor.current;
}

function isContextConsumer(fiber) {
  return fiber.tag === ClassComponent && fiber.type.contextTypes != null;
}

function isContextProvider(fiber) {
  return fiber.tag === ClassComponent && fiber.type.childContextTypes != null;
}

function popContextProvider(fiber) {
  if (!isContextProvider(fiber)) {
    return;
  }

  pop(didPerformWorkStackCursor, fiber);
  pop(contextStackCursor, fiber);
}

function popTopLevelContextObject(fiber) {
  pop(didPerformWorkStackCursor, fiber);
  pop(contextStackCursor, fiber);
}

function pushTopLevelContextObject(fiber, context, didChange) {
  !(contextStackCursor.cursor == null) ? invariant(false, 'Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.') : void 0;

  push(contextStackCursor, context, fiber);
  push(didPerformWorkStackCursor, didChange, fiber);
}

function processChildContext(fiber, parentContext) {
  var instance = fiber.stateNode;
  var childContextTypes = fiber.type.childContextTypes;

  // TODO (bvaughn) Replace this behavior with an invariant() in the future.
  // It has only been added in Fiber to match the (unintentional) behavior in Stack.
  if (typeof instance.getChildContext !== 'function') {
    {
      var componentName = getComponentName(fiber) || 'Unknown';

      if (!warnedAboutMissingGetChildContext[componentName]) {
        warnedAboutMissingGetChildContext[componentName] = true;
        warning(false, '%s.childContextTypes is specified but there is no getChildContext() method ' + 'on the instance. You can either define getChildContext() on %s or remove ' + 'childContextTypes from it.', componentName, componentName);
      }
    }
    return parentContext;
  }

  var childContext = void 0;
  {
    ReactDebugCurrentFiber.setCurrentPhase('getChildContext');
  }
  startPhaseTimer(fiber, 'getChildContext');
  childContext = instance.getChildContext();
  stopPhaseTimer();
  {
    ReactDebugCurrentFiber.setCurrentPhase(null);
  }
  for (var contextKey in childContext) {
    !(contextKey in childContextTypes) ? invariant(false, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(fiber) || 'Unknown', contextKey) : void 0;
  }
  {
    var name = getComponentName(fiber) || 'Unknown';
    checkPropTypes(childContextTypes, childContext, 'child context', name,
    // In practice, there is one case in which we won't get a stack. It's when
    // somebody calls unstable_renderSubtreeIntoContainer() and we process
    // context from the parent component instance. The stack will be missing
    // because it's outside of the reconciliation, and so the pointer has not
    // been set. This is rare and doesn't matter. We'll also remove that API.
    ReactDebugCurrentFiber.getCurrentFiberStackAddendum);
  }

  return _assign({}, parentContext, childContext);
}

function pushContextProvider(workInProgress) {
  if (!isContextProvider(workInProgress)) {
    return false;
  }

  var instance = workInProgress.stateNode;
  // We push the context as early as possible to ensure stack integrity.
  // If the instance does not exist yet, we will push null at first,
  // and replace it on the stack later when invalidating the context.
  var memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyObject;

  // Remember the parent context so we can merge with it later.
  // Inherit the parent's did-perform-work value to avoid inadvertently blocking updates.
  previousContext = contextStackCursor.current;
  push(contextStackCursor, memoizedMergedChildContext, workInProgress);
  push(didPerformWorkStackCursor, didPerformWorkStackCursor.current, workInProgress);

  return true;
}

function invalidateContextProvider(workInProgress, didChange) {
  var instance = workInProgress.stateNode;
  !instance ? invariant(false, 'Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.') : void 0;

  if (didChange) {
    // Merge parent and own context.
    // Skip this if we're not updating due to sCU.
    // This avoids unnecessarily recomputing memoized values.
    var mergedContext = processChildContext(workInProgress, previousContext);
    instance.__reactInternalMemoizedMergedChildContext = mergedContext;

    // Replace the old (or empty) context with the new one.
    // It is important to unwind the context in the reverse order.
    pop(didPerformWorkStackCursor, workInProgress);
    pop(contextStackCursor, workInProgress);
    // Now push the new context and mark that it has changed.
    push(contextStackCursor, mergedContext, workInProgress);
    push(didPerformWorkStackCursor, didChange, workInProgress);
  } else {
    pop(didPerformWorkStackCursor, workInProgress);
    push(didPerformWorkStackCursor, didChange, workInProgress);
  }
}

function resetContext() {
  previousContext = emptyObject;
  contextStackCursor.current = emptyObject;
  didPerformWorkStackCursor.current = false;
}

function findCurrentUnmaskedContext(fiber) {
  // Currently this is only used with renderSubtreeIntoContainer; not sure if it
  // makes sense elsewhere
  !(isFiberMounted(fiber) && fiber.tag === ClassComponent) ? invariant(false, 'Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.') : void 0;

  var node = fiber;
  while (node.tag !== HostRoot) {
    if (isContextProvider(node)) {
      return node.stateNode.__reactInternalMemoizedMergedChildContext;
    }
    var parent = node['return'];
    !parent ? invariant(false, 'Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    node = parent;
  }
  return node.stateNode.context;
}

var NoWork = 0; // TODO: Use an opaque type once ESLint et al support the syntax

var Sync = 1;
var Never = 2147483647; // Max int32: Math.pow(2, 31) - 1

var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = 2;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return (ms / UNIT_SIZE | 0) + MAGIC_NUMBER_OFFSET;
}

function expirationTimeToMs(expirationTime) {
  return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

function ceiling(num, precision) {
  return ((num / precision | 0) + 1) * precision;
}

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return ceiling(currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
}

var NoContext = 0;
var AsyncUpdates = 1;

{
  var hasBadMapPolyfill = false;
  try {
    var nonExtensibleObject = Object.preventExtensions({});
    /* eslint-disable no-new */
    
    /* eslint-enable no-new */
  } catch (e) {
    // TODO: Consider warning about bad polyfills
    hasBadMapPolyfill = true;
  }
}

// A Fiber is work on a Component that needs to be done or was done. There can
// be more than one per component.


{
  var debugCounter = 1;
}

function FiberNode(tag, key, internalContextTag) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this['return'] = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = null;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;

  this.internalContextTag = internalContextTag;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;

  this.alternate = null;

  {
    this._debugID = debugCounter++;
    this._debugSource = null;
    this._debugOwner = null;
    this._debugIsCurrentlyTiming = false;
    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}

// This is a constructor function, rather than a POJO constructor, still
// please ensure we do the following:
// 1) Nobody should add any instance methods on this. Instance methods can be
//    more difficult to predict when they get optimized and they are almost
//    never inlined properly in static compilers.
// 2) Nobody should rely on `instanceof Fiber` for type testing. We should
//    always know when it is a fiber.
// 3) We might want to experiment with using numeric keys since they are easier
//    to optimize in a non-JIT environment.
// 4) We can easily go from a constructor to a createFiber object literal if that
//    is faster.
// 5) It should be easy to port this to a C struct and keep a C implementation
//    compatible.
var createFiber = function (tag, key, internalContextTag) {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, key, internalContextTag);
};

function shouldConstruct(Component) {
  return !!(Component.prototype && Component.prototype.isReactComponent);
}

// This is used to create an alternate fiber to do work on.
function createWorkInProgress(current, pendingProps, expirationTime) {
  var workInProgress = current.alternate;
  if (workInProgress === null) {
    // We use a double buffering pooling technique because we know that we'll
    // only ever need at most two versions of a tree. We pool the "other" unused
    // node that we're free to reuse. This is lazily created to avoid allocating
    // extra objects for things that are never updated. It also allow us to
    // reclaim the extra memory if needed.
    workInProgress = createFiber(current.tag, current.key, current.internalContextTag);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    {
      // DEV-only fields
      workInProgress._debugID = current._debugID;
      workInProgress._debugSource = current._debugSource;
      workInProgress._debugOwner = current._debugOwner;
    }

    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // We already have an alternate.
    // Reset the effect tag.
    workInProgress.effectTag = NoEffect;

    // The effect list is no longer valid.
    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;
  }

  workInProgress.expirationTime = expirationTime;
  workInProgress.pendingProps = pendingProps;

  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  // These will be overridden during the parent's reconciliation
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  return workInProgress;
}

function createHostRootFiber() {
  var fiber = createFiber(HostRoot, null, NoContext);
  return fiber;
}

function createFiberFromElement(element, internalContextTag, expirationTime) {
  var owner = null;
  {
    owner = element._owner;
  }

  var fiber = void 0;
  var type = element.type,
      key = element.key;

  if (typeof type === 'function') {
    fiber = shouldConstruct(type) ? createFiber(ClassComponent, key, internalContextTag) : createFiber(IndeterminateComponent, key, internalContextTag);
    fiber.type = type;
    fiber.pendingProps = element.props;
  } else if (typeof type === 'string') {
    fiber = createFiber(HostComponent, key, internalContextTag);
    fiber.type = type;
    fiber.pendingProps = element.props;
  } else if (typeof type === 'object' && type !== null && typeof type.tag === 'number') {
    // Currently assumed to be a continuation and therefore is a fiber already.
    // TODO: The yield system is currently broken for updates in some cases.
    // The reified yield stores a fiber, but we don't know which fiber that is;
    // the current or a workInProgress? When the continuation gets rendered here
    // we don't know if we can reuse that fiber or if we need to clone it.
    // There is probably a clever way to restructure this.
    fiber = type;
    fiber.pendingProps = element.props;
  } else {
    var info = '';
    {
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }
      var ownerName = owner ? getComponentName(owner) : null;
      if (ownerName) {
        info += '\n\nCheck the render method of `' + ownerName + '`.';
      }
    }
    invariant(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', type == null ? type : typeof type, info);
  }

  {
    fiber._debugSource = element._source;
    fiber._debugOwner = element._owner;
  }

  fiber.expirationTime = expirationTime;

  return fiber;
}

function createFiberFromFragment(elements, internalContextTag, expirationTime, key) {
  var fiber = createFiber(Fragment, key, internalContextTag);
  fiber.pendingProps = elements;
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromText(content, internalContextTag, expirationTime) {
  var fiber = createFiber(HostText, null, internalContextTag);
  fiber.pendingProps = content;
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromHostInstanceForDeletion() {
  var fiber = createFiber(HostComponent, null, NoContext);
  fiber.type = 'DELETED';
  return fiber;
}

function createFiberFromCall(call, internalContextTag, expirationTime) {
  var fiber = createFiber(CallComponent, call.key, internalContextTag);
  fiber.type = call.handler;
  fiber.pendingProps = call;
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromReturn(returnNode, internalContextTag, expirationTime) {
  var fiber = createFiber(ReturnComponent, null, internalContextTag);
  fiber.expirationTime = expirationTime;
  return fiber;
}

function createFiberFromPortal(portal, internalContextTag, expirationTime) {
  var fiber = createFiber(HostPortal, portal.key, internalContextTag);
  fiber.pendingProps = portal.children || [];
  fiber.expirationTime = expirationTime;
  fiber.stateNode = {
    containerInfo: portal.containerInfo,
    pendingChildren: null, // Used by persistent updates
    implementation: portal.implementation
  };
  return fiber;
}

function createFiberRoot(containerInfo, hydrate) {
  // Cyclic construction. This cheats the type system right now because
  // stateNode is any.
  var uninitializedFiber = createHostRootFiber();
  var root = {
    current: uninitializedFiber,
    containerInfo: containerInfo,
    pendingChildren: null,
    remainingExpirationTime: NoWork,
    isReadyForCommit: false,
    finishedWork: null,
    context: null,
    pendingContext: null,
    hydrate: hydrate,
    nextScheduledRoot: null
  };
  uninitializedFiber.stateNode = root;
  return root;
}

var onCommitFiberRoot = null;
var onCommitFiberUnmount = null;
var hasLoggedError = false;

function catchErrors(fn) {
  return function (arg) {
    try {
      return fn(arg);
    } catch (err) {
      if (true && !hasLoggedError) {
        hasLoggedError = true;
        warning(false, 'React DevTools encountered an error: %s', err);
      }
    }
  };
}

function injectInternals(internals) {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
    // No DevTools
    return false;
  }
  var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.isDisabled) {
    // This isn't a real property on the hook, but it can be set to opt out
    // of DevTools integration and associated warnings and logs.
    // https://github.com/facebook/react/issues/3877
    return true;
  }
  if (!hook.supportsFiber) {
    {
      warning(false, 'The installed version of React DevTools is too old and will not work ' + 'with the current version of React. Please update React DevTools. ' + 'https://fb.me/react-devtools');
    }
    // DevTools exists, even though it doesn't support Fiber.
    return true;
  }
  try {
    var rendererID = hook.inject(internals);
    // We have successfully injected, so now it is safe to set up hooks.
    onCommitFiberRoot = catchErrors(function (root) {
      return hook.onCommitFiberRoot(rendererID, root);
    });
    onCommitFiberUnmount = catchErrors(function (fiber) {
      return hook.onCommitFiberUnmount(rendererID, fiber);
    });
  } catch (err) {
    // Catch all errors because it is unsafe to throw during initialization.
    {
      warning(false, 'React DevTools encountered an error: %s.', err);
    }
  }
  // DevTools exists
  return true;
}

function onCommitRoot(root) {
  if (typeof onCommitFiberRoot === 'function') {
    onCommitFiberRoot(root);
  }
}

function onCommitUnmount(fiber) {
  if (typeof onCommitFiberUnmount === 'function') {
    onCommitFiberUnmount(fiber);
  }
}

{
  var didWarnUpdateInsideUpdate = false;
}

// Callbacks are not validated until invocation


// Singly linked-list of updates. When an update is scheduled, it is added to
// the queue of the current fiber and the work-in-progress fiber. The two queues
// are separate but they share a persistent structure.
//
// During reconciliation, updates are removed from the work-in-progress fiber,
// but they remain on the current fiber. That ensures that if a work-in-progress
// is aborted, the aborted updates are recovered by cloning from current.
//
// The work-in-progress queue is always a subset of the current queue.
//
// When the tree is committed, the work-in-progress becomes the current.


function createUpdateQueue(baseState) {
  var queue = {
    baseState: baseState,
    expirationTime: NoWork,
    first: null,
    last: null,
    callbackList: null,
    hasForceUpdate: false,
    isInitialized: false
  };
  {
    queue.isProcessing = false;
  }
  return queue;
}

function insertUpdateIntoQueue(queue, update) {
  // Append the update to the end of the list.
  if (queue.last === null) {
    // Queue is empty
    queue.first = queue.last = update;
  } else {
    queue.last.next = update;
    queue.last = update;
  }
  if (queue.expirationTime === NoWork || queue.expirationTime > update.expirationTime) {
    queue.expirationTime = update.expirationTime;
  }
}

function insertUpdateIntoFiber(fiber, update) {
  // We'll have at least one and at most two distinct update queues.
  var alternateFiber = fiber.alternate;
  var queue1 = fiber.updateQueue;
  if (queue1 === null) {
    // TODO: We don't know what the base state will be until we begin work.
    // It depends on which fiber is the next current. Initialize with an empty
    // base state, then set to the memoizedState when rendering. Not super
    // happy with this approach.
    queue1 = fiber.updateQueue = createUpdateQueue(null);
  }

  var queue2 = void 0;
  if (alternateFiber !== null) {
    queue2 = alternateFiber.updateQueue;
    if (queue2 === null) {
      queue2 = alternateFiber.updateQueue = createUpdateQueue(null);
    }
  } else {
    queue2 = null;
  }
  queue2 = queue2 !== queue1 ? queue2 : null;

  // Warn if an update is scheduled from inside an updater function.
  {
    if ((queue1.isProcessing || queue2 !== null && queue2.isProcessing) && !didWarnUpdateInsideUpdate) {
      warning(false, 'An update (setState, replaceState, or forceUpdate) was scheduled ' + 'from inside an update function. Update functions should be pure, ' + 'with zero side-effects. Consider using componentDidUpdate or a ' + 'callback.');
      didWarnUpdateInsideUpdate = true;
    }
  }

  // If there's only one queue, add the update to that queue and exit.
  if (queue2 === null) {
    insertUpdateIntoQueue(queue1, update);
    return;
  }

  // If either queue is empty, we need to add to both queues.
  if (queue1.last === null || queue2.last === null) {
    insertUpdateIntoQueue(queue1, update);
    insertUpdateIntoQueue(queue2, update);
    return;
  }

  // If both lists are not empty, the last update is the same for both lists
  // because of structural sharing. So, we should only append to one of
  // the lists.
  insertUpdateIntoQueue(queue1, update);
  // But we still need to update the `last` pointer of queue2.
  queue2.last = update;
}

function getUpdateExpirationTime(fiber) {
  if (fiber.tag !== ClassComponent && fiber.tag !== HostRoot) {
    return NoWork;
  }
  var updateQueue = fiber.updateQueue;
  if (updateQueue === null) {
    return NoWork;
  }
  return updateQueue.expirationTime;
}

function getStateFromUpdate(update, instance, prevState, props) {
  var partialState = update.partialState;
  if (typeof partialState === 'function') {
    var updateFn = partialState;

    // Invoke setState callback an extra time to help detect side-effects.
    if (debugRenderPhaseSideEffects) {
      updateFn.call(instance, prevState, props);
    }

    return updateFn.call(instance, prevState, props);
  } else {
    return partialState;
  }
}

function processUpdateQueue(current, workInProgress, queue, instance, props, renderExpirationTime) {
  if (current !== null && current.updateQueue === queue) {
    // We need to create a work-in-progress queue, by cloning the current queue.
    var currentQueue = queue;
    queue = workInProgress.updateQueue = {
      baseState: currentQueue.baseState,
      expirationTime: currentQueue.expirationTime,
      first: currentQueue.first,
      last: currentQueue.last,
      isInitialized: currentQueue.isInitialized,
      // These fields are no longer valid because they were already committed.
      // Reset them.
      callbackList: null,
      hasForceUpdate: false
    };
  }

  {
    // Set this flag so we can warn if setState is called inside the update
    // function of another setState.
    queue.isProcessing = true;
  }

  // Reset the remaining expiration time. If we skip over any updates, we'll
  // increase this accordingly.
  queue.expirationTime = NoWork;

  // TODO: We don't know what the base state will be until we begin work.
  // It depends on which fiber is the next current. Initialize with an empty
  // base state, then set to the memoizedState when rendering. Not super
  // happy with this approach.
  var state = void 0;
  if (queue.isInitialized) {
    state = queue.baseState;
  } else {
    state = queue.baseState = workInProgress.memoizedState;
    queue.isInitialized = true;
  }
  var dontMutatePrevState = true;
  var update = queue.first;
  var didSkip = false;
  while (update !== null) {
    var updateExpirationTime = update.expirationTime;
    if (updateExpirationTime > renderExpirationTime) {
      // This update does not have sufficient priority. Skip it.
      var remainingExpirationTime = queue.expirationTime;
      if (remainingExpirationTime === NoWork || remainingExpirationTime > updateExpirationTime) {
        // Update the remaining expiration time.
        queue.expirationTime = updateExpirationTime;
      }
      if (!didSkip) {
        didSkip = true;
        queue.baseState = state;
      }
      // Continue to the next update.
      update = update.next;
      continue;
    }

    // This update does have sufficient priority.

    // If no previous updates were skipped, drop this update from the queue by
    // advancing the head of the list.
    if (!didSkip) {
      queue.first = update.next;
      if (queue.first === null) {
        queue.last = null;
      }
    }

    // Process the update
    var _partialState = void 0;
    if (update.isReplace) {
      state = getStateFromUpdate(update, instance, state, props);
      dontMutatePrevState = true;
    } else {
      _partialState = getStateFromUpdate(update, instance, state, props);
      if (_partialState) {
        if (dontMutatePrevState) {
          // $FlowFixMe: Idk how to type this properly.
          state = _assign({}, state, _partialState);
        } else {
          state = _assign(state, _partialState);
        }
        dontMutatePrevState = false;
      }
    }
    if (update.isForced) {
      queue.hasForceUpdate = true;
    }
    if (update.callback !== null) {
      // Append to list of callbacks.
      var _callbackList = queue.callbackList;
      if (_callbackList === null) {
        _callbackList = queue.callbackList = [];
      }
      _callbackList.push(update);
    }
    update = update.next;
  }

  if (queue.callbackList !== null) {
    workInProgress.effectTag |= Callback;
  } else if (queue.first === null && !queue.hasForceUpdate) {
    // The queue is empty. We can reset it.
    workInProgress.updateQueue = null;
  }

  if (!didSkip) {
    didSkip = true;
    queue.baseState = state;
  }

  {
    // No longer processing.
    queue.isProcessing = false;
  }

  return state;
}

function commitCallbacks(queue, context) {
  var callbackList = queue.callbackList;
  if (callbackList === null) {
    return;
  }
  // Set the list to null to make sure they don't get called more than once.
  queue.callbackList = null;
  for (var i = 0; i < callbackList.length; i++) {
    var update = callbackList[i];
    var _callback = update.callback;
    // This update might be processed again. Clear the callback so it's only
    // called once.
    update.callback = null;
    !(typeof _callback === 'function') ? invariant(false, 'Invalid argument passed as callback. Expected a function. Instead received: %s', _callback) : void 0;
    _callback.call(context);
  }
}

var fakeInternalInstance = {};
var isArray = Array.isArray;

{
  var didWarnAboutStateAssignmentForComponent = {};

  var warnOnInvalidCallback = function (callback, callerName) {
    warning(callback === null || typeof callback === 'function', '%s(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callerName, callback);
  };

  // This is so gross but it's at least non-critical and can be removed if
  // it causes problems. This is meant to give a nicer error message for
  // ReactDOM15.unstable_renderSubtreeIntoContainer(reactDOM16Component,
  // ...)) which otherwise throws a "_processChildContext is not a function"
  // exception.
  Object.defineProperty(fakeInternalInstance, '_processChildContext', {
    enumerable: false,
    value: function () {
      invariant(false, '_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn\'t supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).');
    }
  });
  Object.freeze(fakeInternalInstance);
}

var ReactFiberClassComponent = function (scheduleWork, computeExpirationForFiber, memoizeProps, memoizeState) {
  // Class component state updater
  var updater = {
    isMounted: isMounted,
    enqueueSetState: function (instance, partialState, callback) {
      var fiber = get(instance);
      callback = callback === undefined ? null : callback;
      {
        warnOnInvalidCallback(callback, 'setState');
      }
      var expirationTime = computeExpirationForFiber(fiber);
      var update = {
        expirationTime: expirationTime,
        partialState: partialState,
        callback: callback,
        isReplace: false,
        isForced: false,
        nextCallback: null,
        next: null
      };
      insertUpdateIntoFiber(fiber, update);
      scheduleWork(fiber, expirationTime);
    },
    enqueueReplaceState: function (instance, state, callback) {
      var fiber = get(instance);
      callback = callback === undefined ? null : callback;
      {
        warnOnInvalidCallback(callback, 'replaceState');
      }
      var expirationTime = computeExpirationForFiber(fiber);
      var update = {
        expirationTime: expirationTime,
        partialState: state,
        callback: callback,
        isReplace: true,
        isForced: false,
        nextCallback: null,
        next: null
      };
      insertUpdateIntoFiber(fiber, update);
      scheduleWork(fiber, expirationTime);
    },
    enqueueForceUpdate: function (instance, callback) {
      var fiber = get(instance);
      callback = callback === undefined ? null : callback;
      {
        warnOnInvalidCallback(callback, 'forceUpdate');
      }
      var expirationTime = computeExpirationForFiber(fiber);
      var update = {
        expirationTime: expirationTime,
        partialState: null,
        callback: callback,
        isReplace: false,
        isForced: true,
        nextCallback: null,
        next: null
      };
      insertUpdateIntoFiber(fiber, update);
      scheduleWork(fiber, expirationTime);
    }
  };

  function checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext) {
    if (oldProps === null || workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate) {
      // If the workInProgress already has an Update effect, return true
      return true;
    }

    var instance = workInProgress.stateNode;
    var type = workInProgress.type;
    if (typeof instance.shouldComponentUpdate === 'function') {
      startPhaseTimer(workInProgress, 'shouldComponentUpdate');
      var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, newContext);
      stopPhaseTimer();

      // Simulate an async bailout/interruption by invoking lifecycle twice.
      if (debugRenderPhaseSideEffects) {
        instance.shouldComponentUpdate(newProps, newState, newContext);
      }

      {
        warning(shouldUpdate !== undefined, '%s.shouldComponentUpdate(): Returned undefined instead of a ' + 'boolean value. Make sure to return true or false.', getComponentName(workInProgress) || 'Unknown');
      }

      return shouldUpdate;
    }

    if (type.prototype && type.prototype.isPureReactComponent) {
      return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
    }

    return true;
  }

  function checkClassInstance(workInProgress) {
    var instance = workInProgress.stateNode;
    var type = workInProgress.type;
    {
      var name = getComponentName(workInProgress);
      var renderPresent = instance.render;

      if (!renderPresent) {
        if (type.prototype && typeof type.prototype.render === 'function') {
          warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: did you accidentally return an object from the constructor?', name);
        } else {
          warning(false, '%s(...): No `render` method found on the returned component ' + 'instance: you may have forgotten to define `render`.', name);
        }
      }

      var noGetInitialStateOnES6 = !instance.getInitialState || instance.getInitialState.isReactClassApproved || instance.state;
      warning(noGetInitialStateOnES6, 'getInitialState was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Did you mean to define a state property instead?', name);
      var noGetDefaultPropsOnES6 = !instance.getDefaultProps || instance.getDefaultProps.isReactClassApproved;
      warning(noGetDefaultPropsOnES6, 'getDefaultProps was defined on %s, a plain JavaScript class. ' + 'This is only supported for classes created using React.createClass. ' + 'Use a static property to define defaultProps instead.', name);
      var noInstancePropTypes = !instance.propTypes;
      warning(noInstancePropTypes, 'propTypes was defined as an instance property on %s. Use a static ' + 'property to define propTypes instead.', name);
      var noInstanceContextTypes = !instance.contextTypes;
      warning(noInstanceContextTypes, 'contextTypes was defined as an instance property on %s. Use a static ' + 'property to define contextTypes instead.', name);
      var noComponentShouldUpdate = typeof instance.componentShouldUpdate !== 'function';
      warning(noComponentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', name);
      if (type.prototype && type.prototype.isPureReactComponent && typeof instance.shouldComponentUpdate !== 'undefined') {
        warning(false, '%s has a method called shouldComponentUpdate(). ' + 'shouldComponentUpdate should not be used when extending React.PureComponent. ' + 'Please extend React.Component if shouldComponentUpdate is used.', getComponentName(workInProgress) || 'A pure component');
      }
      var noComponentDidUnmount = typeof instance.componentDidUnmount !== 'function';
      warning(noComponentDidUnmount, '%s has a method called ' + 'componentDidUnmount(). But there is no such lifecycle method. ' + 'Did you mean componentWillUnmount()?', name);
      var noComponentDidReceiveProps = typeof instance.componentDidReceiveProps !== 'function';
      warning(noComponentDidReceiveProps, '%s has a method called ' + 'componentDidReceiveProps(). But there is no such lifecycle method. ' + 'If you meant to update the state in response to changing props, ' + 'use componentWillReceiveProps(). If you meant to fetch data or ' + 'run side-effects or mutations after React has updated the UI, use componentDidUpdate().', name);
      var noComponentWillRecieveProps = typeof instance.componentWillRecieveProps !== 'function';
      warning(noComponentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', name);
      var hasMutatedProps = instance.props !== workInProgress.pendingProps;
      warning(instance.props === undefined || !hasMutatedProps, '%s(...): When calling super() in `%s`, make sure to pass ' + "up the same props that your component's constructor was passed.", name, name);
      var noInstanceDefaultProps = !instance.defaultProps;
      warning(noInstanceDefaultProps, 'Setting defaultProps as an instance property on %s is not supported and will be ignored.' + ' Instead, define defaultProps as a static property on %s.', name, name);
    }

    var state = instance.state;
    if (state && (typeof state !== 'object' || isArray(state))) {
      warning(false, '%s.state: must be set to an object or null', getComponentName(workInProgress));
    }
    if (typeof instance.getChildContext === 'function') {
      warning(typeof workInProgress.type.childContextTypes === 'object', '%s.getChildContext(): childContextTypes must be defined in order to ' + 'use getChildContext().', getComponentName(workInProgress));
    }
  }

  function resetInputPointers(workInProgress, instance) {
    instance.props = workInProgress.memoizedProps;
    instance.state = workInProgress.memoizedState;
  }

  function adoptClassInstance(workInProgress, instance) {
    instance.updater = updater;
    workInProgress.stateNode = instance;
    // The instance needs access to the fiber so that it can schedule updates
    set(instance, workInProgress);
    {
      instance._reactInternalInstance = fakeInternalInstance;
    }
  }

  function constructClassInstance(workInProgress, props) {
    var ctor = workInProgress.type;
    var unmaskedContext = getUnmaskedContext(workInProgress);
    var needsContext = isContextConsumer(workInProgress);
    var context = needsContext ? getMaskedContext(workInProgress, unmaskedContext) : emptyObject;
    var instance = new ctor(props, context);
    adoptClassInstance(workInProgress, instance);

    // Cache unmasked context so we can avoid recreating masked context unless necessary.
    // ReactFiberContext usually updates this cache but can't for newly-created instances.
    if (needsContext) {
      cacheContext(workInProgress, unmaskedContext, context);
    }

    return instance;
  }

  function callComponentWillMount(workInProgress, instance) {
    startPhaseTimer(workInProgress, 'componentWillMount');
    var oldState = instance.state;
    instance.componentWillMount();
    stopPhaseTimer();

    // Simulate an async bailout/interruption by invoking lifecycle twice.
    if (debugRenderPhaseSideEffects) {
      instance.componentWillMount();
    }

    if (oldState !== instance.state) {
      {
        warning(false, '%s.componentWillMount(): Assigning directly to this.state is ' + "deprecated (except inside a component's " + 'constructor). Use setState instead.', getComponentName(workInProgress));
      }
      updater.enqueueReplaceState(instance, instance.state, null);
    }
  }

  function callComponentWillReceiveProps(workInProgress, instance, newProps, newContext) {
    startPhaseTimer(workInProgress, 'componentWillReceiveProps');
    var oldState = instance.state;
    instance.componentWillReceiveProps(newProps, newContext);
    stopPhaseTimer();

    // Simulate an async bailout/interruption by invoking lifecycle twice.
    if (debugRenderPhaseSideEffects) {
      instance.componentWillReceiveProps(newProps, newContext);
    }

    if (instance.state !== oldState) {
      {
        var componentName = getComponentName(workInProgress) || 'Component';
        if (!didWarnAboutStateAssignmentForComponent[componentName]) {
          warning(false, '%s.componentWillReceiveProps(): Assigning directly to ' + "this.state is deprecated (except inside a component's " + 'constructor). Use setState instead.', componentName);
          didWarnAboutStateAssignmentForComponent[componentName] = true;
        }
      }
      updater.enqueueReplaceState(instance, instance.state, null);
    }
  }

  // Invokes the mount life-cycles on a previously never rendered instance.
  function mountClassInstance(workInProgress, renderExpirationTime) {
    var current = workInProgress.alternate;

    {
      checkClassInstance(workInProgress);
    }

    var instance = workInProgress.stateNode;
    var state = instance.state || null;

    var props = workInProgress.pendingProps;
    !props ? invariant(false, 'There must be pending props for an initial mount. This error is likely caused by a bug in React. Please file an issue.') : void 0;

    var unmaskedContext = getUnmaskedContext(workInProgress);

    instance.props = props;
    instance.state = workInProgress.memoizedState = state;
    instance.refs = emptyObject;
    instance.context = getMaskedContext(workInProgress, unmaskedContext);

    if (enableAsyncSubtreeAPI && workInProgress.type != null && workInProgress.type.prototype != null && workInProgress.type.prototype.unstable_isAsyncReactComponent === true) {
      workInProgress.internalContextTag |= AsyncUpdates;
    }

    if (typeof instance.componentWillMount === 'function') {
      callComponentWillMount(workInProgress, instance);
      // If we had additional state updates during this life-cycle, let's
      // process them now.
      var updateQueue = workInProgress.updateQueue;
      if (updateQueue !== null) {
        instance.state = processUpdateQueue(current, workInProgress, updateQueue, instance, props, renderExpirationTime);
      }
    }
    if (typeof instance.componentDidMount === 'function') {
      workInProgress.effectTag |= Update;
    }
  }

  // Called on a preexisting class instance. Returns false if a resumed render
  // could be reused.
  // function resumeMountClassInstance(
  //   workInProgress: Fiber,
  //   priorityLevel: PriorityLevel,
  // ): boolean {
  //   const instance = workInProgress.stateNode;
  //   resetInputPointers(workInProgress, instance);

  //   let newState = workInProgress.memoizedState;
  //   let newProps = workInProgress.pendingProps;
  //   if (!newProps) {
  //     // If there isn't any new props, then we'll reuse the memoized props.
  //     // This could be from already completed work.
  //     newProps = workInProgress.memoizedProps;
  //     invariant(
  //       newProps != null,
  //       'There should always be pending or memoized props. This error is ' +
  //         'likely caused by a bug in React. Please file an issue.',
  //     );
  //   }
  //   const newUnmaskedContext = getUnmaskedContext(workInProgress);
  //   const newContext = getMaskedContext(workInProgress, newUnmaskedContext);

  //   const oldContext = instance.context;
  //   const oldProps = workInProgress.memoizedProps;

  //   if (
  //     typeof instance.componentWillReceiveProps === 'function' &&
  //     (oldProps !== newProps || oldContext !== newContext)
  //   ) {
  //     callComponentWillReceiveProps(
  //       workInProgress,
  //       instance,
  //       newProps,
  //       newContext,
  //     );
  //   }

  //   // Process the update queue before calling shouldComponentUpdate
  //   const updateQueue = workInProgress.updateQueue;
  //   if (updateQueue !== null) {
  //     newState = processUpdateQueue(
  //       workInProgress,
  //       updateQueue,
  //       instance,
  //       newState,
  //       newProps,
  //       priorityLevel,
  //     );
  //   }

  //   // TODO: Should we deal with a setState that happened after the last
  //   // componentWillMount and before this componentWillMount? Probably
  //   // unsupported anyway.

  //   if (
  //     !checkShouldComponentUpdate(
  //       workInProgress,
  //       workInProgress.memoizedProps,
  //       newProps,
  //       workInProgress.memoizedState,
  //       newState,
  //       newContext,
  //     )
  //   ) {
  //     // Update the existing instance's state, props, and context pointers even
  //     // though we're bailing out.
  //     instance.props = newProps;
  //     instance.state = newState;
  //     instance.context = newContext;
  //     return false;
  //   }

  //   // Update the input pointers now so that they are correct when we call
  //   // componentWillMount
  //   instance.props = newProps;
  //   instance.state = newState;
  //   instance.context = newContext;

  //   if (typeof instance.componentWillMount === 'function') {
  //     callComponentWillMount(workInProgress, instance);
  //     // componentWillMount may have called setState. Process the update queue.
  //     const newUpdateQueue = workInProgress.updateQueue;
  //     if (newUpdateQueue !== null) {
  //       newState = processUpdateQueue(
  //         workInProgress,
  //         newUpdateQueue,
  //         instance,
  //         newState,
  //         newProps,
  //         priorityLevel,
  //       );
  //     }
  //   }

  //   if (typeof instance.componentDidMount === 'function') {
  //     workInProgress.effectTag |= Update;
  //   }

  //   instance.state = newState;

  //   return true;
  // }

  // Invokes the update life-cycles and returns false if it shouldn't rerender.
  function updateClassInstance(current, workInProgress, renderExpirationTime) {
    var instance = workInProgress.stateNode;
    resetInputPointers(workInProgress, instance);

    var oldProps = workInProgress.memoizedProps;
    var newProps = workInProgress.pendingProps;
    if (!newProps) {
      // If there aren't any new props, then we'll reuse the memoized props.
      // This could be from already completed work.
      newProps = oldProps;
      !(newProps != null) ? invariant(false, 'There should always be pending or memoized props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    }
    var oldContext = instance.context;
    var newUnmaskedContext = getUnmaskedContext(workInProgress);
    var newContext = getMaskedContext(workInProgress, newUnmaskedContext);

    // Note: During these life-cycles, instance.props/instance.state are what
    // ever the previously attempted to render - not the "current". However,
    // during componentDidUpdate we pass the "current" props.

    if (typeof instance.componentWillReceiveProps === 'function' && (oldProps !== newProps || oldContext !== newContext)) {
      callComponentWillReceiveProps(workInProgress, instance, newProps, newContext);
    }

    // Compute the next state using the memoized state and the update queue.
    var oldState = workInProgress.memoizedState;
    // TODO: Previous state can be null.
    var newState = void 0;
    if (workInProgress.updateQueue !== null) {
      newState = processUpdateQueue(current, workInProgress, workInProgress.updateQueue, instance, newProps, renderExpirationTime);
    } else {
      newState = oldState;
    }

    if (oldProps === newProps && oldState === newState && !hasContextChanged() && !(workInProgress.updateQueue !== null && workInProgress.updateQueue.hasForceUpdate)) {
      // If an update was already in progress, we should schedule an Update
      // effect even though we're bailing out, so that cWU/cDU are called.
      if (typeof instance.componentDidUpdate === 'function') {
        if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
          workInProgress.effectTag |= Update;
        }
      }
      return false;
    }

    var shouldUpdate = checkShouldComponentUpdate(workInProgress, oldProps, newProps, oldState, newState, newContext);

    if (shouldUpdate) {
      if (typeof instance.componentWillUpdate === 'function') {
        startPhaseTimer(workInProgress, 'componentWillUpdate');
        instance.componentWillUpdate(newProps, newState, newContext);
        stopPhaseTimer();

        // Simulate an async bailout/interruption by invoking lifecycle twice.
        if (debugRenderPhaseSideEffects) {
          instance.componentWillUpdate(newProps, newState, newContext);
        }
      }
      if (typeof instance.componentDidUpdate === 'function') {
        workInProgress.effectTag |= Update;
      }
    } else {
      // If an update was already in progress, we should schedule an Update
      // effect even though we're bailing out, so that cWU/cDU are called.
      if (typeof instance.componentDidUpdate === 'function') {
        if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
          workInProgress.effectTag |= Update;
        }
      }

      // If shouldComponentUpdate returned false, we should still update the
      // memoized props/state to indicate that this work can be reused.
      memoizeProps(workInProgress, newProps);
      memoizeState(workInProgress, newState);
    }

    // Update the existing instance's state, props, and context pointers even
    // if shouldComponentUpdate returns false.
    instance.props = newProps;
    instance.state = newState;
    instance.context = newContext;

    return shouldUpdate;
  }

  return {
    adoptClassInstance: adoptClassInstance,
    constructClassInstance: constructClassInstance,
    mountClassInstance: mountClassInstance,
    // resumeMountClassInstance,
    updateClassInstance: updateClassInstance
  };
};

// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var hasSymbol = typeof Symbol === 'function' && Symbol['for'];

var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;
var REACT_CALL_TYPE = hasSymbol ? Symbol['for']('react.call') : 0xeac8;
var REACT_RETURN_TYPE = hasSymbol ? Symbol['for']('react.return') : 0xeac9;
var REACT_PORTAL_TYPE = hasSymbol ? Symbol['for']('react.portal') : 0xeaca;
var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol['for']('react.fragment') : 0xeacb;

var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';

function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable === 'undefined') {
    return null;
  }
  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }
  return null;
}

var getCurrentFiberStackAddendum$1 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;


{
  var didWarnAboutMaps = false;
  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};
  var ownerHasFunctionTypeWarning = {};

  var warnForMissingKey = function (child) {
    if (child === null || typeof child !== 'object') {
      return;
    }
    if (!child._store || child._store.validated || child.key != null) {
      return;
    }
    !(typeof child._store === 'object') ? invariant(false, 'React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    child._store.validated = true;

    var currentComponentErrorInfo = 'Each child in an array or iterator should have a unique ' + '"key" prop. See https://fb.me/react-warning-keys for ' + 'more information.' + (getCurrentFiberStackAddendum$1() || '');
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

    warning(false, 'Each child in an array or iterator should have a unique ' + '"key" prop. See https://fb.me/react-warning-keys for ' + 'more information.%s', getCurrentFiberStackAddendum$1());
  };
}

var isArray$1 = Array.isArray;

function coerceRef(current, element) {
  var mixedRef = element.ref;
  if (mixedRef !== null && typeof mixedRef !== 'function') {
    if (element._owner) {
      var owner = element._owner;
      var inst = void 0;
      if (owner) {
        var ownerFiber = owner;
        !(ownerFiber.tag === ClassComponent) ? invariant(false, 'Stateless function components cannot have refs.') : void 0;
        inst = ownerFiber.stateNode;
      }
      !inst ? invariant(false, 'Missing owner for string ref %s. This error is likely caused by a bug in React. Please file an issue.', mixedRef) : void 0;
      var stringRef = '' + mixedRef;
      // Check if previous string ref matches new string ref
      if (current !== null && current.ref !== null && current.ref._stringRef === stringRef) {
        return current.ref;
      }
      var ref = function (value) {
        var refs = inst.refs === emptyObject ? inst.refs = {} : inst.refs;
        if (value === null) {
          delete refs[stringRef];
        } else {
          refs[stringRef] = value;
        }
      };
      ref._stringRef = stringRef;
      return ref;
    } else {
      !(typeof mixedRef === 'string') ? invariant(false, 'Expected ref to be a function or a string.') : void 0;
      !element._owner ? invariant(false, 'Element ref was specified as a string (%s) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).', mixedRef) : void 0;
    }
  }
  return mixedRef;
}

function throwOnInvalidObjectType(returnFiber, newChild) {
  if (returnFiber.type !== 'textarea') {
    var addendum = '';
    {
      addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + (getCurrentFiberStackAddendum$1() || '');
    }
    invariant(false, 'Objects are not valid as a React child (found: %s).%s', Object.prototype.toString.call(newChild) === '[object Object]' ? 'object with keys {' + Object.keys(newChild).join(', ') + '}' : newChild, addendum);
  }
}

function warnOnFunctionType() {
  var currentComponentErrorInfo = 'Functions are not valid as a React child. This may happen if ' + 'you return a Component instead of <Component /> from render. ' + 'Or maybe you meant to call this function rather than return it.' + (getCurrentFiberStackAddendum$1() || '');

  if (ownerHasFunctionTypeWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasFunctionTypeWarning[currentComponentErrorInfo] = true;

  warning(false, 'Functions are not valid as a React child. This may happen if ' + 'you return a Component instead of <Component /> from render. ' + 'Or maybe you meant to call this function rather than return it.%s', getCurrentFiberStackAddendum$1() || '');
}

// This wrapper function exists because I expect to clone the code in each path
// to be able to optimize each path individually by branching early. This needs
// a compiler or we can do it manually. Helpers that don't need this branching
// live outside of this function.
function ChildReconciler(shouldTrackSideEffects) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return;
    }
    // Deletions are added in reversed order so we add it to the front.
    // At this point, the return fiber's effect list is empty except for
    // deletions, so we can just append the deletion to the list. The remaining
    // effects aren't added until the complete phase. Once we implement
    // resuming, this may not be true.
    var last = returnFiber.lastEffect;
    if (last !== null) {
      last.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
    childToDelete.nextEffect = null;
    childToDelete.effectTag = Deletion;
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackSideEffects) {
      // Noop.
      return null;
    }

    // TODO: For the shouldClone case, this could be micro-optimized a bit by
    // assuming that after the first child we've already added everything.
    var childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    // Add the remaining children to a temporary map so that we can find them by
    // keys quickly. Implicit (null) keys get added to this set with their index
    var existingChildren = new Map();

    var existingChild = currentFirstChild;
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }
    return existingChildren;
  }

  function useFiber(fiber, pendingProps, expirationTime) {
    // We currently set sibling to null and index to 0 here because it is easy
    // to forget to do before returning it. E.g. for the single child case.
    var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
      // Noop.
      return lastPlacedIndex;
    }
    var current = newFiber.alternate;
    if (current !== null) {
      var oldIndex = current.index;
      if (oldIndex < lastPlacedIndex) {
        // This is a move.
        newFiber.effectTag = Placement;
        return lastPlacedIndex;
      } else {
        // This item can stay in place.
        return oldIndex;
      }
    } else {
      // This is an insertion.
      newFiber.effectTag = Placement;
      return lastPlacedIndex;
    }
  }

  function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.effectTag = Placement;
    }
    return newFiber;
  }

  function updateTextNode(returnFiber, current, textContent, expirationTime) {
    if (current === null || current.tag !== HostText) {
      // Insert
      var created = createFiberFromText(textContent, returnFiber.internalContextTag, expirationTime);
      created['return'] = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current, textContent, expirationTime);
      existing['return'] = returnFiber;
      return existing;
    }
  }

  function updateElement(returnFiber, current, element, expirationTime) {
    if (current !== null && current.type === element.type) {
      // Move based on index
      var existing = useFiber(current, element.props, expirationTime);
      existing.ref = coerceRef(current, element);
      existing['return'] = returnFiber;
      {
        existing._debugSource = element._source;
        existing._debugOwner = element._owner;
      }
      return existing;
    } else {
      // Insert
      var created = createFiberFromElement(element, returnFiber.internalContextTag, expirationTime);
      created.ref = coerceRef(current, element);
      created['return'] = returnFiber;
      return created;
    }
  }

  function updateCall(returnFiber, current, call, expirationTime) {
    // TODO: Should this also compare handler to determine whether to reuse?
    if (current === null || current.tag !== CallComponent) {
      // Insert
      var created = createFiberFromCall(call, returnFiber.internalContextTag, expirationTime);
      created['return'] = returnFiber;
      return created;
    } else {
      // Move based on index
      var existing = useFiber(current, call, expirationTime);
      existing['return'] = returnFiber;
      return existing;
    }
  }

  function updateReturn(returnFiber, current, returnNode, expirationTime) {
    if (current === null || current.tag !== ReturnComponent) {
      // Insert
      var created = createFiberFromReturn(returnNode, returnFiber.internalContextTag, expirationTime);
      created.type = returnNode.value;
      created['return'] = returnFiber;
      return created;
    } else {
      // Move based on index
      var existing = useFiber(current, null, expirationTime);
      existing.type = returnNode.value;
      existing['return'] = returnFiber;
      return existing;
    }
  }

  function updatePortal(returnFiber, current, portal, expirationTime) {
    if (current === null || current.tag !== HostPortal || current.stateNode.containerInfo !== portal.containerInfo || current.stateNode.implementation !== portal.implementation) {
      // Insert
      var created = createFiberFromPortal(portal, returnFiber.internalContextTag, expirationTime);
      created['return'] = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current, portal.children || [], expirationTime);
      existing['return'] = returnFiber;
      return existing;
    }
  }

  function updateFragment(returnFiber, current, fragment, expirationTime, key) {
    if (current === null || current.tag !== Fragment) {
      // Insert
      var created = createFiberFromFragment(fragment, returnFiber.internalContextTag, expirationTime, key);
      created['return'] = returnFiber;
      return created;
    } else {
      // Update
      var existing = useFiber(current, fragment, expirationTime);
      existing['return'] = returnFiber;
      return existing;
    }
  }

  function createChild(returnFiber, newChild, expirationTime) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      var created = createFiberFromText('' + newChild, returnFiber.internalContextTag, expirationTime);
      created['return'] = returnFiber;
      return created;
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              var _created = createFiberFromFragment(newChild.props.children, returnFiber.internalContextTag, expirationTime, newChild.key);
              _created['return'] = returnFiber;
              return _created;
            } else {
              var _created2 = createFiberFromElement(newChild, returnFiber.internalContextTag, expirationTime);
              _created2.ref = coerceRef(null, newChild);
              _created2['return'] = returnFiber;
              return _created2;
            }
          }

        case REACT_CALL_TYPE:
          {
            var _created3 = createFiberFromCall(newChild, returnFiber.internalContextTag, expirationTime);
            _created3['return'] = returnFiber;
            return _created3;
          }

        case REACT_RETURN_TYPE:
          {
            var _created4 = createFiberFromReturn(newChild, returnFiber.internalContextTag, expirationTime);
            _created4.type = newChild.value;
            _created4['return'] = returnFiber;
            return _created4;
          }

        case REACT_PORTAL_TYPE:
          {
            var _created5 = createFiberFromPortal(newChild, returnFiber.internalContextTag, expirationTime);
            _created5['return'] = returnFiber;
            return _created5;
          }
      }

      if (isArray$1(newChild) || getIteratorFn(newChild)) {
        var _created6 = createFiberFromFragment(newChild, returnFiber.internalContextTag, expirationTime, null);
        _created6['return'] = returnFiber;
        return _created6;
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType();
      }
    }

    return null;
  }

  function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
    // Update the fiber if the keys match, otherwise return null.

    var key = oldFiber !== null ? oldFiber.key : null;

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      if (key !== null) {
        return null;
      }
      return updateTextNode(returnFiber, oldFiber, '' + newChild, expirationTime);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            if (newChild.key === key) {
              if (newChild.type === REACT_FRAGMENT_TYPE) {
                return updateFragment(returnFiber, oldFiber, newChild.props.children, expirationTime, key);
              }
              return updateElement(returnFiber, oldFiber, newChild, expirationTime);
            } else {
              return null;
            }
          }

        case REACT_CALL_TYPE:
          {
            if (newChild.key === key) {
              return updateCall(returnFiber, oldFiber, newChild, expirationTime);
            } else {
              return null;
            }
          }

        case REACT_RETURN_TYPE:
          {
            // Returns don't have keys. If the previous node is implicitly keyed
            // we can continue to replace it without aborting even if it is not a
            // yield.
            if (key === null) {
              return updateReturn(returnFiber, oldFiber, newChild, expirationTime);
            } else {
              return null;
            }
          }

        case REACT_PORTAL_TYPE:
          {
            if (newChild.key === key) {
              return updatePortal(returnFiber, oldFiber, newChild, expirationTime);
            } else {
              return null;
            }
          }
      }

      if (isArray$1(newChild) || getIteratorFn(newChild)) {
        if (key !== null) {
          return null;
        }

        return updateFragment(returnFiber, oldFiber, newChild, expirationTime, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType();
      }
    }

    return null;
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      // Text nodes don't have keys, so we neither have to check the old nor
      // new node for the key. If both are text nodes, they match.
      var matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, '' + newChild, expirationTime);
    }

    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          {
            var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            if (newChild.type === REACT_FRAGMENT_TYPE) {
              return updateFragment(returnFiber, _matchedFiber, newChild.props.children, expirationTime, newChild.key);
            }
            return updateElement(returnFiber, _matchedFiber, newChild, expirationTime);
          }

        case REACT_CALL_TYPE:
          {
            var _matchedFiber2 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            return updateCall(returnFiber, _matchedFiber2, newChild, expirationTime);
          }

        case REACT_RETURN_TYPE:
          {
            // Returns don't have keys, so we neither have to check the old nor
            // new node for the key. If both are returns, they match.
            var _matchedFiber3 = existingChildren.get(newIdx) || null;
            return updateReturn(returnFiber, _matchedFiber3, newChild, expirationTime);
          }

        case REACT_PORTAL_TYPE:
          {
            var _matchedFiber4 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            return updatePortal(returnFiber, _matchedFiber4, newChild, expirationTime);
          }
      }

      if (isArray$1(newChild) || getIteratorFn(newChild)) {
        var _matchedFiber5 = existingChildren.get(newIdx) || null;
        return updateFragment(returnFiber, _matchedFiber5, newChild, expirationTime, null);
      }

      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType();
      }
    }

    return null;
  }

  /**
   * Warns if there is a duplicate or missing key
   */
  function warnOnInvalidKey(child, knownKeys) {
    {
      if (typeof child !== 'object' || child === null) {
        return knownKeys;
      }
      switch (child.$$typeof) {
        case REACT_ELEMENT_TYPE:
        case REACT_CALL_TYPE:
        case REACT_PORTAL_TYPE:
          warnForMissingKey(child);
          var key = child.key;
          if (typeof key !== 'string') {
            break;
          }
          if (knownKeys === null) {
            knownKeys = new Set();
            knownKeys.add(key);
            break;
          }
          if (!knownKeys.has(key)) {
            knownKeys.add(key);
            break;
          }
          warning(false, 'Encountered two children with the same key, `%s`. ' + 'Keys should be unique so that components maintain their identity ' + 'across updates. Non-unique keys may cause children to be ' + 'duplicated and/or omitted — the behavior is unsupported and ' + 'could change in a future version.%s', key, getCurrentFiberStackAddendum$1());
          break;
        default:
          break;
      }
    }
    return knownKeys;
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
    // This algorithm can't optimize by searching from boths ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.

    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.

    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.

    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.

    {
      // First, validate keys.
      var knownKeys = null;
      for (var i = 0; i < newChildren.length; i++) {
        var child = newChildren[i];
        knownKeys = warnOnInvalidKey(child, knownKeys);
      }
    }

    var resultingFirstChild = null;
    var previousNewFiber = null;

    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);
      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (oldFiber === null) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (newIdx === newChildren.length) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);
        if (!_newFiber) {
          continue;
        }
        lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber;
        } else {
          previousNewFiber.sibling = _newFiber;
        }
        previousNewFiber = _newFiber;
      }
      return resultingFirstChild;
    }

    // Add all children to a key map for quick lookups.
    var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // Keep scanning and use the map to restore deleted items as moves.
    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);
      if (_newFiber2) {
        if (shouldTrackSideEffects) {
          if (_newFiber2.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren['delete'](_newFiber2.key === null ? newIdx : _newFiber2.key);
          }
        }
        lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber2;
        } else {
          previousNewFiber.sibling = _newFiber2;
        }
        previousNewFiber = _newFiber2;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function (child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }

  function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, expirationTime) {
    // This is the same implementation as reconcileChildrenArray(),
    // but using the iterator instead.

    var iteratorFn = getIteratorFn(newChildrenIterable);
    !(typeof iteratorFn === 'function') ? invariant(false, 'An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.') : void 0;

    {
      // Warn about using Maps as children
      if (typeof newChildrenIterable.entries === 'function') {
        var possibleMap = newChildrenIterable;
        if (possibleMap.entries === iteratorFn) {
          warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', getCurrentFiberStackAddendum$1());
          didWarnAboutMaps = true;
        }
      }

      // First, validate keys.
      // We'll get a different iterator later for the main pass.
      var _newChildren = iteratorFn.call(newChildrenIterable);
      if (_newChildren) {
        var knownKeys = null;
        var _step = _newChildren.next();
        for (; !_step.done; _step = _newChildren.next()) {
          var child = _step.value;
          knownKeys = warnOnInvalidKey(child, knownKeys);
        }
      }
    }

    var newChildren = iteratorFn.call(newChildrenIterable);
    !(newChildren != null) ? invariant(false, 'An iterable object provided no iterator.') : void 0;

    var resultingFirstChild = null;
    var previousNewFiber = null;

    var oldFiber = currentFirstChild;
    var lastPlacedIndex = 0;
    var newIdx = 0;
    var nextOldFiber = null;

    var step = newChildren.next();
    for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
      }
      var newFiber = updateSlot(returnFiber, oldFiber, step.value, expirationTime);
      if (newFiber === null) {
        // TODO: This breaks on empty slots like null children. That's
        // unfortunate because it triggers the slow path all the time. We need
        // a better way to communicate whether this was a miss or null,
        // boolean, undefined, etc.
        if (!oldFiber) {
          oldFiber = nextOldFiber;
        }
        break;
      }
      if (shouldTrackSideEffects) {
        if (oldFiber && newFiber.alternate === null) {
          // We matched the slot, but we didn't reuse the existing fiber, so we
          // need to delete the existing child.
          deleteChild(returnFiber, oldFiber);
        }
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        // TODO: Move out of the loop. This only happens for the first run.
        resultingFirstChild = newFiber;
      } else {
        // TODO: Defer siblings if we're not at the right index for this slot.
        // I.e. if we had null values before, then we want to defer this
        // for each null value. However, we also don't want to call updateSlot
        // with the previous one.
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }

    if (step.done) {
      // We've reached the end of the new children. We can delete the rest.
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; !step.done; newIdx++, step = newChildren.next()) {
        var _newFiber3 = createChild(returnFiber, step.value, expirationTime);
        if (_newFiber3 === null) {
          continue;
        }
        lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          // TODO: Move out of the loop. This only happens for the first run.
          resultingFirstChild = _newFiber3;
        } else {
          previousNewFiber.sibling = _newFiber3;
        }
        previousNewFiber = _newFiber3;
      }
      return resultingFirstChild;
    }

    // Add all children to a key map for quick lookups.
    var existingChildren = mapRemainingChildren(returnFiber, oldFiber);

    // Keep scanning and use the map to restore deleted items as moves.
    for (; !step.done; newIdx++, step = newChildren.next()) {
      var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, expirationTime);
      if (_newFiber4 !== null) {
        if (shouldTrackSideEffects) {
          if (_newFiber4.alternate !== null) {
            // The new fiber is a work in progress, but if there exists a
            // current, that means that we reused the fiber. We need to delete
            // it from the child list so that we don't add it to the deletion
            // list.
            existingChildren['delete'](_newFiber4.key === null ? newIdx : _newFiber4.key);
          }
        }
        lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = _newFiber4;
        } else {
          previousNewFiber.sibling = _newFiber4;
        }
        previousNewFiber = _newFiber4;
      }
    }

    if (shouldTrackSideEffects) {
      // Any existing children that weren't consumed above were deleted. We need
      // to add them to the deletion list.
      existingChildren.forEach(function (child) {
        return deleteChild(returnFiber, child);
      });
    }

    return resultingFirstChild;
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, expirationTime) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      var existing = useFiber(currentFirstChild, textContent, expirationTime);
      existing['return'] = returnFiber;
      return existing;
    }
    // The existing first child is not a text node so we need to create one
    // and delete the existing ones.
    deleteRemainingChildren(returnFiber, currentFirstChild);
    var created = createFiberFromText(textContent, returnFiber.internalContextTag, expirationTime);
    created['return'] = returnFiber;
    return created;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
    var key = element.key;
    var child = currentFirstChild;
    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.type === element.type) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props, expirationTime);
          existing.ref = coerceRef(child, element);
          existing['return'] = returnFiber;
          {
            existing._debugSource = element._source;
            existing._debugOwner = element._owner;
          }
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

    if (element.type === REACT_FRAGMENT_TYPE) {
      var created = createFiberFromFragment(element.props.children, returnFiber.internalContextTag, expirationTime, element.key);
      created['return'] = returnFiber;
      return created;
    } else {
      var _created7 = createFiberFromElement(element, returnFiber.internalContextTag, expirationTime);
      _created7.ref = coerceRef(currentFirstChild, element);
      _created7['return'] = returnFiber;
      return _created7;
    }
  }

  function reconcileSingleCall(returnFiber, currentFirstChild, call, expirationTime) {
    var key = call.key;
    var child = currentFirstChild;
    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (child.tag === CallComponent) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, call, expirationTime);
          existing['return'] = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

    var created = createFiberFromCall(call, returnFiber.internalContextTag, expirationTime);
    created['return'] = returnFiber;
    return created;
  }

  function reconcileSingleReturn(returnFiber, currentFirstChild, returnNode, expirationTime) {
    // There's no need to check for keys on yields since they're stateless.
    var child = currentFirstChild;
    if (child !== null) {
      if (child.tag === ReturnComponent) {
        deleteRemainingChildren(returnFiber, child.sibling);
        var existing = useFiber(child, null, expirationTime);
        existing.type = returnNode.value;
        existing['return'] = returnFiber;
        return existing;
      } else {
        deleteRemainingChildren(returnFiber, child);
      }
    }

    var created = createFiberFromReturn(returnNode, returnFiber.internalContextTag, expirationTime);
    created.type = returnNode.value;
    created['return'] = returnFiber;
    return created;
  }

  function reconcileSinglePortal(returnFiber, currentFirstChild, portal, expirationTime) {
    var key = portal.key;
    var child = currentFirstChild;
    while (child !== null) {
      // TODO: If key === null and child.key === null, then this only applies to
      // the first item in the list.
      if (child.key === key) {
        if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
          deleteRemainingChildren(returnFiber, child.sibling);
          var existing = useFiber(child, portal.children || [], expirationTime);
          existing['return'] = returnFiber;
          return existing;
        } else {
          deleteRemainingChildren(returnFiber, child);
          break;
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

    var created = createFiberFromPortal(portal, returnFiber.internalContextTag, expirationTime);
    created['return'] = returnFiber;
    return created;
  }

  // This API will tag the children with the side-effect of the reconciliation
  // itself. They will be added to the side-effect list as we pass through the
  // children and the parent.
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle top level unkeyed fragments as if they were arrays.
    // This leads to an ambiguity between <>{[...]}</> and <>...</>.
    // We treat the ambiguous cases above the same.
    if (typeof newChild === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null) {
      newChild = newChild.props.children;
    }

    // Handle object types
    var isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));

        case REACT_CALL_TYPE:
          return placeSingleChild(reconcileSingleCall(returnFiber, currentFirstChild, newChild, expirationTime));
        case REACT_RETURN_TYPE:
          return placeSingleChild(reconcileSingleReturn(returnFiber, currentFirstChild, newChild, expirationTime));
        case REACT_PORTAL_TYPE:
          return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, expirationTime));
      }
    }

    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, expirationTime));
    }

    if (isArray$1(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime);
    }

    if (getIteratorFn(newChild)) {
      return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, expirationTime);
    }

    if (isObject) {
      throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
      if (typeof newChild === 'function') {
        warnOnFunctionType();
      }
    }
    if (typeof newChild === 'undefined') {
      // If the new child is undefined, and the return fiber is a composite
      // component, throw an error. If Fiber return types are disabled,
      // we already threw above.
      switch (returnFiber.tag) {
        case ClassComponent:
          {
            {
              var instance = returnFiber.stateNode;
              if (instance.render._isMockFunction) {
                // We allow auto-mocks to proceed as if they're returning null.
                break;
              }
            }
          }
        // Intentionally fall through to the next case, which handles both
        // functions and classes
        // eslint-disable-next-lined no-fallthrough
        case FunctionalComponent:
          {
            var Component = returnFiber.type;
            invariant(false, '%s(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.', Component.displayName || Component.name || 'Component');
          }
      }
    }

    // Remaining cases are all treated as empty.
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }

  return reconcileChildFibers;
}

var reconcileChildFibers = ChildReconciler(true);
var mountChildFibers = ChildReconciler(false);

function cloneChildFibers(current, workInProgress) {
  !(current === null || workInProgress.child === current.child) ? invariant(false, 'Resuming work not yet implemented.') : void 0;

  if (workInProgress.child === null) {
    return;
  }

  var currentChild = workInProgress.child;
  var newChild = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
  workInProgress.child = newChild;

  newChild['return'] = workInProgress;
  while (currentChild.sibling !== null) {
    currentChild = currentChild.sibling;
    newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
    newChild['return'] = workInProgress;
  }
  newChild.sibling = null;
}

{
  var warnedAboutStatelessRefs = {};
}

var ReactFiberBeginWork = function (config, hostContext, hydrationContext, scheduleWork, computeExpirationForFiber) {
  var shouldSetTextContent = config.shouldSetTextContent,
      useSyncScheduling = config.useSyncScheduling,
      shouldDeprioritizeSubtree = config.shouldDeprioritizeSubtree;
  var pushHostContext = hostContext.pushHostContext,
      pushHostContainer = hostContext.pushHostContainer;
  var enterHydrationState = hydrationContext.enterHydrationState,
      resetHydrationState = hydrationContext.resetHydrationState,
      tryToClaimNextHydratableInstance = hydrationContext.tryToClaimNextHydratableInstance;

  var _ReactFiberClassCompo = ReactFiberClassComponent(scheduleWork, computeExpirationForFiber, memoizeProps, memoizeState),
      adoptClassInstance = _ReactFiberClassCompo.adoptClassInstance,
      constructClassInstance = _ReactFiberClassCompo.constructClassInstance,
      mountClassInstance = _ReactFiberClassCompo.mountClassInstance,
      updateClassInstance = _ReactFiberClassCompo.updateClassInstance;

  // TODO: Remove this and use reconcileChildrenAtExpirationTime directly.


  function reconcileChildren(current, workInProgress, nextChildren) {
    reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, workInProgress.expirationTime);
  }

  function reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime) {
    if (current === null) {
      // If this is a fresh new component that hasn't been rendered yet, we
      // won't update its child set by applying minimal side-effects. Instead,
      // we will add them all to the child before it gets rendered. That means
      // we can optimize this reconciliation pass by not tracking side-effects.
      workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
    } else {
      // If the current child is the same as the work in progress, it means that
      // we haven't yet started any work on these children. Therefore, we use
      // the clone algorithm to create a copy of all the current children.

      // If we had any progressed work already, that is invalid at this point so
      // let's throw it out.
      workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderExpirationTime);
    }
  }

  function updateFragment(current, workInProgress) {
    var nextChildren = workInProgress.pendingProps;
    if (hasContextChanged()) {
      // Normally we can bail out on props equality but if context has changed
      // we don't do the bailout and we have to reuse existing props instead.
      if (nextChildren === null) {
        nextChildren = workInProgress.memoizedProps;
      }
    } else if (nextChildren === null || workInProgress.memoizedProps === nextChildren) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }
    reconcileChildren(current, workInProgress, nextChildren);
    memoizeProps(workInProgress, nextChildren);
    return workInProgress.child;
  }

  function markRef(current, workInProgress) {
    var ref = workInProgress.ref;
    if (ref !== null && (!current || current.ref !== ref)) {
      // Schedule a Ref effect
      workInProgress.effectTag |= Ref;
    }
  }

  function updateFunctionalComponent(current, workInProgress) {
    var fn = workInProgress.type;
    var nextProps = workInProgress.pendingProps;

    var memoizedProps = workInProgress.memoizedProps;
    if (hasContextChanged()) {
      // Normally we can bail out on props equality but if context has changed
      // we don't do the bailout and we have to reuse existing props instead.
      if (nextProps === null) {
        nextProps = memoizedProps;
      }
    } else {
      if (nextProps === null || memoizedProps === nextProps) {
        return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }
      // TODO: consider bringing fn.shouldComponentUpdate() back.
      // It used to be here.
    }

    var unmaskedContext = getUnmaskedContext(workInProgress);
    var context = getMaskedContext(workInProgress, unmaskedContext);

    var nextChildren;

    {
      ReactCurrentOwner.current = workInProgress;
      ReactDebugCurrentFiber.setCurrentPhase('render');
      nextChildren = fn(nextProps, context);
      ReactDebugCurrentFiber.setCurrentPhase(null);
    }
    // React DevTools reads this flag.
    workInProgress.effectTag |= PerformedWork;
    reconcileChildren(current, workInProgress, nextChildren);
    memoizeProps(workInProgress, nextProps);
    return workInProgress.child;
  }

  function updateClassComponent(current, workInProgress, renderExpirationTime) {
    // Push context providers early to prevent context stack mismatches.
    // During mounting we don't know the child context yet as the instance doesn't exist.
    // We will invalidate the child context in finishClassComponent() right after rendering.
    var hasContext = pushContextProvider(workInProgress);

    var shouldUpdate = void 0;
    if (current === null) {
      if (!workInProgress.stateNode) {
        // In the initial pass we might need to construct the instance.
        constructClassInstance(workInProgress, workInProgress.pendingProps);
        mountClassInstance(workInProgress, renderExpirationTime);
        shouldUpdate = true;
      } else {
        invariant(false, 'Resuming work not yet implemented.');
        // In a resume, we'll already have an instance we can reuse.
        // shouldUpdate = resumeMountClassInstance(workInProgress, renderExpirationTime);
      }
    } else {
      shouldUpdate = updateClassInstance(current, workInProgress, renderExpirationTime);
    }
    return finishClassComponent(current, workInProgress, shouldUpdate, hasContext);
  }

  function finishClassComponent(current, workInProgress, shouldUpdate, hasContext) {
    // Refs should update even if shouldComponentUpdate returns false
    markRef(current, workInProgress);

    if (!shouldUpdate) {
      // Context providers should defer to sCU for rendering
      if (hasContext) {
        invalidateContextProvider(workInProgress, false);
      }

      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    var instance = workInProgress.stateNode;

    // Rerender
    ReactCurrentOwner.current = workInProgress;
    var nextChildren = void 0;
    {
      ReactDebugCurrentFiber.setCurrentPhase('render');
      nextChildren = instance.render();
      if (debugRenderPhaseSideEffects) {
        instance.render();
      }
      ReactDebugCurrentFiber.setCurrentPhase(null);
    }
    // React DevTools reads this flag.
    workInProgress.effectTag |= PerformedWork;
    reconcileChildren(current, workInProgress, nextChildren);
    // Memoize props and state using the values we just used to render.
    // TODO: Restructure so we never read values from the instance.
    memoizeState(workInProgress, instance.state);
    memoizeProps(workInProgress, instance.props);

    // The context might have changed so we need to recalculate it.
    if (hasContext) {
      invalidateContextProvider(workInProgress, true);
    }

    return workInProgress.child;
  }

  function pushHostRootContext(workInProgress) {
    var root = workInProgress.stateNode;
    if (root.pendingContext) {
      pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context);
    } else if (root.context) {
      // Should always be set
      pushTopLevelContextObject(workInProgress, root.context, false);
    }
    pushHostContainer(workInProgress, root.containerInfo);
  }

  function updateHostRoot(current, workInProgress, renderExpirationTime) {
    pushHostRootContext(workInProgress);
    var updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
      var prevState = workInProgress.memoizedState;
      var state = processUpdateQueue(current, workInProgress, updateQueue, null, null, renderExpirationTime);
      if (prevState === state) {
        // If the state is the same as before, that's a bailout because we had
        // no work that expires at this time.
        resetHydrationState();
        return bailoutOnAlreadyFinishedWork(current, workInProgress);
      }
      var element = state.element;
      var root = workInProgress.stateNode;
      if ((current === null || current.child === null) && root.hydrate && enterHydrationState(workInProgress)) {
        // If we don't have any current children this might be the first pass.
        // We always try to hydrate. If this isn't a hydration pass there won't
        // be any children to hydrate which is effectively the same thing as
        // not hydrating.

        // This is a bit of a hack. We track the host root as a placement to
        // know that we're currently in a mounting state. That way isMounted
        // works as expected. We must reset this before committing.
        // TODO: Delete this when we delete isMounted and findDOMNode.
        workInProgress.effectTag |= Placement;

        // Ensure that children mount into this root without tracking
        // side-effects. This ensures that we don't store Placement effects on
        // nodes that will be hydrated.
        workInProgress.child = mountChildFibers(workInProgress, null, element, renderExpirationTime);
      } else {
        // Otherwise reset hydration state in case we aborted and resumed another
        // root.
        resetHydrationState();
        reconcileChildren(current, workInProgress, element);
      }
      memoizeState(workInProgress, state);
      return workInProgress.child;
    }
    resetHydrationState();
    // If there is no update queue, that's a bailout because the root has no props.
    return bailoutOnAlreadyFinishedWork(current, workInProgress);
  }

  function updateHostComponent(current, workInProgress, renderExpirationTime) {
    pushHostContext(workInProgress);

    if (current === null) {
      tryToClaimNextHydratableInstance(workInProgress);
    }

    var type = workInProgress.type;
    var memoizedProps = workInProgress.memoizedProps;
    var nextProps = workInProgress.pendingProps;
    if (nextProps === null) {
      nextProps = memoizedProps;
      !(nextProps !== null) ? invariant(false, 'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    }
    var prevProps = current !== null ? current.memoizedProps : null;

    if (hasContextChanged()) {
      // Normally we can bail out on props equality but if context has changed
      // we don't do the bailout and we have to reuse existing props instead.
    } else if (nextProps === null || memoizedProps === nextProps) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    var nextChildren = nextProps.children;
    var isDirectTextChild = shouldSetTextContent(type, nextProps);

    if (isDirectTextChild) {
      // We special case a direct text child of a host node. This is a common
      // case. We won't handle it as a reified child. We will instead handle
      // this in the host environment that also have access to this prop. That
      // avoids allocating another HostText fiber and traversing it.
      nextChildren = null;
    } else if (prevProps && shouldSetTextContent(type, prevProps)) {
      // If we're switching from a direct text child to a normal child, or to
      // empty, we need to schedule the text content to be reset.
      workInProgress.effectTag |= ContentReset;
    }

    markRef(current, workInProgress);

    // Check the host config to see if the children are offscreen/hidden.
    if (renderExpirationTime !== Never && !useSyncScheduling && shouldDeprioritizeSubtree(type, nextProps)) {
      // Down-prioritize the children.
      workInProgress.expirationTime = Never;
      // Bailout and come back to this fiber later.
      return null;
    }

    reconcileChildren(current, workInProgress, nextChildren);
    memoizeProps(workInProgress, nextProps);
    return workInProgress.child;
  }

  function updateHostText(current, workInProgress) {
    if (current === null) {
      tryToClaimNextHydratableInstance(workInProgress);
    }
    var nextProps = workInProgress.pendingProps;
    if (nextProps === null) {
      nextProps = workInProgress.memoizedProps;
    }
    memoizeProps(workInProgress, nextProps);
    // Nothing to do here. This is terminal. We'll do the completion step
    // immediately after.
    return null;
  }

  function mountIndeterminateComponent(current, workInProgress, renderExpirationTime) {
    !(current === null) ? invariant(false, 'An indeterminate component should never have mounted. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    var fn = workInProgress.type;
    var props = workInProgress.pendingProps;
    var unmaskedContext = getUnmaskedContext(workInProgress);
    var context = getMaskedContext(workInProgress, unmaskedContext);

    var value;

    {
      if (fn.prototype && typeof fn.prototype.render === 'function') {
        var componentName = getComponentName(workInProgress);
        warning(false, "The <%s /> component appears to have a render method, but doesn't extend React.Component. " + 'This is likely to cause errors. Change %s to extend React.Component instead.', componentName, componentName);
      }
      ReactCurrentOwner.current = workInProgress;
      value = fn(props, context);
    }
    // React DevTools reads this flag.
    workInProgress.effectTag |= PerformedWork;

    if (typeof value === 'object' && value !== null && typeof value.render === 'function') {
      // Proceed under the assumption that this is a class instance
      workInProgress.tag = ClassComponent;

      // Push context providers early to prevent context stack mismatches.
      // During mounting we don't know the child context yet as the instance doesn't exist.
      // We will invalidate the child context in finishClassComponent() right after rendering.
      var hasContext = pushContextProvider(workInProgress);
      adoptClassInstance(workInProgress, value);
      mountClassInstance(workInProgress, renderExpirationTime);
      return finishClassComponent(current, workInProgress, true, hasContext);
    } else {
      // Proceed under the assumption that this is a functional component
      workInProgress.tag = FunctionalComponent;
      {
        var Component = workInProgress.type;

        if (Component) {
          warning(!Component.childContextTypes, '%s(...): childContextTypes cannot be defined on a functional component.', Component.displayName || Component.name || 'Component');
        }
        if (workInProgress.ref !== null) {
          var info = '';
          var ownerName = ReactDebugCurrentFiber.getCurrentFiberOwnerName();
          if (ownerName) {
            info += '\n\nCheck the render method of `' + ownerName + '`.';
          }

          var warningKey = ownerName || workInProgress._debugID || '';
          var debugSource = workInProgress._debugSource;
          if (debugSource) {
            warningKey = debugSource.fileName + ':' + debugSource.lineNumber;
          }
          if (!warnedAboutStatelessRefs[warningKey]) {
            warnedAboutStatelessRefs[warningKey] = true;
            warning(false, 'Stateless function components cannot be given refs. ' + 'Attempts to access this ref will fail.%s%s', info, ReactDebugCurrentFiber.getCurrentFiberStackAddendum());
          }
        }
      }
      reconcileChildren(current, workInProgress, value);
      memoizeProps(workInProgress, props);
      return workInProgress.child;
    }
  }

  function updateCallComponent(current, workInProgress, renderExpirationTime) {
    var nextCall = workInProgress.pendingProps;
    if (hasContextChanged()) {
      // Normally we can bail out on props equality but if context has changed
      // we don't do the bailout and we have to reuse existing props instead.
      if (nextCall === null) {
        nextCall = current && current.memoizedProps;
        !(nextCall !== null) ? invariant(false, 'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
      }
    } else if (nextCall === null || workInProgress.memoizedProps === nextCall) {
      nextCall = workInProgress.memoizedProps;
      // TODO: When bailing out, we might need to return the stateNode instead
      // of the child. To check it for work.
      // return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    var nextChildren = nextCall.children;

    // The following is a fork of reconcileChildrenAtExpirationTime but using
    // stateNode to store the child.
    if (current === null) {
      workInProgress.stateNode = mountChildFibers(workInProgress, workInProgress.stateNode, nextChildren, renderExpirationTime);
    } else {
      workInProgress.stateNode = reconcileChildFibers(workInProgress, workInProgress.stateNode, nextChildren, renderExpirationTime);
    }

    memoizeProps(workInProgress, nextCall);
    // This doesn't take arbitrary time so we could synchronously just begin
    // eagerly do the work of workInProgress.child as an optimization.
    return workInProgress.stateNode;
  }

  function updatePortalComponent(current, workInProgress, renderExpirationTime) {
    pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
    var nextChildren = workInProgress.pendingProps;
    if (hasContextChanged()) {
      // Normally we can bail out on props equality but if context has changed
      // we don't do the bailout and we have to reuse existing props instead.
      if (nextChildren === null) {
        nextChildren = current && current.memoizedProps;
        !(nextChildren != null) ? invariant(false, 'We should always have pending or current props. This error is likely caused by a bug in React. Please file an issue.') : void 0;
      }
    } else if (nextChildren === null || workInProgress.memoizedProps === nextChildren) {
      return bailoutOnAlreadyFinishedWork(current, workInProgress);
    }

    if (current === null) {
      // Portals are special because we don't append the children during mount
      // but at commit. Therefore we need to track insertions which the normal
      // flow doesn't do during mount. This doesn't happen at the root because
      // the root always starts with a "current" with a null child.
      // TODO: Consider unifying this with how the root works.
      workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
      memoizeProps(workInProgress, nextChildren);
    } else {
      reconcileChildren(current, workInProgress, nextChildren);
      memoizeProps(workInProgress, nextChildren);
    }
    return workInProgress.child;
  }

  /*
  function reuseChildrenEffects(returnFiber : Fiber, firstChild : Fiber) {
    let child = firstChild;
    do {
      // Ensure that the first and last effect of the parent corresponds
      // to the children's first and last effect.
      if (!returnFiber.firstEffect) {
        returnFiber.firstEffect = child.firstEffect;
      }
      if (child.lastEffect) {
        if (returnFiber.lastEffect) {
          returnFiber.lastEffect.nextEffect = child.firstEffect;
        }
        returnFiber.lastEffect = child.lastEffect;
      }
    } while (child = child.sibling);
  }
  */

  function bailoutOnAlreadyFinishedWork(current, workInProgress) {
    cancelWorkTimer(workInProgress);

    // TODO: We should ideally be able to bail out early if the children have no
    // more work to do. However, since we don't have a separation of this
    // Fiber's priority and its children yet - we don't know without doing lots
    // of the same work we do anyway. Once we have that separation we can just
    // bail out here if the children has no more work at this priority level.
    // if (workInProgress.priorityOfChildren <= priorityLevel) {
    //   // If there are side-effects in these children that have not yet been
    //   // committed we need to ensure that they get properly transferred up.
    //   if (current && current.child !== workInProgress.child) {
    //     reuseChildrenEffects(workInProgress, child);
    //   }
    //   return null;
    // }

    cloneChildFibers(current, workInProgress);
    return workInProgress.child;
  }

  function bailoutOnLowPriority(current, workInProgress) {
    cancelWorkTimer(workInProgress);

    // TODO: Handle HostComponent tags here as well and call pushHostContext()?
    // See PR 8590 discussion for context
    switch (workInProgress.tag) {
      case HostRoot:
        pushHostRootContext(workInProgress);
        break;
      case ClassComponent:
        pushContextProvider(workInProgress);
        break;
      case HostPortal:
        pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
        break;
    }
    // TODO: What if this is currently in progress?
    // How can that happen? How is this not being cloned?
    return null;
  }

  // TODO: Delete memoizeProps/State and move to reconcile/bailout instead
  function memoizeProps(workInProgress, nextProps) {
    workInProgress.memoizedProps = nextProps;
  }

  function memoizeState(workInProgress, nextState) {
    workInProgress.memoizedState = nextState;
    // Don't reset the updateQueue, in case there are pending updates. Resetting
    // is handled by processUpdateQueue.
  }

  function beginWork(current, workInProgress, renderExpirationTime) {
    if (workInProgress.expirationTime === NoWork || workInProgress.expirationTime > renderExpirationTime) {
      return bailoutOnLowPriority(current, workInProgress);
    }

    switch (workInProgress.tag) {
      case IndeterminateComponent:
        return mountIndeterminateComponent(current, workInProgress, renderExpirationTime);
      case FunctionalComponent:
        return updateFunctionalComponent(current, workInProgress);
      case ClassComponent:
        return updateClassComponent(current, workInProgress, renderExpirationTime);
      case HostRoot:
        return updateHostRoot(current, workInProgress, renderExpirationTime);
      case HostComponent:
        return updateHostComponent(current, workInProgress, renderExpirationTime);
      case HostText:
        return updateHostText(current, workInProgress);
      case CallHandlerPhase:
        // This is a restart. Reset the tag to the initial phase.
        workInProgress.tag = CallComponent;
      // Intentionally fall through since this is now the same.
      case CallComponent:
        return updateCallComponent(current, workInProgress, renderExpirationTime);
      case ReturnComponent:
        // A return component is just a placeholder, we can just run through the
        // next one immediately.
        return null;
      case HostPortal:
        return updatePortalComponent(current, workInProgress, renderExpirationTime);
      case Fragment:
        return updateFragment(current, workInProgress);
      default:
        invariant(false, 'Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.');
    }
  }

  function beginFailedWork(current, workInProgress, renderExpirationTime) {
    // Push context providers here to avoid a push/pop context mismatch.
    switch (workInProgress.tag) {
      case ClassComponent:
        pushContextProvider(workInProgress);
        break;
      case HostRoot:
        pushHostRootContext(workInProgress);
        break;
      default:
        invariant(false, 'Invalid type of work. This error is likely caused by a bug in React. Please file an issue.');
    }

    // Add an error effect so we can handle the error during the commit phase
    workInProgress.effectTag |= Err;

    // This is a weird case where we do "resume" work — work that failed on
    // our first attempt. Because we no longer have a notion of "progressed
    // deletions," reset the child to the current child to make sure we delete
    // it again. TODO: Find a better way to handle this, perhaps during a more
    // general overhaul of error handling.
    if (current === null) {
      workInProgress.child = null;
    } else if (workInProgress.child !== current.child) {
      workInProgress.child = current.child;
    }

    if (workInProgress.expirationTime === NoWork || workInProgress.expirationTime > renderExpirationTime) {
      return bailoutOnLowPriority(current, workInProgress);
    }

    // If we don't bail out, we're going be recomputing our children so we need
    // to drop our effect list.
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;

    // Unmount the current children as if the component rendered null
    var nextChildren = null;
    reconcileChildrenAtExpirationTime(current, workInProgress, nextChildren, renderExpirationTime);

    if (workInProgress.tag === ClassComponent) {
      var instance = workInProgress.stateNode;
      workInProgress.memoizedProps = instance.props;
      workInProgress.memoizedState = instance.state;
    }

    return workInProgress.child;
  }

  return {
    beginWork: beginWork,
    beginFailedWork: beginFailedWork
  };
};

var ReactFiberCompleteWork = function (config, hostContext, hydrationContext) {
  var createInstance = config.createInstance,
      createTextInstance = config.createTextInstance,
      appendInitialChild = config.appendInitialChild,
      finalizeInitialChildren = config.finalizeInitialChildren,
      prepareUpdate = config.prepareUpdate,
      mutation = config.mutation,
      persistence = config.persistence;
  var getRootHostContainer = hostContext.getRootHostContainer,
      popHostContext = hostContext.popHostContext,
      getHostContext = hostContext.getHostContext,
      popHostContainer = hostContext.popHostContainer;
  var prepareToHydrateHostInstance = hydrationContext.prepareToHydrateHostInstance,
      prepareToHydrateHostTextInstance = hydrationContext.prepareToHydrateHostTextInstance,
      popHydrationState = hydrationContext.popHydrationState;


  function markUpdate(workInProgress) {
    // Tag the fiber with an update effect. This turns a Placement into
    // an UpdateAndPlacement.
    workInProgress.effectTag |= Update;
  }

  function markRef(workInProgress) {
    workInProgress.effectTag |= Ref;
  }

  function appendAllReturns(returns, workInProgress) {
    var node = workInProgress.stateNode;
    if (node) {
      node['return'] = workInProgress;
    }
    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText || node.tag === HostPortal) {
        invariant(false, 'A call cannot have host component children.');
      } else if (node.tag === ReturnComponent) {
        returns.push(node.type);
      } else if (node.child !== null) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      while (node.sibling === null) {
        if (node['return'] === null || node['return'] === workInProgress) {
          return;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
  }

  function moveCallToHandlerPhase(current, workInProgress, renderExpirationTime) {
    var call = workInProgress.memoizedProps;
    !call ? invariant(false, 'Should be resolved by now. This error is likely caused by a bug in React. Please file an issue.') : void 0;

    // First step of the call has completed. Now we need to do the second.
    // TODO: It would be nice to have a multi stage call represented by a
    // single component, or at least tail call optimize nested ones. Currently
    // that requires additional fields that we don't want to add to the fiber.
    // So this requires nested handlers.
    // Note: This doesn't mutate the alternate node. I don't think it needs to
    // since this stage is reset for every pass.
    workInProgress.tag = CallHandlerPhase;

    // Build up the returns.
    // TODO: Compare this to a generator or opaque helpers like Children.
    var returns = [];
    appendAllReturns(returns, workInProgress);
    var fn = call.handler;
    var props = call.props;
    var nextChildren = fn(props, returns);

    var currentFirstChild = current !== null ? current.child : null;
    workInProgress.child = reconcileChildFibers(workInProgress, currentFirstChild, nextChildren, renderExpirationTime);
    return workInProgress.child;
  }

  function appendAllChildren(parent, workInProgress) {
    // We only have the top Fiber that was created but we need recurse down its
    // children to find all the terminal nodes.
    var node = workInProgress.child;
    while (node !== null) {
      if (node.tag === HostComponent || node.tag === HostText) {
        appendInitialChild(parent, node.stateNode);
      } else if (node.tag === HostPortal) {
        // If we have a portal child, then we don't want to traverse
        // down its children. Instead, we'll get insertions from each child in
        // the portal directly.
      } else if (node.child !== null) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      if (node === workInProgress) {
        return;
      }
      while (node.sibling === null) {
        if (node['return'] === null || node['return'] === workInProgress) {
          return;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
  }

  var updateHostContainer = void 0;
  var updateHostComponent = void 0;
  var updateHostText = void 0;
  if (mutation) {
    if (enableMutatingReconciler) {
      // Mutation mode
      updateHostContainer = function (workInProgress) {
        // Noop
      };
      updateHostComponent = function (current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance) {
        // TODO: Type this specific to this type of component.
        workInProgress.updateQueue = updatePayload;
        // If the update payload indicates that there is a change or if there
        // is a new ref we mark this as an update. All the work is done in commitWork.
        if (updatePayload) {
          markUpdate(workInProgress);
        }
      };
      updateHostText = function (current, workInProgress, oldText, newText) {
        // If the text differs, mark it as an update. All the work in done in commitWork.
        if (oldText !== newText) {
          markUpdate(workInProgress);
        }
      };
    } else {
      invariant(false, 'Mutating reconciler is disabled.');
    }
  } else if (persistence) {
    if (enablePersistentReconciler) {
      // Persistent host tree mode
      var cloneInstance = persistence.cloneInstance,
          createContainerChildSet = persistence.createContainerChildSet,
          appendChildToContainerChildSet = persistence.appendChildToContainerChildSet,
          finalizeContainerChildren = persistence.finalizeContainerChildren;

      // An unfortunate fork of appendAllChildren because we have two different parent types.

      var appendAllChildrenToContainer = function (containerChildSet, workInProgress) {
        // We only have the top Fiber that was created but we need recurse down its
        // children to find all the terminal nodes.
        var node = workInProgress.child;
        while (node !== null) {
          if (node.tag === HostComponent || node.tag === HostText) {
            appendChildToContainerChildSet(containerChildSet, node.stateNode);
          } else if (node.tag === HostPortal) {
            // If we have a portal child, then we don't want to traverse
            // down its children. Instead, we'll get insertions from each child in
            // the portal directly.
          } else if (node.child !== null) {
            node.child['return'] = node;
            node = node.child;
            continue;
          }
          if (node === workInProgress) {
            return;
          }
          while (node.sibling === null) {
            if (node['return'] === null || node['return'] === workInProgress) {
              return;
            }
            node = node['return'];
          }
          node.sibling['return'] = node['return'];
          node = node.sibling;
        }
      };
      updateHostContainer = function (workInProgress) {
        var portalOrRoot = workInProgress.stateNode;
        var childrenUnchanged = workInProgress.firstEffect === null;
        if (childrenUnchanged) {
          // No changes, just reuse the existing instance.
        } else {
          var container = portalOrRoot.containerInfo;
          var newChildSet = createContainerChildSet(container);
          if (finalizeContainerChildren(container, newChildSet)) {
            markUpdate(workInProgress);
          }
          portalOrRoot.pendingChildren = newChildSet;
          // If children might have changed, we have to add them all to the set.
          appendAllChildrenToContainer(newChildSet, workInProgress);
          // Schedule an update on the container to swap out the container.
          markUpdate(workInProgress);
        }
      };
      updateHostComponent = function (current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance) {
        // If there are no effects associated with this node, then none of our children had any updates.
        // This guarantees that we can reuse all of them.
        var childrenUnchanged = workInProgress.firstEffect === null;
        var currentInstance = current.stateNode;
        if (childrenUnchanged && updatePayload === null) {
          // No changes, just reuse the existing instance.
          // Note that this might release a previous clone.
          workInProgress.stateNode = currentInstance;
        } else {
          var recyclableInstance = workInProgress.stateNode;
          var newInstance = cloneInstance(currentInstance, updatePayload, type, oldProps, newProps, workInProgress, childrenUnchanged, recyclableInstance);
          if (finalizeInitialChildren(newInstance, type, newProps, rootContainerInstance)) {
            markUpdate(workInProgress);
          }
          workInProgress.stateNode = newInstance;
          if (childrenUnchanged) {
            // If there are no other effects in this tree, we need to flag this node as having one.
            // Even though we're not going to use it for anything.
            // Otherwise parents won't know that there are new children to propagate upwards.
            markUpdate(workInProgress);
          } else {
            // If children might have changed, we have to add them all to the set.
            appendAllChildren(newInstance, workInProgress);
          }
        }
      };
      updateHostText = function (current, workInProgress, oldText, newText) {
        if (oldText !== newText) {
          // If the text content differs, we'll create a new text instance for it.
          var rootContainerInstance = getRootHostContainer();
          var currentHostContext = getHostContext();
          workInProgress.stateNode = createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
          // We'll have to mark it as having an effect, even though we won't use the effect for anything.
          // This lets the parents know that at least one of their children has changed.
          markUpdate(workInProgress);
        }
      };
    } else {
      invariant(false, 'Persistent reconciler is disabled.');
    }
  } else {
    if (enableNoopReconciler) {
      // No host operations
      updateHostContainer = function (workInProgress) {
        // Noop
      };
      updateHostComponent = function (current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance) {
        // Noop
      };
      updateHostText = function (current, workInProgress, oldText, newText) {
        // Noop
      };
    } else {
      invariant(false, 'Noop reconciler is disabled.');
    }
  }

  function completeWork(current, workInProgress, renderExpirationTime) {
    // Get the latest props.
    var newProps = workInProgress.pendingProps;
    if (newProps === null) {
      newProps = workInProgress.memoizedProps;
    } else if (workInProgress.expirationTime !== Never || renderExpirationTime === Never) {
      // Reset the pending props, unless this was a down-prioritization.
      workInProgress.pendingProps = null;
    }

    switch (workInProgress.tag) {
      case FunctionalComponent:
        return null;
      case ClassComponent:
        {
          // We are leaving this subtree, so pop context if any.
          popContextProvider(workInProgress);
          return null;
        }
      case HostRoot:
        {
          popHostContainer(workInProgress);
          popTopLevelContextObject(workInProgress);
          var fiberRoot = workInProgress.stateNode;
          if (fiberRoot.pendingContext) {
            fiberRoot.context = fiberRoot.pendingContext;
            fiberRoot.pendingContext = null;
          }

          if (current === null || current.child === null) {
            // If we hydrated, pop so that we can delete any remaining children
            // that weren't hydrated.
            popHydrationState(workInProgress);
            // This resets the hacky state to fix isMounted before committing.
            // TODO: Delete this when we delete isMounted and findDOMNode.
            workInProgress.effectTag &= ~Placement;
          }
          updateHostContainer(workInProgress);
          return null;
        }
      case HostComponent:
        {
          popHostContext(workInProgress);
          var rootContainerInstance = getRootHostContainer();
          var type = workInProgress.type;
          if (current !== null && workInProgress.stateNode != null) {
            // If we have an alternate, that means this is an update and we need to
            // schedule a side-effect to do the updates.
            var oldProps = current.memoizedProps;
            // If we get updated because one of our children updated, we don't
            // have newProps so we'll have to reuse them.
            // TODO: Split the update API as separate for the props vs. children.
            // Even better would be if children weren't special cased at all tho.
            var instance = workInProgress.stateNode;
            var currentHostContext = getHostContext();
            var updatePayload = prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, currentHostContext);

            updateHostComponent(current, workInProgress, updatePayload, type, oldProps, newProps, rootContainerInstance);

            if (current.ref !== workInProgress.ref) {
              markRef(workInProgress);
            }
          } else {
            if (!newProps) {
              !(workInProgress.stateNode !== null) ? invariant(false, 'We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.') : void 0;
              // This can happen when we abort work.
              return null;
            }

            var _currentHostContext = getHostContext();
            // TODO: Move createInstance to beginWork and keep it on a context
            // "stack" as the parent. Then append children as we go in beginWork
            // or completeWork depending on we want to add then top->down or
            // bottom->up. Top->down is faster in IE11.
            var wasHydrated = popHydrationState(workInProgress);
            if (wasHydrated) {
              // TODO: Move this and createInstance step into the beginPhase
              // to consolidate.
              if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, _currentHostContext)) {
                // If changes to the hydrated node needs to be applied at the
                // commit-phase we mark this as such.
                markUpdate(workInProgress);
              }
            } else {
              var _instance = createInstance(type, newProps, rootContainerInstance, _currentHostContext, workInProgress);

              appendAllChildren(_instance, workInProgress);

              // Certain renderers require commit-time effects for initial mount.
              // (eg DOM renderer supports auto-focus for certain elements).
              // Make sure such renderers get scheduled for later work.
              if (finalizeInitialChildren(_instance, type, newProps, rootContainerInstance)) {
                markUpdate(workInProgress);
              }
              workInProgress.stateNode = _instance;
            }

            if (workInProgress.ref !== null) {
              // If there is a ref on a host node we need to schedule a callback
              markRef(workInProgress);
            }
          }
          return null;
        }
      case HostText:
        {
          var newText = newProps;
          if (current && workInProgress.stateNode != null) {
            var oldText = current.memoizedProps;
            // If we have an alternate, that means this is an update and we need
            // to schedule a side-effect to do the updates.
            updateHostText(current, workInProgress, oldText, newText);
          } else {
            if (typeof newText !== 'string') {
              !(workInProgress.stateNode !== null) ? invariant(false, 'We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.') : void 0;
              // This can happen when we abort work.
              return null;
            }
            var _rootContainerInstance = getRootHostContainer();
            var _currentHostContext2 = getHostContext();
            var _wasHydrated = popHydrationState(workInProgress);
            if (_wasHydrated) {
              if (prepareToHydrateHostTextInstance(workInProgress)) {
                markUpdate(workInProgress);
              }
            } else {
              workInProgress.stateNode = createTextInstance(newText, _rootContainerInstance, _currentHostContext2, workInProgress);
            }
          }
          return null;
        }
      case CallComponent:
        return moveCallToHandlerPhase(current, workInProgress, renderExpirationTime);
      case CallHandlerPhase:
        // Reset the tag to now be a first phase call.
        workInProgress.tag = CallComponent;
        return null;
      case ReturnComponent:
        // Does nothing.
        return null;
      case Fragment:
        return null;
      case HostPortal:
        popHostContainer(workInProgress);
        updateHostContainer(workInProgress);
        return null;
      // Error cases
      case IndeterminateComponent:
        invariant(false, 'An indeterminate component should have become determinate before completing. This error is likely caused by a bug in React. Please file an issue.');
      // eslint-disable-next-line no-fallthrough
      default:
        invariant(false, 'Unknown unit of work tag. This error is likely caused by a bug in React. Please file an issue.');
    }
  }

  return {
    completeWork: completeWork
  };
};

var invokeGuardedCallback$2 = ReactErrorUtils.invokeGuardedCallback;
var hasCaughtError$1 = ReactErrorUtils.hasCaughtError;
var clearCaughtError$1 = ReactErrorUtils.clearCaughtError;


var ReactFiberCommitWork = function (config, captureError) {
  var getPublicInstance = config.getPublicInstance,
      mutation = config.mutation,
      persistence = config.persistence;


  var callComponentWillUnmountWithTimer = function (current, instance) {
    startPhaseTimer(current, 'componentWillUnmount');
    instance.props = current.memoizedProps;
    instance.state = current.memoizedState;
    instance.componentWillUnmount();
    stopPhaseTimer();
  };

  // Capture errors so they don't interrupt unmounting.
  function safelyCallComponentWillUnmount(current, instance) {
    {
      invokeGuardedCallback$2(null, callComponentWillUnmountWithTimer, null, current, instance);
      if (hasCaughtError$1()) {
        var unmountError = clearCaughtError$1();
        captureError(current, unmountError);
      }
    }
  }

  function safelyDetachRef(current) {
    var ref = current.ref;
    if (ref !== null) {
      {
        invokeGuardedCallback$2(null, ref, null, null);
        if (hasCaughtError$1()) {
          var refError = clearCaughtError$1();
          captureError(current, refError);
        }
      }
    }
  }

  function commitLifeCycles(current, finishedWork) {
    switch (finishedWork.tag) {
      case ClassComponent:
        {
          var instance = finishedWork.stateNode;
          if (finishedWork.effectTag & Update) {
            if (current === null) {
              startPhaseTimer(finishedWork, 'componentDidMount');
              instance.props = finishedWork.memoizedProps;
              instance.state = finishedWork.memoizedState;
              instance.componentDidMount();
              stopPhaseTimer();
            } else {
              var prevProps = current.memoizedProps;
              var prevState = current.memoizedState;
              startPhaseTimer(finishedWork, 'componentDidUpdate');
              instance.props = finishedWork.memoizedProps;
              instance.state = finishedWork.memoizedState;
              instance.componentDidUpdate(prevProps, prevState);
              stopPhaseTimer();
            }
          }
          var updateQueue = finishedWork.updateQueue;
          if (updateQueue !== null) {
            commitCallbacks(updateQueue, instance);
          }
          return;
        }
      case HostRoot:
        {
          var _updateQueue = finishedWork.updateQueue;
          if (_updateQueue !== null) {
            var _instance = finishedWork.child !== null ? finishedWork.child.stateNode : null;
            commitCallbacks(_updateQueue, _instance);
          }
          return;
        }
      case HostComponent:
        {
          var _instance2 = finishedWork.stateNode;

          // Renderers may schedule work to be done after host components are mounted
          // (eg DOM renderer may schedule auto-focus for inputs and form controls).
          // These effects should only be committed when components are first mounted,
          // aka when there is no current/alternate.
          if (current === null && finishedWork.effectTag & Update) {
            var type = finishedWork.type;
            var props = finishedWork.memoizedProps;
            commitMount(_instance2, type, props, finishedWork);
          }

          return;
        }
      case HostText:
        {
          // We have no life-cycles associated with text.
          return;
        }
      case HostPortal:
        {
          // We have no life-cycles associated with portals.
          return;
        }
      default:
        {
          invariant(false, 'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.');
        }
    }
  }

  function commitAttachRef(finishedWork) {
    var ref = finishedWork.ref;
    if (ref !== null) {
      var instance = finishedWork.stateNode;
      switch (finishedWork.tag) {
        case HostComponent:
          ref(getPublicInstance(instance));
          break;
        default:
          ref(instance);
      }
    }
  }

  function commitDetachRef(current) {
    var currentRef = current.ref;
    if (currentRef !== null) {
      currentRef(null);
    }
  }

  // User-originating errors (lifecycles and refs) should not interrupt
  // deletion, so don't let them throw. Host-originating errors should
  // interrupt deletion, so it's okay
  function commitUnmount(current) {
    if (typeof onCommitUnmount === 'function') {
      onCommitUnmount(current);
    }

    switch (current.tag) {
      case ClassComponent:
        {
          safelyDetachRef(current);
          var instance = current.stateNode;
          if (typeof instance.componentWillUnmount === 'function') {
            safelyCallComponentWillUnmount(current, instance);
          }
          return;
        }
      case HostComponent:
        {
          safelyDetachRef(current);
          return;
        }
      case CallComponent:
        {
          commitNestedUnmounts(current.stateNode);
          return;
        }
      case HostPortal:
        {
          // TODO: this is recursive.
          // We are also not using this parent because
          // the portal will get pushed immediately.
          if (enableMutatingReconciler && mutation) {
            unmountHostComponents(current);
          } else if (enablePersistentReconciler && persistence) {
            emptyPortalContainer(current);
          }
          return;
        }
    }
  }

  function commitNestedUnmounts(root) {
    // While we're inside a removed host node we don't want to call
    // removeChild on the inner nodes because they're removed by the top
    // call anyway. We also want to call componentWillUnmount on all
    // composites before this host node is removed from the tree. Therefore
    var node = root;
    while (true) {
      commitUnmount(node);
      // Visit children because they may contain more composite or host nodes.
      // Skip portals because commitUnmount() currently visits them recursively.
      if (node.child !== null && (
      // If we use mutation we drill down into portals using commitUnmount above.
      // If we don't use mutation we drill down into portals here instead.
      !mutation || node.tag !== HostPortal)) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      if (node === root) {
        return;
      }
      while (node.sibling === null) {
        if (node['return'] === null || node['return'] === root) {
          return;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
  }

  function detachFiber(current) {
    // Cut off the return pointers to disconnect it from the tree. Ideally, we
    // should clear the child pointer of the parent alternate to let this
    // get GC:ed but we don't know which for sure which parent is the current
    // one so we'll settle for GC:ing the subtree of this child. This child
    // itself will be GC:ed when the parent updates the next time.
    current['return'] = null;
    current.child = null;
    if (current.alternate) {
      current.alternate.child = null;
      current.alternate['return'] = null;
    }
  }

  if (!mutation) {
    var commitContainer = void 0;
    if (persistence) {
      var replaceContainerChildren = persistence.replaceContainerChildren,
          createContainerChildSet = persistence.createContainerChildSet;

      var emptyPortalContainer = function (current) {
        var portal = current.stateNode;
        var containerInfo = portal.containerInfo;

        var emptyChildSet = createContainerChildSet(containerInfo);
        replaceContainerChildren(containerInfo, emptyChildSet);
      };
      commitContainer = function (finishedWork) {
        switch (finishedWork.tag) {
          case ClassComponent:
            {
              return;
            }
          case HostComponent:
            {
              return;
            }
          case HostText:
            {
              return;
            }
          case HostRoot:
          case HostPortal:
            {
              var portalOrRoot = finishedWork.stateNode;
              var containerInfo = portalOrRoot.containerInfo,
                  _pendingChildren = portalOrRoot.pendingChildren;

              replaceContainerChildren(containerInfo, _pendingChildren);
              return;
            }
          default:
            {
              invariant(false, 'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.');
            }
        }
      };
    } else {
      commitContainer = function (finishedWork) {
        // Noop
      };
    }
    if (enablePersistentReconciler || enableNoopReconciler) {
      return {
        commitResetTextContent: function (finishedWork) {},
        commitPlacement: function (finishedWork) {},
        commitDeletion: function (current) {
          // Detach refs and call componentWillUnmount() on the whole subtree.
          commitNestedUnmounts(current);
          detachFiber(current);
        },
        commitWork: function (current, finishedWork) {
          commitContainer(finishedWork);
        },

        commitLifeCycles: commitLifeCycles,
        commitAttachRef: commitAttachRef,
        commitDetachRef: commitDetachRef
      };
    } else if (persistence) {
      invariant(false, 'Persistent reconciler is disabled.');
    } else {
      invariant(false, 'Noop reconciler is disabled.');
    }
  }
  var commitMount = mutation.commitMount,
      commitUpdate = mutation.commitUpdate,
      resetTextContent = mutation.resetTextContent,
      commitTextUpdate = mutation.commitTextUpdate,
      appendChild = mutation.appendChild,
      appendChildToContainer = mutation.appendChildToContainer,
      insertBefore = mutation.insertBefore,
      insertInContainerBefore = mutation.insertInContainerBefore,
      removeChild = mutation.removeChild,
      removeChildFromContainer = mutation.removeChildFromContainer;


  function getHostParentFiber(fiber) {
    var parent = fiber['return'];
    while (parent !== null) {
      if (isHostParent(parent)) {
        return parent;
      }
      parent = parent['return'];
    }
    invariant(false, 'Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.');
  }

  function isHostParent(fiber) {
    return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
  }

  function getHostSibling(fiber) {
    // We're going to search forward into the tree until we find a sibling host
    // node. Unfortunately, if multiple insertions are done in a row we have to
    // search past them. This leads to exponential search for the next sibling.
    var node = fiber;
    siblings: while (true) {
      // If we didn't find anything, let's try the next sibling.
      while (node.sibling === null) {
        if (node['return'] === null || isHostParent(node['return'])) {
          // If we pop out of the root or hit the parent the fiber we are the
          // last sibling.
          return null;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
      while (node.tag !== HostComponent && node.tag !== HostText) {
        // If it is not host node and, we might have a host node inside it.
        // Try to search down until we find one.
        if (node.effectTag & Placement) {
          // If we don't have a child, try the siblings instead.
          continue siblings;
        }
        // If we don't have a child, try the siblings instead.
        // We also skip portals because they are not part of this host tree.
        if (node.child === null || node.tag === HostPortal) {
          continue siblings;
        } else {
          node.child['return'] = node;
          node = node.child;
        }
      }
      // Check if this host node is stable or about to be placed.
      if (!(node.effectTag & Placement)) {
        // Found it!
        return node.stateNode;
      }
    }
  }

  function commitPlacement(finishedWork) {
    // Recursively insert all host nodes into the parent.
    var parentFiber = getHostParentFiber(finishedWork);
    var parent = void 0;
    var isContainer = void 0;
    switch (parentFiber.tag) {
      case HostComponent:
        parent = parentFiber.stateNode;
        isContainer = false;
        break;
      case HostRoot:
        parent = parentFiber.stateNode.containerInfo;
        isContainer = true;
        break;
      case HostPortal:
        parent = parentFiber.stateNode.containerInfo;
        isContainer = true;
        break;
      default:
        invariant(false, 'Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.');
    }
    if (parentFiber.effectTag & ContentReset) {
      // Reset the text content of the parent before doing any insertions
      resetTextContent(parent);
      // Clear ContentReset from the effect tag
      parentFiber.effectTag &= ~ContentReset;
    }

    var before = getHostSibling(finishedWork);
    // We only have the top Fiber that was inserted but we need recurse down its
    // children to find all the terminal nodes.
    var node = finishedWork;
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText) {
        if (before) {
          if (isContainer) {
            insertInContainerBefore(parent, node.stateNode, before);
          } else {
            insertBefore(parent, node.stateNode, before);
          }
        } else {
          if (isContainer) {
            appendChildToContainer(parent, node.stateNode);
          } else {
            appendChild(parent, node.stateNode);
          }
        }
      } else if (node.tag === HostPortal) {
        // If the insertion itself is a portal, then we don't want to traverse
        // down its children. Instead, we'll get insertions from each child in
        // the portal directly.
      } else if (node.child !== null) {
        node.child['return'] = node;
        node = node.child;
        continue;
      }
      if (node === finishedWork) {
        return;
      }
      while (node.sibling === null) {
        if (node['return'] === null || node['return'] === finishedWork) {
          return;
        }
        node = node['return'];
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
  }

  function unmountHostComponents(current) {
    // We only have the top Fiber that was inserted but we need recurse down its
    var node = current;

    // Each iteration, currentParent is populated with node's host parent if not
    // currentParentIsValid.
    var currentParentIsValid = false;
    var currentParent = void 0;
    var currentParentIsContainer = void 0;

    while (true) {
      if (!currentParentIsValid) {
        var parent = node['return'];
        findParent: while (true) {
          !(parent !== null) ? invariant(false, 'Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          switch (parent.tag) {
            case HostComponent:
              currentParent = parent.stateNode;
              currentParentIsContainer = false;
              break findParent;
            case HostRoot:
              currentParent = parent.stateNode.containerInfo;
              currentParentIsContainer = true;
              break findParent;
            case HostPortal:
              currentParent = parent.stateNode.containerInfo;
              currentParentIsContainer = true;
              break findParent;
          }
          parent = parent['return'];
        }
        currentParentIsValid = true;
      }

      if (node.tag === HostComponent || node.tag === HostText) {
        commitNestedUnmounts(node);
        // After all the children have unmounted, it is now safe to remove the
        // node from the tree.
        if (currentParentIsContainer) {
          removeChildFromContainer(currentParent, node.stateNode);
        } else {
          removeChild(currentParent, node.stateNode);
        }
        // Don't visit children because we already visited them.
      } else if (node.tag === HostPortal) {
        // When we go into a portal, it becomes the parent to remove from.
        // We will reassign it back when we pop the portal on the way up.
        currentParent = node.stateNode.containerInfo;
        // Visit children because portals might contain host components.
        if (node.child !== null) {
          node.child['return'] = node;
          node = node.child;
          continue;
        }
      } else {
        commitUnmount(node);
        // Visit children because we may find more host components below.
        if (node.child !== null) {
          node.child['return'] = node;
          node = node.child;
          continue;
        }
      }
      if (node === current) {
        return;
      }
      while (node.sibling === null) {
        if (node['return'] === null || node['return'] === current) {
          return;
        }
        node = node['return'];
        if (node.tag === HostPortal) {
          // When we go out of the portal, we need to restore the parent.
          // Since we don't keep a stack of them, we will search for it.
          currentParentIsValid = false;
        }
      }
      node.sibling['return'] = node['return'];
      node = node.sibling;
    }
  }

  function commitDeletion(current) {
    // Recursively delete all host nodes from the parent.
    // Detach refs and call componentWillUnmount() on the whole subtree.
    unmountHostComponents(current);
    detachFiber(current);
  }

  function commitWork(current, finishedWork) {
    switch (finishedWork.tag) {
      case ClassComponent:
        {
          return;
        }
      case HostComponent:
        {
          var instance = finishedWork.stateNode;
          if (instance != null) {
            // Commit the work prepared earlier.
            var newProps = finishedWork.memoizedProps;
            // For hydration we reuse the update path but we treat the oldProps
            // as the newProps. The updatePayload will contain the real change in
            // this case.
            var oldProps = current !== null ? current.memoizedProps : newProps;
            var type = finishedWork.type;
            // TODO: Type the updateQueue to be specific to host components.
            var updatePayload = finishedWork.updateQueue;
            finishedWork.updateQueue = null;
            if (updatePayload !== null) {
              commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
            }
          }
          return;
        }
      case HostText:
        {
          !(finishedWork.stateNode !== null) ? invariant(false, 'This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          var textInstance = finishedWork.stateNode;
          var newText = finishedWork.memoizedProps;
          // For hydration we reuse the update path but we treat the oldProps
          // as the newProps. The updatePayload will contain the real change in
          // this case.
          var oldText = current !== null ? current.memoizedProps : newText;
          commitTextUpdate(textInstance, oldText, newText);
          return;
        }
      case HostRoot:
        {
          return;
        }
      default:
        {
          invariant(false, 'This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.');
        }
    }
  }

  function commitResetTextContent(current) {
    resetTextContent(current.stateNode);
  }

  if (enableMutatingReconciler) {
    return {
      commitResetTextContent: commitResetTextContent,
      commitPlacement: commitPlacement,
      commitDeletion: commitDeletion,
      commitWork: commitWork,
      commitLifeCycles: commitLifeCycles,
      commitAttachRef: commitAttachRef,
      commitDetachRef: commitDetachRef
    };
  } else {
    invariant(false, 'Mutating reconciler is disabled.');
  }
};

var NO_CONTEXT = {};

var ReactFiberHostContext = function (config) {
  var getChildHostContext = config.getChildHostContext,
      getRootHostContext = config.getRootHostContext;


  var contextStackCursor = createCursor(NO_CONTEXT);
  var contextFiberStackCursor = createCursor(NO_CONTEXT);
  var rootInstanceStackCursor = createCursor(NO_CONTEXT);

  function requiredContext(c) {
    !(c !== NO_CONTEXT) ? invariant(false, 'Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    return c;
  }

  function getRootHostContainer() {
    var rootInstance = requiredContext(rootInstanceStackCursor.current);
    return rootInstance;
  }

  function pushHostContainer(fiber, nextRootInstance) {
    // Push current root instance onto the stack;
    // This allows us to reset root when portals are popped.
    push(rootInstanceStackCursor, nextRootInstance, fiber);

    var nextRootContext = getRootHostContext(nextRootInstance);

    // Track the context and the Fiber that provided it.
    // This enables us to pop only Fibers that provide unique contexts.
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor, nextRootContext, fiber);
  }

  function popHostContainer(fiber) {
    pop(contextStackCursor, fiber);
    pop(contextFiberStackCursor, fiber);
    pop(rootInstanceStackCursor, fiber);
  }

  function getHostContext() {
    var context = requiredContext(contextStackCursor.current);
    return context;
  }

  function pushHostContext(fiber) {
    var rootInstance = requiredContext(rootInstanceStackCursor.current);
    var context = requiredContext(contextStackCursor.current);
    var nextContext = getChildHostContext(context, fiber.type, rootInstance);

    // Don't push this Fiber's context unless it's unique.
    if (context === nextContext) {
      return;
    }

    // Track the context and the Fiber that provided it.
    // This enables us to pop only Fibers that provide unique contexts.
    push(contextFiberStackCursor, fiber, fiber);
    push(contextStackCursor, nextContext, fiber);
  }

  function popHostContext(fiber) {
    // Do not pop unless this Fiber provided the current context.
    // pushHostContext() only pushes Fibers that provide unique contexts.
    if (contextFiberStackCursor.current !== fiber) {
      return;
    }

    pop(contextStackCursor, fiber);
    pop(contextFiberStackCursor, fiber);
  }

  function resetHostContainer() {
    contextStackCursor.current = NO_CONTEXT;
    rootInstanceStackCursor.current = NO_CONTEXT;
  }

  return {
    getHostContext: getHostContext,
    getRootHostContainer: getRootHostContainer,
    popHostContainer: popHostContainer,
    popHostContext: popHostContext,
    pushHostContainer: pushHostContainer,
    pushHostContext: pushHostContext,
    resetHostContainer: resetHostContainer
  };
};

var ReactFiberHydrationContext = function (config) {
  var shouldSetTextContent = config.shouldSetTextContent,
      hydration = config.hydration;

  // If this doesn't have hydration mode.

  if (!hydration) {
    return {
      enterHydrationState: function () {
        return false;
      },
      resetHydrationState: function () {},
      tryToClaimNextHydratableInstance: function () {},
      prepareToHydrateHostInstance: function () {
        invariant(false, 'Expected prepareToHydrateHostInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.');
      },
      prepareToHydrateHostTextInstance: function () {
        invariant(false, 'Expected prepareToHydrateHostTextInstance() to never be called. This error is likely caused by a bug in React. Please file an issue.');
      },
      popHydrationState: function (fiber) {
        return false;
      }
    };
  }

  var canHydrateInstance = hydration.canHydrateInstance,
      canHydrateTextInstance = hydration.canHydrateTextInstance,
      getNextHydratableSibling = hydration.getNextHydratableSibling,
      getFirstHydratableChild = hydration.getFirstHydratableChild,
      hydrateInstance = hydration.hydrateInstance,
      hydrateTextInstance = hydration.hydrateTextInstance,
      didNotMatchHydratedContainerTextInstance = hydration.didNotMatchHydratedContainerTextInstance,
      didNotMatchHydratedTextInstance = hydration.didNotMatchHydratedTextInstance,
      didNotHydrateContainerInstance = hydration.didNotHydrateContainerInstance,
      didNotHydrateInstance = hydration.didNotHydrateInstance,
      didNotFindHydratableContainerInstance = hydration.didNotFindHydratableContainerInstance,
      didNotFindHydratableContainerTextInstance = hydration.didNotFindHydratableContainerTextInstance,
      didNotFindHydratableInstance = hydration.didNotFindHydratableInstance,
      didNotFindHydratableTextInstance = hydration.didNotFindHydratableTextInstance;

  // The deepest Fiber on the stack involved in a hydration context.
  // This may have been an insertion or a hydration.

  var hydrationParentFiber = null;
  var nextHydratableInstance = null;
  var isHydrating = false;

  function enterHydrationState(fiber) {
    var parentInstance = fiber.stateNode.containerInfo;
    nextHydratableInstance = getFirstHydratableChild(parentInstance);
    hydrationParentFiber = fiber;
    isHydrating = true;
    return true;
  }

  function deleteHydratableInstance(returnFiber, instance) {
    {
      switch (returnFiber.tag) {
        case HostRoot:
          didNotHydrateContainerInstance(returnFiber.stateNode.containerInfo, instance);
          break;
        case HostComponent:
          didNotHydrateInstance(returnFiber.type, returnFiber.memoizedProps, returnFiber.stateNode, instance);
          break;
      }
    }

    var childToDelete = createFiberFromHostInstanceForDeletion();
    childToDelete.stateNode = instance;
    childToDelete['return'] = returnFiber;
    childToDelete.effectTag = Deletion;

    // This might seem like it belongs on progressedFirstDeletion. However,
    // these children are not part of the reconciliation list of children.
    // Even if we abort and rereconcile the children, that will try to hydrate
    // again and the nodes are still in the host tree so these will be
    // recreated.
    if (returnFiber.lastEffect !== null) {
      returnFiber.lastEffect.nextEffect = childToDelete;
      returnFiber.lastEffect = childToDelete;
    } else {
      returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
    }
  }

  function insertNonHydratedInstance(returnFiber, fiber) {
    fiber.effectTag |= Placement;
    {
      switch (returnFiber.tag) {
        case HostRoot:
          {
            var parentContainer = returnFiber.stateNode.containerInfo;
            switch (fiber.tag) {
              case HostComponent:
                var type = fiber.type;
                var props = fiber.pendingProps;
                didNotFindHydratableContainerInstance(parentContainer, type, props);
                break;
              case HostText:
                var text = fiber.pendingProps;
                didNotFindHydratableContainerTextInstance(parentContainer, text);
                break;
            }
            break;
          }
        case HostComponent:
          {
            var parentType = returnFiber.type;
            var parentProps = returnFiber.memoizedProps;
            var parentInstance = returnFiber.stateNode;
            switch (fiber.tag) {
              case HostComponent:
                var _type = fiber.type;
                var _props = fiber.pendingProps;
                didNotFindHydratableInstance(parentType, parentProps, parentInstance, _type, _props);
                break;
              case HostText:
                var _text = fiber.pendingProps;
                didNotFindHydratableTextInstance(parentType, parentProps, parentInstance, _text);
                break;
            }
            break;
          }
        default:
          return;
      }
    }
  }

  function tryHydrate(fiber, nextInstance) {
    switch (fiber.tag) {
      case HostComponent:
        {
          var type = fiber.type;
          var props = fiber.pendingProps;
          var instance = canHydrateInstance(nextInstance, type, props);
          if (instance !== null) {
            fiber.stateNode = instance;
            return true;
          }
          return false;
        }
      case HostText:
        {
          var text = fiber.pendingProps;
          var textInstance = canHydrateTextInstance(nextInstance, text);
          if (textInstance !== null) {
            fiber.stateNode = textInstance;
            return true;
          }
          return false;
        }
      default:
        return false;
    }
  }

  function tryToClaimNextHydratableInstance(fiber) {
    if (!isHydrating) {
      return;
    }
    var nextInstance = nextHydratableInstance;
    if (!nextInstance) {
      // Nothing to hydrate. Make it an insertion.
      insertNonHydratedInstance(hydrationParentFiber, fiber);
      isHydrating = false;
      hydrationParentFiber = fiber;
      return;
    }
    if (!tryHydrate(fiber, nextInstance)) {
      // If we can't hydrate this instance let's try the next one.
      // We use this as a heuristic. It's based on intuition and not data so it
      // might be flawed or unnecessary.
      nextInstance = getNextHydratableSibling(nextInstance);
      if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
        // Nothing to hydrate. Make it an insertion.
        insertNonHydratedInstance(hydrationParentFiber, fiber);
        isHydrating = false;
        hydrationParentFiber = fiber;
        return;
      }
      // We matched the next one, we'll now assume that the first one was
      // superfluous and we'll delete it. Since we can't eagerly delete it
      // we'll have to schedule a deletion. To do that, this node needs a dummy
      // fiber associated with it.
      deleteHydratableInstance(hydrationParentFiber, nextHydratableInstance);
    }
    hydrationParentFiber = fiber;
    nextHydratableInstance = getFirstHydratableChild(nextInstance);
  }

  function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
    var instance = fiber.stateNode;
    var updatePayload = hydrateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, hostContext, fiber);
    // TODO: Type this specific to this type of component.
    fiber.updateQueue = updatePayload;
    // If the update payload indicates that there is a change or if there
    // is a new ref we mark this as an update.
    if (updatePayload !== null) {
      return true;
    }
    return false;
  }

  function prepareToHydrateHostTextInstance(fiber) {
    var textInstance = fiber.stateNode;
    var textContent = fiber.memoizedProps;
    var shouldUpdate = hydrateTextInstance(textInstance, textContent, fiber);
    {
      if (shouldUpdate) {
        // We assume that prepareToHydrateHostTextInstance is called in a context where the
        // hydration parent is the parent host component of this host text.
        var returnFiber = hydrationParentFiber;
        if (returnFiber !== null) {
          switch (returnFiber.tag) {
            case HostRoot:
              {
                var parentContainer = returnFiber.stateNode.containerInfo;
                didNotMatchHydratedContainerTextInstance(parentContainer, textInstance, textContent);
                break;
              }
            case HostComponent:
              {
                var parentType = returnFiber.type;
                var parentProps = returnFiber.memoizedProps;
                var parentInstance = returnFiber.stateNode;
                didNotMatchHydratedTextInstance(parentType, parentProps, parentInstance, textInstance, textContent);
                break;
              }
          }
        }
      }
    }
    return shouldUpdate;
  }

  function popToNextHostParent(fiber) {
    var parent = fiber['return'];
    while (parent !== null && parent.tag !== HostComponent && parent.tag !== HostRoot) {
      parent = parent['return'];
    }
    hydrationParentFiber = parent;
  }

  function popHydrationState(fiber) {
    if (fiber !== hydrationParentFiber) {
      // We're deeper than the current hydration context, inside an inserted
      // tree.
      return false;
    }
    if (!isHydrating) {
      // If we're not currently hydrating but we're in a hydration context, then
      // we were an insertion and now need to pop up reenter hydration of our
      // siblings.
      popToNextHostParent(fiber);
      isHydrating = true;
      return false;
    }

    var type = fiber.type;

    // If we have any remaining hydratable nodes, we need to delete them now.
    // We only do this deeper than head and body since they tend to have random
    // other nodes in them. We also ignore components with pure text content in
    // side of them.
    // TODO: Better heuristic.
    if (fiber.tag !== HostComponent || type !== 'head' && type !== 'body' && !shouldSetTextContent(type, fiber.memoizedProps)) {
      var nextInstance = nextHydratableInstance;
      while (nextInstance) {
        deleteHydratableInstance(fiber, nextInstance);
        nextInstance = getNextHydratableSibling(nextInstance);
      }
    }

    popToNextHostParent(fiber);
    nextHydratableInstance = hydrationParentFiber ? getNextHydratableSibling(fiber.stateNode) : null;
    return true;
  }

  function resetHydrationState() {
    hydrationParentFiber = null;
    nextHydratableInstance = null;
    isHydrating = false;
  }

  return {
    enterHydrationState: enterHydrationState,
    resetHydrationState: resetHydrationState,
    tryToClaimNextHydratableInstance: tryToClaimNextHydratableInstance,
    prepareToHydrateHostInstance: prepareToHydrateHostInstance,
    prepareToHydrateHostTextInstance: prepareToHydrateHostTextInstance,
    popHydrationState: popHydrationState
  };
};

// This lets us hook into Fiber to debug what it's doing.
// See https://github.com/facebook/react/pull/8033.
// This is not part of the public API, not even for React DevTools.
// You may only inject a debugTool if you work on React Fiber itself.
var ReactFiberInstrumentation = {
  debugTool: null
};

var ReactFiberInstrumentation_1 = ReactFiberInstrumentation;

var defaultShowDialog = function (capturedError) {
  return true;
};

var showDialog = defaultShowDialog;

function logCapturedError(capturedError) {
  var logError = showDialog(capturedError);

  // Allow injected showDialog() to prevent default console.error logging.
  // This enables renderers like ReactNative to better manage redbox behavior.
  if (logError === false) {
    return;
  }

  var error = capturedError.error;
  var suppressLogging = error && error.suppressReactErrorLogging;
  if (suppressLogging) {
    return;
  }

  {
    var componentName = capturedError.componentName,
        componentStack = capturedError.componentStack,
        errorBoundaryName = capturedError.errorBoundaryName,
        errorBoundaryFound = capturedError.errorBoundaryFound,
        willRetry = capturedError.willRetry;


    var componentNameMessage = componentName ? 'The above error occurred in the <' + componentName + '> component:' : 'The above error occurred in one of your React components:';

    var errorBoundaryMessage = void 0;
    // errorBoundaryFound check is sufficient; errorBoundaryName check is to satisfy Flow.
    if (errorBoundaryFound && errorBoundaryName) {
      if (willRetry) {
        errorBoundaryMessage = 'React will try to recreate this component tree from scratch ' + ('using the error boundary you provided, ' + errorBoundaryName + '.');
      } else {
        errorBoundaryMessage = 'This error was initially handled by the error boundary ' + errorBoundaryName + '.\n' + 'Recreating the tree from scratch failed so React will unmount the tree.';
      }
    } else {
      errorBoundaryMessage = 'Consider adding an error boundary to your tree to customize error handling behavior.\n' + 'Visit https://fb.me/react-error-boundaries to learn more about error boundaries.';
    }
    var combinedMessage = '' + componentNameMessage + componentStack + '\n\n' + ('' + errorBoundaryMessage);

    // In development, we provide our own message with just the component stack.
    // We don't include the original error message and JS stack because the browser
    // has already printed it. Even if the application swallows the error, it is still
    // displayed by the browser thanks to the DEV-only fake event trick in ReactErrorUtils.
    console.error(combinedMessage);
  }
}

var invokeGuardedCallback$1 = ReactErrorUtils.invokeGuardedCallback;
var hasCaughtError = ReactErrorUtils.hasCaughtError;
var clearCaughtError = ReactErrorUtils.clearCaughtError;


{
  var didWarnAboutStateTransition = false;
  var didWarnSetStateChildContext = false;
  var didWarnStateUpdateForUnmountedComponent = {};

  var warnAboutUpdateOnUnmounted = function (fiber) {
    var componentName = getComponentName(fiber) || 'ReactClass';
    if (didWarnStateUpdateForUnmountedComponent[componentName]) {
      return;
    }
    warning(false, 'Can only update a mounted or mounting ' + 'component. This usually means you called setState, replaceState, ' + 'or forceUpdate on an unmounted component. This is a no-op.\n\nPlease ' + 'check the code for the %s component.', componentName);
    didWarnStateUpdateForUnmountedComponent[componentName] = true;
  };

  var warnAboutInvalidUpdates = function (instance) {
    switch (ReactDebugCurrentFiber.phase) {
      case 'getChildContext':
        if (didWarnSetStateChildContext) {
          return;
        }
        warning(false, 'setState(...): Cannot call setState() inside getChildContext()');
        didWarnSetStateChildContext = true;
        break;
      case 'render':
        if (didWarnAboutStateTransition) {
          return;
        }
        warning(false, 'Cannot update during an existing state transition (such as within ' + "`render` or another component's constructor). Render methods should " + 'be a pure function of props and state; constructor side-effects are ' + 'an anti-pattern, but can be moved to `componentWillMount`.');
        didWarnAboutStateTransition = true;
        break;
    }
  };
}

var ReactFiberScheduler = function (config) {
  var hostContext = ReactFiberHostContext(config);
  var hydrationContext = ReactFiberHydrationContext(config);
  var popHostContainer = hostContext.popHostContainer,
      popHostContext = hostContext.popHostContext,
      resetHostContainer = hostContext.resetHostContainer;

  var _ReactFiberBeginWork = ReactFiberBeginWork(config, hostContext, hydrationContext, scheduleWork, computeExpirationForFiber),
      beginWork = _ReactFiberBeginWork.beginWork,
      beginFailedWork = _ReactFiberBeginWork.beginFailedWork;

  var _ReactFiberCompleteWo = ReactFiberCompleteWork(config, hostContext, hydrationContext),
      completeWork = _ReactFiberCompleteWo.completeWork;

  var _ReactFiberCommitWork = ReactFiberCommitWork(config, captureError),
      commitResetTextContent = _ReactFiberCommitWork.commitResetTextContent,
      commitPlacement = _ReactFiberCommitWork.commitPlacement,
      commitDeletion = _ReactFiberCommitWork.commitDeletion,
      commitWork = _ReactFiberCommitWork.commitWork,
      commitLifeCycles = _ReactFiberCommitWork.commitLifeCycles,
      commitAttachRef = _ReactFiberCommitWork.commitAttachRef,
      commitDetachRef = _ReactFiberCommitWork.commitDetachRef;

  var now = config.now,
      scheduleDeferredCallback = config.scheduleDeferredCallback,
      cancelDeferredCallback = config.cancelDeferredCallback,
      useSyncScheduling = config.useSyncScheduling,
      prepareForCommit = config.prepareForCommit,
      resetAfterCommit = config.resetAfterCommit;

  // Represents the current time in ms.

  var startTime = now();
  var mostRecentCurrentTime = msToExpirationTime(0);

  // Represents the expiration time that incoming updates should use. (If this
  // is NoWork, use the default strategy: async updates in async mode, sync
  // updates in sync mode.)
  var expirationContext = NoWork;

  var isWorking = false;

  // The next work in progress fiber that we're currently working on.
  var nextUnitOfWork = null;
  var nextRoot = null;
  // The time at which we're currently rendering work.
  var nextRenderExpirationTime = NoWork;

  // The next fiber with an effect that we're currently committing.
  var nextEffect = null;

  // Keep track of which fibers have captured an error that need to be handled.
  // Work is removed from this collection after componentDidCatch is called.
  var capturedErrors = null;
  // Keep track of which fibers have failed during the current batch of work.
  // This is a different set than capturedErrors, because it is not reset until
  // the end of the batch. This is needed to propagate errors correctly if a
  // subtree fails more than once.
  var failedBoundaries = null;
  // Error boundaries that captured an error during the current commit.
  var commitPhaseBoundaries = null;
  var firstUncaughtError = null;
  var didFatal = false;

  var isCommitting = false;
  var isUnmounting = false;

  // Used for performance tracking.
  var interruptedBy = null;

  function resetContextStack() {
    // Reset the stack
    reset$1();
    // Reset the cursors
    resetContext();
    resetHostContainer();
  }

  function commitAllHostEffects() {
    while (nextEffect !== null) {
      {
        ReactDebugCurrentFiber.setCurrentFiber(nextEffect);
      }
      recordEffect();

      var effectTag = nextEffect.effectTag;
      if (effectTag & ContentReset) {
        commitResetTextContent(nextEffect);
      }

      if (effectTag & Ref) {
        var current = nextEffect.alternate;
        if (current !== null) {
          commitDetachRef(current);
        }
      }

      // The following switch statement is only concerned about placement,
      // updates, and deletions. To avoid needing to add a case for every
      // possible bitmap value, we remove the secondary effects from the
      // effect tag and switch on that value.
      var primaryEffectTag = effectTag & ~(Callback | Err | ContentReset | Ref | PerformedWork);
      switch (primaryEffectTag) {
        case Placement:
          {
            commitPlacement(nextEffect);
            // Clear the "placement" from effect tag so that we know that this is inserted, before
            // any life-cycles like componentDidMount gets called.
            // TODO: findDOMNode doesn't rely on this any more but isMounted
            // does and isMounted is deprecated anyway so we should be able
            // to kill this.
            nextEffect.effectTag &= ~Placement;
            break;
          }
        case PlacementAndUpdate:
          {
            // Placement
            commitPlacement(nextEffect);
            // Clear the "placement" from effect tag so that we know that this is inserted, before
            // any life-cycles like componentDidMount gets called.
            nextEffect.effectTag &= ~Placement;

            // Update
            var _current = nextEffect.alternate;
            commitWork(_current, nextEffect);
            break;
          }
        case Update:
          {
            var _current2 = nextEffect.alternate;
            commitWork(_current2, nextEffect);
            break;
          }
        case Deletion:
          {
            isUnmounting = true;
            commitDeletion(nextEffect);
            isUnmounting = false;
            break;
          }
      }
      nextEffect = nextEffect.nextEffect;
    }

    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }
  }

  function commitAllLifeCycles() {
    while (nextEffect !== null) {
      var effectTag = nextEffect.effectTag;

      if (effectTag & (Update | Callback)) {
        recordEffect();
        var current = nextEffect.alternate;
        commitLifeCycles(current, nextEffect);
      }

      if (effectTag & Ref) {
        recordEffect();
        commitAttachRef(nextEffect);
      }

      if (effectTag & Err) {
        recordEffect();
        commitErrorHandling(nextEffect);
      }

      var next = nextEffect.nextEffect;
      // Ensure that we clean these up so that we don't accidentally keep them.
      // I'm not actually sure this matters because we can't reset firstEffect
      // and lastEffect since they're on every node, not just the effectful
      // ones. So we have to clean everything as we reuse nodes anyway.
      nextEffect.nextEffect = null;
      // Ensure that we reset the effectTag here so that we can rely on effect
      // tags to reason about the current life-cycle.
      nextEffect = next;
    }
  }

  function commitRoot(finishedWork) {
    // We keep track of this so that captureError can collect any boundaries
    // that capture an error during the commit phase. The reason these aren't
    // local to this function is because errors that occur during cWU are
    // captured elsewhere, to prevent the unmount from being interrupted.
    isWorking = true;
    isCommitting = true;
    startCommitTimer();

    var root = finishedWork.stateNode;
    !(root.current !== finishedWork) ? invariant(false, 'Cannot commit the same tree as before. This is probably a bug related to the return field. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    root.isReadyForCommit = false;

    // Reset this to null before calling lifecycles
    ReactCurrentOwner.current = null;

    var firstEffect = void 0;
    if (finishedWork.effectTag > PerformedWork) {
      // A fiber's effect list consists only of its children, not itself. So if
      // the root has an effect, we need to add it to the end of the list. The
      // resulting list is the set that would belong to the root's parent, if
      // it had one; that is, all the effects in the tree including the root.
      if (finishedWork.lastEffect !== null) {
        finishedWork.lastEffect.nextEffect = finishedWork;
        firstEffect = finishedWork.firstEffect;
      } else {
        firstEffect = finishedWork;
      }
    } else {
      // There is no effect on the root.
      firstEffect = finishedWork.firstEffect;
    }

    prepareForCommit();

    // Commit all the side-effects within a tree. We'll do this in two passes.
    // The first pass performs all the host insertions, updates, deletions and
    // ref unmounts.
    nextEffect = firstEffect;
    startCommitHostEffectsTimer();
    while (nextEffect !== null) {
      var didError = false;
      var _error = void 0;
      {
        invokeGuardedCallback$1(null, commitAllHostEffects, null);
        if (hasCaughtError()) {
          didError = true;
          _error = clearCaughtError();
        }
      }
      if (didError) {
        !(nextEffect !== null) ? invariant(false, 'Should have next effect. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        captureError(nextEffect, _error);
        // Clean-up
        if (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;
        }
      }
    }
    stopCommitHostEffectsTimer();

    resetAfterCommit();

    // The work-in-progress tree is now the current tree. This must come after
    // the first pass of the commit phase, so that the previous tree is still
    // current during componentWillUnmount, but before the second pass, so that
    // the finished work is current during componentDidMount/Update.
    root.current = finishedWork;

    // In the second pass we'll perform all life-cycles and ref callbacks.
    // Life-cycles happen as a separate pass so that all placements, updates,
    // and deletions in the entire tree have already been invoked.
    // This pass also triggers any renderer-specific initial effects.
    nextEffect = firstEffect;
    startCommitLifeCyclesTimer();
    while (nextEffect !== null) {
      var _didError = false;
      var _error2 = void 0;
      {
        invokeGuardedCallback$1(null, commitAllLifeCycles, null);
        if (hasCaughtError()) {
          _didError = true;
          _error2 = clearCaughtError();
        }
      }
      if (_didError) {
        !(nextEffect !== null) ? invariant(false, 'Should have next effect. This error is likely caused by a bug in React. Please file an issue.') : void 0;
        captureError(nextEffect, _error2);
        if (nextEffect !== null) {
          nextEffect = nextEffect.nextEffect;
        }
      }
    }

    isCommitting = false;
    isWorking = false;
    stopCommitLifeCyclesTimer();
    stopCommitTimer();
    if (typeof onCommitRoot === 'function') {
      onCommitRoot(finishedWork.stateNode);
    }
    if (true && ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentation_1.debugTool.onCommitWork(finishedWork);
    }

    // If we caught any errors during this commit, schedule their boundaries
    // to update.
    if (commitPhaseBoundaries) {
      commitPhaseBoundaries.forEach(scheduleErrorRecovery);
      commitPhaseBoundaries = null;
    }

    if (firstUncaughtError !== null) {
      var _error3 = firstUncaughtError;
      firstUncaughtError = null;
      onUncaughtError(_error3);
    }

    var remainingTime = root.current.expirationTime;

    if (remainingTime === NoWork) {
      capturedErrors = null;
      failedBoundaries = null;
    }

    return remainingTime;
  }

  function resetExpirationTime(workInProgress, renderTime) {
    if (renderTime !== Never && workInProgress.expirationTime === Never) {
      // The children of this component are hidden. Don't bubble their
      // expiration times.
      return;
    }

    // Check for pending updates.
    var newExpirationTime = getUpdateExpirationTime(workInProgress);

    // TODO: Calls need to visit stateNode

    // Bubble up the earliest expiration time.
    var child = workInProgress.child;
    while (child !== null) {
      if (child.expirationTime !== NoWork && (newExpirationTime === NoWork || newExpirationTime > child.expirationTime)) {
        newExpirationTime = child.expirationTime;
      }
      child = child.sibling;
    }
    workInProgress.expirationTime = newExpirationTime;
  }

  function completeUnitOfWork(workInProgress) {
    while (true) {
      // The current, flushed, state of this fiber is the alternate.
      // Ideally nothing should rely on this, but relying on it here
      // means that we don't need an additional field on the work in
      // progress.
      var current = workInProgress.alternate;
      {
        ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
      }
      var next = completeWork(current, workInProgress, nextRenderExpirationTime);
      {
        ReactDebugCurrentFiber.resetCurrentFiber();
      }

      var returnFiber = workInProgress['return'];
      var siblingFiber = workInProgress.sibling;

      resetExpirationTime(workInProgress, nextRenderExpirationTime);

      if (next !== null) {
        stopWorkTimer(workInProgress);
        if (true && ReactFiberInstrumentation_1.debugTool) {
          ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
        }
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        return next;
      }

      if (returnFiber !== null) {
        // Append all the effects of the subtree and this fiber onto the effect
        // list of the parent. The completion order of the children affects the
        // side-effect order.
        if (returnFiber.firstEffect === null) {
          returnFiber.firstEffect = workInProgress.firstEffect;
        }
        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // If this fiber had side-effects, we append it AFTER the children's
        // side-effects. We can perform certain side-effects earlier if
        // needed, by doing multiple passes over the effect list. We don't want
        // to schedule our own side-effect on our own list because if end up
        // reusing children we'll schedule this effect onto itself since we're
        // at the end.
        var effectTag = workInProgress.effectTag;
        // Skip both NoWork and PerformedWork tags when creating the effect list.
        // PerformedWork effect is read by React DevTools but shouldn't be committed.
        if (effectTag > PerformedWork) {
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            returnFiber.firstEffect = workInProgress;
          }
          returnFiber.lastEffect = workInProgress;
        }
      }

      stopWorkTimer(workInProgress);
      if (true && ReactFiberInstrumentation_1.debugTool) {
        ReactFiberInstrumentation_1.debugTool.onCompleteWork(workInProgress);
      }

      if (siblingFiber !== null) {
        // If there is more work to do in this returnFiber, do that next.
        return siblingFiber;
      } else if (returnFiber !== null) {
        // If there's no more work in this returnFiber. Complete the returnFiber.
        workInProgress = returnFiber;
        continue;
      } else {
        // We've reached the root.
        var root = workInProgress.stateNode;
        root.isReadyForCommit = true;
        return null;
      }
    }

    // Without this explicit null return Flow complains of invalid return type
    // TODO Remove the above while(true) loop
    // eslint-disable-next-line no-unreachable
    return null;
  }

  function performUnitOfWork(workInProgress) {
    // The current, flushed, state of this fiber is the alternate.
    // Ideally nothing should rely on this, but relying on it here
    // means that we don't need an additional field on the work in
    // progress.
    var current = workInProgress.alternate;

    // See if beginning this work spawns more work.
    startWorkTimer(workInProgress);
    {
      ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
    }

    var next = beginWork(current, workInProgress, nextRenderExpirationTime);
    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }
    if (true && ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
    }

    if (next === null) {
      // If this doesn't spawn new work, complete the current work.
      next = completeUnitOfWork(workInProgress);
    }

    ReactCurrentOwner.current = null;

    return next;
  }

  function performFailedUnitOfWork(workInProgress) {
    // The current, flushed, state of this fiber is the alternate.
    // Ideally nothing should rely on this, but relying on it here
    // means that we don't need an additional field on the work in
    // progress.
    var current = workInProgress.alternate;

    // See if beginning this work spawns more work.
    startWorkTimer(workInProgress);
    {
      ReactDebugCurrentFiber.setCurrentFiber(workInProgress);
    }
    var next = beginFailedWork(current, workInProgress, nextRenderExpirationTime);
    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }
    if (true && ReactFiberInstrumentation_1.debugTool) {
      ReactFiberInstrumentation_1.debugTool.onBeginWork(workInProgress);
    }

    if (next === null) {
      // If this doesn't spawn new work, complete the current work.
      next = completeUnitOfWork(workInProgress);
    }

    ReactCurrentOwner.current = null;

    return next;
  }

  function workLoop(expirationTime) {
    if (capturedErrors !== null) {
      // If there are unhandled errors, switch to the slow work loop.
      // TODO: How to avoid this check in the fast path? Maybe the renderer
      // could keep track of which roots have unhandled errors and call a
      // forked version of renderRoot.
      slowWorkLoopThatChecksForFailedWork(expirationTime);
      return;
    }
    if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expirationTime) {
      return;
    }

    if (nextRenderExpirationTime <= mostRecentCurrentTime) {
      // Flush all expired work.
      while (nextUnitOfWork !== null) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      }
    } else {
      // Flush asynchronous work until the deadline runs out of time.
      while (nextUnitOfWork !== null && !shouldYield()) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
      }
    }
  }

  function slowWorkLoopThatChecksForFailedWork(expirationTime) {
    if (nextRenderExpirationTime === NoWork || nextRenderExpirationTime > expirationTime) {
      return;
    }

    if (nextRenderExpirationTime <= mostRecentCurrentTime) {
      // Flush all expired work.
      while (nextUnitOfWork !== null) {
        if (hasCapturedError(nextUnitOfWork)) {
          // Use a forked version of performUnitOfWork
          nextUnitOfWork = performFailedUnitOfWork(nextUnitOfWork);
        } else {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        }
      }
    } else {
      // Flush asynchronous work until the deadline runs out of time.
      while (nextUnitOfWork !== null && !shouldYield()) {
        if (hasCapturedError(nextUnitOfWork)) {
          // Use a forked version of performUnitOfWork
          nextUnitOfWork = performFailedUnitOfWork(nextUnitOfWork);
        } else {
          nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        }
      }
    }
  }

  function renderRootCatchBlock(root, failedWork, boundary, expirationTime) {
    // We're going to restart the error boundary that captured the error.
    // Conceptually, we're unwinding the stack. We need to unwind the
    // context stack, too.
    unwindContexts(failedWork, boundary);

    // Restart the error boundary using a forked version of
    // performUnitOfWork that deletes the boundary's children. The entire
    // failed subree will be unmounted. During the commit phase, a special
    // lifecycle method is called on the error boundary, which triggers
    // a re-render.
    nextUnitOfWork = performFailedUnitOfWork(boundary);

    // Continue working.
    workLoop(expirationTime);
  }

  function renderRoot(root, expirationTime) {
    !!isWorking ? invariant(false, 'renderRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    isWorking = true;

    // We're about to mutate the work-in-progress tree. If the root was pending
    // commit, it no longer is: we'll need to complete it again.
    root.isReadyForCommit = false;

    // Check if we're starting from a fresh stack, or if we're resuming from
    // previously yielded work.
    if (root !== nextRoot || expirationTime !== nextRenderExpirationTime || nextUnitOfWork === null) {
      // Reset the stack and start working from the root.
      resetContextStack();
      nextRoot = root;
      nextRenderExpirationTime = expirationTime;
      nextUnitOfWork = createWorkInProgress(nextRoot.current, null, expirationTime);
    }

    startWorkLoopTimer(nextUnitOfWork);

    var didError = false;
    var error = null;
    {
      invokeGuardedCallback$1(null, workLoop, null, expirationTime);
      if (hasCaughtError()) {
        didError = true;
        error = clearCaughtError();
      }
    }

    // An error was thrown during the render phase.
    while (didError) {
      if (didFatal) {
        // This was a fatal error. Don't attempt to recover from it.
        firstUncaughtError = error;
        break;
      }

      var failedWork = nextUnitOfWork;
      if (failedWork === null) {
        // An error was thrown but there's no current unit of work. This can
        // happen during the commit phase if there's a bug in the renderer.
        didFatal = true;
        continue;
      }

      // "Capture" the error by finding the nearest boundary. If there is no
      // error boundary, we use the root.
      var boundary = captureError(failedWork, error);
      !(boundary !== null) ? invariant(false, 'Should have found an error boundary. This error is likely caused by a bug in React. Please file an issue.') : void 0;

      if (didFatal) {
        // The error we just captured was a fatal error. This happens
        // when the error propagates to the root more than once.
        continue;
      }

      didError = false;
      error = null;
      {
        invokeGuardedCallback$1(null, renderRootCatchBlock, null, root, failedWork, boundary, expirationTime);
        if (hasCaughtError()) {
          didError = true;
          error = clearCaughtError();
          continue;
        }
      }
      // We're finished working. Exit the error loop.
      break;
    }

    var uncaughtError = firstUncaughtError;

    // We're done performing work. Time to clean up.
    stopWorkLoopTimer(interruptedBy);
    interruptedBy = null;
    isWorking = false;
    didFatal = false;
    firstUncaughtError = null;

    if (uncaughtError !== null) {
      onUncaughtError(uncaughtError);
    }

    return root.isReadyForCommit ? root.current.alternate : null;
  }

  // Returns the boundary that captured the error, or null if the error is ignored
  function captureError(failedWork, error) {
    // It is no longer valid because we exited the user code.
    ReactCurrentOwner.current = null;
    {
      ReactDebugCurrentFiber.resetCurrentFiber();
    }

    // Search for the nearest error boundary.
    var boundary = null;

    // Passed to logCapturedError()
    var errorBoundaryFound = false;
    var willRetry = false;
    var errorBoundaryName = null;

    // Host containers are a special case. If the failed work itself is a host
    // container, then it acts as its own boundary. In all other cases, we
    // ignore the work itself and only search through the parents.
    if (failedWork.tag === HostRoot) {
      boundary = failedWork;

      if (isFailedBoundary(failedWork)) {
        // If this root already failed, there must have been an error when
        // attempting to unmount it. This is a worst-case scenario and
        // should only be possible if there's a bug in the renderer.
        didFatal = true;
      }
    } else {
      var node = failedWork['return'];
      while (node !== null && boundary === null) {
        if (node.tag === ClassComponent) {
          var instance = node.stateNode;
          if (typeof instance.componentDidCatch === 'function') {
            errorBoundaryFound = true;
            errorBoundaryName = getComponentName(node);

            // Found an error boundary!
            boundary = node;
            willRetry = true;
          }
        } else if (node.tag === HostRoot) {
          // Treat the root like a no-op error boundary
          boundary = node;
        }

        if (isFailedBoundary(node)) {
          // This boundary is already in a failed state.

          // If we're currently unmounting, that means this error was
          // thrown while unmounting a failed subtree. We should ignore
          // the error.
          if (isUnmounting) {
            return null;
          }

          // If we're in the commit phase, we should check to see if
          // this boundary already captured an error during this commit.
          // This case exists because multiple errors can be thrown during
          // a single commit without interruption.
          if (commitPhaseBoundaries !== null && (commitPhaseBoundaries.has(node) || node.alternate !== null && commitPhaseBoundaries.has(node.alternate))) {
            // If so, we should ignore this error.
            return null;
          }

          // The error should propagate to the next boundary -— we keep looking.
          boundary = null;
          willRetry = false;
        }

        node = node['return'];
      }
    }

    if (boundary !== null) {
      // Add to the collection of failed boundaries. This lets us know that
      // subsequent errors in this subtree should propagate to the next boundary.
      if (failedBoundaries === null) {
        failedBoundaries = new Set();
      }
      failedBoundaries.add(boundary);

      // This method is unsafe outside of the begin and complete phases.
      // We might be in the commit phase when an error is captured.
      // The risk is that the return path from this Fiber may not be accurate.
      // That risk is acceptable given the benefit of providing users more context.
      var _componentStack = getStackAddendumByWorkInProgressFiber(failedWork);
      var _componentName = getComponentName(failedWork);

      // Add to the collection of captured errors. This is stored as a global
      // map of errors and their component stack location keyed by the boundaries
      // that capture them. We mostly use this Map as a Set; it's a Map only to
      // avoid adding a field to Fiber to store the error.
      if (capturedErrors === null) {
        capturedErrors = new Map();
      }

      var capturedError = {
        componentName: _componentName,
        componentStack: _componentStack,
        error: error,
        errorBoundary: errorBoundaryFound ? boundary.stateNode : null,
        errorBoundaryFound: errorBoundaryFound,
        errorBoundaryName: errorBoundaryName,
        willRetry: willRetry
      };

      capturedErrors.set(boundary, capturedError);

      try {
        logCapturedError(capturedError);
      } catch (e) {
        // Prevent cycle if logCapturedError() throws.
        // A cycle may still occur if logCapturedError renders a component that throws.
        var suppressLogging = e && e.suppressReactErrorLogging;
        if (!suppressLogging) {
          console.error(e);
        }
      }

      // If we're in the commit phase, defer scheduling an update on the
      // boundary until after the commit is complete
      if (isCommitting) {
        if (commitPhaseBoundaries === null) {
          commitPhaseBoundaries = new Set();
        }
        commitPhaseBoundaries.add(boundary);
      } else {
        // Otherwise, schedule an update now.
        // TODO: Is this actually necessary during the render phase? Is it
        // possible to unwind and continue rendering at the same priority,
        // without corrupting internal state?
        scheduleErrorRecovery(boundary);
      }
      return boundary;
    } else if (firstUncaughtError === null) {
      // If no boundary is found, we'll need to throw the error
      firstUncaughtError = error;
    }
    return null;
  }

  function hasCapturedError(fiber) {
    // TODO: capturedErrors should store the boundary instance, to avoid needing
    // to check the alternate.
    return capturedErrors !== null && (capturedErrors.has(fiber) || fiber.alternate !== null && capturedErrors.has(fiber.alternate));
  }

  function isFailedBoundary(fiber) {
    // TODO: failedBoundaries should store the boundary instance, to avoid
    // needing to check the alternate.
    return failedBoundaries !== null && (failedBoundaries.has(fiber) || fiber.alternate !== null && failedBoundaries.has(fiber.alternate));
  }

  function commitErrorHandling(effectfulFiber) {
    var capturedError = void 0;
    if (capturedErrors !== null) {
      capturedError = capturedErrors.get(effectfulFiber);
      capturedErrors['delete'](effectfulFiber);
      if (capturedError == null) {
        if (effectfulFiber.alternate !== null) {
          effectfulFiber = effectfulFiber.alternate;
          capturedError = capturedErrors.get(effectfulFiber);
          capturedErrors['delete'](effectfulFiber);
        }
      }
    }

    !(capturedError != null) ? invariant(false, 'No error for given unit of work. This error is likely caused by a bug in React. Please file an issue.') : void 0;

    switch (effectfulFiber.tag) {
      case ClassComponent:
        var instance = effectfulFiber.stateNode;

        var info = {
          componentStack: capturedError.componentStack
        };

        // Allow the boundary to handle the error, usually by scheduling
        // an update to itself
        instance.componentDidCatch(capturedError.error, info);
        return;
      case HostRoot:
        if (firstUncaughtError === null) {
          firstUncaughtError = capturedError.error;
        }
        return;
      default:
        invariant(false, 'Invalid type of work. This error is likely caused by a bug in React. Please file an issue.');
    }
  }

  function unwindContexts(from, to) {
    var node = from;
    while (node !== null) {
      switch (node.tag) {
        case ClassComponent:
          popContextProvider(node);
          break;
        case HostComponent:
          popHostContext(node);
          break;
        case HostRoot:
          popHostContainer(node);
          break;
        case HostPortal:
          popHostContainer(node);
          break;
      }
      if (node === to || node.alternate === to) {
        stopFailedWorkTimer(node);
        break;
      } else {
        stopWorkTimer(node);
      }
      node = node['return'];
    }
  }

  function computeAsyncExpiration() {
    // Given the current clock time, returns an expiration time. We use rounding
    // to batch like updates together.
    // Should complete within ~1000ms. 1200ms max.
    var currentTime = recalculateCurrentTime();
    var expirationMs = 1000;
    var bucketSizeMs = 200;
    return computeExpirationBucket(currentTime, expirationMs, bucketSizeMs);
  }

  function computeExpirationForFiber(fiber) {
    var expirationTime = void 0;
    if (expirationContext !== NoWork) {
      // An explicit expiration context was set;
      expirationTime = expirationContext;
    } else if (isWorking) {
      if (isCommitting) {
        // Updates that occur during the commit phase should have sync priority
        // by default.
        expirationTime = Sync;
      } else {
        // Updates during the render phase should expire at the same time as
        // the work that is being rendered.
        expirationTime = nextRenderExpirationTime;
      }
    } else {
      // No explicit expiration context was set, and we're not currently
      // performing work. Calculate a new expiration time.
      if (useSyncScheduling && !(fiber.internalContextTag & AsyncUpdates)) {
        // This is a sync update
        expirationTime = Sync;
      } else {
        // This is an async update
        expirationTime = computeAsyncExpiration();
      }
    }
    return expirationTime;
  }

  function scheduleWork(fiber, expirationTime) {
    return scheduleWorkImpl(fiber, expirationTime, false);
  }

  function checkRootNeedsClearing(root, fiber, expirationTime) {
    if (!isWorking && root === nextRoot && expirationTime < nextRenderExpirationTime) {
      // Restart the root from the top.
      if (nextUnitOfWork !== null) {
        // This is an interruption. (Used for performance tracking.)
        interruptedBy = fiber;
      }
      nextRoot = null;
      nextUnitOfWork = null;
      nextRenderExpirationTime = NoWork;
    }
  }

  function scheduleWorkImpl(fiber, expirationTime, isErrorRecovery) {
    recordScheduleUpdate();

    {
      if (!isErrorRecovery && fiber.tag === ClassComponent) {
        var instance = fiber.stateNode;
        warnAboutInvalidUpdates(instance);
      }
    }

    var node = fiber;
    while (node !== null) {
      // Walk the parent path to the root and update each node's
      // expiration time.
      if (node.expirationTime === NoWork || node.expirationTime > expirationTime) {
        node.expirationTime = expirationTime;
      }
      if (node.alternate !== null) {
        if (node.alternate.expirationTime === NoWork || node.alternate.expirationTime > expirationTime) {
          node.alternate.expirationTime = expirationTime;
        }
      }
      if (node['return'] === null) {
        if (node.tag === HostRoot) {
          var root = node.stateNode;

          checkRootNeedsClearing(root, fiber, expirationTime);
          requestWork(root, expirationTime);
          checkRootNeedsClearing(root, fiber, expirationTime);
        } else {
          {
            if (!isErrorRecovery && fiber.tag === ClassComponent) {
              warnAboutUpdateOnUnmounted(fiber);
            }
          }
          return;
        }
      }
      node = node['return'];
    }
  }

  function scheduleErrorRecovery(fiber) {
    scheduleWorkImpl(fiber, Sync, true);
  }

  function recalculateCurrentTime() {
    // Subtract initial time so it fits inside 32bits
    var ms = now() - startTime;
    mostRecentCurrentTime = msToExpirationTime(ms);
    return mostRecentCurrentTime;
  }

  function deferredUpdates(fn) {
    var previousExpirationContext = expirationContext;
    expirationContext = computeAsyncExpiration();
    try {
      return fn();
    } finally {
      expirationContext = previousExpirationContext;
    }
  }

  function syncUpdates(fn) {
    var previousExpirationContext = expirationContext;
    expirationContext = Sync;
    try {
      return fn();
    } finally {
      expirationContext = previousExpirationContext;
    }
  }

  // TODO: Everything below this is written as if it has been lifted to the
  // renderers. I'll do this in a follow-up.

  // Linked-list of roots
  var firstScheduledRoot = null;
  var lastScheduledRoot = null;

  var callbackExpirationTime = NoWork;
  var callbackID = -1;
  var isRendering = false;
  var nextFlushedRoot = null;
  var nextFlushedExpirationTime = NoWork;
  var deadlineDidExpire = false;
  var hasUnhandledError = false;
  var unhandledError = null;
  var deadline = null;

  var isBatchingUpdates = false;
  var isUnbatchingUpdates = false;

  // Use these to prevent an infinite loop of nested updates
  var NESTED_UPDATE_LIMIT = 1000;
  var nestedUpdateCount = 0;

  var timeHeuristicForUnitOfWork = 1;

  function scheduleCallbackWithExpiration(expirationTime) {
    if (callbackExpirationTime !== NoWork) {
      // A callback is already scheduled. Check its expiration time (timeout).
      if (expirationTime > callbackExpirationTime) {
        // Existing callback has sufficient timeout. Exit.
        return;
      } else {
        // Existing callback has insufficient timeout. Cancel and schedule a
        // new one.
        cancelDeferredCallback(callbackID);
      }
      // The request callback timer is already running. Don't start a new one.
    } else {
      startRequestCallbackTimer();
    }

    // Compute a timeout for the given expiration time.
    var currentMs = now() - startTime;
    var expirationMs = expirationTimeToMs(expirationTime);
    var timeout = expirationMs - currentMs;

    callbackExpirationTime = expirationTime;
    callbackID = scheduleDeferredCallback(performAsyncWork, { timeout: timeout });
  }

  // requestWork is called by the scheduler whenever a root receives an update.
  // It's up to the renderer to call renderRoot at some point in the future.
  function requestWork(root, expirationTime) {
    if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
      invariant(false, 'Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.');
    }

    // Add the root to the schedule.
    // Check if this root is already part of the schedule.
    if (root.nextScheduledRoot === null) {
      // This root is not already scheduled. Add it.
      root.remainingExpirationTime = expirationTime;
      if (lastScheduledRoot === null) {
        firstScheduledRoot = lastScheduledRoot = root;
        root.nextScheduledRoot = root;
      } else {
        lastScheduledRoot.nextScheduledRoot = root;
        lastScheduledRoot = root;
        lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
      }
    } else {
      // This root is already scheduled, but its priority may have increased.
      var remainingExpirationTime = root.remainingExpirationTime;
      if (remainingExpirationTime === NoWork || expirationTime < remainingExpirationTime) {
        // Update the priority.
        root.remainingExpirationTime = expirationTime;
      }
    }

    if (isRendering) {
      // Prevent reentrancy. Remaining work will be scheduled at the end of
      // the currently rendering batch.
      return;
    }

    if (isBatchingUpdates) {
      // Flush work at the end of the batch.
      if (isUnbatchingUpdates) {
        // ...unless we're inside unbatchedUpdates, in which case we should
        // flush it now.
        nextFlushedRoot = root;
        nextFlushedExpirationTime = Sync;
        performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
      }
      return;
    }

    // TODO: Get rid of Sync and use current time?
    if (expirationTime === Sync) {
      performWork(Sync, null);
    } else {
      scheduleCallbackWithExpiration(expirationTime);
    }
  }

  function findHighestPriorityRoot() {
    var highestPriorityWork = NoWork;
    var highestPriorityRoot = null;

    if (lastScheduledRoot !== null) {
      var previousScheduledRoot = lastScheduledRoot;
      var root = firstScheduledRoot;
      while (root !== null) {
        var remainingExpirationTime = root.remainingExpirationTime;
        if (remainingExpirationTime === NoWork) {
          // This root no longer has work. Remove it from the scheduler.

          // TODO: This check is redudant, but Flow is confused by the branch
          // below where we set lastScheduledRoot to null, even though we break
          // from the loop right after.
          !(previousScheduledRoot !== null && lastScheduledRoot !== null) ? invariant(false, 'Should have a previous and last root. This error is likely caused by a bug in React. Please file an issue.') : void 0;
          if (root === root.nextScheduledRoot) {
            // This is the only root in the list.
            root.nextScheduledRoot = null;
            firstScheduledRoot = lastScheduledRoot = null;
            break;
          } else if (root === firstScheduledRoot) {
            // This is the first root in the list.
            var next = root.nextScheduledRoot;
            firstScheduledRoot = next;
            lastScheduledRoot.nextScheduledRoot = next;
            root.nextScheduledRoot = null;
          } else if (root === lastScheduledRoot) {
            // This is the last root in the list.
            lastScheduledRoot = previousScheduledRoot;
            lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
            root.nextScheduledRoot = null;
            break;
          } else {
            previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot;
            root.nextScheduledRoot = null;
          }
          root = previousScheduledRoot.nextScheduledRoot;
        } else {
          if (highestPriorityWork === NoWork || remainingExpirationTime < highestPriorityWork) {
            // Update the priority, if it's higher
            highestPriorityWork = remainingExpirationTime;
            highestPriorityRoot = root;
          }
          if (root === lastScheduledRoot) {
            break;
          }
          previousScheduledRoot = root;
          root = root.nextScheduledRoot;
        }
      }
    }

    // If the next root is the same as the previous root, this is a nested
    // update. To prevent an infinite loop, increment the nested update count.
    var previousFlushedRoot = nextFlushedRoot;
    if (previousFlushedRoot !== null && previousFlushedRoot === highestPriorityRoot) {
      nestedUpdateCount++;
    } else {
      // Reset whenever we switch roots.
      nestedUpdateCount = 0;
    }
    nextFlushedRoot = highestPriorityRoot;
    nextFlushedExpirationTime = highestPriorityWork;
  }

  function performAsyncWork(dl) {
    performWork(NoWork, dl);
  }

  function performWork(minExpirationTime, dl) {
    deadline = dl;

    // Keep working on roots until there's no more work, or until the we reach
    // the deadline.
    findHighestPriorityRoot();

    if (enableUserTimingAPI && deadline !== null) {
      var didExpire = nextFlushedExpirationTime < recalculateCurrentTime();
      stopRequestCallbackTimer(didExpire);
    }

    while (nextFlushedRoot !== null && nextFlushedExpirationTime !== NoWork && (minExpirationTime === NoWork || nextFlushedExpirationTime <= minExpirationTime) && !deadlineDidExpire) {
      performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime);
      // Find the next highest priority work.
      findHighestPriorityRoot();
    }

    // We're done flushing work. Either we ran out of time in this callback,
    // or there's no more work left with sufficient priority.

    // If we're inside a callback, set this to false since we just completed it.
    if (deadline !== null) {
      callbackExpirationTime = NoWork;
      callbackID = -1;
    }
    // If there's work left over, schedule a new callback.
    if (nextFlushedExpirationTime !== NoWork) {
      scheduleCallbackWithExpiration(nextFlushedExpirationTime);
    }

    // Clean-up.
    deadline = null;
    deadlineDidExpire = false;
    nestedUpdateCount = 0;

    if (hasUnhandledError) {
      var _error4 = unhandledError;
      unhandledError = null;
      hasUnhandledError = false;
      throw _error4;
    }
  }

  function performWorkOnRoot(root, expirationTime) {
    !!isRendering ? invariant(false, 'performWorkOnRoot was called recursively. This error is likely caused by a bug in React. Please file an issue.') : void 0;

    isRendering = true;

    // Check if this is async work or sync/expired work.
    // TODO: Pass current time as argument to renderRoot, commitRoot
    if (expirationTime <= recalculateCurrentTime()) {
      // Flush sync work.
      var finishedWork = root.finishedWork;
      if (finishedWork !== null) {
        // This root is already complete. We can commit it.
        root.finishedWork = null;
        root.remainingExpirationTime = commitRoot(finishedWork);
      } else {
        root.finishedWork = null;
        finishedWork = renderRoot(root, expirationTime);
        if (finishedWork !== null) {
          // We've completed the root. Commit it.
          root.remainingExpirationTime = commitRoot(finishedWork);
        }
      }
    } else {
      // Flush async work.
      var _finishedWork = root.finishedWork;
      if (_finishedWork !== null) {
        // This root is already complete. We can commit it.
        root.finishedWork = null;
        root.remainingExpirationTime = commitRoot(_finishedWork);
      } else {
        root.finishedWork = null;
        _finishedWork = renderRoot(root, expirationTime);
        if (_finishedWork !== null) {
          // We've completed the root. Check the deadline one more time
          // before committing.
          if (!shouldYield()) {
            // Still time left. Commit the root.
            root.remainingExpirationTime = commitRoot(_finishedWork);
          } else {
            // There's no time left. Mark this root as complete. We'll come
            // back and commit it later.
            root.finishedWork = _finishedWork;
          }
        }
      }
    }

    isRendering = false;
  }

  // When working on async work, the reconciler asks the renderer if it should
  // yield execution. For DOM, we implement this with requestIdleCallback.
  function shouldYield() {
    if (deadline === null) {
      return false;
    }
    if (deadline.timeRemaining() > timeHeuristicForUnitOfWork) {
      // Disregard deadline.didTimeout. Only expired work should be flushed
      // during a timeout. This path is only hit for non-expired work.
      return false;
    }
    deadlineDidExpire = true;
    return true;
  }

  // TODO: Not happy about this hook. Conceptually, renderRoot should return a
  // tuple of (isReadyForCommit, didError, error)
  function onUncaughtError(error) {
    !(nextFlushedRoot !== null) ? invariant(false, 'Should be working on a root. This error is likely caused by a bug in React. Please file an issue.') : void 0;
    // Unschedule this root so we don't work on it again until there's
    // another update.
    nextFlushedRoot.remainingExpirationTime = NoWork;
    if (!hasUnhandledError) {
      hasUnhandledError = true;
      unhandledError = error;
    }
  }

  // TODO: Batching should be implemented at the renderer level, not inside
  // the reconciler.
  function batchedUpdates(fn, a) {
    var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
      return fn(a);
    } finally {
      isBatchingUpdates = previousIsBatchingUpdates;
      if (!isBatchingUpdates && !isRendering) {
        performWork(Sync, null);
      }
    }
  }

  // TODO: Batching should be implemented at the renderer level, not inside
  // the reconciler.
  function unbatchedUpdates(fn) {
    if (isBatchingUpdates && !isUnbatchingUpdates) {
      isUnbatchingUpdates = true;
      try {
        return fn();
      } finally {
        isUnbatchingUpdates = false;
      }
    }
    return fn();
  }

  // TODO: Batching should be implemented at the renderer level, not within
  // the reconciler.
  function flushSync(fn) {
    var previousIsBatchingUpdates = isBatchingUpdates;
    isBatchingUpdates = true;
    try {
      return syncUpdates(fn);
    } finally {
      isBatchingUpdates = previousIsBatchingUpdates;
      !!isRendering ? invariant(false, 'flushSync was called from inside a lifecycle method. It cannot be called when React is already rendering.') : void 0;
      performWork(Sync, null);
    }
  }

  return {
    computeAsyncExpiration: computeAsyncExpiration,
    computeExpirationForFiber: computeExpirationForFiber,
    scheduleWork: scheduleWork,
    batchedUpdates: batchedUpdates,
    unbatchedUpdates: unbatchedUpdates,
    flushSync: flushSync,
    deferredUpdates: deferredUpdates
  };
};

{
  var didWarnAboutNestedUpdates = false;
}

// 0 is PROD, 1 is DEV.
// Might add PROFILE later.


function getContextForSubtree(parentComponent) {
  if (!parentComponent) {
    return emptyObject;
  }

  var fiber = get(parentComponent);
  var parentContext = findCurrentUnmaskedContext(fiber);
  return isContextProvider(fiber) ? processChildContext(fiber, parentContext) : parentContext;
}

var ReactFiberReconciler$1 = function (config) {
  var getPublicInstance = config.getPublicInstance;

  var _ReactFiberScheduler = ReactFiberScheduler(config),
      computeAsyncExpiration = _ReactFiberScheduler.computeAsyncExpiration,
      computeExpirationForFiber = _ReactFiberScheduler.computeExpirationForFiber,
      scheduleWork = _ReactFiberScheduler.scheduleWork,
      batchedUpdates = _ReactFiberScheduler.batchedUpdates,
      unbatchedUpdates = _ReactFiberScheduler.unbatchedUpdates,
      flushSync = _ReactFiberScheduler.flushSync,
      deferredUpdates = _ReactFiberScheduler.deferredUpdates;

  function scheduleTopLevelUpdate(current, element, callback) {
    {
      if (ReactDebugCurrentFiber.phase === 'render' && ReactDebugCurrentFiber.current !== null && !didWarnAboutNestedUpdates) {
        didWarnAboutNestedUpdates = true;
        warning(false, 'Render methods should be a pure function of props and state; ' + 'triggering nested component updates from render is not allowed. ' + 'If necessary, trigger nested updates in componentDidUpdate.\n\n' + 'Check the render method of %s.', getComponentName(ReactDebugCurrentFiber.current) || 'Unknown');
      }
    }

    callback = callback === undefined ? null : callback;
    {
      warning(callback === null || typeof callback === 'function', 'render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
    }

    var expirationTime = void 0;
    // Check if the top-level element is an async wrapper component. If so,
    // treat updates to the root as async. This is a bit weird but lets us
    // avoid a separate `renderAsync` API.
    if (enableAsyncSubtreeAPI && element != null && element.type != null && element.type.prototype != null && element.type.prototype.unstable_isAsyncReactComponent === true) {
      expirationTime = computeAsyncExpiration();
    } else {
      expirationTime = computeExpirationForFiber(current);
    }

    var update = {
      expirationTime: expirationTime,
      partialState: { element: element },
      callback: callback,
      isReplace: false,
      isForced: false,
      nextCallback: null,
      next: null
    };
    insertUpdateIntoFiber(current, update);
    scheduleWork(current, expirationTime);
  }

  function findHostInstance(fiber) {
    var hostFiber = findCurrentHostFiber(fiber);
    if (hostFiber === null) {
      return null;
    }
    return hostFiber.stateNode;
  }

  return {
    createContainer: function (containerInfo, hydrate) {
      return createFiberRoot(containerInfo, hydrate);
    },
    updateContainer: function (element, container, parentComponent, callback) {
      // TODO: If this is a nested container, this won't be the root.
      var current = container.current;

      {
        if (ReactFiberInstrumentation_1.debugTool) {
          if (current.alternate === null) {
            ReactFiberInstrumentation_1.debugTool.onMountContainer(container);
          } else if (element === null) {
            ReactFiberInstrumentation_1.debugTool.onUnmountContainer(container);
          } else {
            ReactFiberInstrumentation_1.debugTool.onUpdateContainer(container);
          }
        }
      }

      var context = getContextForSubtree(parentComponent);
      if (container.context === null) {
        container.context = context;
      } else {
        container.pendingContext = context;
      }

      scheduleTopLevelUpdate(current, element, callback);
    },


    batchedUpdates: batchedUpdates,

    unbatchedUpdates: unbatchedUpdates,

    deferredUpdates: deferredUpdates,

    flushSync: flushSync,

    getPublicRootInstance: function (container) {
      var containerFiber = container.current;
      if (!containerFiber.child) {
        return null;
      }
      switch (containerFiber.child.tag) {
        case HostComponent:
          return getPublicInstance(containerFiber.child.stateNode);
        default:
          return containerFiber.child.stateNode;
      }
    },


    findHostInstance: findHostInstance,

    findHostInstanceWithNoPortals: function (fiber) {
      var hostFiber = findCurrentHostFiberWithNoPortals(fiber);
      if (hostFiber === null) {
        return null;
      }
      return hostFiber.stateNode;
    },
    injectIntoDevTools: function (devToolsConfig) {
      var findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;

      return injectInternals(_assign({}, devToolsConfig, {
        findHostInstanceByFiber: function (fiber) {
          return findHostInstance(fiber);
        },
        findFiberByHostInstance: function (instance) {
          if (!findFiberByHostInstance) {
            // Might not be implemented by the renderer.
            return null;
          }
          return findFiberByHostInstance(instance);
        }
      }));
    }
  };
};

var ReactFiberReconciler$2 = Object.freeze({
	default: ReactFiberReconciler$1
});

var ReactFiberReconciler$3 = ( ReactFiberReconciler$2 && ReactFiberReconciler$1 ) || ReactFiberReconciler$2;

// TODO: bundle Flow types with the package.



// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var reactReconciler = ReactFiberReconciler$3['default'] ? ReactFiberReconciler$3['default'] : ReactFiberReconciler$3;

function createPortal$1(children, containerInfo,
// TODO: figure out the API for cross-renderer implementation.
implementation) {
  var key = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  return {
    // This tag allow us to uniquely identify this as a React Portal
    $$typeof: REACT_PORTAL_TYPE,
    key: key == null ? null : '' + key,
    children: children,
    containerInfo: containerInfo,
    implementation: implementation
  };
}

// TODO: this is special because it gets imported during build.

var ReactVersion = '16.2.0';

// a requestAnimationFrame, storing the time for the start of the frame, then
// scheduling a postMessage which gets scheduled after paint. Within the
// postMessage handler do as much work as possible until time + frame rate.
// By separating the idle call into a separate event tick we ensure that
// layout, paint and other browser work is counted against the available time.
// The frame rate is dynamically adjusted.

{
  if (ExecutionEnvironment.canUseDOM && typeof requestAnimationFrame !== 'function') {
    warning(false, 'React depends on requestAnimationFrame. Make sure that you load a ' + 'polyfill in older browsers. http://fb.me/react-polyfills');
  }
}

var hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';

var now = void 0;
if (hasNativePerformanceNow) {
  now = function () {
    return performance.now();
  };
} else {
  now = function () {
    return Date.now();
  };
}

// TODO: There's no way to cancel, because Fiber doesn't atm.
var rIC = void 0;
var cIC = void 0;

if (!ExecutionEnvironment.canUseDOM) {
  rIC = function (frameCallback) {
    return setTimeout(function () {
      frameCallback({
        timeRemaining: function () {
          return Infinity;
        }
      });
    });
  };
  cIC = function (timeoutID) {
    clearTimeout(timeoutID);
  };
} else if (typeof requestIdleCallback !== 'function' || typeof cancelIdleCallback !== 'function') {
  // Polyfill requestIdleCallback and cancelIdleCallback

  var scheduledRICCallback = null;
  var isIdleScheduled = false;
  var timeoutTime = -1;

  var isAnimationFrameScheduled = false;

  var frameDeadline = 0;
  // We start out assuming that we run at 30fps but then the heuristic tracking
  // will adjust this value to a faster fps if we get more frequent animation
  // frames.
  var previousFrameTime = 33;
  var activeFrameTime = 33;

  var frameDeadlineObject;
  if (hasNativePerformanceNow) {
    frameDeadlineObject = {
      didTimeout: false,
      timeRemaining: function () {
        // We assume that if we have a performance timer that the rAF callback
        // gets a performance timer value. Not sure if this is always true.
        var remaining = frameDeadline - performance.now();
        return remaining > 0 ? remaining : 0;
      }
    };
  } else {
    frameDeadlineObject = {
      didTimeout: false,
      timeRemaining: function () {
        // Fallback to Date.now()
        var remaining = frameDeadline - Date.now();
        return remaining > 0 ? remaining : 0;
      }
    };
  }

  // We use the postMessage trick to defer idle work until after the repaint.
  var messageKey = '__reactIdleCallback$' + Math.random().toString(36).slice(2);
  var idleTick = function (event) {
    if (event.source !== window || event.data !== messageKey) {
      return;
    }

    isIdleScheduled = false;

    var currentTime = now();
    if (frameDeadline - currentTime <= 0) {
      // There's no time left in this idle period. Check if the callback has
      // a timeout and whether it's been exceeded.
      if (timeoutTime !== -1 && timeoutTime <= currentTime) {
        // Exceeded the timeout. Invoke the callback even though there's no
        // time left.
        frameDeadlineObject.didTimeout = true;
      } else {
        // No timeout.
        if (!isAnimationFrameScheduled) {
          // Schedule another animation callback so we retry later.
          isAnimationFrameScheduled = true;
          requestAnimationFrame(animationTick);
        }
        // Exit without invoking the callback.
        return;
      }
    } else {
      // There's still time left in this idle period.
      frameDeadlineObject.didTimeout = false;
    }

    timeoutTime = -1;
    var callback = scheduledRICCallback;
    scheduledRICCallback = null;
    if (callback !== null) {
      callback(frameDeadlineObject);
    }
  };
  // Assumes that we have addEventListener in this environment. Might need
  // something better for old IE.
  window.addEventListener('message', idleTick, false);

  var animationTick = function (rafTime) {
    isAnimationFrameScheduled = false;
    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
      if (nextFrameTime < 8) {
        // Defensive coding. We don't support higher frame rates than 120hz.
        // If we get lower than that, it is probably a bug.
        nextFrameTime = 8;
      }
      // If one frame goes long, then the next one can be short to catch up.
      // If two frames are short in a row, then that's an indication that we
      // actually have a higher frame rate than what we're currently optimizing.
      // We adjust our heuristic dynamically accordingly. For example, if we're
      // running on 120hz display or 90hz VR display.
      // Take the max of the two in case one of them was an anomaly due to
      // missed frame deadlines.
      activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    } else {
      previousFrameTime = nextFrameTime;
    }
    frameDeadline = rafTime + activeFrameTime;
    if (!isIdleScheduled) {
      isIdleScheduled = true;
      window.postMessage(messageKey, '*');
    }
  };

  rIC = function (callback, options) {
    // This assumes that we only schedule one callback at a time because that's
    // how Fiber uses it.
    scheduledRICCallback = callback;
    if (options != null && typeof options.timeout === 'number') {
      timeoutTime = now() + options.timeout;
    }
    if (!isAnimationFrameScheduled) {
      // If rAF didn't already schedule one, we need to schedule a frame.
      // TODO: If this rAF doesn't materialize because the browser throttles, we
      // might want to still have setTimeout trigger rIC as a backup to ensure
      // that we keep performing work.
      isAnimationFrameScheduled = true;
      requestAnimationFrame(animationTick);
    }
    return 0;
  };

  cIC = function () {
    scheduledRICCallback = null;
    isIdleScheduled = false;
    timeoutTime = -1;
  };
} else {
  rIC = window.requestIdleCallback;
  cIC = window.cancelIdleCallback;
}

/**
 * Forked from fbjs/warning:
 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
 *
 * Only change is we use console.warn instead of console.error,
 * and do nothing when 'console' is not supported.
 * This really simplifies the code.
 * ---
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var lowPriorityWarning = function () {};

{
  var printWarning = function (format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.warn(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  lowPriorityWarning = function (condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }
    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

var lowPriorityWarning$1 = lowPriorityWarning;

// isAttributeNameSafe() is currently duplicated in DOMMarkupOperations.
// TODO: Find a better place for this.
var VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
var illegalAttributeNameCache = {};
var validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
  if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
    return true;
  }
  if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  {
    warning(false, 'Invalid attribute name: `%s`', attributeName);
  }
  return false;
}

// shouldIgnoreValue() is currently duplicated in DOMMarkupOperations.
// TODO: Find a better place for this.
function shouldIgnoreValue(propertyInfo, value) {
  return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
}

/**
 * Operations for dealing with DOM properties.
 */





/**
 * Get the value for a property on a node. Only used in DEV for SSR validation.
 * The "expected" argument is used as a hint of what the expected value is.
 * Some properties have multiple equivalent values.
 */
function getValueForProperty(node, name, expected) {
  {
    var propertyInfo = getPropertyInfo(name);
    if (propertyInfo) {
      var mutationMethod = propertyInfo.mutationMethod;
      if (mutationMethod || propertyInfo.mustUseProperty) {
        return node[propertyInfo.propertyName];
      } else {
        var attributeName = propertyInfo.attributeName;

        var stringValue = null;

        if (propertyInfo.hasOverloadedBooleanValue) {
          if (node.hasAttribute(attributeName)) {
            var value = node.getAttribute(attributeName);
            if (value === '') {
              return true;
            }
            if (shouldIgnoreValue(propertyInfo, expected)) {
              return value;
            }
            if (value === '' + expected) {
              return expected;
            }
            return value;
          }
        } else if (node.hasAttribute(attributeName)) {
          if (shouldIgnoreValue(propertyInfo, expected)) {
            // We had an attribute but shouldn't have had one, so read it
            // for the error message.
            return node.getAttribute(attributeName);
          }
          if (propertyInfo.hasBooleanValue) {
            // If this was a boolean, it doesn't matter what the value is
            // the fact that we have it is the same as the expected.
            return expected;
          }
          // Even if this property uses a namespace we use getAttribute
          // because we assume its namespaced name is the same as our config.
          // To use getAttributeNS we need the local name which we don't have
          // in our config atm.
          stringValue = node.getAttribute(attributeName);
        }

        if (shouldIgnoreValue(propertyInfo, expected)) {
          return stringValue === null ? expected : stringValue;
        } else if (stringValue === '' + expected) {
          return expected;
        } else {
          return stringValue;
        }
      }
    }
  }
}

/**
 * Get the value for a attribute on a node. Only used in DEV for SSR validation.
 * The third argument is used as a hint of what the expected value is. Some
 * attributes have multiple equivalent values.
 */
function getValueForAttribute(node, name, expected) {
  {
    if (!isAttributeNameSafe(name)) {
      return;
    }
    if (!node.hasAttribute(name)) {
      return expected === undefined ? undefined : null;
    }
    var value = node.getAttribute(name);
    if (value === '' + expected) {
      return expected;
    }
    return value;
  }
}

/**
 * Sets the value for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 * @param {*} value
 */
function setValueForProperty(node, name, value) {
  var propertyInfo = getPropertyInfo(name);

  if (propertyInfo && shouldSetAttribute(name, value)) {
    var mutationMethod = propertyInfo.mutationMethod;
    if (mutationMethod) {
      mutationMethod(node, value);
    } else if (shouldIgnoreValue(propertyInfo, value)) {
      deleteValueForProperty(node, name);
      return;
    } else if (propertyInfo.mustUseProperty) {
      // Contrary to `setAttribute`, object properties are properly
      // `toString`ed by IE8/9.
      node[propertyInfo.propertyName] = value;
    } else {
      var attributeName = propertyInfo.attributeName;
      var namespace = propertyInfo.attributeNamespace;
      // `setAttribute` with objects becomes only `[object]` in IE8/9,
      // ('' + value) makes it output the correct toString()-value.
      if (namespace) {
        node.setAttributeNS(namespace, attributeName, '' + value);
      } else if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
        node.setAttribute(attributeName, '');
      } else {
        node.setAttribute(attributeName, '' + value);
      }
    }
  } else {
    setValueForAttribute(node, name, shouldSetAttribute(name, value) ? value : null);
    return;
  }

  {
    
  }
}

function setValueForAttribute(node, name, value) {
  if (!isAttributeNameSafe(name)) {
    return;
  }
  if (value == null) {
    node.removeAttribute(name);
  } else {
    node.setAttribute(name, '' + value);
  }

  {
    
  }
}

/**
 * Deletes an attributes from a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 */
function deleteValueForAttribute(node, name) {
  node.removeAttribute(name);
}

/**
 * Deletes the value for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 */
function deleteValueForProperty(node, name) {
  var propertyInfo = getPropertyInfo(name);
  if (propertyInfo) {
    var mutationMethod = propertyInfo.mutationMethod;
    if (mutationMethod) {
      mutationMethod(node, undefined);
    } else if (propertyInfo.mustUseProperty) {
      var propName = propertyInfo.propertyName;
      if (propertyInfo.hasBooleanValue) {
        node[propName] = false;
      } else {
        node[propName] = '';
      }
    } else {
      node.removeAttribute(propertyInfo.attributeName);
    }
  } else {
    node.removeAttribute(name);
  }
}

var ReactControlledValuePropTypes = {
  checkPropTypes: null
};

{
  var hasReadOnlyValue = {
    button: true,
    checkbox: true,
    image: true,
    hidden: true,
    radio: true,
    reset: true,
    submit: true
  };

  var propTypes = {
    value: function (props, propName, componentName) {
      if (!props[propName] || hasReadOnlyValue[props.type] || props.onChange || props.readOnly || props.disabled) {
        return null;
      }
      return new Error('You provided a `value` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultValue`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    },
    checked: function (props, propName, componentName) {
      if (!props[propName] || props.onChange || props.readOnly || props.disabled) {
        return null;
      }
      return new Error('You provided a `checked` prop to a form field without an ' + '`onChange` handler. This will render a read-only field. If ' + 'the field should be mutable use `defaultChecked`. Otherwise, ' + 'set either `onChange` or `readOnly`.');
    }
  };

  /**
   * Provide a linked `value` attribute for controlled forms. You should not use
   * this outside of the ReactDOM controlled form components.
   */
  ReactControlledValuePropTypes.checkPropTypes = function (tagName, props, getStack) {
    checkPropTypes(propTypes, props, 'prop', tagName, getStack);
  };
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
var getCurrentFiberOwnerName$2 = ReactDebugCurrentFiber.getCurrentFiberOwnerName;
var getCurrentFiberStackAddendum$3 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;

var didWarnValueDefaultValue = false;
var didWarnCheckedDefaultChecked = false;
var didWarnControlledToUncontrolled = false;
var didWarnUncontrolledToControlled = false;

function isControlled(props) {
  var usesChecked = props.type === 'checkbox' || props.type === 'radio';
  return usesChecked ? props.checked != null : props.value != null;
}

/**
 * Implements an <input> host component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * See http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */

function getHostProps(element, props) {
  var node = element;
  var value = props.value;
  var checked = props.checked;

  var hostProps = _assign({
    // Make sure we set .type before any other properties (setting .value
    // before .type means .value is lost in IE11 and below)
    type: undefined,
    // Make sure we set .step before .value (setting .value before .step
    // means .value is rounded on mount, based upon step precision)
    step: undefined,
    // Make sure we set .min & .max before .value (to ensure proper order
    // in corner cases such as min or max deriving from value, e.g. Issue #7170)
    min: undefined,
    max: undefined
  }, props, {
    defaultChecked: undefined,
    defaultValue: undefined,
    value: value != null ? value : node._wrapperState.initialValue,
    checked: checked != null ? checked : node._wrapperState.initialChecked
  });

  return hostProps;
}

function initWrapperState(element, props) {
  {
    ReactControlledValuePropTypes.checkPropTypes('input', props, getCurrentFiberStackAddendum$3);

    if (props.checked !== undefined && props.defaultChecked !== undefined && !didWarnCheckedDefaultChecked) {
      warning(false, '%s contains an input of type %s with both checked and defaultChecked props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the checked prop, or the defaultChecked prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', getCurrentFiberOwnerName$2() || 'A component', props.type);
      didWarnCheckedDefaultChecked = true;
    }
    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue) {
      warning(false, '%s contains an input of type %s with both value and defaultValue props. ' + 'Input elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled input ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components', getCurrentFiberOwnerName$2() || 'A component', props.type);
      didWarnValueDefaultValue = true;
    }
  }

  var defaultValue = props.defaultValue;
  var node = element;
  node._wrapperState = {
    initialChecked: props.checked != null ? props.checked : props.defaultChecked,
    initialValue: props.value != null ? props.value : defaultValue,
    controlled: isControlled(props)
  };
}

function updateChecked(element, props) {
  var node = element;
  var checked = props.checked;
  if (checked != null) {
    setValueForProperty(node, 'checked', checked);
  }
}

function updateWrapper(element, props) {
  var node = element;
  {
    var controlled = isControlled(props);

    if (!node._wrapperState.controlled && controlled && !didWarnUncontrolledToControlled) {
      warning(false, 'A component is changing an uncontrolled input of type %s to be controlled. ' + 'Input elements should not switch from uncontrolled to controlled (or vice versa). ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://fb.me/react-controlled-components%s', props.type, getCurrentFiberStackAddendum$3());
      didWarnUncontrolledToControlled = true;
    }
    if (node._wrapperState.controlled && !controlled && !didWarnControlledToUncontrolled) {
      warning(false, 'A component is changing a controlled input of type %s to be uncontrolled. ' + 'Input elements should not switch from controlled to uncontrolled (or vice versa). ' + 'Decide between using a controlled or uncontrolled input ' + 'element for the lifetime of the component. More info: https://fb.me/react-controlled-components%s', props.type, getCurrentFiberStackAddendum$3());
      didWarnControlledToUncontrolled = true;
    }
  }

  updateChecked(element, props);

  var value = props.value;
  if (value != null) {
    if (value === 0 && node.value === '') {
      node.value = '0';
      // Note: IE9 reports a number inputs as 'text', so check props instead.
    } else if (props.type === 'number') {
      // Simulate `input.valueAsNumber`. IE9 does not support it
      var valueAsNumber = parseFloat(node.value) || 0;

      if (
      // eslint-disable-next-line
      value != valueAsNumber ||
      // eslint-disable-next-line
      value == valueAsNumber && node.value != value) {
        // Cast `value` to a string to ensure the value is set correctly. While
        // browsers typically do this as necessary, jsdom doesn't.
        node.value = '' + value;
      }
    } else if (node.value !== '' + value) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      node.value = '' + value;
    }
  } else {
    if (props.value == null && props.defaultValue != null) {
      // In Chrome, assigning defaultValue to certain input types triggers input validation.
      // For number inputs, the display value loses trailing decimal points. For email inputs,
      // Chrome raises "The specified value <x> is not a valid email address".
      //
      // Here we check to see if the defaultValue has actually changed, avoiding these problems
      // when the user is inputting text
      //
      // https://github.com/facebook/react/issues/7253
      if (node.defaultValue !== '' + props.defaultValue) {
        node.defaultValue = '' + props.defaultValue;
      }
    }
    if (props.checked == null && props.defaultChecked != null) {
      node.defaultChecked = !!props.defaultChecked;
    }
  }
}

function postMountWrapper(element, props) {
  var node = element;

  // Detach value from defaultValue. We won't do anything if we're working on
  // submit or reset inputs as those values & defaultValues are linked. They
  // are not resetable nodes so this operation doesn't matter and actually
  // removes browser-default values (eg "Submit Query") when no value is
  // provided.

  switch (props.type) {
    case 'submit':
    case 'reset':
      break;
    case 'color':
    case 'date':
    case 'datetime':
    case 'datetime-local':
    case 'month':
    case 'time':
    case 'week':
      // This fixes the no-show issue on iOS Safari and Android Chrome:
      // https://github.com/facebook/react/issues/7233
      node.value = '';
      node.value = node.defaultValue;
      break;
    default:
      node.value = node.value;
      break;
  }

  // Normally, we'd just do `node.checked = node.checked` upon initial mount, less this bug
  // this is needed to work around a chrome bug where setting defaultChecked
  // will sometimes influence the value of checked (even after detachment).
  // Reference: https://bugs.chromium.org/p/chromium/issues/detail?id=608416
  // We need to temporarily unset name to avoid disrupting radio button groups.
  var name = node.name;
  if (name !== '') {
    node.name = '';
  }
  node.defaultChecked = !node.defaultChecked;
  node.defaultChecked = !node.defaultChecked;
  if (name !== '') {
    node.name = name;
  }
}

function restoreControlledState$1(element, props) {
  var node = element;
  updateWrapper(node, props);
  updateNamedCousins(node, props);
}

function updateNamedCousins(rootNode, props) {
  var name = props.name;
  if (props.type === 'radio' && name != null) {
    var queryRoot = rootNode;

    while (queryRoot.parentNode) {
      queryRoot = queryRoot.parentNode;
    }

    // If `rootNode.form` was non-null, then we could try `form.elements`,
    // but that sometimes behaves strangely in IE8. We could also try using
    // `form.getElementsByName`, but that will only return direct children
    // and won't include inputs that use the HTML5 `form=` attribute. Since
    // the input might not even be in a form. It might not even be in the
    // document. Let's just use the local `querySelectorAll` to ensure we don't
    // miss anything.
    var group = queryRoot.querySelectorAll('input[name=' + JSON.stringify('' + name) + '][type="radio"]');

    for (var i = 0; i < group.length; i++) {
      var otherNode = group[i];
      if (otherNode === rootNode || otherNode.form !== rootNode.form) {
        continue;
      }
      // This will throw if radio buttons rendered by different copies of React
      // and the same name are rendered into the same form (same as #1939).
      // That's probably okay; we don't support it just as we don't support
      // mixing React radio buttons with non-React ones.
      var otherProps = getFiberCurrentPropsFromNode$1(otherNode);
      !otherProps ? invariant(false, 'ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.') : void 0;

      // We need update the tracked value on the named cousin since the value
      // was changed but the input saw no event or value set
      updateValueIfChanged(otherNode);

      // If this is a controlled radio button group, forcing the input that
      // was previously checked to update will cause it to be come re-checked
      // as appropriate.
      updateWrapper(otherNode, otherProps);
    }
  }
}

function flattenChildren(children) {
  var content = '';

  // Flatten children and warn if they aren't strings or numbers;
  // invalid types are ignored.
  // We can silently skip them because invalid DOM nesting warning
  // catches these cases in Fiber.
  React.Children.forEach(children, function (child) {
    if (child == null) {
      return;
    }
    if (typeof child === 'string' || typeof child === 'number') {
      content += child;
    }
  });

  return content;
}

/**
 * Implements an <option> host component that warns when `selected` is set.
 */

function validateProps(element, props) {
  // TODO (yungsters): Remove support for `selected` in <option>.
  {
    warning(props.selected == null, 'Use the `defaultValue` or `value` props on <select> instead of ' + 'setting `selected` on <option>.');
  }
}

function postMountWrapper$1(element, props) {
  // value="" should make a value attribute (#6219)
  if (props.value != null) {
    element.setAttribute('value', props.value);
  }
}

function getHostProps$1(element, props) {
  var hostProps = _assign({ children: undefined }, props);
  var content = flattenChildren(props.children);

  if (content) {
    hostProps.children = content;
  }

  return hostProps;
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
var getCurrentFiberOwnerName$3 = ReactDebugCurrentFiber.getCurrentFiberOwnerName;
var getCurrentFiberStackAddendum$4 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;


{
  var didWarnValueDefaultValue$1 = false;
}

function getDeclarationErrorAddendum() {
  var ownerName = getCurrentFiberOwnerName$3();
  if (ownerName) {
    return '\n\nCheck the render method of `' + ownerName + '`.';
  }
  return '';
}

var valuePropNames = ['value', 'defaultValue'];

/**
 * Validation function for `value` and `defaultValue`.
 */
function checkSelectPropTypes(props) {
  ReactControlledValuePropTypes.checkPropTypes('select', props, getCurrentFiberStackAddendum$4);

  for (var i = 0; i < valuePropNames.length; i++) {
    var propName = valuePropNames[i];
    if (props[propName] == null) {
      continue;
    }
    var isArray = Array.isArray(props[propName]);
    if (props.multiple && !isArray) {
      warning(false, 'The `%s` prop supplied to <select> must be an array if ' + '`multiple` is true.%s', propName, getDeclarationErrorAddendum());
    } else if (!props.multiple && isArray) {
      warning(false, 'The `%s` prop supplied to <select> must be a scalar ' + 'value if `multiple` is false.%s', propName, getDeclarationErrorAddendum());
    }
  }
}

function updateOptions(node, multiple, propValue, setDefaultSelected) {
  var options = node.options;

  if (multiple) {
    var selectedValues = propValue;
    var selectedValue = {};
    for (var i = 0; i < selectedValues.length; i++) {
      // Prefix to avoid chaos with special keys.
      selectedValue['$' + selectedValues[i]] = true;
    }
    for (var _i = 0; _i < options.length; _i++) {
      var selected = selectedValue.hasOwnProperty('$' + options[_i].value);
      if (options[_i].selected !== selected) {
        options[_i].selected = selected;
      }
      if (selected && setDefaultSelected) {
        options[_i].defaultSelected = true;
      }
    }
  } else {
    // Do not set `select.value` as exact behavior isn't consistent across all
    // browsers for all cases.
    var _selectedValue = '' + propValue;
    var defaultSelected = null;
    for (var _i2 = 0; _i2 < options.length; _i2++) {
      if (options[_i2].value === _selectedValue) {
        options[_i2].selected = true;
        if (setDefaultSelected) {
          options[_i2].defaultSelected = true;
        }
        return;
      }
      if (defaultSelected === null && !options[_i2].disabled) {
        defaultSelected = options[_i2];
      }
    }
    if (defaultSelected !== null) {
      defaultSelected.selected = true;
    }
  }
}

/**
 * Implements a <select> host component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * stringable. If `multiple` is true, the prop must be an array of stringables.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */

function getHostProps$2(element, props) {
  return _assign({}, props, {
    value: undefined
  });
}

function initWrapperState$1(element, props) {
  var node = element;
  {
    checkSelectPropTypes(props);
  }

  var value = props.value;
  node._wrapperState = {
    initialValue: value != null ? value : props.defaultValue,
    wasMultiple: !!props.multiple
  };

  {
    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValueDefaultValue$1) {
      warning(false, 'Select elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled select ' + 'element and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
      didWarnValueDefaultValue$1 = true;
    }
  }
}

function postMountWrapper$2(element, props) {
  var node = element;
  node.multiple = !!props.multiple;
  var value = props.value;
  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } else if (props.defaultValue != null) {
    updateOptions(node, !!props.multiple, props.defaultValue, true);
  }
}

function postUpdateWrapper(element, props) {
  var node = element;
  // After the initial mount, we control selected-ness manually so don't pass
  // this value down
  node._wrapperState.initialValue = undefined;

  var wasMultiple = node._wrapperState.wasMultiple;
  node._wrapperState.wasMultiple = !!props.multiple;

  var value = props.value;
  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  } else if (wasMultiple !== !!props.multiple) {
    // For simplicity, reapply `defaultValue` if `multiple` is toggled.
    if (props.defaultValue != null) {
      updateOptions(node, !!props.multiple, props.defaultValue, true);
    } else {
      // Revert the select back to its default unselected state.
      updateOptions(node, !!props.multiple, props.multiple ? [] : '', false);
    }
  }
}

function restoreControlledState$2(element, props) {
  var node = element;
  var value = props.value;

  if (value != null) {
    updateOptions(node, !!props.multiple, value, false);
  }
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
var getCurrentFiberStackAddendum$5 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;

var didWarnValDefaultVal = false;

/**
 * Implements a <textarea> host component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */

function getHostProps$3(element, props) {
  var node = element;
  !(props.dangerouslySetInnerHTML == null) ? invariant(false, '`dangerouslySetInnerHTML` does not make sense on <textarea>.') : void 0;

  // Always set children to the same thing. In IE9, the selection range will
  // get reset if `textContent` is mutated.  We could add a check in setTextContent
  // to only set the value if/when the value differs from the node value (which would
  // completely solve this IE9 bug), but Sebastian+Sophie seemed to like this
  // solution. The value can be a boolean or object so that's why it's forced
  // to be a string.
  var hostProps = _assign({}, props, {
    value: undefined,
    defaultValue: undefined,
    children: '' + node._wrapperState.initialValue
  });

  return hostProps;
}

function initWrapperState$2(element, props) {
  var node = element;
  {
    ReactControlledValuePropTypes.checkPropTypes('textarea', props, getCurrentFiberStackAddendum$5);
    if (props.value !== undefined && props.defaultValue !== undefined && !didWarnValDefaultVal) {
      warning(false, 'Textarea elements must be either controlled or uncontrolled ' + '(specify either the value prop, or the defaultValue prop, but not ' + 'both). Decide between using a controlled or uncontrolled textarea ' + 'and remove one of these props. More info: ' + 'https://fb.me/react-controlled-components');
      didWarnValDefaultVal = true;
    }
  }

  var initialValue = props.value;

  // Only bother fetching default value if we're going to use it
  if (initialValue == null) {
    var defaultValue = props.defaultValue;
    // TODO (yungsters): Remove support for children content in <textarea>.
    var children = props.children;
    if (children != null) {
      {
        warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.');
      }
      !(defaultValue == null) ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : void 0;
      if (Array.isArray(children)) {
        !(children.length <= 1) ? invariant(false, '<textarea> can only have at most one child.') : void 0;
        children = children[0];
      }

      defaultValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValue = '';
    }
    initialValue = defaultValue;
  }

  node._wrapperState = {
    initialValue: '' + initialValue
  };
}

function updateWrapper$1(element, props) {
  var node = element;
  var value = props.value;
  if (value != null) {
    // Cast `value` to a string to ensure the value is set correctly. While
    // browsers typically do this as necessary, jsdom doesn't.
    var newValue = '' + value;

    // To avoid side effects (such as losing text selection), only set value if changed
    if (newValue !== node.value) {
      node.value = newValue;
    }
    if (props.defaultValue == null) {
      node.defaultValue = newValue;
    }
  }
  if (props.defaultValue != null) {
    node.defaultValue = props.defaultValue;
  }
}

function postMountWrapper$3(element, props) {
  var node = element;
  // This is in postMount because we need access to the DOM node, which is not
  // available until after the component has mounted.
  var textContent = node.textContent;

  // Only set node.value if textContent is equal to the expected
  // initial value. In IE10/IE11 there is a bug where the placeholder attribute
  // will populate textContent as well.
  // https://developer.microsoft.com/microsoft-edge/platform/issues/101525/
  if (textContent === node._wrapperState.initialValue) {
    node.value = textContent;
  }
}

function restoreControlledState$3(element, props) {
  // DOM component is still mounted; update
  updateWrapper$1(element, props);
}

var HTML_NAMESPACE$1 = 'http://www.w3.org/1999/xhtml';
var MATH_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

var Namespaces = {
  html: HTML_NAMESPACE$1,
  mathml: MATH_NAMESPACE,
  svg: SVG_NAMESPACE
};

// Assumes there is no parent namespace.
function getIntrinsicNamespace(type) {
  switch (type) {
    case 'svg':
      return SVG_NAMESPACE;
    case 'math':
      return MATH_NAMESPACE;
    default:
      return HTML_NAMESPACE$1;
  }
}

function getChildNamespace(parentNamespace, type) {
  if (parentNamespace == null || parentNamespace === HTML_NAMESPACE$1) {
    // No (or default) parent namespace: potential entry point.
    return getIntrinsicNamespace(type);
  }
  if (parentNamespace === SVG_NAMESPACE && type === 'foreignObject') {
    // We're leaving SVG.
    return HTML_NAMESPACE$1;
  }
  // By default, pass namespace below.
  return parentNamespace;
}

/* globals MSApp */

/**
 * Create a function which has 'unsafe' privileges (required by windows8 apps)
 */
var createMicrosoftUnsafeLocalFunction = function (func) {
  if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
    return function (arg0, arg1, arg2, arg3) {
      MSApp.execUnsafeLocalFunction(function () {
        return func(arg0, arg1, arg2, arg3);
      });
    };
  } else {
    return func;
  }
};

// SVG temp container for IE lacking innerHTML
var reusableSVGContainer = void 0;

/**
 * Set the innerHTML property of a node
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInnerHTML = createMicrosoftUnsafeLocalFunction(function (node, html) {
  // IE does not have innerHTML for SVG nodes, so instead we inject the
  // new markup in a temp node and then move the child nodes across into
  // the target node

  if (node.namespaceURI === Namespaces.svg && !('innerHTML' in node)) {
    reusableSVGContainer = reusableSVGContainer || document.createElement('div');
    reusableSVGContainer.innerHTML = '<svg>' + html + '</svg>';
    var svgNode = reusableSVGContainer.firstChild;
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    while (svgNode.firstChild) {
      node.appendChild(svgNode.firstChild);
    }
  } else {
    node.innerHTML = html;
  }
});

/**
 * Set the textContent property of a node, ensuring that whitespace is preserved
 * even in IE8. innerText is a poor substitute for textContent and, among many
 * issues, inserts <br> instead of the literal newline chars. innerHTML behaves
 * as it should.
 *
 * @param {DOMElement} node
 * @param {string} text
 * @internal
 */
var setTextContent = function (node, text) {
  if (text) {
    var firstChild = node.firstChild;

    if (firstChild && firstChild === node.lastChild && firstChild.nodeType === TEXT_NODE) {
      firstChild.nodeValue = text;
      return;
    }
  }
  node.textContent = text;
};

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function (prop) {
  prefixes.forEach(function (prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value, isCustomProperty) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  if (!isCustomProperty && typeof value === 'number' && value !== 0 && !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])) {
    return value + 'px'; // Presumes implicit 'px' suffix for unitless numbers
  }

  return ('' + value).trim();
}

var warnValidStyle = emptyFunction;

{
  // 'msTransform' is correct, but the other prefixes should be capitalized
  var badVendoredStyleNamePattern = /^(?:webkit|moz|o)[A-Z]/;

  // style values shouldn't contain a semicolon
  var badStyleValueWithSemicolonPattern = /;\s*$/;

  var warnedStyleNames = {};
  var warnedStyleValues = {};
  var warnedForNaNValue = false;
  var warnedForInfinityValue = false;

  var warnHyphenatedStyleName = function (name, getStack) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    warning(false, 'Unsupported style property %s. Did you mean %s?%s', name, camelizeStyleName(name), getStack());
  };

  var warnBadVendoredStyleName = function (name, getStack) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    warning(false, 'Unsupported vendor-prefixed style property %s. Did you mean %s?%s', name, name.charAt(0).toUpperCase() + name.slice(1), getStack());
  };

  var warnStyleValueWithSemicolon = function (name, value, getStack) {
    if (warnedStyleValues.hasOwnProperty(value) && warnedStyleValues[value]) {
      return;
    }

    warnedStyleValues[value] = true;
    warning(false, "Style property values shouldn't contain a semicolon. " + 'Try "%s: %s" instead.%s', name, value.replace(badStyleValueWithSemicolonPattern, ''), getStack());
  };

  var warnStyleValueIsNaN = function (name, value, getStack) {
    if (warnedForNaNValue) {
      return;
    }

    warnedForNaNValue = true;
    warning(false, '`NaN` is an invalid value for the `%s` css style property.%s', name, getStack());
  };

  var warnStyleValueIsInfinity = function (name, value, getStack) {
    if (warnedForInfinityValue) {
      return;
    }

    warnedForInfinityValue = true;
    warning(false, '`Infinity` is an invalid value for the `%s` css style property.%s', name, getStack());
  };

  warnValidStyle = function (name, value, getStack) {
    if (name.indexOf('-') > -1) {
      warnHyphenatedStyleName(name, getStack);
    } else if (badVendoredStyleNamePattern.test(name)) {
      warnBadVendoredStyleName(name, getStack);
    } else if (badStyleValueWithSemicolonPattern.test(value)) {
      warnStyleValueWithSemicolon(name, value, getStack);
    }

    if (typeof value === 'number') {
      if (isNaN(value)) {
        warnStyleValueIsNaN(name, value, getStack);
      } else if (!isFinite(value)) {
        warnStyleValueIsInfinity(name, value, getStack);
      }
    }
  };
}

var warnValidStyle$1 = warnValidStyle;

/**
 * Operations for dealing with CSS properties.
 */

/**
 * This creates a string that is expected to be equivalent to the style
 * attribute generated by server-side rendering. It by-passes warnings and
 * security checks so it's not safe to use this value for anything other than
 * comparison. It is only used in DEV for SSR validation.
 */
function createDangerousStringForStyles(styles) {
  {
    var serialized = '';
    var delimiter = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      var styleValue = styles[styleName];
      if (styleValue != null) {
        var isCustomProperty = styleName.indexOf('--') === 0;
        serialized += delimiter + hyphenateStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty);

        delimiter = ';';
      }
    }
    return serialized || null;
  }
}

/**
 * Sets the value for multiple styles on a node.  If a value is specified as
 * '' (empty string), the corresponding style property will be unset.
 *
 * @param {DOMElement} node
 * @param {object} styles
 */
function setValueForStyles(node, styles, getStack) {
  var style = node.style;
  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    var isCustomProperty = styleName.indexOf('--') === 0;
    {
      if (!isCustomProperty) {
        warnValidStyle$1(styleName, styles[styleName], getStack);
      }
    }
    var styleValue = dangerousStyleValue(styleName, styles[styleName], isCustomProperty);
    if (styleName === 'float') {
      styleName = 'cssFloat';
    }
    if (isCustomProperty) {
      style.setProperty(styleName, styleValue);
    } else {
      style[styleName] = styleValue;
    }
  }
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special-case tags.

var omittedCloseTags = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};

// For HTML, certain tags cannot have children. This has the same purpose as
// `omittedCloseTags` except that `menuitem` should still have its closing tag.

var voidElementTags = _assign({
  menuitem: true
}, omittedCloseTags);

var HTML$1 = '__html';

function assertValidProps(tag, props, getStack) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  if (voidElementTags[tag]) {
    !(props.children == null && props.dangerouslySetInnerHTML == null) ? invariant(false, '%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s', tag, getStack()) : void 0;
  }
  if (props.dangerouslySetInnerHTML != null) {
    !(props.children == null) ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : void 0;
    !(typeof props.dangerouslySetInnerHTML === 'object' && HTML$1 in props.dangerouslySetInnerHTML) ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.') : void 0;
  }
  {
    warning(props.suppressContentEditableWarning || !props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.%s', getStack());
  }
  !(props.style == null || typeof props.style === 'object') ? invariant(false, 'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s', getStack()) : void 0;
}

function isCustomComponent(tagName, props) {
  if (tagName.indexOf('-') === -1) {
    return typeof props.is === 'string';
  }
  switch (tagName) {
    // These are reserved SVG and MathML elements.
    // We don't mind this whitelist too much because we expect it to never grow.
    // The alternative is to track the namespace in a few places which is convoluted.
    // https://w3c.github.io/webcomponents/spec/custom/#custom-elements-core-concepts
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return false;
    default:
      return true;
  }
}

var ariaProperties = {
  'aria-current': 0, // state
  'aria-details': 0,
  'aria-disabled': 0, // state
  'aria-hidden': 0, // state
  'aria-invalid': 0, // state
  'aria-keyshortcuts': 0,
  'aria-label': 0,
  'aria-roledescription': 0,
  // Widget Attributes
  'aria-autocomplete': 0,
  'aria-checked': 0,
  'aria-expanded': 0,
  'aria-haspopup': 0,
  'aria-level': 0,
  'aria-modal': 0,
  'aria-multiline': 0,
  'aria-multiselectable': 0,
  'aria-orientation': 0,
  'aria-placeholder': 0,
  'aria-pressed': 0,
  'aria-readonly': 0,
  'aria-required': 0,
  'aria-selected': 0,
  'aria-sort': 0,
  'aria-valuemax': 0,
  'aria-valuemin': 0,
  'aria-valuenow': 0,
  'aria-valuetext': 0,
  // Live Region Attributes
  'aria-atomic': 0,
  'aria-busy': 0,
  'aria-live': 0,
  'aria-relevant': 0,
  // Drag-and-Drop Attributes
  'aria-dropeffect': 0,
  'aria-grabbed': 0,
  // Relationship Attributes
  'aria-activedescendant': 0,
  'aria-colcount': 0,
  'aria-colindex': 0,
  'aria-colspan': 0,
  'aria-controls': 0,
  'aria-describedby': 0,
  'aria-errormessage': 0,
  'aria-flowto': 0,
  'aria-labelledby': 0,
  'aria-owns': 0,
  'aria-posinset': 0,
  'aria-rowcount': 0,
  'aria-rowindex': 0,
  'aria-rowspan': 0,
  'aria-setsize': 0
};

var warnedProperties = {};
var rARIA = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
var rARIACamel = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

var hasOwnProperty = Object.prototype.hasOwnProperty;

function getStackAddendum() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : '';
}

function validateProperty(tagName, name) {
  if (hasOwnProperty.call(warnedProperties, name) && warnedProperties[name]) {
    return true;
  }

  if (rARIACamel.test(name)) {
    var ariaName = 'aria-' + name.slice(4).toLowerCase();
    var correctName = ariaProperties.hasOwnProperty(ariaName) ? ariaName : null;

    // If this is an aria-* attribute, but is not listed in the known DOM
    // DOM properties, then it is an invalid aria-* attribute.
    if (correctName == null) {
      warning(false, 'Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.%s', name, getStackAddendum());
      warnedProperties[name] = true;
      return true;
    }
    // aria-* attributes should be lowercase; suggest the lowercase version.
    if (name !== correctName) {
      warning(false, 'Invalid ARIA attribute `%s`. Did you mean `%s`?%s', name, correctName, getStackAddendum());
      warnedProperties[name] = true;
      return true;
    }
  }

  if (rARIA.test(name)) {
    var lowerCasedName = name.toLowerCase();
    var standardName = ariaProperties.hasOwnProperty(lowerCasedName) ? lowerCasedName : null;

    // If this is an aria-* attribute, but is not listed in the known DOM
    // DOM properties, then it is an invalid aria-* attribute.
    if (standardName == null) {
      warnedProperties[name] = true;
      return false;
    }
    // aria-* attributes should be lowercase; suggest the lowercase version.
    if (name !== standardName) {
      warning(false, 'Unknown ARIA attribute `%s`. Did you mean `%s`?%s', name, standardName, getStackAddendum());
      warnedProperties[name] = true;
      return true;
    }
  }

  return true;
}

function warnInvalidARIAProps(type, props) {
  var invalidProps = [];

  for (var key in props) {
    var isValid = validateProperty(type, key);
    if (!isValid) {
      invalidProps.push(key);
    }
  }

  var unknownPropString = invalidProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');

  if (invalidProps.length === 1) {
    warning(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum());
  } else if (invalidProps.length > 1) {
    warning(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, type, getStackAddendum());
  }
}

function validateProperties(type, props) {
  if (isCustomComponent(type, props)) {
    return;
  }
  warnInvalidARIAProps(type, props);
}

var didWarnValueNull = false;

function getStackAddendum$1() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : '';
}

function validateProperties$1(type, props) {
  if (type !== 'input' && type !== 'textarea' && type !== 'select') {
    return;
  }

  if (props != null && props.value === null && !didWarnValueNull) {
    didWarnValueNull = true;
    if (type === 'select' && props.multiple) {
      warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty array when `multiple` is set to `true` ' + 'to clear the component or `undefined` for uncontrolled components.%s', type, getStackAddendum$1());
    } else {
      warning(false, '`value` prop on `%s` should not be null. ' + 'Consider using an empty string to clear the component or `undefined` ' + 'for uncontrolled components.%s', type, getStackAddendum$1());
    }
  }
}

// When adding attributes to the HTML or SVG whitelist, be sure to
// also add them to this module to ensure casing and incorrect name
// warnings.
var possibleStandardNames = {
  // HTML
  accept: 'accept',
  acceptcharset: 'acceptCharset',
  'accept-charset': 'acceptCharset',
  accesskey: 'accessKey',
  action: 'action',
  allowfullscreen: 'allowFullScreen',
  alt: 'alt',
  as: 'as',
  async: 'async',
  autocapitalize: 'autoCapitalize',
  autocomplete: 'autoComplete',
  autocorrect: 'autoCorrect',
  autofocus: 'autoFocus',
  autoplay: 'autoPlay',
  autosave: 'autoSave',
  capture: 'capture',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  challenge: 'challenge',
  charset: 'charSet',
  checked: 'checked',
  children: 'children',
  cite: 'cite',
  'class': 'className',
  classid: 'classID',
  classname: 'className',
  cols: 'cols',
  colspan: 'colSpan',
  content: 'content',
  contenteditable: 'contentEditable',
  contextmenu: 'contextMenu',
  controls: 'controls',
  controlslist: 'controlsList',
  coords: 'coords',
  crossorigin: 'crossOrigin',
  dangerouslysetinnerhtml: 'dangerouslySetInnerHTML',
  data: 'data',
  datetime: 'dateTime',
  'default': 'default',
  defaultchecked: 'defaultChecked',
  defaultvalue: 'defaultValue',
  defer: 'defer',
  dir: 'dir',
  disabled: 'disabled',
  download: 'download',
  draggable: 'draggable',
  enctype: 'encType',
  'for': 'htmlFor',
  form: 'form',
  formmethod: 'formMethod',
  formaction: 'formAction',
  formenctype: 'formEncType',
  formnovalidate: 'formNoValidate',
  formtarget: 'formTarget',
  frameborder: 'frameBorder',
  headers: 'headers',
  height: 'height',
  hidden: 'hidden',
  high: 'high',
  href: 'href',
  hreflang: 'hrefLang',
  htmlfor: 'htmlFor',
  httpequiv: 'httpEquiv',
  'http-equiv': 'httpEquiv',
  icon: 'icon',
  id: 'id',
  innerhtml: 'innerHTML',
  inputmode: 'inputMode',
  integrity: 'integrity',
  is: 'is',
  itemid: 'itemID',
  itemprop: 'itemProp',
  itemref: 'itemRef',
  itemscope: 'itemScope',
  itemtype: 'itemType',
  keyparams: 'keyParams',
  keytype: 'keyType',
  kind: 'kind',
  label: 'label',
  lang: 'lang',
  list: 'list',
  loop: 'loop',
  low: 'low',
  manifest: 'manifest',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  max: 'max',
  maxlength: 'maxLength',
  media: 'media',
  mediagroup: 'mediaGroup',
  method: 'method',
  min: 'min',
  minlength: 'minLength',
  multiple: 'multiple',
  muted: 'muted',
  name: 'name',
  nonce: 'nonce',
  novalidate: 'noValidate',
  open: 'open',
  optimum: 'optimum',
  pattern: 'pattern',
  placeholder: 'placeholder',
  playsinline: 'playsInline',
  poster: 'poster',
  preload: 'preload',
  profile: 'profile',
  radiogroup: 'radioGroup',
  readonly: 'readOnly',
  referrerpolicy: 'referrerPolicy',
  rel: 'rel',
  required: 'required',
  reversed: 'reversed',
  role: 'role',
  rows: 'rows',
  rowspan: 'rowSpan',
  sandbox: 'sandbox',
  scope: 'scope',
  scoped: 'scoped',
  scrolling: 'scrolling',
  seamless: 'seamless',
  selected: 'selected',
  shape: 'shape',
  size: 'size',
  sizes: 'sizes',
  span: 'span',
  spellcheck: 'spellCheck',
  src: 'src',
  srcdoc: 'srcDoc',
  srclang: 'srcLang',
  srcset: 'srcSet',
  start: 'start',
  step: 'step',
  style: 'style',
  summary: 'summary',
  tabindex: 'tabIndex',
  target: 'target',
  title: 'title',
  type: 'type',
  usemap: 'useMap',
  value: 'value',
  width: 'width',
  wmode: 'wmode',
  wrap: 'wrap',

  // SVG
  about: 'about',
  accentheight: 'accentHeight',
  'accent-height': 'accentHeight',
  accumulate: 'accumulate',
  additive: 'additive',
  alignmentbaseline: 'alignmentBaseline',
  'alignment-baseline': 'alignmentBaseline',
  allowreorder: 'allowReorder',
  alphabetic: 'alphabetic',
  amplitude: 'amplitude',
  arabicform: 'arabicForm',
  'arabic-form': 'arabicForm',
  ascent: 'ascent',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  autoreverse: 'autoReverse',
  azimuth: 'azimuth',
  basefrequency: 'baseFrequency',
  baselineshift: 'baselineShift',
  'baseline-shift': 'baselineShift',
  baseprofile: 'baseProfile',
  bbox: 'bbox',
  begin: 'begin',
  bias: 'bias',
  by: 'by',
  calcmode: 'calcMode',
  capheight: 'capHeight',
  'cap-height': 'capHeight',
  clip: 'clip',
  clippath: 'clipPath',
  'clip-path': 'clipPath',
  clippathunits: 'clipPathUnits',
  cliprule: 'clipRule',
  'clip-rule': 'clipRule',
  color: 'color',
  colorinterpolation: 'colorInterpolation',
  'color-interpolation': 'colorInterpolation',
  colorinterpolationfilters: 'colorInterpolationFilters',
  'color-interpolation-filters': 'colorInterpolationFilters',
  colorprofile: 'colorProfile',
  'color-profile': 'colorProfile',
  colorrendering: 'colorRendering',
  'color-rendering': 'colorRendering',
  contentscripttype: 'contentScriptType',
  contentstyletype: 'contentStyleType',
  cursor: 'cursor',
  cx: 'cx',
  cy: 'cy',
  d: 'd',
  datatype: 'datatype',
  decelerate: 'decelerate',
  descent: 'descent',
  diffuseconstant: 'diffuseConstant',
  direction: 'direction',
  display: 'display',
  divisor: 'divisor',
  dominantbaseline: 'dominantBaseline',
  'dominant-baseline': 'dominantBaseline',
  dur: 'dur',
  dx: 'dx',
  dy: 'dy',
  edgemode: 'edgeMode',
  elevation: 'elevation',
  enablebackground: 'enableBackground',
  'enable-background': 'enableBackground',
  end: 'end',
  exponent: 'exponent',
  externalresourcesrequired: 'externalResourcesRequired',
  fill: 'fill',
  fillopacity: 'fillOpacity',
  'fill-opacity': 'fillOpacity',
  fillrule: 'fillRule',
  'fill-rule': 'fillRule',
  filter: 'filter',
  filterres: 'filterRes',
  filterunits: 'filterUnits',
  floodopacity: 'floodOpacity',
  'flood-opacity': 'floodOpacity',
  floodcolor: 'floodColor',
  'flood-color': 'floodColor',
  focusable: 'focusable',
  fontfamily: 'fontFamily',
  'font-family': 'fontFamily',
  fontsize: 'fontSize',
  'font-size': 'fontSize',
  fontsizeadjust: 'fontSizeAdjust',
  'font-size-adjust': 'fontSizeAdjust',
  fontstretch: 'fontStretch',
  'font-stretch': 'fontStretch',
  fontstyle: 'fontStyle',
  'font-style': 'fontStyle',
  fontvariant: 'fontVariant',
  'font-variant': 'fontVariant',
  fontweight: 'fontWeight',
  'font-weight': 'fontWeight',
  format: 'format',
  from: 'from',
  fx: 'fx',
  fy: 'fy',
  g1: 'g1',
  g2: 'g2',
  glyphname: 'glyphName',
  'glyph-name': 'glyphName',
  glyphorientationhorizontal: 'glyphOrientationHorizontal',
  'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
  glyphorientationvertical: 'glyphOrientationVertical',
  'glyph-orientation-vertical': 'glyphOrientationVertical',
  glyphref: 'glyphRef',
  gradienttransform: 'gradientTransform',
  gradientunits: 'gradientUnits',
  hanging: 'hanging',
  horizadvx: 'horizAdvX',
  'horiz-adv-x': 'horizAdvX',
  horizoriginx: 'horizOriginX',
  'horiz-origin-x': 'horizOriginX',
  ideographic: 'ideographic',
  imagerendering: 'imageRendering',
  'image-rendering': 'imageRendering',
  in2: 'in2',
  'in': 'in',
  inlist: 'inlist',
  intercept: 'intercept',
  k1: 'k1',
  k2: 'k2',
  k3: 'k3',
  k4: 'k4',
  k: 'k',
  kernelmatrix: 'kernelMatrix',
  kernelunitlength: 'kernelUnitLength',
  kerning: 'kerning',
  keypoints: 'keyPoints',
  keysplines: 'keySplines',
  keytimes: 'keyTimes',
  lengthadjust: 'lengthAdjust',
  letterspacing: 'letterSpacing',
  'letter-spacing': 'letterSpacing',
  lightingcolor: 'lightingColor',
  'lighting-color': 'lightingColor',
  limitingconeangle: 'limitingConeAngle',
  local: 'local',
  markerend: 'markerEnd',
  'marker-end': 'markerEnd',
  markerheight: 'markerHeight',
  markermid: 'markerMid',
  'marker-mid': 'markerMid',
  markerstart: 'markerStart',
  'marker-start': 'markerStart',
  markerunits: 'markerUnits',
  markerwidth: 'markerWidth',
  mask: 'mask',
  maskcontentunits: 'maskContentUnits',
  maskunits: 'maskUnits',
  mathematical: 'mathematical',
  mode: 'mode',
  numoctaves: 'numOctaves',
  offset: 'offset',
  opacity: 'opacity',
  operator: 'operator',
  order: 'order',
  orient: 'orient',
  orientation: 'orientation',
  origin: 'origin',
  overflow: 'overflow',
  overlineposition: 'overlinePosition',
  'overline-position': 'overlinePosition',
  overlinethickness: 'overlineThickness',
  'overline-thickness': 'overlineThickness',
  paintorder: 'paintOrder',
  'paint-order': 'paintOrder',
  panose1: 'panose1',
  'panose-1': 'panose1',
  pathlength: 'pathLength',
  patterncontentunits: 'patternContentUnits',
  patterntransform: 'patternTransform',
  patternunits: 'patternUnits',
  pointerevents: 'pointerEvents',
  'pointer-events': 'pointerEvents',
  points: 'points',
  pointsatx: 'pointsAtX',
  pointsaty: 'pointsAtY',
  pointsatz: 'pointsAtZ',
  prefix: 'prefix',
  preservealpha: 'preserveAlpha',
  preserveaspectratio: 'preserveAspectRatio',
  primitiveunits: 'primitiveUnits',
  property: 'property',
  r: 'r',
  radius: 'radius',
  refx: 'refX',
  refy: 'refY',
  renderingintent: 'renderingIntent',
  'rendering-intent': 'renderingIntent',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  requiredextensions: 'requiredExtensions',
  requiredfeatures: 'requiredFeatures',
  resource: 'resource',
  restart: 'restart',
  result: 'result',
  results: 'results',
  rotate: 'rotate',
  rx: 'rx',
  ry: 'ry',
  scale: 'scale',
  security: 'security',
  seed: 'seed',
  shaperendering: 'shapeRendering',
  'shape-rendering': 'shapeRendering',
  slope: 'slope',
  spacing: 'spacing',
  specularconstant: 'specularConstant',
  specularexponent: 'specularExponent',
  speed: 'speed',
  spreadmethod: 'spreadMethod',
  startoffset: 'startOffset',
  stddeviation: 'stdDeviation',
  stemh: 'stemh',
  stemv: 'stemv',
  stitchtiles: 'stitchTiles',
  stopcolor: 'stopColor',
  'stop-color': 'stopColor',
  stopopacity: 'stopOpacity',
  'stop-opacity': 'stopOpacity',
  strikethroughposition: 'strikethroughPosition',
  'strikethrough-position': 'strikethroughPosition',
  strikethroughthickness: 'strikethroughThickness',
  'strikethrough-thickness': 'strikethroughThickness',
  string: 'string',
  stroke: 'stroke',
  strokedasharray: 'strokeDasharray',
  'stroke-dasharray': 'strokeDasharray',
  strokedashoffset: 'strokeDashoffset',
  'stroke-dashoffset': 'strokeDashoffset',
  strokelinecap: 'strokeLinecap',
  'stroke-linecap': 'strokeLinecap',
  strokelinejoin: 'strokeLinejoin',
  'stroke-linejoin': 'strokeLinejoin',
  strokemiterlimit: 'strokeMiterlimit',
  'stroke-miterlimit': 'strokeMiterlimit',
  strokewidth: 'strokeWidth',
  'stroke-width': 'strokeWidth',
  strokeopacity: 'strokeOpacity',
  'stroke-opacity': 'strokeOpacity',
  suppresscontenteditablewarning: 'suppressContentEditableWarning',
  suppresshydrationwarning: 'suppressHydrationWarning',
  surfacescale: 'surfaceScale',
  systemlanguage: 'systemLanguage',
  tablevalues: 'tableValues',
  targetx: 'targetX',
  targety: 'targetY',
  textanchor: 'textAnchor',
  'text-anchor': 'textAnchor',
  textdecoration: 'textDecoration',
  'text-decoration': 'textDecoration',
  textlength: 'textLength',
  textrendering: 'textRendering',
  'text-rendering': 'textRendering',
  to: 'to',
  transform: 'transform',
  'typeof': 'typeof',
  u1: 'u1',
  u2: 'u2',
  underlineposition: 'underlinePosition',
  'underline-position': 'underlinePosition',
  underlinethickness: 'underlineThickness',
  'underline-thickness': 'underlineThickness',
  unicode: 'unicode',
  unicodebidi: 'unicodeBidi',
  'unicode-bidi': 'unicodeBidi',
  unicoderange: 'unicodeRange',
  'unicode-range': 'unicodeRange',
  unitsperem: 'unitsPerEm',
  'units-per-em': 'unitsPerEm',
  unselectable: 'unselectable',
  valphabetic: 'vAlphabetic',
  'v-alphabetic': 'vAlphabetic',
  values: 'values',
  vectoreffect: 'vectorEffect',
  'vector-effect': 'vectorEffect',
  version: 'version',
  vertadvy: 'vertAdvY',
  'vert-adv-y': 'vertAdvY',
  vertoriginx: 'vertOriginX',
  'vert-origin-x': 'vertOriginX',
  vertoriginy: 'vertOriginY',
  'vert-origin-y': 'vertOriginY',
  vhanging: 'vHanging',
  'v-hanging': 'vHanging',
  videographic: 'vIdeographic',
  'v-ideographic': 'vIdeographic',
  viewbox: 'viewBox',
  viewtarget: 'viewTarget',
  visibility: 'visibility',
  vmathematical: 'vMathematical',
  'v-mathematical': 'vMathematical',
  vocab: 'vocab',
  widths: 'widths',
  wordspacing: 'wordSpacing',
  'word-spacing': 'wordSpacing',
  writingmode: 'writingMode',
  'writing-mode': 'writingMode',
  x1: 'x1',
  x2: 'x2',
  x: 'x',
  xchannelselector: 'xChannelSelector',
  xheight: 'xHeight',
  'x-height': 'xHeight',
  xlinkactuate: 'xlinkActuate',
  'xlink:actuate': 'xlinkActuate',
  xlinkarcrole: 'xlinkArcrole',
  'xlink:arcrole': 'xlinkArcrole',
  xlinkhref: 'xlinkHref',
  'xlink:href': 'xlinkHref',
  xlinkrole: 'xlinkRole',
  'xlink:role': 'xlinkRole',
  xlinkshow: 'xlinkShow',
  'xlink:show': 'xlinkShow',
  xlinktitle: 'xlinkTitle',
  'xlink:title': 'xlinkTitle',
  xlinktype: 'xlinkType',
  'xlink:type': 'xlinkType',
  xmlbase: 'xmlBase',
  'xml:base': 'xmlBase',
  xmllang: 'xmlLang',
  'xml:lang': 'xmlLang',
  xmlns: 'xmlns',
  'xml:space': 'xmlSpace',
  xmlnsxlink: 'xmlnsXlink',
  'xmlns:xlink': 'xmlnsXlink',
  xmlspace: 'xmlSpace',
  y1: 'y1',
  y2: 'y2',
  y: 'y',
  ychannelselector: 'yChannelSelector',
  z: 'z',
  zoomandpan: 'zoomAndPan'
};

function getStackAddendum$2() {
  var stack = ReactDebugCurrentFrame.getStackAddendum();
  return stack != null ? stack : '';
}

{
  var warnedProperties$1 = {};
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var EVENT_NAME_REGEX = /^on./;
  var INVALID_EVENT_NAME_REGEX = /^on[^A-Z]/;
  var rARIA$1 = new RegExp('^(aria)-[' + ATTRIBUTE_NAME_CHAR + ']*$');
  var rARIACamel$1 = new RegExp('^(aria)[A-Z][' + ATTRIBUTE_NAME_CHAR + ']*$');

  var validateProperty$1 = function (tagName, name, value, canUseEventSystem) {
    if (hasOwnProperty$1.call(warnedProperties$1, name) && warnedProperties$1[name]) {
      return true;
    }

    var lowerCasedName = name.toLowerCase();
    if (lowerCasedName === 'onfocusin' || lowerCasedName === 'onfocusout') {
      warning(false, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.');
      warnedProperties$1[name] = true;
      return true;
    }

    // We can't rely on the event system being injected on the server.
    if (canUseEventSystem) {
      if (registrationNameModules.hasOwnProperty(name)) {
        return true;
      }
      var registrationName = possibleRegistrationNames.hasOwnProperty(lowerCasedName) ? possibleRegistrationNames[lowerCasedName] : null;
      if (registrationName != null) {
        warning(false, 'Invalid event handler property `%s`. Did you mean `%s`?%s', name, registrationName, getStackAddendum$2());
        warnedProperties$1[name] = true;
        return true;
      }
      if (EVENT_NAME_REGEX.test(name)) {
        warning(false, 'Unknown event handler property `%s`. It will be ignored.%s', name, getStackAddendum$2());
        warnedProperties$1[name] = true;
        return true;
      }
    } else if (EVENT_NAME_REGEX.test(name)) {
      // If no event plugins have been injected, we are in a server environment.
      // So we can't tell if the event name is correct for sure, but we can filter
      // out known bad ones like `onclick`. We can't suggest a specific replacement though.
      if (INVALID_EVENT_NAME_REGEX.test(name)) {
        warning(false, 'Invalid event handler property `%s`. ' + 'React events use the camelCase naming convention, for example `onClick`.%s', name, getStackAddendum$2());
      }
      warnedProperties$1[name] = true;
      return true;
    }

    // Let the ARIA attribute hook validate ARIA attributes
    if (rARIA$1.test(name) || rARIACamel$1.test(name)) {
      return true;
    }

    if (lowerCasedName === 'innerhtml') {
      warning(false, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.');
      warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCasedName === 'aria') {
      warning(false, 'The `aria` attribute is reserved for future use in React. ' + 'Pass individual `aria-` attributes instead.');
      warnedProperties$1[name] = true;
      return true;
    }

    if (lowerCasedName === 'is' && value !== null && value !== undefined && typeof value !== 'string') {
      warning(false, 'Received a `%s` for a string attribute `is`. If this is expected, cast ' + 'the value to a string.%s', typeof value, getStackAddendum$2());
      warnedProperties$1[name] = true;
      return true;
    }

    if (typeof value === 'number' && isNaN(value)) {
      warning(false, 'Received NaN for the `%s` attribute. If this is expected, cast ' + 'the value to a string.%s', name, getStackAddendum$2());
      warnedProperties$1[name] = true;
      return true;
    }

    var isReserved = isReservedProp(name);

    // Known attributes should match the casing specified in the property config.
    if (possibleStandardNames.hasOwnProperty(lowerCasedName)) {
      var standardName = possibleStandardNames[lowerCasedName];
      if (standardName !== name) {
        warning(false, 'Invalid DOM property `%s`. Did you mean `%s`?%s', name, standardName, getStackAddendum$2());
        warnedProperties$1[name] = true;
        return true;
      }
    } else if (!isReserved && name !== lowerCasedName) {
      // Unknown attributes should have lowercase casing since that's how they
      // will be cased anyway with server rendering.
      warning(false, 'React does not recognize the `%s` prop on a DOM element. If you ' + 'intentionally want it to appear in the DOM as a custom ' + 'attribute, spell it as lowercase `%s` instead. ' + 'If you accidentally passed it from a parent component, remove ' + 'it from the DOM element.%s', name, lowerCasedName, getStackAddendum$2());
      warnedProperties$1[name] = true;
      return true;
    }

    if (typeof value === 'boolean' && !shouldAttributeAcceptBooleanValue(name)) {
      if (value) {
        warning(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.%s', value, name, name, value, name, getStackAddendum$2());
      } else {
        warning(false, 'Received `%s` for a non-boolean attribute `%s`.\n\n' + 'If you want to write it to the DOM, pass a string instead: ' + '%s="%s" or %s={value.toString()}.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.%s', value, name, name, value, name, name, name, getStackAddendum$2());
      }
      warnedProperties$1[name] = true;
      return true;
    }

    // Now that we've validated casing, do not validate
    // data types for reserved props
    if (isReserved) {
      return true;
    }

    // Warn when a known attribute is a bad type
    if (!shouldSetAttribute(name, value)) {
      warnedProperties$1[name] = true;
      return false;
    }

    return true;
  };
}

var warnUnknownProperties = function (type, props, canUseEventSystem) {
  var unknownProps = [];
  for (var key in props) {
    var isValid = validateProperty$1(type, key, props[key], canUseEventSystem);
    if (!isValid) {
      unknownProps.push(key);
    }
  }

  var unknownPropString = unknownProps.map(function (prop) {
    return '`' + prop + '`';
  }).join(', ');
  if (unknownProps.length === 1) {
    warning(false, 'Invalid value for prop %s on <%s> tag. Either remove it from the element, ' + 'or pass a string or number value to keep it in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropString, type, getStackAddendum$2());
  } else if (unknownProps.length > 1) {
    warning(false, 'Invalid values for props %s on <%s> tag. Either remove them from the element, ' + 'or pass a string or number value to keep them in the DOM. ' + 'For details, see https://fb.me/react-attribute-behavior%s', unknownPropString, type, getStackAddendum$2());
  }
};

function validateProperties$2(type, props, canUseEventSystem) {
  if (isCustomComponent(type, props)) {
    return;
  }
  warnUnknownProperties(type, props, canUseEventSystem);
}

// TODO: direct imports like some-package/src/* are bad. Fix me.
var getCurrentFiberOwnerName$1 = ReactDebugCurrentFiber.getCurrentFiberOwnerName;
var getCurrentFiberStackAddendum$2 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;

var didWarnInvalidHydration = false;
var didWarnShadyDOM = false;

var DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
var SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
var SUPPRESS_HYDRATION_WARNING$1 = 'suppressHydrationWarning';
var AUTOFOCUS = 'autoFocus';
var CHILDREN = 'children';
var STYLE = 'style';
var HTML = '__html';

var HTML_NAMESPACE = Namespaces.html;


var getStack = emptyFunction.thatReturns('');

{
  getStack = getCurrentFiberStackAddendum$2;

  var warnedUnknownTags = {
    // Chrome is the only major browser not shipping <time>. But as of July
    // 2017 it intends to ship it due to widespread usage. We intentionally
    // *don't* warn for <time> even if it's unrecognized by Chrome because
    // it soon will be, and many apps have been using it anyway.
    time: true,
    // There are working polyfills for <dialog>. Let people use it.
    dialog: true
  };

  var validatePropertiesInDevelopment = function (type, props) {
    validateProperties(type, props);
    validateProperties$1(type, props);
    validateProperties$2(type, props, /* canUseEventSystem */true);
  };

  // HTML parsing normalizes CR and CRLF to LF.
  // It also can turn \u0000 into \uFFFD inside attributes.
  // https://www.w3.org/TR/html5/single-page.html#preprocessing-the-input-stream
  // If we have a mismatch, it might be caused by that.
  // We will still patch up in this case but not fire the warning.
  var NORMALIZE_NEWLINES_REGEX = /\r\n?/g;
  var NORMALIZE_NULL_AND_REPLACEMENT_REGEX = /\u0000|\uFFFD/g;

  var normalizeMarkupForTextOrAttribute = function (markup) {
    var markupString = typeof markup === 'string' ? markup : '' + markup;
    return markupString.replace(NORMALIZE_NEWLINES_REGEX, '\n').replace(NORMALIZE_NULL_AND_REPLACEMENT_REGEX, '');
  };

  var warnForTextDifference = function (serverText, clientText) {
    if (didWarnInvalidHydration) {
      return;
    }
    var normalizedClientText = normalizeMarkupForTextOrAttribute(clientText);
    var normalizedServerText = normalizeMarkupForTextOrAttribute(serverText);
    if (normalizedServerText === normalizedClientText) {
      return;
    }
    didWarnInvalidHydration = true;
    warning(false, 'Text content did not match. Server: "%s" Client: "%s"', normalizedServerText, normalizedClientText);
  };

  var warnForPropDifference = function (propName, serverValue, clientValue) {
    if (didWarnInvalidHydration) {
      return;
    }
    var normalizedClientValue = normalizeMarkupForTextOrAttribute(clientValue);
    var normalizedServerValue = normalizeMarkupForTextOrAttribute(serverValue);
    if (normalizedServerValue === normalizedClientValue) {
      return;
    }
    didWarnInvalidHydration = true;
    warning(false, 'Prop `%s` did not match. Server: %s Client: %s', propName, JSON.stringify(normalizedServerValue), JSON.stringify(normalizedClientValue));
  };

  var warnForExtraAttributes = function (attributeNames) {
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = true;
    var names = [];
    attributeNames.forEach(function (name) {
      names.push(name);
    });
    warning(false, 'Extra attributes from the server: %s', names);
  };

  var warnForInvalidEventListener = function (registrationName, listener) {
    if (listener === false) {
      warning(false, 'Expected `%s` listener to be a function, instead got `false`.\n\n' + 'If you used to conditionally omit it with %s={condition && value}, ' + 'pass %s={condition ? value : undefined} instead.%s', registrationName, registrationName, registrationName, getCurrentFiberStackAddendum$2());
    } else {
      warning(false, 'Expected `%s` listener to be a function, instead got a value of `%s` type.%s', registrationName, typeof listener, getCurrentFiberStackAddendum$2());
    }
  };

  // Parse the HTML and read it back to normalize the HTML string so that it
  // can be used for comparison.
  var normalizeHTML = function (parent, html) {
    // We could have created a separate document here to avoid
    // re-initializing custom elements if they exist. But this breaks
    // how <noscript> is being handled. So we use the same document.
    // See the discussion in https://github.com/facebook/react/pull/11157.
    var testElement = parent.namespaceURI === HTML_NAMESPACE ? parent.ownerDocument.createElement(parent.tagName) : parent.ownerDocument.createElementNS(parent.namespaceURI, parent.tagName);
    testElement.innerHTML = html;
    return testElement.innerHTML;
  };
}

function ensureListeningTo(rootContainerElement, registrationName) {
  var isDocumentOrFragment = rootContainerElement.nodeType === DOCUMENT_NODE || rootContainerElement.nodeType === DOCUMENT_FRAGMENT_NODE;
  var doc = isDocumentOrFragment ? rootContainerElement : rootContainerElement.ownerDocument;
  listenTo(registrationName, doc);
}

function getOwnerDocumentFromRootContainer(rootContainerElement) {
  return rootContainerElement.nodeType === DOCUMENT_NODE ? rootContainerElement : rootContainerElement.ownerDocument;
}

// There are so many media events, it makes sense to just
// maintain a list rather than create a `trapBubbledEvent` for each
var mediaEvents = {
  topAbort: 'abort',
  topCanPlay: 'canplay',
  topCanPlayThrough: 'canplaythrough',
  topDurationChange: 'durationchange',
  topEmptied: 'emptied',
  topEncrypted: 'encrypted',
  topEnded: 'ended',
  topError: 'error',
  topLoadedData: 'loadeddata',
  topLoadedMetadata: 'loadedmetadata',
  topLoadStart: 'loadstart',
  topPause: 'pause',
  topPlay: 'play',
  topPlaying: 'playing',
  topProgress: 'progress',
  topRateChange: 'ratechange',
  topSeeked: 'seeked',
  topSeeking: 'seeking',
  topStalled: 'stalled',
  topSuspend: 'suspend',
  topTimeUpdate: 'timeupdate',
  topVolumeChange: 'volumechange',
  topWaiting: 'waiting'
};

function trapClickOnNonInteractiveElement(node) {
  // Mobile Safari does not fire properly bubble click events on
  // non-interactive elements, which means delegated click listeners do not
  // fire. The workaround for this bug involves attaching an empty click
  // listener on the target node.
  // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
  // Just set it using the onclick property so that we don't have to manage any
  // bookkeeping for it. Not sure if we need to clear it when the listener is
  // removed.
  // TODO: Only do this for the relevant Safaris maybe?
  node.onclick = emptyFunction;
}

function setInitialDOMProperties(tag, domElement, rootContainerElement, nextProps, isCustomComponentTag) {
  for (var propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    var nextProp = nextProps[propKey];
    if (propKey === STYLE) {
      {
        if (nextProp) {
          // Freeze the next style object so that we can assume it won't be
          // mutated. We have already warned for this in the past.
          Object.freeze(nextProp);
        }
      }
      // Relies on `updateStylesByID` not mutating `styleUpdates`.
      setValueForStyles(domElement, nextProp, getStack);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml = nextProp ? nextProp[HTML] : undefined;
      if (nextHtml != null) {
        setInnerHTML(domElement, nextHtml);
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === 'string') {
        // Avoid setting initial textContent when the text is empty. In IE11 setting
        // textContent on a <textarea> will cause the placeholder to not
        // show within the <textarea> until it has been focused and blurred again.
        // https://github.com/facebook/react/issues/6731#issuecomment-254874553
        var canSetTextContent = tag !== 'textarea' || nextProp !== '';
        if (canSetTextContent) {
          setTextContent(domElement, nextProp);
        }
      } else if (typeof nextProp === 'number') {
        setTextContent(domElement, '' + nextProp);
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      // Noop
    } else if (propKey === AUTOFOCUS) {
      // We polyfill it separately on the client during commit.
      // We blacklist it here rather than in the property list because we emit it in SSR.
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        if (true && typeof nextProp !== 'function') {
          warnForInvalidEventListener(propKey, nextProp);
        }
        ensureListeningTo(rootContainerElement, propKey);
      }
    } else if (isCustomComponentTag) {
      setValueForAttribute(domElement, propKey, nextProp);
    } else if (nextProp != null) {
      // If we're updating to null or undefined, we should remove the property
      // from the DOM node instead of inadvertently setting to a string. This
      // brings us in line with the same behavior we have on initial render.
      setValueForProperty(domElement, propKey, nextProp);
    }
  }
}

function updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag) {
  // TODO: Handle wasCustomComponentTag
  for (var i = 0; i < updatePayload.length; i += 2) {
    var propKey = updatePayload[i];
    var propValue = updatePayload[i + 1];
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue, getStack);
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else if (isCustomComponentTag) {
      if (propValue != null) {
        setValueForAttribute(domElement, propKey, propValue);
      } else {
        deleteValueForAttribute(domElement, propKey);
      }
    } else if (propValue != null) {
      setValueForProperty(domElement, propKey, propValue);
    } else {
      // If we're updating to null or undefined, we should remove the property
      // from the DOM node instead of inadvertently setting to a string. This
      // brings us in line with the same behavior we have on initial render.
      deleteValueForProperty(domElement, propKey);
    }
  }
}

function createElement$1(type, props, rootContainerElement, parentNamespace) {
  // We create tags in the namespace of their parent container, except HTML
  var ownerDocument = getOwnerDocumentFromRootContainer(rootContainerElement);
  var domElement;
  var namespaceURI = parentNamespace;
  if (namespaceURI === HTML_NAMESPACE) {
    namespaceURI = getIntrinsicNamespace(type);
  }
  if (namespaceURI === HTML_NAMESPACE) {
    {
      var isCustomComponentTag = isCustomComponent(type, props);
      // Should this check be gated by parent namespace? Not sure we want to
      // allow <SVG> or <mATH>.
      warning(isCustomComponentTag || type === type.toLowerCase(), '<%s /> is using uppercase HTML. Always use lowercase HTML tags ' + 'in React.', type);
    }

    if (type === 'script') {
      // Create the script via .innerHTML so its "parser-inserted" flag is
      // set to true and it does not execute
      var div = ownerDocument.createElement('div');
      div.innerHTML = '<script><' + '/script>'; // eslint-disable-line
      // This is guaranteed to yield a script element.
      var firstChild = div.firstChild;
      domElement = div.removeChild(firstChild);
    } else if (typeof props.is === 'string') {
      // $FlowIssue `createElement` should be updated for Web Components
      domElement = ownerDocument.createElement(type, { is: props.is });
    } else {
      // Separate else branch instead of using `props.is || undefined` above because of a Firefox bug.
      // See discussion in https://github.com/facebook/react/pull/6896
      // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
      domElement = ownerDocument.createElement(type);
    }
  } else {
    domElement = ownerDocument.createElementNS(namespaceURI, type);
  }

  {
    if (namespaceURI === HTML_NAMESPACE) {
      if (!isCustomComponentTag && Object.prototype.toString.call(domElement) === '[object HTMLUnknownElement]' && !Object.prototype.hasOwnProperty.call(warnedUnknownTags, type)) {
        warnedUnknownTags[type] = true;
        warning(false, 'The tag <%s> is unrecognized in this browser. ' + 'If you meant to render a React component, start its name with ' + 'an uppercase letter.', type);
      }
    }
  }

  return domElement;
}

function createTextNode$1(text, rootContainerElement) {
  return getOwnerDocumentFromRootContainer(rootContainerElement).createTextNode(text);
}

function setInitialProperties$1(domElement, tag, rawProps, rootContainerElement) {
  var isCustomComponentTag = isCustomComponent(tag, rawProps);
  {
    validatePropertiesInDevelopment(tag, rawProps);
    if (isCustomComponentTag && !didWarnShadyDOM && domElement.shadyRoot) {
      warning(false, '%s is using shady DOM. Using shady DOM with React can ' + 'cause things to break subtly.', getCurrentFiberOwnerName$1() || 'A component');
      didWarnShadyDOM = true;
    }
  }

  // TODO: Make sure that we check isMounted before firing any of these events.
  var props;
  switch (tag) {
    case 'iframe':
    case 'object':
      trapBubbledEvent('topLoad', 'load', domElement);
      props = rawProps;
      break;
    case 'video':
    case 'audio':
      // Create listener for each media event
      for (var event in mediaEvents) {
        if (mediaEvents.hasOwnProperty(event)) {
          trapBubbledEvent(event, mediaEvents[event], domElement);
        }
      }
      props = rawProps;
      break;
    case 'source':
      trapBubbledEvent('topError', 'error', domElement);
      props = rawProps;
      break;
    case 'img':
    case 'image':
      trapBubbledEvent('topError', 'error', domElement);
      trapBubbledEvent('topLoad', 'load', domElement);
      props = rawProps;
      break;
    case 'form':
      trapBubbledEvent('topReset', 'reset', domElement);
      trapBubbledEvent('topSubmit', 'submit', domElement);
      props = rawProps;
      break;
    case 'details':
      trapBubbledEvent('topToggle', 'toggle', domElement);
      props = rawProps;
      break;
    case 'input':
      initWrapperState(domElement, rawProps);
      props = getHostProps(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
    case 'option':
      validateProps(domElement, rawProps);
      props = getHostProps$1(domElement, rawProps);
      break;
    case 'select':
      initWrapperState$1(domElement, rawProps);
      props = getHostProps$2(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
    case 'textarea':
      initWrapperState$2(domElement, rawProps);
      props = getHostProps$3(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
    default:
      props = rawProps;
  }

  assertValidProps(tag, props, getStack);

  setInitialDOMProperties(tag, domElement, rootContainerElement, props, isCustomComponentTag);

  switch (tag) {
    case 'input':
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper(domElement, rawProps);
      break;
    case 'textarea':
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper$3(domElement, rawProps);
      break;
    case 'option':
      postMountWrapper$1(domElement, rawProps);
      break;
    case 'select':
      postMountWrapper$2(domElement, rawProps);
      break;
    default:
      if (typeof props.onClick === 'function') {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }
}

// Calculate the diff between the two objects.
function diffProperties$1(domElement, tag, lastRawProps, nextRawProps, rootContainerElement) {
  {
    validatePropertiesInDevelopment(tag, nextRawProps);
  }

  var updatePayload = null;

  var lastProps;
  var nextProps;
  switch (tag) {
    case 'input':
      lastProps = getHostProps(domElement, lastRawProps);
      nextProps = getHostProps(domElement, nextRawProps);
      updatePayload = [];
      break;
    case 'option':
      lastProps = getHostProps$1(domElement, lastRawProps);
      nextProps = getHostProps$1(domElement, nextRawProps);
      updatePayload = [];
      break;
    case 'select':
      lastProps = getHostProps$2(domElement, lastRawProps);
      nextProps = getHostProps$2(domElement, nextRawProps);
      updatePayload = [];
      break;
    case 'textarea':
      lastProps = getHostProps$3(domElement, lastRawProps);
      nextProps = getHostProps$3(domElement, nextRawProps);
      updatePayload = [];
      break;
    default:
      lastProps = lastRawProps;
      nextProps = nextRawProps;
      if (typeof lastProps.onClick !== 'function' && typeof nextProps.onClick === 'function') {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }

  assertValidProps(tag, nextProps, getStack);

  var propKey;
  var styleName;
  var styleUpdates = null;
  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }
    if (propKey === STYLE) {
      var lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = '';
        }
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML || propKey === CHILDREN) {
      // Noop. This is handled by the clear text mechanism.
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      // Noop
    } else if (propKey === AUTOFOCUS) {
      // Noop. It doesn't work on updates anyway.
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      // This is a special case. If any listener updates we need to ensure
      // that the "current" fiber pointer gets updated so we need a commit
      // to update this element.
      if (!updatePayload) {
        updatePayload = [];
      }
    } else {
      // For all other deleted properties we add it to the queue. We use
      // the whitelist in the commit phase instead.
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    var nextProp = nextProps[propKey];
    var lastProp = lastProps != null ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
      continue;
    }
    if (propKey === STYLE) {
      {
        if (nextProp) {
          // Freeze the next style object so that we can assume it won't be
          // mutated. We have already warned for this in the past.
          Object.freeze(nextProp);
        }
      }
      if (lastProp) {
        // Unset styles on `lastProp` but not on `nextProp`.
        for (styleName in lastProp) {
          if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = '';
          }
        }
        // Update styles that changed since `lastProp`.
        for (styleName in nextProp) {
          if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        // Relies on `updateStylesByID` not mutating `styleUpdates`.
        if (!styleUpdates) {
          if (!updatePayload) {
            updatePayload = [];
          }
          updatePayload.push(propKey, styleUpdates);
        }
        styleUpdates = nextProp;
      }
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      var nextHtml = nextProp ? nextProp[HTML] : undefined;
      var lastHtml = lastProp ? lastProp[HTML] : undefined;
      if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          (updatePayload = updatePayload || []).push(propKey, '' + nextHtml);
        }
      } else {
        // TODO: It might be too late to clear this if we have children
        // inserted already.
      }
    } else if (propKey === CHILDREN) {
      if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof nextProp === 'number')) {
        (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
      }
    } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1) {
      // Noop
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        // We eagerly listen to this even though we haven't committed yet.
        if (true && typeof nextProp !== 'function') {
          warnForInvalidEventListener(propKey, nextProp);
        }
        ensureListeningTo(rootContainerElement, propKey);
      }
      if (!updatePayload && lastProp !== nextProp) {
        // This is a special case. If any listener updates we need to ensure
        // that the "current" props pointer gets updated so we need a commit
        // to update this element.
        updatePayload = [];
      }
    } else {
      // For any other property we always add it to the queue and then we
      // filter it out using the whitelist during the commit.
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
  }
  return updatePayload;
}

// Apply the diff.
function updateProperties$1(domElement, updatePayload, tag, lastRawProps, nextRawProps) {
  // Update checked *before* name.
  // In the middle of an update, it is possible to have multiple checked.
  // When a checked radio tries to change name, browser makes another radio's checked false.
  if (tag === 'input' && nextRawProps.type === 'radio' && nextRawProps.name != null) {
    updateChecked(domElement, nextRawProps);
  }

  var wasCustomComponentTag = isCustomComponent(tag, lastRawProps);
  var isCustomComponentTag = isCustomComponent(tag, nextRawProps);
  // Apply the diff.
  updateDOMProperties(domElement, updatePayload, wasCustomComponentTag, isCustomComponentTag);

  // TODO: Ensure that an update gets scheduled if any of the special props
  // changed.
  switch (tag) {
    case 'input':
      // Update the wrapper around inputs *after* updating props. This has to
      // happen after `updateDOMProperties`. Otherwise HTML5 input validations
      // raise warnings and prevent the new value from being assigned.
      updateWrapper(domElement, nextRawProps);
      break;
    case 'textarea':
      updateWrapper$1(domElement, nextRawProps);
      break;
    case 'select':
      // <select> value update needs to occur after <option> children
      // reconciliation
      postUpdateWrapper(domElement, nextRawProps);
      break;
  }
}

function diffHydratedProperties$1(domElement, tag, rawProps, parentNamespace, rootContainerElement) {
  {
    var suppressHydrationWarning = rawProps[SUPPRESS_HYDRATION_WARNING$1] === true;
    var isCustomComponentTag = isCustomComponent(tag, rawProps);
    validatePropertiesInDevelopment(tag, rawProps);
    if (isCustomComponentTag && !didWarnShadyDOM && domElement.shadyRoot) {
      warning(false, '%s is using shady DOM. Using shady DOM with React can ' + 'cause things to break subtly.', getCurrentFiberOwnerName$1() || 'A component');
      didWarnShadyDOM = true;
    }
  }

  // TODO: Make sure that we check isMounted before firing any of these events.
  switch (tag) {
    case 'iframe':
    case 'object':
      trapBubbledEvent('topLoad', 'load', domElement);
      break;
    case 'video':
    case 'audio':
      // Create listener for each media event
      for (var event in mediaEvents) {
        if (mediaEvents.hasOwnProperty(event)) {
          trapBubbledEvent(event, mediaEvents[event], domElement);
        }
      }
      break;
    case 'source':
      trapBubbledEvent('topError', 'error', domElement);
      break;
    case 'img':
    case 'image':
      trapBubbledEvent('topError', 'error', domElement);
      trapBubbledEvent('topLoad', 'load', domElement);
      break;
    case 'form':
      trapBubbledEvent('topReset', 'reset', domElement);
      trapBubbledEvent('topSubmit', 'submit', domElement);
      break;
    case 'details':
      trapBubbledEvent('topToggle', 'toggle', domElement);
      break;
    case 'input':
      initWrapperState(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
    case 'option':
      validateProps(domElement, rawProps);
      break;
    case 'select':
      initWrapperState$1(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
    case 'textarea':
      initWrapperState$2(domElement, rawProps);
      trapBubbledEvent('topInvalid', 'invalid', domElement);
      // For controlled components we always need to ensure we're listening
      // to onChange. Even if there is no listener.
      ensureListeningTo(rootContainerElement, 'onChange');
      break;
  }

  assertValidProps(tag, rawProps, getStack);

  {
    var extraAttributeNames = new Set();
    var attributes = domElement.attributes;
    for (var i = 0; i < attributes.length; i++) {
      var name = attributes[i].name.toLowerCase();
      switch (name) {
        // Built-in SSR attribute is whitelisted
        case 'data-reactroot':
          break;
        // Controlled attributes are not validated
        // TODO: Only ignore them on controlled tags.
        case 'value':
          break;
        case 'checked':
          break;
        case 'selected':
          break;
        default:
          // Intentionally use the original name.
          // See discussion in https://github.com/facebook/react/pull/10676.
          extraAttributeNames.add(attributes[i].name);
      }
    }
  }

  var updatePayload = null;
  for (var propKey in rawProps) {
    if (!rawProps.hasOwnProperty(propKey)) {
      continue;
    }
    var nextProp = rawProps[propKey];
    if (propKey === CHILDREN) {
      // For text content children we compare against textContent. This
      // might match additional HTML that is hidden when we read it using
      // textContent. E.g. "foo" will match "f<span>oo</span>" but that still
      // satisfies our requirement. Our requirement is not to produce perfect
      // HTML and attributes. Ideally we should preserve structure but it's
      // ok not to if the visible content is still enough to indicate what
      // even listeners these nodes might be wired up to.
      // TODO: Warn if there is more than a single textNode as a child.
      // TODO: Should we use domElement.firstChild.nodeValue to compare?
      if (typeof nextProp === 'string') {
        if (domElement.textContent !== nextProp) {
          if (true && !suppressHydrationWarning) {
            warnForTextDifference(domElement.textContent, nextProp);
          }
          updatePayload = [CHILDREN, nextProp];
        }
      } else if (typeof nextProp === 'number') {
        if (domElement.textContent !== '' + nextProp) {
          if (true && !suppressHydrationWarning) {
            warnForTextDifference(domElement.textContent, nextProp);
          }
          updatePayload = [CHILDREN, '' + nextProp];
        }
      }
    } else if (registrationNameModules.hasOwnProperty(propKey)) {
      if (nextProp != null) {
        if (true && typeof nextProp !== 'function') {
          warnForInvalidEventListener(propKey, nextProp);
        }
        ensureListeningTo(rootContainerElement, propKey);
      }
    } else {
      // Validate that the properties correspond to their expected values.
      var serverValue;
      var propertyInfo;
      if (suppressHydrationWarning) {
        // Don't bother comparing. We're ignoring all these warnings.
      } else if (propKey === SUPPRESS_CONTENT_EDITABLE_WARNING || propKey === SUPPRESS_HYDRATION_WARNING$1 ||
      // Controlled attributes are not validated
      // TODO: Only ignore them on controlled tags.
      propKey === 'value' || propKey === 'checked' || propKey === 'selected') {
        // Noop
      } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
        var rawHtml = nextProp ? nextProp[HTML] || '' : '';
        var serverHTML = domElement.innerHTML;
        var expectedHTML = normalizeHTML(domElement, rawHtml);
        if (expectedHTML !== serverHTML) {
          warnForPropDifference(propKey, serverHTML, expectedHTML);
        }
      } else if (propKey === STYLE) {
        // $FlowFixMe - Should be inferred as not undefined.
        extraAttributeNames['delete'](propKey);
        var expectedStyle = createDangerousStringForStyles(nextProp);
        serverValue = domElement.getAttribute('style');
        if (expectedStyle !== serverValue) {
          warnForPropDifference(propKey, serverValue, expectedStyle);
        }
      } else if (isCustomComponentTag) {
        // $FlowFixMe - Should be inferred as not undefined.
        extraAttributeNames['delete'](propKey.toLowerCase());
        serverValue = getValueForAttribute(domElement, propKey, nextProp);

        if (nextProp !== serverValue) {
          warnForPropDifference(propKey, serverValue, nextProp);
        }
      } else if (shouldSetAttribute(propKey, nextProp)) {
        if (propertyInfo = getPropertyInfo(propKey)) {
          // $FlowFixMe - Should be inferred as not undefined.
          extraAttributeNames['delete'](propertyInfo.attributeName);
          serverValue = getValueForProperty(domElement, propKey, nextProp);
        } else {
          var ownNamespace = parentNamespace;
          if (ownNamespace === HTML_NAMESPACE) {
            ownNamespace = getIntrinsicNamespace(tag);
          }
          if (ownNamespace === HTML_NAMESPACE) {
            // $FlowFixMe - Should be inferred as not undefined.
            extraAttributeNames['delete'](propKey.toLowerCase());
          } else {
            // $FlowFixMe - Should be inferred as not undefined.
            extraAttributeNames['delete'](propKey);
          }
          serverValue = getValueForAttribute(domElement, propKey, nextProp);
        }

        if (nextProp !== serverValue) {
          warnForPropDifference(propKey, serverValue, nextProp);
        }
      }
    }
  }

  {
    // $FlowFixMe - Should be inferred as not undefined.
    if (extraAttributeNames.size > 0 && !suppressHydrationWarning) {
      // $FlowFixMe - Should be inferred as not undefined.
      warnForExtraAttributes(extraAttributeNames);
    }
  }

  switch (tag) {
    case 'input':
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper(domElement, rawProps);
      break;
    case 'textarea':
      // TODO: Make sure we check if this is still unmounted or do any clean
      // up necessary since we never stop tracking anymore.
      track(domElement);
      postMountWrapper$3(domElement, rawProps);
      break;
    case 'select':
    case 'option':
      // For input and textarea we current always set the value property at
      // post mount to force it to diverge from attributes. However, for
      // option and select we don't quite do the same thing and select
      // is not resilient to the DOM state changing so we don't do that here.
      // TODO: Consider not doing this for input and textarea.
      break;
    default:
      if (typeof rawProps.onClick === 'function') {
        // TODO: This cast may not be sound for SVG, MathML or custom elements.
        trapClickOnNonInteractiveElement(domElement);
      }
      break;
  }

  return updatePayload;
}

function diffHydratedText$1(textNode, text) {
  var isDifferent = textNode.nodeValue !== text;
  return isDifferent;
}

function warnForUnmatchedText$1(textNode, text) {
  {
    warnForTextDifference(textNode.nodeValue, text);
  }
}

function warnForDeletedHydratableElement$1(parentNode, child) {
  {
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = true;
    warning(false, 'Did not expect server HTML to contain a <%s> in <%s>.', child.nodeName.toLowerCase(), parentNode.nodeName.toLowerCase());
  }
}

function warnForDeletedHydratableText$1(parentNode, child) {
  {
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = true;
    warning(false, 'Did not expect server HTML to contain the text node "%s" in <%s>.', child.nodeValue, parentNode.nodeName.toLowerCase());
  }
}

function warnForInsertedHydratedElement$1(parentNode, tag, props) {
  {
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = true;
    warning(false, 'Expected server HTML to contain a matching <%s> in <%s>.', tag, parentNode.nodeName.toLowerCase());
  }
}

function warnForInsertedHydratedText$1(parentNode, text) {
  {
    if (text === '') {
      // We expect to insert empty text nodes since they're not represented in
      // the HTML.
      // TODO: Remove this special case if we can just avoid inserting empty
      // text nodes.
      return;
    }
    if (didWarnInvalidHydration) {
      return;
    }
    didWarnInvalidHydration = true;
    warning(false, 'Expected server HTML to contain a matching text node for "%s" in <%s>.', text, parentNode.nodeName.toLowerCase());
  }
}

function restoreControlledState(domElement, tag, props) {
  switch (tag) {
    case 'input':
      restoreControlledState$1(domElement, props);
      return;
    case 'textarea':
      restoreControlledState$3(domElement, props);
      return;
    case 'select':
      restoreControlledState$2(domElement, props);
      return;
  }
}

var ReactDOMFiberComponent = Object.freeze({
	createElement: createElement$1,
	createTextNode: createTextNode$1,
	setInitialProperties: setInitialProperties$1,
	diffProperties: diffProperties$1,
	updateProperties: updateProperties$1,
	diffHydratedProperties: diffHydratedProperties$1,
	diffHydratedText: diffHydratedText$1,
	warnForUnmatchedText: warnForUnmatchedText$1,
	warnForDeletedHydratableElement: warnForDeletedHydratableElement$1,
	warnForDeletedHydratableText: warnForDeletedHydratableText$1,
	warnForInsertedHydratedElement: warnForInsertedHydratedElement$1,
	warnForInsertedHydratedText: warnForInsertedHydratedText$1,
	restoreControlledState: restoreControlledState
});

// TODO: direct imports like some-package/src/* are bad. Fix me.
var getCurrentFiberStackAddendum$6 = ReactDebugCurrentFiber.getCurrentFiberStackAddendum;

var validateDOMNesting = emptyFunction;

{
  // This validation code was written based on the HTML5 parsing spec:
  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
  //
  // Note: this does not catch all invalid nesting, nor does it try to (as it's
  // not clear what practical benefit doing so provides); instead, we warn only
  // for cases where the parser will give a parse tree differing from what React
  // intended. For example, <b><div></div></b> is invalid but we don't warn
  // because it still parses correctly; we do warn for other cases like nested
  // <p> tags where the beginning of the second element implicitly closes the
  // first, causing a confusing mess.

  // https://html.spec.whatwg.org/multipage/syntax.html#special
  var specialTags = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'];

  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
  var inScopeTags = ['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'template',

  // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
  // TODO: Distinguish by namespace here -- for <title>, including it here
  // errs on the side of fewer warnings
  'foreignObject', 'desc', 'title'];

  // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-button-scope
  var buttonScopeTags = inScopeTags.concat(['button']);

  // https://html.spec.whatwg.org/multipage/syntax.html#generate-implied-end-tags
  var impliedEndTags = ['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'];

  var emptyAncestorInfo = {
    current: null,

    formTag: null,
    aTagInScope: null,
    buttonTagInScope: null,
    nobrTagInScope: null,
    pTagInButtonScope: null,

    listItemTagAutoclosing: null,
    dlItemTagAutoclosing: null
  };

  var updatedAncestorInfo$1 = function (oldInfo, tag, instance) {
    var ancestorInfo = _assign({}, oldInfo || emptyAncestorInfo);
    var info = { tag: tag, instance: instance };

    if (inScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.aTagInScope = null;
      ancestorInfo.buttonTagInScope = null;
      ancestorInfo.nobrTagInScope = null;
    }
    if (buttonScopeTags.indexOf(tag) !== -1) {
      ancestorInfo.pTagInButtonScope = null;
    }

    // See rules for 'li', 'dd', 'dt' start tags in
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
      ancestorInfo.listItemTagAutoclosing = null;
      ancestorInfo.dlItemTagAutoclosing = null;
    }

    ancestorInfo.current = info;

    if (tag === 'form') {
      ancestorInfo.formTag = info;
    }
    if (tag === 'a') {
      ancestorInfo.aTagInScope = info;
    }
    if (tag === 'button') {
      ancestorInfo.buttonTagInScope = info;
    }
    if (tag === 'nobr') {
      ancestorInfo.nobrTagInScope = info;
    }
    if (tag === 'p') {
      ancestorInfo.pTagInButtonScope = info;
    }
    if (tag === 'li') {
      ancestorInfo.listItemTagAutoclosing = info;
    }
    if (tag === 'dd' || tag === 'dt') {
      ancestorInfo.dlItemTagAutoclosing = info;
    }

    return ancestorInfo;
  };

  /**
   * Returns whether
   */
  var isTagValidWithParent = function (tag, parentTag) {
    // First, let's check if we're in an unusual parsing mode...
    switch (parentTag) {
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
      case 'select':
        return tag === 'option' || tag === 'optgroup' || tag === '#text';
      case 'optgroup':
        return tag === 'option' || tag === '#text';
      // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
      // but
      case 'option':
        return tag === '#text';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
      // No special behavior since these rules fall back to "in body" mode for
      // all except special table nodes which cause bad parsing behavior anyway.

      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
      case 'tr':
        return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
      case 'tbody':
      case 'thead':
      case 'tfoot':
        return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
      case 'colgroup':
        return tag === 'col' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
      case 'table':
        return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
      case 'head':
        return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';
      // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
      case 'html':
        return tag === 'head' || tag === 'body';
      case '#document':
        return tag === 'html';
    }

    // Probably in the "in body" parsing mode, so we outlaw only tag combos
    // where the parsing rules cause implicit opens or closes to be added.
    // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
    switch (tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

      case 'rp':
      case 'rt':
        return impliedEndTags.indexOf(parentTag) === -1;

      case 'body':
      case 'caption':
      case 'col':
      case 'colgroup':
      case 'frame':
      case 'head':
      case 'html':
      case 'tbody':
      case 'td':
      case 'tfoot':
      case 'th':
      case 'thead':
      case 'tr':
        // These tags are only valid with a few parents that have special child
        // parsing rules -- if we're down here, then none of those matched and
        // so we allow it only if we don't know what the parent is, as all other
        // cases are invalid.
        return parentTag == null;
    }

    return true;
  };

  /**
   * Returns whether
   */
  var findInvalidAncestorForTag = function (tag, ancestorInfo) {
    switch (tag) {
      case 'address':
      case 'article':
      case 'aside':
      case 'blockquote':
      case 'center':
      case 'details':
      case 'dialog':
      case 'dir':
      case 'div':
      case 'dl':
      case 'fieldset':
      case 'figcaption':
      case 'figure':
      case 'footer':
      case 'header':
      case 'hgroup':
      case 'main':
      case 'menu':
      case 'nav':
      case 'ol':
      case 'p':
      case 'section':
      case 'summary':
      case 'ul':
      case 'pre':
      case 'listing':
      case 'table':
      case 'hr':
      case 'xmp':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return ancestorInfo.pTagInButtonScope;

      case 'form':
        return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

      case 'li':
        return ancestorInfo.listItemTagAutoclosing;

      case 'dd':
      case 'dt':
        return ancestorInfo.dlItemTagAutoclosing;

      case 'button':
        return ancestorInfo.buttonTagInScope;

      case 'a':
        // Spec says something about storing a list of markers, but it sounds
        // equivalent to this check.
        return ancestorInfo.aTagInScope;

      case 'nobr':
        return ancestorInfo.nobrTagInScope;
    }

    return null;
  };

  var didWarn = {};

  validateDOMNesting = function (childTag, childText, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && parentInfo.tag;

    if (childText != null) {
      warning(childTag == null, 'validateDOMNesting: when childText is passed, childTag should be null');
      childTag = '#text';
    }

    var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
    var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
    var invalidParentOrAncestor = invalidParent || invalidAncestor;
    if (!invalidParentOrAncestor) {
      return;
    }

    var ancestorTag = invalidParentOrAncestor.tag;
    var addendum = getCurrentFiberStackAddendum$6();

    var warnKey = !!invalidParent + '|' + childTag + '|' + ancestorTag + '|' + addendum;
    if (didWarn[warnKey]) {
      return;
    }
    didWarn[warnKey] = true;

    var tagDisplayName = childTag;
    var whitespaceInfo = '';
    if (childTag === '#text') {
      if (/\S/.test(childText)) {
        tagDisplayName = 'Text nodes';
      } else {
        tagDisplayName = 'Whitespace text nodes';
        whitespaceInfo = " Make sure you don't have any extra whitespace between tags on " + 'each line of your source code.';
      }
    } else {
      tagDisplayName = '<' + childTag + '>';
    }

    if (invalidParent) {
      var info = '';
      if (ancestorTag === 'table' && childTag === 'tr') {
        info += ' Add a <tbody> to your code to match the DOM tree generated by ' + 'the browser.';
      }
      warning(false, 'validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s%s', tagDisplayName, ancestorTag, whitespaceInfo, info, addendum);
    } else {
      warning(false, 'validateDOMNesting(...): %s cannot appear as a descendant of ' + '<%s>.%s', tagDisplayName, ancestorTag, addendum);
    }
  };

  // TODO: turn this into a named export
  validateDOMNesting.updatedAncestorInfo = updatedAncestorInfo$1;

  // For testing
  validateDOMNesting.isTagValidInContext = function (tag, ancestorInfo) {
    ancestorInfo = ancestorInfo || emptyAncestorInfo;
    var parentInfo = ancestorInfo.current;
    var parentTag = parentInfo && parentInfo.tag;
    return isTagValidWithParent(tag, parentTag) && !findInvalidAncestorForTag(tag, ancestorInfo);
  };
}

var validateDOMNesting$1 = validateDOMNesting;

// TODO: direct imports like some-package/src/* are bad. Fix me.
var createElement = createElement$1;
var createTextNode = createTextNode$1;
var setInitialProperties = setInitialProperties$1;
var diffProperties = diffProperties$1;
var updateProperties = updateProperties$1;
var diffHydratedProperties = diffHydratedProperties$1;
var diffHydratedText = diffHydratedText$1;
var warnForUnmatchedText = warnForUnmatchedText$1;
var warnForDeletedHydratableElement = warnForDeletedHydratableElement$1;
var warnForDeletedHydratableText = warnForDeletedHydratableText$1;
var warnForInsertedHydratedElement = warnForInsertedHydratedElement$1;
var warnForInsertedHydratedText = warnForInsertedHydratedText$1;
var updatedAncestorInfo = validateDOMNesting$1.updatedAncestorInfo;
var precacheFiberNode = precacheFiberNode$1;
var updateFiberProps = updateFiberProps$1;


{
  var SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
  if (typeof Map !== 'function' || Map.prototype == null || typeof Map.prototype.forEach !== 'function' || typeof Set !== 'function' || Set.prototype == null || typeof Set.prototype.clear !== 'function' || typeof Set.prototype.forEach !== 'function') {
    warning(false, 'React depends on Map and Set built-in types. Make sure that you load a ' + 'polyfill in older browsers. http://fb.me/react-polyfills');
  }
}

injection$3.injectFiberControlledHostComponent(ReactDOMFiberComponent);

var eventsEnabled = null;
var selectionInformation = null;

/**
 * True if the supplied DOM node is a valid node element.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @return {boolean} True if the DOM is a valid DOM node.
 * @internal
 */
function isValidContainer(node) {
  return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && node.nodeValue === ' react-mount-point-unstable '));
}

function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOCUMENT_NODE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

function shouldHydrateDueToLegacyHeuristic(container) {
  var rootElement = getReactRootElementInContainer(container);
  return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
}

function shouldAutoFocusHostComponent(type, props) {
  switch (type) {
    case 'button':
    case 'input':
    case 'select':
    case 'textarea':
      return !!props.autoFocus;
  }
  return false;
}

var DOMRenderer = reactReconciler({
  getRootHostContext: function (rootContainerInstance) {
    var type = void 0;
    var namespace = void 0;
    var nodeType = rootContainerInstance.nodeType;
    switch (nodeType) {
      case DOCUMENT_NODE:
      case DOCUMENT_FRAGMENT_NODE:
        {
          type = nodeType === DOCUMENT_NODE ? '#document' : '#fragment';
          var root = rootContainerInstance.documentElement;
          namespace = root ? root.namespaceURI : getChildNamespace(null, '');
          break;
        }
      default:
        {
          var container = nodeType === COMMENT_NODE ? rootContainerInstance.parentNode : rootContainerInstance;
          var ownNamespace = container.namespaceURI || null;
          type = container.tagName;
          namespace = getChildNamespace(ownNamespace, type);
          break;
        }
    }
    {
      var validatedTag = type.toLowerCase();
      var _ancestorInfo = updatedAncestorInfo(null, validatedTag, null);
      return { namespace: namespace, ancestorInfo: _ancestorInfo };
    }
    return namespace;
  },
  getChildHostContext: function (parentHostContext, type) {
    {
      var parentHostContextDev = parentHostContext;
      var _namespace = getChildNamespace(parentHostContextDev.namespace, type);
      var _ancestorInfo2 = updatedAncestorInfo(parentHostContextDev.ancestorInfo, type, null);
      return { namespace: _namespace, ancestorInfo: _ancestorInfo2 };
    }
    var parentNamespace = parentHostContext;
    return getChildNamespace(parentNamespace, type);
  },
  getPublicInstance: function (instance) {
    return instance;
  },
  prepareForCommit: function () {
    eventsEnabled = isEnabled();
    selectionInformation = getSelectionInformation();
    setEnabled(false);
  },
  resetAfterCommit: function () {
    restoreSelection(selectionInformation);
    selectionInformation = null;
    setEnabled(eventsEnabled);
    eventsEnabled = null;
  },
  createInstance: function (type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    var parentNamespace = void 0;
    {
      // TODO: take namespace into account when validating.
      var hostContextDev = hostContext;
      validateDOMNesting$1(type, null, hostContextDev.ancestorInfo);
      if (typeof props.children === 'string' || typeof props.children === 'number') {
        var string = '' + props.children;
        var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type, null);
        validateDOMNesting$1(null, string, ownAncestorInfo);
      }
      parentNamespace = hostContextDev.namespace;
    }
    var domElement = createElement(type, props, rootContainerInstance, parentNamespace);
    precacheFiberNode(internalInstanceHandle, domElement);
    updateFiberProps(domElement, props);
    return domElement;
  },
  appendInitialChild: function (parentInstance, child) {
    parentInstance.appendChild(child);
  },
  finalizeInitialChildren: function (domElement, type, props, rootContainerInstance) {
    setInitialProperties(domElement, type, props, rootContainerInstance);
    return shouldAutoFocusHostComponent(type, props);
  },
  prepareUpdate: function (domElement, type, oldProps, newProps, rootContainerInstance, hostContext) {
    {
      var hostContextDev = hostContext;
      if (typeof newProps.children !== typeof oldProps.children && (typeof newProps.children === 'string' || typeof newProps.children === 'number')) {
        var string = '' + newProps.children;
        var ownAncestorInfo = updatedAncestorInfo(hostContextDev.ancestorInfo, type, null);
        validateDOMNesting$1(null, string, ownAncestorInfo);
      }
    }
    return diffProperties(domElement, type, oldProps, newProps, rootContainerInstance);
  },
  shouldSetTextContent: function (type, props) {
    return type === 'textarea' || typeof props.children === 'string' || typeof props.children === 'number' || typeof props.dangerouslySetInnerHTML === 'object' && props.dangerouslySetInnerHTML !== null && typeof props.dangerouslySetInnerHTML.__html === 'string';
  },
  shouldDeprioritizeSubtree: function (type, props) {
    return !!props.hidden;
  },
  createTextInstance: function (text, rootContainerInstance, hostContext, internalInstanceHandle) {
    {
      var hostContextDev = hostContext;
      validateDOMNesting$1(null, text, hostContextDev.ancestorInfo);
    }
    var textNode = createTextNode(text, rootContainerInstance);
    precacheFiberNode(internalInstanceHandle, textNode);
    return textNode;
  },


  now: now,

  mutation: {
    commitMount: function (domElement, type, newProps, internalInstanceHandle) {
      domElement.focus();
    },
    commitUpdate: function (domElement, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
      // Update the props handle so that we know which props are the ones with
      // with current event handlers.
      updateFiberProps(domElement, newProps);
      // Apply the diff to the DOM node.
      updateProperties(domElement, updatePayload, type, oldProps, newProps);
    },
    resetTextContent: function (domElement) {
      domElement.textContent = '';
    },
    commitTextUpdate: function (textInstance, oldText, newText) {
      textInstance.nodeValue = newText;
    },
    appendChild: function (parentInstance, child) {
      parentInstance.appendChild(child);
    },
    appendChildToContainer: function (container, child) {
      if (container.nodeType === COMMENT_NODE) {
        container.parentNode.insertBefore(child, container);
      } else {
        container.appendChild(child);
      }
    },
    insertBefore: function (parentInstance, child, beforeChild) {
      parentInstance.insertBefore(child, beforeChild);
    },
    insertInContainerBefore: function (container, child, beforeChild) {
      if (container.nodeType === COMMENT_NODE) {
        container.parentNode.insertBefore(child, beforeChild);
      } else {
        container.insertBefore(child, beforeChild);
      }
    },
    removeChild: function (parentInstance, child) {
      parentInstance.removeChild(child);
    },
    removeChildFromContainer: function (container, child) {
      if (container.nodeType === COMMENT_NODE) {
        container.parentNode.removeChild(child);
      } else {
        container.removeChild(child);
      }
    }
  },

  hydration: {
    canHydrateInstance: function (instance, type, props) {
      if (instance.nodeType !== ELEMENT_NODE || type.toLowerCase() !== instance.nodeName.toLowerCase()) {
        return null;
      }
      // This has now been refined to an element node.
      return instance;
    },
    canHydrateTextInstance: function (instance, text) {
      if (text === '' || instance.nodeType !== TEXT_NODE) {
        // Empty strings are not parsed by HTML so there won't be a correct match here.
        return null;
      }
      // This has now been refined to a text node.
      return instance;
    },
    getNextHydratableSibling: function (instance) {
      var node = instance.nextSibling;
      // Skip non-hydratable nodes.
      while (node && node.nodeType !== ELEMENT_NODE && node.nodeType !== TEXT_NODE) {
        node = node.nextSibling;
      }
      return node;
    },
    getFirstHydratableChild: function (parentInstance) {
      var next = parentInstance.firstChild;
      // Skip non-hydratable nodes.
      while (next && next.nodeType !== ELEMENT_NODE && next.nodeType !== TEXT_NODE) {
        next = next.nextSibling;
      }
      return next;
    },
    hydrateInstance: function (instance, type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
      precacheFiberNode(internalInstanceHandle, instance);
      // TODO: Possibly defer this until the commit phase where all the events
      // get attached.
      updateFiberProps(instance, props);
      var parentNamespace = void 0;
      {
        var hostContextDev = hostContext;
        parentNamespace = hostContextDev.namespace;
      }
      return diffHydratedProperties(instance, type, props, parentNamespace, rootContainerInstance);
    },
    hydrateTextInstance: function (textInstance, text, internalInstanceHandle) {
      precacheFiberNode(internalInstanceHandle, textInstance);
      return diffHydratedText(textInstance, text);
    },
    didNotMatchHydratedContainerTextInstance: function (parentContainer, textInstance, text) {
      {
        warnForUnmatchedText(textInstance, text);
      }
    },
    didNotMatchHydratedTextInstance: function (parentType, parentProps, parentInstance, textInstance, text) {
      if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
        warnForUnmatchedText(textInstance, text);
      }
    },
    didNotHydrateContainerInstance: function (parentContainer, instance) {
      {
        if (instance.nodeType === 1) {
          warnForDeletedHydratableElement(parentContainer, instance);
        } else {
          warnForDeletedHydratableText(parentContainer, instance);
        }
      }
    },
    didNotHydrateInstance: function (parentType, parentProps, parentInstance, instance) {
      if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
        if (instance.nodeType === 1) {
          warnForDeletedHydratableElement(parentInstance, instance);
        } else {
          warnForDeletedHydratableText(parentInstance, instance);
        }
      }
    },
    didNotFindHydratableContainerInstance: function (parentContainer, type, props) {
      {
        warnForInsertedHydratedElement(parentContainer, type, props);
      }
    },
    didNotFindHydratableContainerTextInstance: function (parentContainer, text) {
      {
        warnForInsertedHydratedText(parentContainer, text);
      }
    },
    didNotFindHydratableInstance: function (parentType, parentProps, parentInstance, type, props) {
      if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
        warnForInsertedHydratedElement(parentInstance, type, props);
      }
    },
    didNotFindHydratableTextInstance: function (parentType, parentProps, parentInstance, text) {
      if (true && parentProps[SUPPRESS_HYDRATION_WARNING] !== true) {
        warnForInsertedHydratedText(parentInstance, text);
      }
    }
  },

  scheduleDeferredCallback: rIC,
  cancelDeferredCallback: cIC,

  useSyncScheduling: !enableAsyncSchedulingByDefaultInReactDOM
});

injection$4.injectFiberBatchedUpdates(DOMRenderer.batchedUpdates);

var warnedAboutHydrateAPI = false;

function renderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  !isValidContainer(container) ? invariant(false, 'Target container is not a DOM element.') : void 0;

  {
    if (container._reactRootContainer && container.nodeType !== COMMENT_NODE) {
      var hostInstance = DOMRenderer.findHostInstanceWithNoPortals(container._reactRootContainer.current);
      if (hostInstance) {
        warning(hostInstance.parentNode === container, 'render(...): It looks like the React-rendered content of this ' + 'container was removed without using React. This is not ' + 'supported and will cause errors. Instead, call ' + 'ReactDOM.unmountComponentAtNode to empty a container.');
      }
    }

    var isRootRenderedBySomeReact = !!container._reactRootContainer;
    var rootEl = getReactRootElementInContainer(container);
    var hasNonRootReactChild = !!(rootEl && getInstanceFromNode$1(rootEl));

    warning(!hasNonRootReactChild || isRootRenderedBySomeReact, 'render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.');

    warning(container.nodeType !== ELEMENT_NODE || !container.tagName || container.tagName.toUpperCase() !== 'BODY', 'render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.');
  }

  var root = container._reactRootContainer;
  if (!root) {
    var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
    // First clear any existing content.
    if (!shouldHydrate) {
      var warned = false;
      var rootSibling = void 0;
      while (rootSibling = container.lastChild) {
        {
          if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
            warned = true;
            warning(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.');
          }
        }
        container.removeChild(rootSibling);
      }
    }
    {
      if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
        warnedAboutHydrateAPI = true;
        lowPriorityWarning$1(false, 'render(): Calling ReactDOM.render() to hydrate server-rendered markup ' + 'will stop working in React v17. Replace the ReactDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to the server HTML.');
      }
    }
    var newRoot = DOMRenderer.createContainer(container, shouldHydrate);
    root = container._reactRootContainer = newRoot;
    // Initial mount should not be batched.
    DOMRenderer.unbatchedUpdates(function () {
      DOMRenderer.updateContainer(children, newRoot, parentComponent, callback);
    });
  } else {
    DOMRenderer.updateContainer(children, root, parentComponent, callback);
  }
  return DOMRenderer.getPublicRootInstance(root);
}

function createPortal(children, container) {
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  !isValidContainer(container) ? invariant(false, 'Target container is not a DOM element.') : void 0;
  // TODO: pass ReactDOM portal implementation as third argument
  return createPortal$1(children, container, null, key);
}

function ReactRoot(container, hydrate) {
  var root = DOMRenderer.createContainer(container, hydrate);
  this._reactRootContainer = root;
}
ReactRoot.prototype.render = function (children, callback) {
  var root = this._reactRootContainer;
  DOMRenderer.updateContainer(children, root, null, callback);
};
ReactRoot.prototype.unmount = function (callback) {
  var root = this._reactRootContainer;
  DOMRenderer.updateContainer(null, root, null, callback);
};

var ReactDOM = {
  createPortal: createPortal,

  findDOMNode: function (componentOrElement) {
    {
      var owner = ReactCurrentOwner.current;
      if (owner !== null) {
        var warnedAboutRefsInRender = owner.stateNode._warnedAboutRefsInRender;
        warning(warnedAboutRefsInRender, '%s is accessing findDOMNode inside its render(). ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', getComponentName(owner) || 'A component');
        owner.stateNode._warnedAboutRefsInRender = true;
      }
    }
    if (componentOrElement == null) {
      return null;
    }
    if (componentOrElement.nodeType === ELEMENT_NODE) {
      return componentOrElement;
    }

    var inst = get(componentOrElement);
    if (inst) {
      return DOMRenderer.findHostInstance(inst);
    }

    if (typeof componentOrElement.render === 'function') {
      invariant(false, 'Unable to find node on an unmounted component.');
    } else {
      invariant(false, 'Element appears to be neither ReactComponent nor DOMNode. Keys: %s', Object.keys(componentOrElement));
    }
  },
  hydrate: function (element, container, callback) {
    // TODO: throw or warn if we couldn't hydrate?
    return renderSubtreeIntoContainer(null, element, container, true, callback);
  },
  render: function (element, container, callback) {
    return renderSubtreeIntoContainer(null, element, container, false, callback);
  },
  unstable_renderSubtreeIntoContainer: function (parentComponent, element, containerNode, callback) {
    !(parentComponent != null && has(parentComponent)) ? invariant(false, 'parentComponent must be a valid React Component') : void 0;
    return renderSubtreeIntoContainer(parentComponent, element, containerNode, false, callback);
  },
  unmountComponentAtNode: function (container) {
    !isValidContainer(container) ? invariant(false, 'unmountComponentAtNode(...): Target container is not a DOM element.') : void 0;

    if (container._reactRootContainer) {
      {
        var rootEl = getReactRootElementInContainer(container);
        var renderedByDifferentReact = rootEl && !getInstanceFromNode$1(rootEl);
        warning(!renderedByDifferentReact, "unmountComponentAtNode(): The node you're attempting to unmount " + 'was rendered by another copy of React.');
      }

      // Unmount should not be batched.
      DOMRenderer.unbatchedUpdates(function () {
        renderSubtreeIntoContainer(null, null, container, false, function () {
          container._reactRootContainer = null;
        });
      });
      // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      {
        var _rootEl = getReactRootElementInContainer(container);
        var hasNonRootReactChild = !!(_rootEl && getInstanceFromNode$1(_rootEl));

        // Check if the container itself is a React root node.
        var isContainerReactRoot = container.nodeType === 1 && isValidContainer(container.parentNode) && !!container.parentNode._reactRootContainer;

        warning(!hasNonRootReactChild, "unmountComponentAtNode(): The node you're attempting to unmount " + 'was rendered by React and is not a top-level container. %s', isContainerReactRoot ? 'You may have accidentally passed in a React root node instead ' + 'of its container.' : 'Instead, have the parent component update its state and ' + 'rerender in order to remove this component.');
      }

      return false;
    }
  },


  // Temporary alias since we already shipped React 16 RC with it.
  // TODO: remove in React 17.
  unstable_createPortal: createPortal,

  unstable_batchedUpdates: batchedUpdates,

  unstable_deferredUpdates: DOMRenderer.deferredUpdates,

  flushSync: DOMRenderer.flushSync,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    // For TapEventPlugin which is popular in open source
    EventPluginHub: EventPluginHub,
    // Used by test-utils
    EventPluginRegistry: EventPluginRegistry,
    EventPropagators: EventPropagators,
    ReactControlledComponent: ReactControlledComponent,
    ReactDOMComponentTree: ReactDOMComponentTree,
    ReactDOMEventListener: ReactDOMEventListener
  }
};

if (enableCreateRoot) {
  ReactDOM.createRoot = function createRoot(container, options) {
    var hydrate = options != null && options.hydrate === true;
    return new ReactRoot(container, hydrate);
  };
}

var foundDevTools = DOMRenderer.injectIntoDevTools({
  findFiberByHostInstance: getClosestInstanceFromNode,
  bundleType: 1,
  version: ReactVersion,
  rendererPackageName: 'react-dom'
});

{
  if (!foundDevTools && ExecutionEnvironment.canUseDOM && window.top === window.self) {
    // If we're in Chrome or Firefox, provide a download link if not installed.
    if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('Firefox') > -1) {
      var protocol = window.location.protocol;
      // Don't warn in exotic cases like chrome-extension://.
      if (/^(https?|file):$/.test(protocol)) {
        console.info('%cDownload the React DevTools ' + 'for a better development experience: ' + 'https://fb.me/react-devtools' + (protocol === 'file:' ? '\nYou might need to use a local HTTP server (instead of file://): ' + 'https://fb.me/react-devtools-faq' : ''), 'font-weight:bold');
      }
    }
  }
}



var ReactDOM$2 = Object.freeze({
	default: ReactDOM
});

var ReactDOM$3 = ( ReactDOM$2 && ReactDOM ) || ReactDOM$2;

// TODO: decide on the top-level export form.
// This is hacky but makes it work with both Rollup and Jest.
var reactDom = ReactDOM$3['default'] ? ReactDOM$3['default'] : ReactDOM$3;

module.exports = reactDom;
  })();
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var emptyFunction = __webpack_require__(1);

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function capture(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    } else {
      if (true) {
        console.error('Attempted to listen to events during the capture phase on a ' + 'browser that does not support the capture phase. Your application ' + 'will not receive some events.');
      }
      return {
        remove: emptyFunction
      };
    }
  },

  registerDefault: function registerDefault() {}
};

module.exports = EventListener;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/* eslint-disable fb-www/typeof-undefined */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */
function getActiveElement(doc) /*?DOMElement*/{
  doc = doc || (typeof document !== 'undefined' ? document : undefined);
  if (typeof doc === 'undefined') {
    return null;
  }
  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

module.exports = getActiveElement;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */



var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var isTextNode = __webpack_require__(25);

/*eslint-disable no-bitwise */

/**
 * Checks if a given DOM node contains or is another DOM node.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var isNode = __webpack_require__(26);

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  var doc = object ? object.ownerDocument || object : document;
  var defaultView = doc.defaultView || window;
  return !!(object && (typeof defaultView.Node === 'function' ? object instanceof defaultView.Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
}

module.exports = isNode;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * @param {DOMElement} node input/textarea to focus
 */

function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch (e) {}
}

module.exports = focusNode;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */



var hyphenate = __webpack_require__(29);

var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */



var camelize = __webpack_require__(31);

var msPattern = /^-ms-/;

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
}

module.exports = camelizeStyleName;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function (_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = register;
/* unused harmony export unregister */
// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

function register() {
  if (false) {
    // The URL constructor is available in all browsers that support SW.
    var publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', function () {
      var swUrl = process.env.PUBLIC_URL + '/service-worker.js';

      if (isLocalhost) {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(function () {
          console.log('This web app is being served cache-first by a service ' + 'worker. To learn more, visit https://goo.gl/SC7cgQ');
        });
      } else {
        // Is not local host. Just register service worker
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker.register(swUrl).then(function (registration) {
    registration.onupdatefound = function () {
      var installingWorker = registration.installing;
      installingWorker.onstatechange = function () {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the old content will have been purged and
            // the fresh content will have been added to the cache.
            // It's the perfect time to display a "New content is
            // available; please refresh." message in your web app.
            console.log('New content is available; please refresh.');
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            console.log('Content is cached for offline use.');
          }
        }
      };
    };
  }).catch(function (error) {
    console.error('Error during service worker registration:', error);
  });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl).then(function (response) {
    // Ensure service worker exists, and that we really are getting a JS file.
    if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
      // No service worker found. Probably a different app. Reload the page.
      navigator.serviceWorker.ready.then(function (registration) {
        registration.unregister().then(function () {
          window.location.reload();
        });
      });
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl);
    }
  }).catch(function () {
    console.log('No internet connection found. App is running in offline mode.');
  });
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.unregister();
    });
  }
}

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_font_awesome_css_font_awesome_min_css__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_font_awesome_css_font_awesome_min_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_font_awesome_css_font_awesome_min_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Dashboard_css__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Dashboard_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__Dashboard_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bootstrap_dist_css_bootstrap_css__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_bootstrap_dist_css_bootstrap_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_bootstrap_dist_css_bootstrap_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_responsive_carousel_lib_styles_carousel_css__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_responsive_carousel_lib_styles_carousel_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_responsive_carousel_lib_styles_carousel_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Components_Ratp__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_responsive_carousel__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_responsive_carousel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_responsive_carousel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Components_Weather__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Components_Plant__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Components_Bulb__ = __webpack_require__(69);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }












// RATP CONSTANTES
var TRANSPORT_TYPE = ["rers", "metro"];
var LINES = ["A", "B", "1", "2", "3", "3b", "4", "5", "6", "7", "7b", "8", "9", "10", "12", "13", "14"];
var CITY = ["Paris", "Le Havre", "Orleans", "Lyon", "Nice", "Nantes", "Bordeaux", "Marseille", "Toulouse", "Rennes", "Reims", "Rouen"];

var Dashboard = function (_Component) {
    _inherits(Dashboard, _Component);

    function Dashboard() {
        _classCallCheck(this, Dashboard);

        var _this = _possibleConstructorReturn(this, _Component.call(this));

        _this.state = {
            plantes: []
        };
        return _this;
    }

    Dashboard.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        fetch("/plant/all").then(function (response) {
            return response.json();
        }).then(function (data) {
            _this2.setState({
                plantes: data.result
            });
        });
    };

    Dashboard.prototype.render = function render() {
        var eachPlant = function eachPlant(plant) {
            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                null,
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__Components_Plant__["a" /* default */], { key: plant._id,
                    id: plant._id,
                    name: plant.nom,
                    instruction: plant.instructions,
                    description: plant.description,
                    lastArrosage: plant.lastArrosage }),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'p',
                    { className: 'legend' },
                    plant.name
                )
            );
        };
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'container' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_6_react_responsive_carousel__["Carousel"],
                { showArrows: true, showThumbs: false },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__Components_Ratp__["a" /* default */], { transportType: TRANSPORT_TYPE[0], line: LINES[0], walkTime: '13', station: 'Le Parc De Saint Maur', way: 'A' }),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'p',
                        { className: 'legend' },
                        'RATP APP'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__Components_Weather__["a" /* default */], { city: CITY[0] }),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'p',
                        { className: 'legend' },
                        CITY[0],
                        ' Weather'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__Components_Bulb__["a" /* default */], null),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'p',
                        { className: 'legend' },
                        'Ampoule Yeelight'
                    )
                ),
                this.state.plantes.map(eachPlant)
            )
        );
    };

    return Dashboard;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Dashboard);

/***/ }),
/* 35 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 37 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 38 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__App_css__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var API = "https://api-ratp.pierre-grimaud.fr/v3";
var DATA_TYPES = ["/schedules", "/traffic"];

var Ratp = function (_Component) {
    _inherits(Ratp, _Component);

    // A RATP COMPONENT will be use to display an horaire for a specific data
    function Ratp(props) {
        _classCallCheck(this, Ratp);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            title: "Chargement en cours",
            message: "",
            slug: "",
            colorTraffic: "green",
            schedules: [],
            times: [],
            divStyle: {
                backgroundColor: 'green',
                paddingLeft: "100px"
            }
        };
        _this.getTraffic = _this.getTraffic.bind(_this);
        _this.getHoraire = _this.getHoraire.bind(_this);
        _this.refresh = _this.refresh.bind(_this);
        _this.getUniqueKey = _this.getUniqueKey.bind(_this);
        _this.manageSchedules = _this.manageSchedules.bind(_this);
        _this.displayStation = props.station;
        _this.station = props.station.replace(" ", "+");
        _this.walkTime = parseInt(props.walkTime, 10) ? props.walkTime : 13;
        _this.way = props.way;
        _this.line = props.line;
        _this.destination = props.destination;
        _this.transportType = props.transportType;
        _this.imgPath = "../images/";
        _this.image = _this.imgPath + _this.transportType + "/" + _this.line + ".png";
        _this.logo = __webpack_require__(40)("./" + _this.transportType + "/" + _this.line + ".png");
        return _this;
    }

    Ratp.prototype.componentDidMount = function componentDidMount() {
        this.refresh();
    };

    Ratp.prototype.getTraffic = function getTraffic() {
        var _this2 = this;

        fetch(API + DATA_TYPES[1] + "/" + this.transportType + "/" + this.line).then(function (response) {
            return response.json();
        }).then(function (data) {
            _this2.setState({
                title: data.result.title,
                message: data.result.message,
                slug: data.result.slug
            });

            if (_this2.state.slug !== "normal") {
                _this2.setState({
                    divStyle: {
                        backgroundColor: 'red',
                        paddingLeft: "100px"
                    }
                });
            }
        }).catch(function (error) {
            console.log(error);
            this.setState({
                title: "Erreur",
                message: "Les données n'ont pas pu être chargées",
                slug: "network_error"
            });
        });
    };

    Ratp.prototype.getHoraire = function getHoraire() {
        var _this3 = this;

        fetch(API + DATA_TYPES[0] + "/" + this.transportType + "/" + this.line + "/" + this.station + "/" + this.way).then(function (response) {
            return response.json();
        }).then(function (data) {
            _this3.setState({
                schedules: data.result.schedules.map(function (schedule) {
                    // Get time in minutes
                    schedule.key = _this3.getUniqueKey();
                    _this3.diff_minutes(schedule);
                    return schedule;
                })
            });
            _this3.timerId = setInterval(function () {
                _this3.manageSchedules();
            }, 50000);
        }).catch(function (error) {
            // Mock data
            var key = this.getUniqueKey();
            var schedules = [{ key: key,
                destination: "Mock Destination",
                message: "5",
                time: 5 }];
            this.setState({
                schedules: schedules

            });
            console.log(error);
        });
    };

    Ratp.prototype.getUniqueKey = function getUniqueKey() {
        this.key = this.key || 0;
        return this.key++;
    };

    Ratp.prototype.refresh = function refresh() {
        this.getTraffic();
        this.getHoraire();
    };

    Ratp.prototype.manageSchedules = function manageSchedules() {
        var _this4 = this;

        this.setState(function (prevState) {
            return {
                schedules: prevState.schedules
                // Supprime l'heure si elle est égale à 0
                .filter(function (schedule) {
                    return schedule.time > _this4.walkTime * 0.8;
                }).map(function (schedule) {
                    _this4.diff_minutes(schedule);
                    return schedule;
                })
            };
        });
    };

    Ratp.prototype.componentDidUpdate = function componentDidUpdate(props) {};

    Ratp.editShedule = function editShedule(schedule) {
        // Get moment date
        var date = new Date();
        var minutes = date.getMinutes();
        //let hour = date.getHours();
        // Split time in two differents times
        var time = schedule.message.time;
        if (parseInt(time, 10) > this.walkTime * 0.8) {
            schedule.time = time - minutes;
        }
        return schedule;
    };

    Ratp.prototype.diff_minutes = function diff_minutes(schedule) {
        var timeHM = schedule.message.split(":");
        var time = 0;
        var date = new Date();
        var minutes = date.getMinutes();
        var hour = date.getHours();
        while (parseInt(timeHM[0], 10) > parseInt(hour, 10)) {
            timeHM[1] = parseInt(timeHM[1], 10) + 60;
            hour++;
        }
        if (parseInt(timeHM[1], 10) > parseInt(minutes, 10)) {
            time = timeHM[1] - minutes;
            // Set diff time in schedule object
            schedule.time = time;
        } else {
            schedule.time = 0;
        }
        return schedule;
    };
    /*
    removeSchedule(schdeduleKey){
        this.setState(prevState => ({
            schedules: prevState.schedules.filter(schedule => schedule.key !== schdeduleKey)
        }))
    }
    */


    Ratp.prototype.render = function render() {
        var walkTime = this.walkTime;
        var eachSchedule = function eachSchedule(schedule) {
            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Schedule, { key: schedule.key,
                destination: schedule.destination,
                message: schedule.message,
                time: schedule.time });
        };
        var Schedule = function Schedule(props) {
            var displaytime = "";
            var style = {
                color: "black"
            };
            if (props.time !== undefined) {
                displaytime = "(" + props.time + " mn)";
                if (walkTime < props.time) {
                    style = {
                        color: "green",
                        fontWeight: "bold"
                    };
                } else {
                    style = {
                        color: "orange"
                    };
                }
            }
            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'row' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-md-8 col-8' },
                    props.destination
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-md-4 col-4' },
                    props.message,
                    ' ',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'span',
                        { style: style },
                        ' ',
                        displaytime
                    ),
                    '  '
                )
            );
        };
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'App RATP', style: { backgroundColor: "#ccffcc" } },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { style: this.state.divStyle, className: 'header row' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('img', { src: this.logo, alt: this.line, style: { width: "28px", marginRight: "10px", verticalAlign: "middle", display: "inline" } }),
                    this.displayStation,
                    ' '
                ),
                ' ',
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'button',
                    { className: 'refresh fa fa-refresh', onClick: this.refresh },
                    ' '
                )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'p',
                null,
                this.state.slug !== "normal" ? this.state.message : ""
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'row' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-md-8 col-8' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'b',
                        null,
                        'Destination'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-md-4 col-4' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'b',
                        null,
                        'Temps'
                    )
                )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { style: { fontsize: "14px", padding: "10px" } },
                this.state.schedules.map(eachSchedule)
            )
        );
    };

    return Ratp;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Ratp);

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./bulb/bulb_off.png": 11,
	"./bulb/bulb_on.png": 12,
	"./metro/1.png": 41,
	"./metro/10.png": 42,
	"./metro/11.png": 43,
	"./metro/12.png": 44,
	"./metro/13.png": 45,
	"./metro/14.png": 46,
	"./metro/2.png": 47,
	"./metro/3.png": 48,
	"./metro/3b.png": 49,
	"./metro/4.png": 50,
	"./metro/5.png": 51,
	"./metro/6.png": 52,
	"./metro/7.png": 53,
	"./metro/7b.png": 54,
	"./metro/8.png": 55,
	"./metro/9.png": 56,
	"./rers/A.png": 57,
	"./rers/B.png": 58
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 40;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEV/ZwD/88D/0hD/9tD/1SD/6pD/7aD/54D/3lD/20D//PD/+eD/4WBvWgCfgQD/2DD/8LAPDAC/mwDvwgAfGQBfTQA/MwAAAAD/zwD///8AAAAAAAAAAAAAAAAAAAAAAADGRXGBAAAAGnRSTlP/////////////////////////////////ABQiANoAAAABYktHRB8FDRC9AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAVAAAAFQBxfMg1AAAAlUlEQVQY03XRRxLDIAwFUNGLsZ1qpPtfNBgYuUYLRrwF5QuolTLOGdE3BOsSncZa0kVW1a266Kok7stWHY6IqFYNrX+Py9g6XVS0dnrmvPAZkGrzzXlTT9Duf30mYEUCvmSn6lbFH5U3SuCvOhPYq5ryN31WGYuKUwz4qJnZI6aer92n5ngWAz8kiG1CxU0KwRvV5/YDldYkXFKYRlkAAAAldEVYdGNyZWF0ZS1kYXRlADIwMDktMDYtMjlUMTU6MTY6MzArMDI6MDDQ90ueAAAAJXRFWHRtb2RpZnktZGF0ZQAyMDA4LTEyLTAyVDE3OjUyOjQ3KzAxOjAwnj8qfgAAAABJRU5ErkJggg=="

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEWmfhPgrij36sbQnhj579Xmv1Pv1I0NCgHz36ritDfx2pspHwQbFQOKaRDoxGKYdBH9+vLqyXD79eNhSQu0iRVTPwl8Xw7kuUVFNAj15LjCkxZvVA03KgYAAADeqRr////E1DfoAAAAIHRSTlP/////////////////////////////////////////AFxcG+0AAAABYktHRB8FDRC9AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAVAAAAFQBxfMg1AAAAzklEQVQY013R23aEIAwF0MhNZdTRcXqVHP7/L5tQsE7zEBd7SSCB8m+4GEI0dZFJ0xpGlOjCeqqrVtxUdR2uMRR9vCLgVD1g97RLTsz9AYyiBph75gTcWGPWGrThUxcJd+Z3O/EELJlG0DQfogczNFkgUzlANfENukHEXVVqU1Hz79+mXdO91v3WukvTmfkuG+QOH5mGprbnXq4sbUTpbayKpzTDbzKgVdScA7BET/l8lZkNr8PZ6nyH69TC+RYP38ybvxcSj5v3S3T13X4AtNMrJZpa0Q8AAAAldEVYdGNyZWF0ZS1kYXRlADIwMDktMDYtMjlUMTU6MTY6MzArMDI6MDDQ90ueAAAAJXRFWHRtb2RpZnktZGF0ZQAyMDA4LTEyLTAyVDE3OjUyOjA2KzAxOjAwvAIvMAAAAABJRU5ErkJggg=="

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEV+SRnm29Ldz8LczsHMt6S6noWGVSnDq5SYbkegelephmbLtqP39PGOYTfu5+GohWWGVSjt5uCgeVaPYjjUw7O6noSXbUf///91PQr///8AAAAAAAAAAAAAAAAAAAAAAAD9UqdSAAAAGnRSTlP/////////////////////////////////ABQiANoAAAABYktHRB8FDRC9AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAVAAAAFQBxfMg1AAAAo0lEQVQY03XRWRLDIAgAUNziFpM20yre/6JFYtNs5UP0jSMjQF1DWGOs7IcKbRnNgBxgxk1FN3bZVQDuQ7NOR0QUTR1tFqUSpazUjDiQynYopWR8REpvfgMCplJYOTVdKlD9Z5ybRpVWxbqWyk0puopblX/uwo1W8FdNFfRVLf1tOCuMpPLUBnxxz/QRQ++v3nfNbLOY/Nec/E2I3AbnvBV9bh8PeSQirPxdcQAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0wNi0yOVQxNToxNjozMCswMjowMND3S54AAAAldEVYdG1vZGlmeS1kYXRlADIwMDgtMTItMDJUMTc6NTI6MjMrMDE6MDCsHwfqAAAAAElFTkSuQmCC"

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEURc0jQ5NsQc0jA2s8whWBBj20hfVTf7OZAj2yAtZ7v9fKgx7aQvqpgoYVRmXlhooXw9vSPvang7eefx7Vwq5HP49qw0cNQmHgxhmGAtJ2/2c7///8Bajz///8AAAAAAABiUGEeAAAAHnRSTlP//////////////////////////////////////wDsGBxeAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAFQAAABUAcXzINQAAAL9JREFUGNNd0VsSgyAMBdAAoqL4tu1oLvvfZgOi1eYDJ0cDmFA4QnnnvMlJoLiMrkQKcuOlKltyk1UR7tEmnZ8IqKhWyqZ9gp4a5uoDlKIG6CTdsXKKIu5BA5aY7MBeo2PegD5QibrqtqgxmBdZw3HUqTXzGs97aNFwpeVp7ir4KtLdiC6NqNNHgfpTdXWUy+tA7an1cV8p8vJv5b/qUdT8tQHv1LP2iUPub3vvmrtmMdvTrPlNSNwP1vZe5bl9AWB3KMaluF91AAAAJXRFWHRjcmVhdGUtZGF0ZQAyMDA5LTA2LTI5VDE1OjE2OjMwKzAyOjAw0PdLngAAACV0RVh0bW9kaWZ5LWRhdGUAMjAwOC0xMi0wMlQxNzo1MjozMCswMTowMFFdHekAAAAASUVORK5CYII="

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEVsn5nk9POX19Dr9/YJDQzI6ubP7OmHxsCs39qe2dPW7+wSGhk/XFljkYw2T0x1rKZRd3P4/Pzy+vmz4d265OB+ubNahICl3Nbd8vAbJyZIamYkNTMAAACQ1M3///8AAACVVMnEAAAAH3RSTlP///////////////////////////////////////8AzRl2EAAAAAFiS0dEHwUNEL0AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAABUAAAAVAHF8yDUAAADMSURBVBjTVdHbloMwCAVQYkyMl2qttjPTcPL/nzlAU2t5UNm6IAKVV/gYQnQ1KaSXNfSwaMJ6qK9m7qr6BucYTG/fCHjVBHRTntDNLfN4AXpRBzwkzbizxaI1aMesSQaudxDzE9gK9aDx8VSVWJivcitk2Uun3PJfp/3OmrWSqjvrQhPzbNp81D7PVnc7VI7ajfrwU2h4K/Eo3VjeRfm3vupFiFs5WLOKumMARNb712Y2fA9nr/MdzlMLxy5u6W3JfTYkHveUtujr3v4BjHMp7m9la6kAAAAldEVYdGNyZWF0ZS1kYXRlADIwMDktMDYtMjlUMTU6MTY6MzArMDI6MDDQ90ueAAAAJXRFWHRtb2RpZnktZGF0ZQAyMDA4LTEyLTAyVDE3OjUyOjI5KzAxOjAwCG9YpAAAAABJRU5ErkJggg=="

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEW8NJbtyePy1+rlrtXgoc7ck8fBQZ3KXKvOarLfoM725fH78vjTeLnSd7m8M5b24/HFTqTkrdX68fjx1urpvNzFT6TbksfJXKvtyOP///+4Jo////8AAAAAAAAAAAAAAABKm4mSAAAAHHRSTlP///////////////////////////////////8AF7Li1wAAAAFiS0dEHwUNEL0AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAABUAAAAVAHF8yDUAAAC2SURBVBjTXdHZEoMgDAXQsIpVq9VWSfj//yyJ4HYfGDkzBkgg7dHWOavKJgEvnfMkAdcdqouJq6Ia6Boj+rojkWZt8m9tbHn/jjFO5LMqomFGjKwfRNy4BvTyLbrhLBoSeNrGYWWFEVdRSvtRoi2OtKs+dWLZVZ26YL5HVaiKJSvXDVUjB3EZ6JfAHKdxpILNb/NPhS6rerSBvtIzc8e+9Ndcu+aOWbxCtUadE8pu+6YJVpe5/QFwCCaruIUfUwAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0wNi0yOVQxNToxNjozMCswMjowMND3S54AAAAldEVYdG1vZGlmeS1kYXRlADIwMDgtMTItMDJUMTc6NTM6MTUrMDE6MDCugl4NAAAAAElFTkSuQmCC"

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEXD0ufS3u1Id7aFpc+kvNsqYaqVsNXC0eZmjcKFpM44a7ApYKqju9pnjsPh6fPx9PlYg7yyxuA5bLDv8/jR3eyzx+F1mcgaVaT///8LSp7///8AAAAAAAAAAAAAAAAAAAB53LHdAAAAG3RSTlP//////////////////////////////////wAnNAs1AAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAFQAAABUAcXzINQAAAKpJREFUGNNdkVsWwyAIRBGNeTTGpO2p6P4XWkWqpvM1XBUQIFUpq7UFCRIbr6fICto3qoQxB6EqxFGG6XGHMapCsbjHTkTzxnTKFNhdVPQKkgNcPZ8x5usLB2eCXn8jWqtL0Kt8iDap1+mSy4kFGOA7NBoa3NuzBGftgehq8JnAsFm5X0ls89+mfxp8pkNvVRfPzNyhk/macWq67eLAH0PoG8rcOsTTKtnbF+nlJc/nq2S0AAAAJXRFWHRjcmVhdGUtZGF0ZQAyMDA5LTA2LTI5VDE1OjE2OjMwKzAyOjAw0PdLngAAACV0RVh0bW9kaWZ5LWRhdGUAMjAwOC0xMi0wMlQxNzo1MjozNiswMTowMDKNKNMAAAAASUVORK5CYII="

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEX09dLIzRvw8sPP0znp66TT10ni5Ybl6JXS10jL0SrHzRvw8cLa3Wfs7rPa3mf4+eH8/PHX21jd4Xbh5IXz9dHl55TW2lf7++/3+ODo66Pt77TP1Dr////Eygz///8AAAAJX5wrAAAAH3RSTlP///////////////////////////////////////8AzRl2EAAAAAFiS0dEHwUNEL0AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAABUAAAAVAHF8yDUAAAC5SURBVBjTVZHpEoMgDIQRudSqeNQeE3j/x2wIgWJ+OOGbmF0WEXMJa4yVsZzSx5shUHXGVyqYEZdMRRfaUkTXOwwhDUadun4GgLMnOiCV1D0g1WvkHWLJvx1j2AEc9Vurj/N5RYiisGkC+BS9StPeJ/eyUnehjb3MNm4B5rJ341H0XFb0USjWP1GNPVi8G1k7ktj7ygF5pPlynXNsNnwpM3UPZ+F8VZuaqW+x6upa/l8IuV203iyf4g9sSyq9yoJjZgAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0wNi0yOVQxNToxNjozMCswMjowMND3S54AAAAldEVYdG1vZGlmeS1kYXRlADIwMDgtMTItMDJUMTc6NTI6NTYrMDE6MDD04iFUAAAAAElFTkSuQmCC"

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEUSGhmX19Dk9PPr9/bP7Oms39qe2dMbJybI6ubW7+x+ubM/XFmHxsD4/Py65OB1rKby+vljkYyz4d0tQkBRd3Ol3Nbd8vBahIAJDQwkNTNsn5lIamYAAACQ1M3///8AAAAPPPh8AAAAH3RSTlP///////////////////////////////////////8AzRl2EAAAAAFiS0dEHwUNEL0AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAABUAAAAVAHF8yDUAAADXSURBVBjTVdHZsoMgDADQyCKoVau9LUsS/v8zb6RU2zwwwxmGbFDeoY33RrVLgeOYfc81Oj+fqptVV011x98xVL3/IrM+1DICUcRTe1HFLCgRcmDOW/0DFuYt8xjpgWnlgJx5L/DOf4s0IVFCdPDHBQ4LCSiO6DZCjLCyriqvKK3oEBCDS6yqjhkjuZBSCOGRsmirdiK6Ki6wSzk35kTxxGeBQfJHyUbTqUZ668faxYXdLCrN5Xx88olXndnwO5ylzXf4npo/d3G3H7Pq2pC4WazdjW57+wdtDCnLYblCEQAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0wNi0yOVQxNToxNjozMCswMjowMND3S54AAAAldEVYdG1vZGlmeS1kYXRlADIwMDgtMTItMDJUMTc6NTI6MzgrMDE6MDBislOOAAAAAElFTkSuQmCC"

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEW8NJbtyePy1+rJXKvBQZ3ck8fgoc7lrtXKXKv68fjOarL25fH78vjTeLnFTqTx1urXhMC8M5bpvNzFT6Tou9zAQZ3bksffoM7tyOP///+4Jo////8AAAAAAAAAAAAAAADO0+OjAAAAHHRSTlP///////////////////////////////////8AF7Li1wAAAAFiS0dEHwUNEL0AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAABUAAAAVAHF8yDUAAACnSURBVBjTXdHZFoQgCABQtFxap9kF//8/xxSohodO3DooALmF9c55w0mG/TG7nmqAm1UtW3XDaoHOEapOVySyu0ZO1pRSfemLGvnlhohSAxbGD6qOGfj894BfUcpyVMJXpyq32nC4H5pYB9zorI2Ro+O6Y/taolwtrXvyzBC0J63gS2/9v8JcVJuTeNSZhSsuPN9wnprTXUwyN4rm2FBxv8Q4est7+wFIDSdd0gvE/wAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0wNi0yOVQxNToxNjozMCswMjowMND3S54AAAAldEVYdG1vZGlmeS1kYXRlADIwMDgtMTItMDJUMTc6NTI6MjYrMDE6MDD+JyhNAAAAAElFTkSuQmCC"

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEX9gTb/3sr/5tj+m1/+vJT9ikT+za/+xaLtcSb/7+X/9/L+q3oPBwL+o2zdaSN+PBReLQ/NYiEfDwX9klGORBeeSxn+1b1uNBE/Hgq9Wh4AAAD9eSn///8AAAAAAAAAAACohd5sAAAAHXRSTlP/////////////////////////////////////AFmG52oAAAABYktHRB8FDRC9AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAVAAAAFQBxfMg1AAAAtUlEQVQY01WR1xKEIAxFQxGsu+o2Kf//nRtIopgHJpyBe1MgU2hvrVd8yVCO0XapBtjxpJpZ5YqphtSGq3S4w5R0oaam76PEVtIOqaIHRywRWAMmoWsIoa/5kqETGi7lLFb4fV4f4tdQ5KSQ1FVW/4vxKbSpNsZDdBdK0GuTt68MjmDcseKZ7Dz2Vkv7FLOdioMRKTXXYw8s/60zc/fhTDxf107NnrsYjDCjrg0h95Mxi9e8tz9vVCiUUKtU6AAAACV0RVh0Y3JlYXRlLWRhdGUAMjAwOS0wNi0yOVQxNToxNjozMCswMjowMND3S54AAAAldEVYdG1vZGlmeS1kYXRlADIwMDgtMTItMDJUMTc6NTM6MzgrMDE6MDCNcDiwAAAAAElFTkSuQmCC"

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEUdMR1/yYDm9OZuuG/d8d3D5sTM6cyY1JkHDAe74ruHzIhJe0pYk1nu+O6q26qh16L3/PcWJBZnrGhRh1EsSSwOGA5foGAzVjQ7YjvV7dWQ0JEAAAB2xXf///8AAAAAAABw/SgHAAAAHnRSTlP//////////////////////////////////////wDsGBxeAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAFQAAABUAcXzINQAAALxJREFUGNNVkdkSwyAIRXHXNnvSFf3/36wBTFIe9HLGuSBA4dAuJWclKbAfU7plCpWmg2phxK1QrfI1PNH+H+asdxpYdzMiPnd1q9QyXHGP5gEDCRNxNtkwHQtw/TvicjoX4PuFjw3g3uoJBbLFN2f2oHGtXcT2VgkFMm++I91vjKaaM/0W8CQWxEf13ihx9W/SWqzFgBpWU6XyOdN1T1Yfmpn/H84g8/XXqaVjF31oLNhzQ5W7IYTRadnbD+8GKOXDuIwNAAAAJXRFWHRjcmVhdGUtZGF0ZQAyMDA5LTA2LTI5VDE1OjE2OjMwKzAyOjAw0PdLngAAACV0RVh0bW9kaWZ5LWRhdGUAMjAwOC0xMi0wMlQxNzo1MzoxNyswMTowMDkdTyQAAAAASUVORK5CYII="

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEX+6fD5kLL+4uv8xNb7p8L90+D8zNv6mLe6ZoEPCAr+8fXZd5f7tcx8RFb/+Pr7rsfpgKKMTWFdM0BsO0vKb4z92ub6n7yrXnYuGSA+IisAAAD5ia3///8AAAAAAAAAAAA6iKh0AAAAHXRSTlP/////////////////////////////////////AFmG52oAAAABYktHRB8FDRC9AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAVAAAAFQBxfMg1AAAAp0lEQVQY022R6RKDIAyEI5dHrdbeJrz/czYEgtp2fzDLx04YFohZEKwNJuouLZNtSdTYqVIoTLgpFBraywsdjpAoBaNL7rZmJd8yNXK+YlaZAaOYe8fqUbI07+9fEE/ZRajw0uNV79vouUbJwJ8oZ5vfKM+da/St8BnBZ/dCXJQGflurAzotaGJqvmqgh3Tmj3As/fp9a7b+xeCUObP9EPMwOjeHsosfMfQocSdGTSkAAAAldEVYdGNyZWF0ZS1kYXRlADIwMDktMDYtMjlUMTU6MTY6MzArMDI6MDDQ90ueAAAAJXRFWHRtb2RpZnktZGF0ZQAyMDA4LTEyLTAyVDE3OjUzOjAwKzAxOjAwMBBxNAAAAABJRU5ErkJggg=="

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEVYk1nd8d1/yYDm9Oa74rvM6cyY1JmHzIhfoGDD5sQzVjQOGA4WJBbu+O73/Peh16Kq26oHDAdRh1EkPSUsSSyQ0JFCbkLV7dVJe0o7YjsdMR0AAAB2xXf///8AAAAAAADUs6GdAAAAHnRSTlP//////////////////////////////////////wDsGBxeAAAAAWJLR0QfBQ0QvQAAAAlwSFlzAAAASAAAAEgARslrPgAAAAl2cEFnAAAAFQAAABUAcXzINQAAAMtJREFUGNNd0duSwyAIAFCMxmiS5tZtFwT//zeXqG3T5cEZzzAoALmGjc5F0y4ZzmNxg5To3PJW26y4aWo7uUZf9PaNIvZUL2MqMTYdVI1I4hLpUwM2kQAAyEwvXTO09394P1AEjvOSoWJgRkpBkETFNk08CWlponl6iqkKmio0H0y0T0G1q6m7qNJEhHPSumtN1c9iSoh4T/DI0KuOzOHSXNTehtLGBbtF1fwbg/yWmfXfuLX59tepufcubv5l3nw2pB4379do297+AIKJKM1nO+j+AAAAJXRFWHRjcmVhdGUtZGF0ZQAyMDA5LTA2LTI5VDE1OjE2OjMwKzAyOjAw0PdLngAAACV0RVh0bW9kaWZ5LWRhdGUAMjAwOC0xMi0wMlQxNzo1MjozNiswMTowMDKNKNMAAAAASUVORK5CYII="

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEXx5PHKmsv06/UxJDEMCQzm0Ofq1+rNoc65ibrjyeNjSWPYtdlKN0rUrtWtgK4YEhg9LT748viUbpX8+fzbvNxWQFd7W3wlGyVvUm/t3u7Rp9Kgd6EAAADGk8f///8AAACcamXQAAAAH3RSTlP///////////////////////////////////////8AzRl2EAAAAAFiS0dEHwUNEL0AAAAJcEhZcwAAAEgAAABIAEbJaz4AAAAJdnBBZwAAABUAAAAVAHF8yDUAAAC+SURBVBjTVZFZEoQgDEQRBUVF3J2l4f7HHAzB0f6gmldUJyQiJElljBJ8CWQWU3tSYZaLSmbEBVNZ+Ls00ekJvZcntWRnB1Qt2TpSQW6o4A5g5wyxknkBjT+QHndB1Jl+G8fUhxRwJsChargeU78hqmTKxfwOtCPQZ5q6LVGeR5Vzuz/tmX6C0GRaYOyBjS4q/i211p/VRqpWLJHm3uZ5SO5NM9PP4aw8X32fmrl2MXWZWfHfUORqtbZTkvf2A8z1KiFDk5QMAAAAJXRFWHRjcmVhdGUtZGF0ZQAyMDA5LTA2LTI5VDE1OjE2OjMwKzAyOjAw0PdLngAAACV0RVh0bW9kaWZ5LWRhdGUAMjAwOC0xMi0wMlQxNzo1MjoxNCswMTowMOc3PocAAAAASUVORK5CYII="

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAMAAACeyVWkAAAAYFBMVEXIzRvw8sP09dIYGQHp66Tl6JXL0SrT10kMDADi5YYxMgMkJQKTlwm3vQv4+eH8/PHX21hiZQZVWAXa3mdJSwQ9PwNucQarsArt77R6fgfP1DqfpAmGiggAAADEygz///+h+kDPAAAAIHRSTlP/////////////////////////////////////////AFxcG+0AAAABYktHRB8FDRC9AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAVAAAAFQBxfMg1AAAAv0lEQVQY01WRiRLDIAhEUWPVHM3Vu139/7+sQUxTJuMsb8yCQKmEtiFYJUmi7RjDKXJQGHeqhTFXQjXFYzRMz/8wRr1Rx/JpgK5necpUsfoAPn938aCVRYtuGAwunEyJSn1gjnFBW5yTlDL5brzCSz2hMzhMyVRta/YwvjooOnRrsFTfaYc34M3ilagp6Np2kMaizW+rraH+T2Om5XF93w/i9OCZNf/DWWW+zXFqYd/F2VXm1G9DmdvVuclq2dsXOpwr3EXDVo4AAAAldEVYdGNyZWF0ZS1kYXRlADIwMDktMDYtMjlUMTU6MTY6MzArMDI6MDDQ90ueAAAAJXRFWHRtb2RpZnktZGF0ZQAyMDA4LTEyLTAyVDE3OjUzOjIxKzAxOjAw1EJ9/QAAAABJRU5ErkJggg=="

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Thumbs = exports.Carousel = undefined;

var _Carousel = __webpack_require__(60);

var _Carousel2 = _interopRequireDefault(_Carousel);

var _Thumbs = __webpack_require__(16);

var _Thumbs2 = _interopRequireDefault(_Thumbs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Carousel = _Carousel2.default;
exports.Thumbs = _Thumbs2.default;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(7);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(8);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _cssClasses = __webpack_require__(13);

var _cssClasses2 = _interopRequireDefault(_cssClasses);

var _CSSTranslate = __webpack_require__(14);

var _CSSTranslate2 = _interopRequireDefault(_CSSTranslate);

var _reactEasySwipe = __webpack_require__(15);

var _reactEasySwipe2 = _interopRequireDefault(_reactEasySwipe);

var _Thumbs = __webpack_require__(16);

var _Thumbs2 = _interopRequireDefault(_Thumbs);

var _customPropTypes = __webpack_require__(65);

var customPropTypes = _interopRequireWildcard(_customPropTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};

var defaultStatusFormatter = function defaultStatusFormatter(current, total) {
    return current + ' of ' + total;
};

var Carousel = function (_Component) {
    _inherits(Carousel, _Component);

    function Carousel(props) {
        _classCallCheck(this, Carousel);

        var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, props));

        _this.autoPlay = function () {
            if (!_this.props.autoPlay) {
                return;
            }

            clearTimeout(_this.timer);
            _this.timer = setTimeout(function () {
                _this.increment();
            }, _this.props.interval);
        };

        _this.clearAutoPlay = function () {
            if (!_this.props.autoPlay) {
                return;
            }

            clearTimeout(_this.timer);
        };

        _this.resetAutoPlay = function () {
            _this.clearAutoPlay();
            _this.autoPlay();
        };

        _this.stopOnHover = function () {
            _this.setState({ isMouseEntered: true });
            _this.clearAutoPlay();
        };

        _this.startOnLeave = function () {
            _this.setState({ isMouseEntered: false });
            _this.autoPlay();
        };

        _this.navigateWithKeyboard = function (e) {
            var axis = _this.props.axis;

            var isHorizontal = axis === 'horizontal';
            var keyNames = {
                ArrowUp: 38,
                ArrowRight: 39,
                ArrowDown: 40,
                ArrowLeft: 37
            };

            var nextKey = isHorizontal ? keyNames.ArrowRight : keyNames.ArrowDown;
            var prevKey = isHorizontal ? keyNames.ArrowLeft : keyNames.ArrowUp;

            if (nextKey === e.keyCode) {
                _this.increment();
            } else if (prevKey === e.keyCode) {
                _this.decrement();
            }
        };

        _this.updateSizes = function () {
            if (!_this.state.initialized) {
                return;
            }

            var isHorizontal = _this.props.axis === 'horizontal';
            var firstItem = _this.refs.item0;
            var itemSize = isHorizontal ? firstItem.clientWidth : firstItem.clientHeight;

            _this.setState({
                itemSize: itemSize,
                wrapperSize: isHorizontal ? itemSize * _this.props.children.length : itemSize
            });
        };

        _this.setMountState = function () {
            _this.setState({ hasMount: true });
            _this.updateSizes();
        };

        _this.handleClickItem = function (index, item) {
            if (_this.state.cancelClick) {
                _this.setState({
                    cancelClick: false
                });

                return;
            }

            _this.props.onClickItem(index, item);

            if (index !== _this.state.selectedItem) {
                _this.setState({
                    selectedItem: index
                });
            }
        };

        _this.handleOnChange = function (index, item) {
            _this.props.onChange(index, item);
        };

        _this.handleClickThumb = function (index, item) {
            _this.props.onClickThumb(index, item);

            _this.selectItem({
                selectedItem: index
            });
        };

        _this.onSwipeStart = function () {
            _this.setState({
                swiping: true
            });
            _this.clearAutoPlay();
        };

        _this.onSwipeEnd = function () {
            _this.resetPosition();
            _this.setState({
                swiping: false
            });
            _this.autoPlay();
        };

        _this.onSwipeMove = function (delta) {
            var isHorizontal = _this.props.axis === 'horizontal';

            var initialBoundry = 0;

            var currentPosition = _this.getPosition(_this.state.selectedItem);
            var finalBoundry = _this.getPosition(_this.props.children.length - 1);

            var axisDelta = isHorizontal ? delta.x : delta.y;
            var handledDelta = axisDelta;

            // prevent user from swiping left out of boundaries
            if (currentPosition === initialBoundry && axisDelta > 0) {
                handledDelta = 0;
            }

            // prevent user from swiping right out of boundaries
            if (currentPosition === finalBoundry && axisDelta < 0) {
                handledDelta = 0;
            }

            var position = currentPosition + 100 / (_this.state.itemSize / handledDelta) + '%';

            _this.setPosition(position);

            // allows scroll if the swipe was within the tolerance
            var hasMoved = Math.abs(axisDelta) > _this.props.swipeScrollTolerance;

            if (hasMoved && !_this.state.cancelClick) {
                _this.setState({
                    cancelClick: true
                });
            }

            return hasMoved;
        };

        _this.resetPosition = function () {
            var currentPosition = _this.getPosition(_this.state.selectedItem) + '%';
            _this.setPosition(currentPosition);
        };

        _this.setPosition = function (position) {
            var list = _reactDom2.default.findDOMNode(_this.refs.itemList);
            ['WebkitTransform', 'MozTransform', 'MsTransform', 'OTransform', 'transform', 'msTransform'].forEach(function (prop) {
                list.style[prop] = (0, _CSSTranslate2.default)(position, _this.props.axis);
            });
        };

        _this.decrement = function (positions) {
            _this.moveTo(_this.state.selectedItem - (typeof positions === 'Number' ? positions : 1));
        };

        _this.increment = function (positions) {
            _this.moveTo(_this.state.selectedItem + (typeof positions === 'Number' ? positions : 1));
        };

        _this.moveTo = function (position) {
            var lastPosition = _this.props.children.length - 1;

            if (position < 0) {
                position = _this.props.infiniteLoop ? lastPosition : 0;
            }

            if (position > lastPosition) {
                position = _this.props.infiniteLoop ? 0 : lastPosition;
            }

            _this.selectItem({
                // if it's not a slider, we don't need to set position here
                selectedItem: position
            });

            // don't reset auto play when stop on hover is enabled, doing so will trigger a call to auto play more than once
            // and will result in the interval function not being cleared correctly.
            if (_this.props.autoPlay && _this.state.isMouseEntered === false) {
                _this.resetAutoPlay();
            }
        };

        _this.changeItem = function (e) {
            var newIndex = e.target.value;

            _this.selectItem({
                selectedItem: newIndex
            });
        };

        _this.selectItem = function (state) {
            _this.setState(state);
            _this.handleOnChange(state.selectedItem, _this.props.children[state.selectedItem]);
        };

        _this.getInitialImage = function () {
            var selectedItem = _this.props.selectedItem;
            var item = _this.refs['item' + selectedItem];
            var images = item && item.getElementsByTagName('img');
            return images && images[selectedItem];
        };

        _this.getVariableImageHeight = function (position) {
            var item = _this.refs['item' + position];
            var images = item && item.getElementsByTagName('img');
            if (_this.state.hasMount && images.length > 0) {
                var image = images[0];

                if (!image.complete) {
                    // if the image is still loading, the size won't be available so we trigger a new render after it's done
                    var onImageLoad = function onImageLoad() {
                        _this.forceUpdate();
                        image.removeEventListener('load', onImageLoad);
                    };

                    image.addEventListener('load', onImageLoad);
                }

                var height = image.clientHeight;
                return height > 0 ? height : null;
            }

            return null;
        };

        _this.state = {
            initialized: false,
            selectedItem: props.selectedItem,
            hasMount: false,
            isMouseEntered: false
        };
        return _this;
    }

    _createClass(Carousel, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.props.children) {
                return;
            }

            this.setupCarousel();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.selectedItem !== this.state.selectedItem) {
                this.updateSizes();
                this.moveTo(nextProps.selectedItem);
            }

            if (nextProps.autoPlay !== this.props.autoPlay) {
                if (nextProps.autoPlay) {
                    this.setupAutoPlay();
                } else {
                    this.destroyAutoPlay();
                }
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            if (!prevProps.children && this.props.children && !this.state.initialized) {
                this.setupCarousel();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.destroyCarousel();
        }
    }, {
        key: 'setupCarousel',
        value: function setupCarousel() {
            this.bindEvents();

            if (this.props.autoPlay) {
                this.setupAutoPlay();
            }

            this.setState({
                initialized: true
            });

            var initialImage = this.getInitialImage();
            if (initialImage) {
                // if it's a carousel of images, we set the mount state after the first image is loaded
                initialImage.addEventListener('load', this.setMountState);
            } else {
                this.setMountState();
            }
        }
    }, {
        key: 'destroyCarousel',
        value: function destroyCarousel() {
            if (this.state.initialized) {
                this.unbindEvents();
                this.destroyAutoPlay();
            }
        }
    }, {
        key: 'setupAutoPlay',
        value: function setupAutoPlay() {
            this.autoPlay();
            var carouselWrapper = this.refs['carouselWrapper'];

            if (this.props.stopOnHover && carouselWrapper) {
                carouselWrapper.addEventListener('mouseenter', this.stopOnHover);
                carouselWrapper.addEventListener('mouseleave', this.startOnLeave);
            }
        }
    }, {
        key: 'destroyAutoPlay',
        value: function destroyAutoPlay() {
            this.clearAutoPlay();
            var carouselWrapper = this.refs['carouselWrapper'];

            if (this.props.stopOnHover && carouselWrapper) {
                carouselWrapper.removeEventListener('mouseenter', this.stopOnHover);
                carouselWrapper.removeEventListener('mouseleave', this.startOnLeave);
            }
        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {
            // as the widths are calculated, we need to resize
            // the carousel when the window is resized
            window.addEventListener("resize", this.updateSizes);
            // issue #2 - image loading smaller
            window.addEventListener("DOMContentLoaded", this.updateSizes);

            if (this.props.useKeyboardArrows) {
                document.addEventListener("keydown", this.navigateWithKeyboard);
            }
        }
    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {
            // removing listeners
            window.removeEventListener("resize", this.updateSizes);
            window.removeEventListener("DOMContentLoaded", this.updateSizes);

            var initialImage = this.getInitialImage();
            if (initialImage) {
                initialImage.removeEventListener("load", this.setMountState);
            }

            if (this.props.useKeyboardArrows) {
                document.removeEventListener("keydown", this.navigateWithKeyboard);
            }
        }
    }, {
        key: 'getPosition',
        value: function getPosition(index) {
            if (this.props.centerMode && this.props.axis === 'horizontal') {
                var currentPosition = -index * this.props.centerSlidePercentage;
                var lastPosition = this.props.children.length - 1;

                if (index && index !== lastPosition) {
                    currentPosition += (100 - this.props.centerSlidePercentage) / 2;
                } else if (index === lastPosition) {
                    currentPosition += 100 - this.props.centerSlidePercentage;
                }

                return currentPosition;
            }

            return -index * 100;
        }
    }, {
        key: 'renderItems',
        value: function renderItems() {
            var _this2 = this;

            return _react2.default.Children.map(this.props.children, function (item, index) {
                var itemClass = _cssClasses2.default.ITEM(true, index === _this2.state.selectedItem);
                var slideProps = {
                    ref: 'item' + index,
                    key: 'itemKey' + index,
                    className: _cssClasses2.default.ITEM(true, index === _this2.state.selectedItem),
                    onClick: _this2.handleClickItem.bind(_this2, index, item)
                };

                if (_this2.props.centerMode && _this2.props.axis === 'horizontal') {
                    slideProps.style = {
                        minWidth: _this2.props.centerSlidePercentage + '%'
                    };
                }

                return _react2.default.createElement(
                    'li',
                    slideProps,
                    item
                );
            });
        }
    }, {
        key: 'renderControls',
        value: function renderControls() {
            var _this3 = this;

            if (!this.props.showIndicators) {
                return null;
            }

            return _react2.default.createElement(
                'ul',
                { className: 'control-dots' },
                _react2.default.Children.map(this.props.children, function (item, index) {
                    return _react2.default.createElement('li', { className: _cssClasses2.default.DOT(index === _this3.state.selectedItem), onClick: _this3.changeItem, value: index, key: index });
                })
            );
        }
    }, {
        key: 'renderStatus',
        value: function renderStatus() {
            if (!this.props.showStatus) {
                return null;
            }

            return _react2.default.createElement(
                'p',
                { className: 'carousel-status' },
                this.props.statusFormatter(this.state.selectedItem + 1, this.props.children.length)
            );
        }
    }, {
        key: 'renderThumbs',
        value: function renderThumbs() {
            if (!this.props.showThumbs || this.props.children.length === 0) {
                return null;
            }

            return _react2.default.createElement(
                _Thumbs2.default,
                { onSelectItem: this.handleClickThumb, selectedItem: this.state.selectedItem, transitionTime: this.props.transitionTime, thumbWidth: this.props.thumbWidth },
                this.props.children
            );
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.props.children || this.props.children.length === 0) {
                return null;
            }

            var itemsLength = this.props.children.length;

            var isHorizontal = this.props.axis === 'horizontal';

            var canShowArrows = this.props.showArrows && itemsLength > 1;

            // show left arrow?
            var hasPrev = canShowArrows && (this.state.selectedItem > 0 || this.props.infiniteLoop);
            // show right arrow
            var hasNext = canShowArrows && (this.state.selectedItem < itemsLength - 1 || this.props.infiniteLoop);
            // obj to hold the transformations and styles
            var itemListStyles = {};

            var currentPosition = this.getPosition(this.state.selectedItem);

            // if 3d is available, let's take advantage of the performance of transform
            var transformProp = (0, _CSSTranslate2.default)(currentPosition + '%', this.props.axis);

            var transitionTime = this.props.transitionTime + 'ms';

            itemListStyles = {
                'WebkitTransform': transformProp,
                'MozTransform': transformProp,
                'MsTransform': transformProp,
                'OTransform': transformProp,
                'transform': transformProp,
                'msTransform': transformProp
            };

            if (!this.state.swiping) {
                itemListStyles = _extends({}, itemListStyles, {
                    'WebkitTransitionDuration': transitionTime,
                    'MozTransitionDuration': transitionTime,
                    'MsTransitionDuration': transitionTime,
                    'OTransitionDuration': transitionTime,
                    'transitionDuration': transitionTime,
                    'msTransitionDuration': transitionTime
                });
            }

            var swiperProps = {
                selectedItem: this.state.selectedItem,
                className: _cssClasses2.default.SLIDER(true, this.state.swiping),
                onSwipeMove: this.onSwipeMove,
                onSwipeStart: this.onSwipeStart,
                onSwipeEnd: this.onSwipeEnd,
                style: itemListStyles,
                tolerance: this.props.swipeScrollTolerance,
                ref: 'itemList'
            };

            var containerStyles = {};

            if (isHorizontal) {
                swiperProps.onSwipeLeft = this.increment;
                swiperProps.onSwipeRight = this.decrement;

                if (this.props.dynamicHeight) {
                    var itemHeight = this.getVariableImageHeight(this.state.selectedItem);
                    swiperProps.style.height = itemHeight || 'auto';
                    containerStyles.height = itemHeight || 'auto';
                }
            } else {
                swiperProps.onSwipeUp = this.props.verticalSwipe === 'natural' ? this.increment : this.decrement;
                swiperProps.onSwipeDown = this.props.verticalSwipe === 'natural' ? this.decrement : this.increment;
                swiperProps.style.height = this.state.itemSize;
                containerStyles.height = this.state.itemSize;
            }

            return _react2.default.createElement(
                'div',
                { className: this.props.className, ref: 'carouselWrapper' },
                _react2.default.createElement(
                    'div',
                    { className: _cssClasses2.default.CAROUSEL(true), style: { width: this.props.width } },
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_PREV(!hasPrev), onClick: this.decrement }),
                    _react2.default.createElement(
                        'div',
                        { className: _cssClasses2.default.WRAPPER(true, this.props.axis), style: containerStyles, ref: 'itemsWrapper' },
                        _react2.default.createElement(
                            _reactEasySwipe2.default,
                            _extends({ tagName: 'ul' }, swiperProps, { allowMouseEvents: this.props.emulateTouch }),
                            this.renderItems()
                        )
                    ),
                    _react2.default.createElement('button', { type: 'button', className: _cssClasses2.default.ARROW_NEXT(!hasNext), onClick: this.increment }),
                    this.renderControls(),
                    this.renderStatus()
                ),
                this.renderThumbs()
            );
        }
    }]);

    return Carousel;
}(_react.Component);

Carousel.displayName = 'Carousel';
Carousel.propTypes = {
    className: _propTypes2.default.string,
    children: _propTypes2.default.node,
    showArrows: _propTypes2.default.bool,
    showStatus: _propTypes2.default.bool,
    showIndicators: _propTypes2.default.bool,
    infiniteLoop: _propTypes2.default.bool,
    showThumbs: _propTypes2.default.bool,
    thumbWidth: _propTypes2.default.number,
    selectedItem: _propTypes2.default.number,
    onClickItem: _propTypes2.default.func.isRequired,
    onClickThumb: _propTypes2.default.func.isRequired,
    onChange: _propTypes2.default.func.isRequired,
    axis: _propTypes2.default.oneOf(['horizontal', 'vertical']),
    verticalSwipe: _propTypes2.default.oneOf(['natural', 'standard']),
    width: customPropTypes.unit,
    useKeyboardArrows: _propTypes2.default.bool,
    autoPlay: _propTypes2.default.bool,
    stopOnHover: _propTypes2.default.bool,
    interval: _propTypes2.default.number,
    transitionTime: _propTypes2.default.number,
    swipeScrollTolerance: _propTypes2.default.number,
    dynamicHeight: _propTypes2.default.bool,
    emulateTouch: _propTypes2.default.bool,
    statusFormatter: _propTypes2.default.func.isRequired,
    centerMode: _propTypes2.default.bool,
    centerSlidePercentage: _propTypes2.default.number
};
Carousel.defaultProps = {
    showIndicators: true,
    showArrows: true,
    showStatus: true,
    showThumbs: true,
    infiniteLoop: false,
    selectedItem: 0,
    axis: 'horizontal',
    verticalSwipe: 'standard',
    width: '100%',
    useKeyboardArrows: false,
    autoPlay: false,
    stopOnHover: true,
    interval: 3000,
    transitionTime: 350,
    swipeScrollTolerance: 5,
    dynamicHeight: false,
    emulateTouch: false,
    onClickItem: noop,
    onClickThumb: noop,
    onChange: noop,
    statusFormatter: defaultStatusFormatter,
    centerMode: false,
    centerSlidePercentage: 80
};
exports.default = Carousel;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(1);
var invariant = __webpack_require__(2);
var warning = __webpack_require__(3);
var assign = __webpack_require__(5);

var ReactPropTypesSecret = __webpack_require__(10);
var checkPropTypes = __webpack_require__(6);

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (true) {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if ("development" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
       true ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
       true ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(0), __webpack_require__(8)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('react'), require('prop-types'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.react, global.propTypes);
    global.reactSwipe = mod.exports;
  }
})(this, function (exports, _react, _propTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.setHasSupportToCaptureOption = setHasSupportToCaptureOption;

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var supportsCaptureOption = false;
  function setHasSupportToCaptureOption(hasSupport) {
    supportsCaptureOption = hasSupport;
  }

  try {
    addEventListener("test", null, Object.defineProperty({}, 'capture', { get: function get() {
        setHasSupportToCaptureOption(true);
      } }));
  } catch (e) {}

  function getSafeEventHandlerOpts() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { capture: true };

    return supportsCaptureOption ? options : options.capture;
  }

  /**
   * [getPosition returns a position element that works for mouse or touch events]
   * @param  {[Event]} event [the received event]
   * @return {[Object]}      [x and y coords]
   */
  function getPosition(event) {
    if ('touches' in event) {
      var _event$touches$ = event.touches[0],
          pageX = _event$touches$.pageX,
          pageY = _event$touches$.pageY;

      return { x: pageX, y: pageY };
    }

    var screenX = event.screenX,
        screenY = event.screenY;

    return { x: screenX, y: screenY };
  }

  var ReactSwipe = function (_Component) {
    _inherits(ReactSwipe, _Component);

    function ReactSwipe() {
      var _ref;

      _classCallCheck(this, ReactSwipe);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var _this = _possibleConstructorReturn(this, (_ref = ReactSwipe.__proto__ || Object.getPrototypeOf(ReactSwipe)).call.apply(_ref, [this].concat(args)));

      _this._handleSwipeStart = _this._handleSwipeStart.bind(_this);
      _this._handleSwipeMove = _this._handleSwipeMove.bind(_this);
      _this._handleSwipeEnd = _this._handleSwipeEnd.bind(_this);

      _this._onMouseDown = _this._onMouseDown.bind(_this);
      _this._onMouseMove = _this._onMouseMove.bind(_this);
      _this._onMouseUp = _this._onMouseUp.bind(_this);
      return _this;
    }

    _createClass(ReactSwipe, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (this.swiper) {
          this.swiper.addEventListener('touchmove', this._handleSwipeMove, getSafeEventHandlerOpts({
            capture: true,
            passive: false
          }));
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.swiper) {
          this.swiper.removeEventListener('touchmove', this._handleSwipeMove, getSafeEventHandlerOpts({
            capture: true,
            passive: false
          }));
        }
      }
    }, {
      key: '_onMouseDown',
      value: function _onMouseDown(event) {
        if (!this.props.allowMouseEvents) {
          return;
        }

        this.mouseDown = true;

        document.addEventListener('mouseup', this._onMouseUp);
        document.addEventListener('mousemove', this._onMouseMove);

        this._handleSwipeStart(event);
      }
    }, {
      key: '_onMouseMove',
      value: function _onMouseMove(event) {
        if (!this.mouseDown) {
          return;
        }

        this._handleSwipeMove(event);
      }
    }, {
      key: '_onMouseUp',
      value: function _onMouseUp(event) {
        this.mouseDown = false;

        document.removeEventListener('mouseup', this._onMouseUp);
        document.removeEventListener('mousemove', this._onMouseMove);

        this._handleSwipeEnd(event);
      }
    }, {
      key: '_handleSwipeStart',
      value: function _handleSwipeStart(event) {
        var _getPosition = getPosition(event),
            x = _getPosition.x,
            y = _getPosition.y;

        this.moveStart = { x: x, y: y };
        this.props.onSwipeStart(event);
      }
    }, {
      key: '_handleSwipeMove',
      value: function _handleSwipeMove(event) {
        var _getPosition2 = getPosition(event),
            x = _getPosition2.x,
            y = _getPosition2.y;

        var deltaX = x - this.moveStart.x;
        var deltaY = y - this.moveStart.y;
        this.moving = true;

        // handling the responsability of cancelling the scroll to
        // the component handling the event
        var shouldPreventDefault = this.props.onSwipeMove({
          x: deltaX,
          y: deltaY
        }, event);

        if (shouldPreventDefault) {
          event.preventDefault();
        }

        this.movePosition = { deltaX: deltaX, deltaY: deltaY };
      }
    }, {
      key: '_handleSwipeEnd',
      value: function _handleSwipeEnd(event) {
        this.props.onSwipeEnd(event);

        var tolerance = this.props.tolerance;


        if (this.moving) {
          if (this.movePosition.deltaX < -tolerance) {
            this.props.onSwipeLeft(1, event);
          } else if (this.movePosition.deltaX > tolerance) {
            this.props.onSwipeRight(1, event);
          }
          if (this.movePosition.deltaY < -tolerance) {
            this.props.onSwipeUp(1, event);
          } else if (this.movePosition.deltaY > tolerance) {
            this.props.onSwipeDown(1, event);
          }
        }

        this.moveStart = null;
        this.moving = false;
        this.movePosition = null;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          this.props.tagName,
          {
            ref: function ref(node) {
              return _this2.swiper = node;
            },
            onMouseDown: this._onMouseDown,
            onTouchStart: this._handleSwipeStart,
            onTouchEnd: this._handleSwipeEnd,
            className: this.props.className,
            style: this.props.style
          },
          this.props.children
        );
      }
    }]);

    return ReactSwipe;
  }(_react.Component);

  ReactSwipe.displayName = 'ReactSwipe';
  ReactSwipe.propTypes = {
    tagName: _propTypes2.default.string,
    className: _propTypes2.default.string,
    style: _propTypes2.default.object,
    children: _propTypes2.default.node,
    allowMouseEvents: _propTypes2.default.bool,
    onSwipeUp: _propTypes2.default.func,
    onSwipeDown: _propTypes2.default.func,
    onSwipeLeft: _propTypes2.default.func,
    onSwipeRight: _propTypes2.default.func,
    onSwipeStart: _propTypes2.default.func,
    onSwipeMove: _propTypes2.default.func,
    onSwipeEnd: _propTypes2.default.func,
    tolerance: _propTypes2.default.number.isRequired
  };
  ReactSwipe.defaultProps = {
    tagName: 'div',
    allowMouseEvents: false,
    onSwipeUp: function onSwipeUp() {},
    onSwipeDown: function onSwipeDown() {},
    onSwipeLeft: function onSwipeLeft() {},
    onSwipeRight: function onSwipeRight() {},
    onSwipeStart: function onSwipeStart() {},
    onSwipeMove: function onSwipeMove() {},
    onSwipeEnd: function onSwipeEnd() {},

    tolerance: 0
  };
  exports.default = ReactSwipe;
});

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var outerWidth = exports.outerWidth = function outerWidth(el) {
	var width = el.offsetWidth;
	var style = getComputedStyle(el);

	width += parseInt(style.marginLeft) + parseInt(style.marginRight);
	return width;
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var unit = exports.unit = function unit(props, propName, componentName) {
    if (!/(pt|px|em|rem|vw|vh|%)$/.test(props[propName])) {
        return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed. It needs to be a size unit like pt, px, em, rem, vw, %');
    }
};

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__App_css__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by saziri on 13/03/2018.
 */



var API = 'http://api.openweathermap.org/data/2.5/weather';

var Weather = function (_Component) {
    _inherits(Weather, _Component);

    function Weather(props) {
        _classCallCheck(this, Weather);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            temperature: "",
            humidite: "",
            vent: "",
            image: "",
            long: "",
            lat: ''
        };
        _this.background = __webpack_require__(67);
        _this.city = props.city;
        return _this;
    }

    Weather.prototype.componentDidMount = function componentDidMount() {
        this.getWeather();
    };

    Weather.prototype.getWeather = function getWeather() {
        var _this2 = this;

        var query = '?q=' + this.city + ',fr&appid=66c5a4a7889ec64b4baf8f8af653e7e9&units=metric';
        fetch(API + query).then(function (response) {
            return response.json();
        }).then(function (data) {
            _this2.setState({
                temperature: Math.round(data.main.temp * 10) / 10,
                humidite: data.main.humidity,
                vent: (data.wind.speed / 1000 * 3600).toFixed(2),
                image: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
                long: data.coord.lon,
                lat: data.coord.lat
            });
        });
    };

    Weather.prototype.render = function render() {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'App', style: { backgroundImage: "url(" + this.background + ")" } },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { style: { backgroundColor: 'blue' }, className: 'header col-offset-1 col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    null,
                    'M\xE9t\xE9o ',
                    this.city,
                    ' '
                ),
                ' ',
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'button',
                    { className: 'refresh fa fa-refresh', onClick: this.getWeather },
                    ' '
                )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { id: 'zone_meteo', className: 'col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-12', id: 'temperature' },
                    'Temp\xE9rature ',
                    this.state.temperature,
                    ' \xB0C'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-12', id: 'humidite' },
                    'Humidite ',
                    this.state.humidite,
                    ' %'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-12' },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('img', { id: 'image', style: { width: "100px" }, alt: 'weather', src: this.state.image })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'div',
                    { className: 'col-12', id: 'vent' },
                    'Vent ',
                    this.state.vent,
                    ' km/h',
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'hidden', id: 'long', value: this.state.long }),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'hidden', id: 'lat', value: this.state.lat })
                )
            )
        );
    };

    return Weather;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Weather);

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYyOTk0Qzc4RTQyNTExRTM4MUYxODdCNUE0NUJGRTU3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYyOTk0Qzc5RTQyNTExRTM4MUYxODdCNUE0NUJGRTU3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTcyRkJDNTVFNDIwMTFFMzgxRjE4N0I1QTQ1QkZFNTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTcyRkJDNTZFNDIwMTFFMzgxRjE4N0I1QTQ1QkZFNTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYG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"

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__App_css__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by saziri on 13/03/2018.
 */



var Plant = function (_Component) {
    _inherits(Plant, _Component);

    function Plant(props) {
        _classCallCheck(this, Plant);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            lastArrosage: props.lastArrosage
        };
        _this.name = props.name;
        _this.id = props.id;
        _this.instruction = props.instruction;
        _this.description = props.description;
        _this.arrose = _this.arrose.bind(_this);
        return _this;
    }

    Plant.prototype.arrose = function arrose() {
        var _this2 = this;

        fetch('plant/arrose', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plant_id: this.id })
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            _this2.setState({
                lastArrosage: data.result.lastArrosage
            });
        });
    };

    Plant.prototype.render = function render() {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'App' },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { style: { backgroundColor: 'green' }, className: 'col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    null,
                    'Plante ',
                    this.name,
                    ' '
                )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'col-12' },
                'Arros\xE9 le : ',
                this.state.lastArrosage
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    null,
                    'Conseils d\'arrosage '
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', null),
                'Nombre arrosage : ',
                this.instruction,
                ' ',
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', null),
                'Dur\xE9e de vie : ',
                this.description,
                ' ',
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('br', null)
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { className: 'col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'button',
                    { className: 'btn btn-default btn-large', onClick: this.arrose, style: { backgroundColor: "#28a745" } },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        'i',
                        { className: 'fa fa-shower' },
                        ' '
                    ),
                    ' Arroser '
                )
            )
        );
    };

    return Plant;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Plant);

/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__App_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__App_css__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by saziri on 13/03/2018.
 */



var API = 'http://127.0.0.1:5000/';

var Bulb = function (_Component) {
    _inherits(Bulb, _Component);

    function Bulb(props) {
        _classCallCheck(this, Bulb);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.bulbOn = __webpack_require__(12);
        _this.bulbOff = __webpack_require__(11);
        _this.state = {
            bulb: _this.bulbOff
        };
        _this.getState = _this.getState.bind(_this);
        _this.toggle = _this.toggle.bind(_this);
        return _this;
    }

    Bulb.prototype.componentDidMount = function componentDidMount() {
        this.getState();
    };

    Bulb.prototype.getState = function getState() {
        var _this2 = this;

        var query = 'getState';
        fetch(API + query).then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log("hello bulb");
            _this2.setState({
                bulb: data.power === "off" ? _this2.bulbOff : _this2.bulbOn
            });
        });
    };

    Bulb.prototype.toggle = function toggle() {
        var _this3 = this;

        var query = 'toggle';
        fetch(API + query).then(function (response) {
            return response.json();
        }).then(function (data) {
            _this3.setState({
                bulb: data.power === "off" ? _this3.bulbOff : _this3.bulbOn
            });
        });
    };

    Bulb.prototype.render = function render() {
        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'div',
            { className: 'App', style: { backgroundColor: "#c435e8" } },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { style: { backgroundColor: 'yellow' }, className: 'header col-offset-1 col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'b',
                    { style: { color: 'black' } },
                    'Ampoule '
                )
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                { id: 'zone_ampoule', className: 'col-12' },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    'button',
                    { className: 'btn', onClick: this.toggle },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('img', { id: 'image', style: { width: "100px" }, alt: 'bulb', src: this.state.bulb })
                )
            )
        );
    };

    return Bulb;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = (Bulb);

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map