"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
			}var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
				var n = t[o][1][e];return s(n ? n : e);
			}, l, l.exports, e, t, n, r);
		}return n[o].exports;
	}var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
		s(r[o]);
	}return s;
})({ 1: [function (require, module, exports) {
		(function (global) {
			global.GoogleMapsLoader = require('google-maps');

			var GoogleMapsLoader = global.GoogleMapsLoader;

			function renderMap() {
				var tiyCincy = {
					lat: 39.1053073,
					lng: -84.5121242
				};

				GoogleMapsLoader.load(function (google) {
					var map = new google.maps.Map(document.getElementById('map'), {
						center: tiyCincy,
						zoom: 15,
						disableDefaultUI: true,
						disableDoubleClickZoom: true,
						scrollwheel: false
					});

					new google.maps.Marker({
						position: tiyCincy,
						map: map
					});
				});
			}

			function initMap() {
				GoogleMapsLoader.KEY = 'AIzaSyBZjNKYJzp1VU407Gah8uOUVHZjC7jLX1U';
				renderMap();
			}

			$(document).ready(initMap);
		}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	}, { "google-maps": 2 }], 2: [function (require, module, exports) {
		(function (root, factory) {

			if (root === null) {
				throw new Error('Google-maps package can be used only in browser');
			}

			if (typeof define === 'function' && define.amd) {
				define(factory);
			} else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
				module.exports = factory();
			} else {
				root.GoogleMapsLoader = factory();
			}
		})(typeof window !== 'undefined' ? window : null, function () {

			'use strict';

			var googleVersion = '3.18';

			var script = null;

			var google = null;

			var loading = false;

			var callbacks = [];

			var onLoadEvents = [];

			var originalCreateLoaderMethod = null;

			var GoogleMapsLoader = {};

			GoogleMapsLoader.URL = 'https://maps.googleapis.com/maps/api/js';

			GoogleMapsLoader.KEY = null;

			GoogleMapsLoader.LIBRARIES = [];

			GoogleMapsLoader.CLIENT = null;

			GoogleMapsLoader.CHANNEL = null;

			GoogleMapsLoader.LANGUAGE = null;

			GoogleMapsLoader.REGION = null;

			GoogleMapsLoader.VERSION = googleVersion;

			GoogleMapsLoader.WINDOW_CALLBACK_NAME = '__google_maps_api_provider_initializator__';

			GoogleMapsLoader._googleMockApiObject = {};

			GoogleMapsLoader.load = function (fn) {
				if (google === null) {
					if (loading === true) {
						if (fn) {
							callbacks.push(fn);
						}
					} else {
						loading = true;

						window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] = function () {
							ready(fn);
						};

						GoogleMapsLoader.createLoader();
					}
				} else if (fn) {
					fn(google);
				}
			};

			GoogleMapsLoader.createLoader = function () {
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = GoogleMapsLoader.createUrl();

				document.body.appendChild(script);
			};

			GoogleMapsLoader.isLoaded = function () {
				return google !== null;
			};

			GoogleMapsLoader.createUrl = function () {
				var url = GoogleMapsLoader.URL;

				url += '?callback=' + GoogleMapsLoader.WINDOW_CALLBACK_NAME;

				if (GoogleMapsLoader.KEY) {
					url += '&key=' + GoogleMapsLoader.KEY;
				}

				if (GoogleMapsLoader.LIBRARIES.length > 0) {
					url += '&libraries=' + GoogleMapsLoader.LIBRARIES.join(',');
				}

				if (GoogleMapsLoader.CLIENT) {
					url += '&client=' + GoogleMapsLoader.CLIENT + '&v=' + GoogleMapsLoader.VERSION;
				}

				if (GoogleMapsLoader.CHANNEL) {
					url += '&channel=' + GoogleMapsLoader.CHANNEL;
				}

				if (GoogleMapsLoader.LANGUAGE) {
					url += '&language=' + GoogleMapsLoader.LANGUAGE;
				}

				if (GoogleMapsLoader.REGION) {
					url += '&region=' + GoogleMapsLoader.REGION;
				}

				return url;
			};

			GoogleMapsLoader.release = function (fn) {
				var release = function release() {
					GoogleMapsLoader.KEY = null;
					GoogleMapsLoader.LIBRARIES = [];
					GoogleMapsLoader.CLIENT = null;
					GoogleMapsLoader.CHANNEL = null;
					GoogleMapsLoader.LANGUAGE = null;
					GoogleMapsLoader.REGION = null;
					GoogleMapsLoader.VERSION = googleVersion;

					google = null;
					loading = false;
					callbacks = [];
					onLoadEvents = [];

					if (typeof window.google !== 'undefined') {
						delete window.google;
					}

					if (typeof window[GoogleMapsLoader.WINDOW_CALLBACK_NAME] !== 'undefined') {
						delete window[GoogleMapsLoader.WINDOW_CALLBACK_NAME];
					}

					if (originalCreateLoaderMethod !== null) {
						GoogleMapsLoader.createLoader = originalCreateLoaderMethod;
						originalCreateLoaderMethod = null;
					}

					if (script !== null) {
						script.parentElement.removeChild(script);
						script = null;
					}

					if (fn) {
						fn();
					}
				};

				if (loading) {
					GoogleMapsLoader.load(function () {
						release();
					});
				} else {
					release();
				}
			};

			GoogleMapsLoader.onLoad = function (fn) {
				onLoadEvents.push(fn);
			};

			GoogleMapsLoader.makeMock = function () {
				originalCreateLoaderMethod = GoogleMapsLoader.createLoader;

				GoogleMapsLoader.createLoader = function () {
					window.google = GoogleMapsLoader._googleMockApiObject;
					window[GoogleMapsLoader.WINDOW_CALLBACK_NAME]();
				};
			};

			var ready = function ready(fn) {
				var i;

				loading = false;

				if (google === null) {
					google = window.google;
				}

				for (i = 0; i < onLoadEvents.length; i++) {
					onLoadEvents[i](google);
				}

				if (fn) {
					fn(google);
				}

				for (i = 0; i < callbacks.length; i++) {
					callbacks[i](google);
				}

				callbacks = [];
			};

			return GoogleMapsLoader;
		});
	}, {}] }, {}, [1]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zY3JpcHRzL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9tYXAuanMiLCJhcHAvc2NyaXB0cy9hcHAvc2NyaXB0cy9tYXAuanMiLCJhcHAvc2NyaXB0cy9ub2RlX21vZHVsZXMvZ29vZ2xlLW1hcHMvbGliL0dvb2dsZS5qcyJdLCJuYW1lcyI6WyJlIiwidCIsIm4iLCJyIiwicyIsIm8iLCJ1IiwiYSIsInJlcXVpcmUiLCJpIiwiZiIsIkVycm9yIiwiY29kZSIsImwiLCJleHBvcnRzIiwiY2FsbCIsImxlbmd0aCIsIm1vZHVsZSIsImdsb2JhbCIsIkdvb2dsZU1hcHNMb2FkZXIiLCJyZW5kZXJNYXAiLCJ0aXlDaW5jeSIsImxhdCIsImxuZyIsImxvYWQiLCJtYXAiLCJnb29nbGUiLCJtYXBzIiwiTWFwIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNlbnRlciIsInpvb20iLCJkaXNhYmxlRGVmYXVsdFVJIiwiZGlzYWJsZURvdWJsZUNsaWNrWm9vbSIsInNjcm9sbHdoZWVsIiwiTWFya2VyIiwicG9zaXRpb24iLCJpbml0TWFwIiwiS0VZIiwiJCIsInJlYWR5Iiwic2VsZiIsIndpbmRvdyIsInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiZ29vZ2xlVmVyc2lvbiIsInNjcmlwdCIsImxvYWRpbmciLCJjYWxsYmFja3MiLCJvbkxvYWRFdmVudHMiLCJvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZCIsIlVSTCIsIkxJQlJBUklFUyIsIkNMSUVOVCIsIkNIQU5ORUwiLCJMQU5HVUFHRSIsIlJFR0lPTiIsIlZFUlNJT04iLCJXSU5ET1dfQ0FMTEJBQ0tfTkFNRSIsIl9nb29nbGVNb2NrQXBpT2JqZWN0IiwiZm4iLCJwdXNoIiwiY3JlYXRlTG9hZGVyIiwiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJzcmMiLCJjcmVhdGVVcmwiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJpc0xvYWRlZCIsInVybCIsImpvaW4iLCJyZWxlYXNlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwib25Mb2FkIiwibWFrZU1vY2siXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxDQUFBLFNBQUFBLENBQUEsQ0FBQUMsQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUEsRUFBQTtBQUFBLFVBQUFDLENBQUEsQ0FBQUMsQ0FBQSxFQUFBQyxDQUFBLEVBQUE7QUFBQSxNQUFBLENBQUFKLEVBQUFHLENBQUEsQ0FBQSxFQUFBO0FBQUEsT0FBQSxDQUFBSixFQUFBSSxDQUFBLENBQUEsRUFBQTtBQUFBLFFBQUFFLElBQUEsT0FBQUMsT0FBQSxJQUFBLFVBQUEsSUFBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQUYsQ0FBQSxJQUFBQyxDQUFBLEVBQUEsT0FBQUEsRUFBQUYsQ0FBQSxFQUFBLENBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQUksQ0FBQSxFQUFBLE9BQUFBLEVBQUFKLENBQUEsRUFBQSxDQUFBLENBQUEsQ0FBQSxDQUFBLElBQUFLLElBQUEsSUFBQUMsS0FBQSxDQUFBLHlCQUFBTixDQUFBLEdBQUEsR0FBQSxDQUFBLENBQUEsTUFBQUssRUFBQUUsSUFBQSxHQUFBLGtCQUFBLEVBQUFGLENBQUE7QUFBQSxRQUFBRyxJQUFBWCxFQUFBRyxDQUFBLElBQUEsRUFBQVMsU0FBQSxFQUFBLEVBQUEsQ0FBQWIsRUFBQUksQ0FBQSxFQUFBLENBQUEsRUFBQVUsSUFBQSxDQUFBRixFQUFBQyxPQUFBLEVBQUEsVUFBQWQsQ0FBQSxFQUFBO0FBQUEsUUFBQUUsSUFBQUQsRUFBQUksQ0FBQSxFQUFBLENBQUEsRUFBQUwsQ0FBQSxDQUFBLENBQUEsT0FBQUksRUFBQUYsSUFBQUEsQ0FBQSxHQUFBRixDQUFBLENBQUE7QUFBQSxJQUFBLEVBQUFhLENBQUEsRUFBQUEsRUFBQUMsT0FBQSxFQUFBZCxDQUFBLEVBQUFDLENBQUEsRUFBQUMsQ0FBQSxFQUFBQyxDQUFBO0FBQUEsVUFBQUQsRUFBQUcsQ0FBQSxFQUFBUyxPQUFBO0FBQUEsTUFBQUwsSUFBQSxPQUFBRCxPQUFBLElBQUEsVUFBQSxJQUFBQSxPQUFBLENBQUEsS0FBQSxJQUFBSCxJQUFBLENBQUEsRUFBQUEsSUFBQUYsRUFBQWEsTUFBQSxFQUFBWCxHQUFBO0FBQUFELElBQUFELEVBQUFFLENBQUEsQ0FBQTtBQUFBLEVBQUEsT0FBQUQsQ0FBQTtBQUFBLENBQUEsRUFBQSxFQUFBLEdBQUEsQ0FBQSxVQUFBSSxPQUFBLEVBQUFTLE1BQUEsRUFBQUgsT0FBQSxFQUFBO0FDQ0EsR0FBQyxVQUFVSSxNQUFWLEVBQWlCO0FDRGxCQSxVQUFBQyxnQkFBQSxHQUFBWCxRQUFBLGFBQUEsQ0FBQTs7QUFFQSxPQUFBVyxtQkFBQUQsT0FBQUMsZ0JBQUE7O0FBRUEsWUFBQUMsU0FBQSxHQUFBO0FBQ0EsUUFBQUMsV0FBQTtBQUNBQyxVQUFBLFVBREE7QUFFQUMsVUFBQSxDQUFBO0FBRkEsS0FBQTs7QUFLQUoscUJBQUFLLElBQUEsQ0FBQSxrQkFBQTtBQUNBLFNBQUFDLE1BQUEsSUFBQUMsT0FBQUMsSUFBQSxDQUFBQyxHQUFBLENBQUFDLFNBQUFDLGNBQUEsQ0FBQSxLQUFBLENBQUEsRUFBQTtBQUNBQyxjQUFBVixRQURBO0FBRUFXLFlBQUEsRUFGQTtBQUdBQyx3QkFBQSxJQUhBO0FBSUFDLDhCQUFBLElBSkE7QUFLQUMsbUJBQUE7QUFMQSxNQUFBLENBQUE7O0FBUUEsU0FBQVQsT0FBQUMsSUFBQSxDQUFBUyxNQUFBLENBQUE7QUFDQUMsZ0JBQUFoQixRQURBO0FBRUFJO0FBRkEsTUFBQTtBQUlBLEtBYkE7QUFjQTs7QUFFQSxZQUFBYSxPQUFBLEdBQUE7QUFDQW5CLHFCQUFBb0IsR0FBQSxHQUFBLHlDQUFBO0FBQ0FuQjtBQUNBOztBQUVBb0IsS0FBQVgsUUFBQSxFQUFBWSxLQUFBLENBQUFILE9BQUE7QURJQyxHQWxDRCxFQWtDR3ZCLElBbENILENBa0NRLElBbENSLEVBa0NhLE9BQU9HLE1BQVAsS0FBa0IsV0FBbEIsR0FBZ0NBLE1BQWhDLEdBQXlDLE9BQU93QixJQUFQLEtBQWdCLFdBQWhCLEdBQThCQSxJQUE5QixHQUFxQyxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLEdBQWdDQSxNQUFoQyxHQUF5QyxFQWxDcEk7QUFvQ0MsRURyQ0QsRUNxQ0UsRUFBQyxlQUFjLENBQWYsRURyQ0YsQ0FBQSxFQ3FDcUIsR0FBRSxDQUFDLFVBQVNuQyxPQUFULEVBQWlCUyxNQUFqQixFQUF3QkgsT0FBeEIsRUFBZ0M7QUVyQ3hELEdBQUEsVUFBQThCLElBQUEsRUFBQUMsT0FBQSxFQUFBOztBQUVBLE9BQUFELFNBQUEsSUFBQSxFQUFBO0FBQ0EsVUFBQSxJQUFBakMsS0FBQSxDQUFBLGlEQUFBLENBQUE7QUFDQTs7QUFFQSxPQUFBLE9BQUFtQyxNQUFBLEtBQUEsVUFBQSxJQUFBQSxPQUFBQyxHQUFBLEVBQUE7QUFDQUQsV0FBQUQsT0FBQTtBQUNBLElBRkEsTUFFQSxJQUFBLFFBQUEvQixPQUFBLHlDQUFBQSxPQUFBLE9BQUEsUUFBQSxFQUFBO0FBQ0FHLFdBQUFILE9BQUEsR0FBQStCLFNBQUE7QUFDQSxJQUZBLE1BRUE7QUFDQUQsU0FBQXpCLGdCQUFBLEdBQUEwQixTQUFBO0FBQ0E7QUFFQSxHQWRBLEVBY0EsT0FBQUYsTUFBQSxLQUFBLFdBQUEsR0FBQUEsTUFBQSxHQUFBLElBZEEsRUFjQSxZQUFBOztBQUdBOztBQUdBLE9BQUFLLGdCQUFBLE1BQUE7O0FBRUEsT0FBQUMsU0FBQSxJQUFBOztBQUVBLE9BQUF2QixTQUFBLElBQUE7O0FBRUEsT0FBQXdCLFVBQUEsS0FBQTs7QUFFQSxPQUFBQyxZQUFBLEVBQUE7O0FBRUEsT0FBQUMsZUFBQSxFQUFBOztBQUVBLE9BQUFDLDZCQUFBLElBQUE7O0FBR0EsT0FBQWxDLG1CQUFBLEVBQUE7O0FBR0FBLG9CQUFBbUMsR0FBQSxHQUFBLHlDQUFBOztBQUVBbkMsb0JBQUFvQixHQUFBLEdBQUEsSUFBQTs7QUFFQXBCLG9CQUFBb0MsU0FBQSxHQUFBLEVBQUE7O0FBRUFwQyxvQkFBQXFDLE1BQUEsR0FBQSxJQUFBOztBQUVBckMsb0JBQUFzQyxPQUFBLEdBQUEsSUFBQTs7QUFFQXRDLG9CQUFBdUMsUUFBQSxHQUFBLElBQUE7O0FBRUF2QyxvQkFBQXdDLE1BQUEsR0FBQSxJQUFBOztBQUVBeEMsb0JBQUF5QyxPQUFBLEdBQUFaLGFBQUE7O0FBRUE3QixvQkFBQTBDLG9CQUFBLEdBQUEsNENBQUE7O0FBR0ExQyxvQkFBQTJDLG9CQUFBLEdBQUEsRUFBQTs7QUFHQTNDLG9CQUFBSyxJQUFBLEdBQUEsVUFBQXVDLEVBQUEsRUFBQTtBQUNBLFFBQUFyQyxXQUFBLElBQUEsRUFBQTtBQUNBLFNBQUF3QixZQUFBLElBQUEsRUFBQTtBQUNBLFVBQUFhLEVBQUEsRUFBQTtBQUNBWixpQkFBQWEsSUFBQSxDQUFBRCxFQUFBO0FBQ0E7QUFDQSxNQUpBLE1BSUE7QUFDQWIsZ0JBQUEsSUFBQTs7QUFFQVAsYUFBQXhCLGlCQUFBMEMsb0JBQUEsSUFBQSxZQUFBO0FBQ0FwQixhQUFBc0IsRUFBQTtBQUNBLE9BRkE7O0FBSUE1Qyx1QkFBQThDLFlBQUE7QUFDQTtBQUNBLEtBZEEsTUFjQSxJQUFBRixFQUFBLEVBQUE7QUFDQUEsUUFBQXJDLE1BQUE7QUFDQTtBQUNBLElBbEJBOztBQXFCQVAsb0JBQUE4QyxZQUFBLEdBQUEsWUFBQTtBQUNBaEIsYUFBQXBCLFNBQUFxQyxhQUFBLENBQUEsUUFBQSxDQUFBO0FBQ0FqQixXQUFBa0IsSUFBQSxHQUFBLGlCQUFBO0FBQ0FsQixXQUFBbUIsR0FBQSxHQUFBakQsaUJBQUFrRCxTQUFBLEVBQUE7O0FBRUF4QyxhQUFBeUMsSUFBQSxDQUFBQyxXQUFBLENBQUF0QixNQUFBO0FBQ0EsSUFOQTs7QUFTQTlCLG9CQUFBcUQsUUFBQSxHQUFBLFlBQUE7QUFDQSxXQUFBOUMsV0FBQSxJQUFBO0FBQ0EsSUFGQTs7QUFLQVAsb0JBQUFrRCxTQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUFJLE1BQUF0RCxpQkFBQW1DLEdBQUE7O0FBRUFtQixXQUFBLGVBQUF0RCxpQkFBQTBDLG9CQUFBOztBQUVBLFFBQUExQyxpQkFBQW9CLEdBQUEsRUFBQTtBQUNBa0MsWUFBQSxVQUFBdEQsaUJBQUFvQixHQUFBO0FBQ0E7O0FBRUEsUUFBQXBCLGlCQUFBb0MsU0FBQSxDQUFBdkMsTUFBQSxHQUFBLENBQUEsRUFBQTtBQUNBeUQsWUFBQSxnQkFBQXRELGlCQUFBb0MsU0FBQSxDQUFBbUIsSUFBQSxDQUFBLEdBQUEsQ0FBQTtBQUNBOztBQUVBLFFBQUF2RCxpQkFBQXFDLE1BQUEsRUFBQTtBQUNBaUIsWUFBQSxhQUFBdEQsaUJBQUFxQyxNQUFBLEdBQUEsS0FBQSxHQUFBckMsaUJBQUF5QyxPQUFBO0FBQ0E7O0FBRUEsUUFBQXpDLGlCQUFBc0MsT0FBQSxFQUFBO0FBQ0FnQixZQUFBLGNBQUF0RCxpQkFBQXNDLE9BQUE7QUFDQTs7QUFFQSxRQUFBdEMsaUJBQUF1QyxRQUFBLEVBQUE7QUFDQWUsWUFBQSxlQUFBdEQsaUJBQUF1QyxRQUFBO0FBQ0E7O0FBRUEsUUFBQXZDLGlCQUFBd0MsTUFBQSxFQUFBO0FBQ0FjLFlBQUEsYUFBQXRELGlCQUFBd0MsTUFBQTtBQUNBOztBQUVBLFdBQUFjLEdBQUE7QUFDQSxJQTlCQTs7QUFpQ0F0RCxvQkFBQXdELE9BQUEsR0FBQSxVQUFBWixFQUFBLEVBQUE7QUFDQSxRQUFBWSxVQUFBLFNBQUFBLE9BQUEsR0FBQTtBQUNBeEQsc0JBQUFvQixHQUFBLEdBQUEsSUFBQTtBQUNBcEIsc0JBQUFvQyxTQUFBLEdBQUEsRUFBQTtBQUNBcEMsc0JBQUFxQyxNQUFBLEdBQUEsSUFBQTtBQUNBckMsc0JBQUFzQyxPQUFBLEdBQUEsSUFBQTtBQUNBdEMsc0JBQUF1QyxRQUFBLEdBQUEsSUFBQTtBQUNBdkMsc0JBQUF3QyxNQUFBLEdBQUEsSUFBQTtBQUNBeEMsc0JBQUF5QyxPQUFBLEdBQUFaLGFBQUE7O0FBRUF0QixjQUFBLElBQUE7QUFDQXdCLGVBQUEsS0FBQTtBQUNBQyxpQkFBQSxFQUFBO0FBQ0FDLG9CQUFBLEVBQUE7O0FBRUEsU0FBQSxPQUFBVCxPQUFBakIsTUFBQSxLQUFBLFdBQUEsRUFBQTtBQUNBLGFBQUFpQixPQUFBakIsTUFBQTtBQUNBOztBQUVBLFNBQUEsT0FBQWlCLE9BQUF4QixpQkFBQTBDLG9CQUFBLENBQUEsS0FBQSxXQUFBLEVBQUE7QUFDQSxhQUFBbEIsT0FBQXhCLGlCQUFBMEMsb0JBQUEsQ0FBQTtBQUNBOztBQUVBLFNBQUFSLCtCQUFBLElBQUEsRUFBQTtBQUNBbEMsdUJBQUE4QyxZQUFBLEdBQUFaLDBCQUFBO0FBQ0FBLG1DQUFBLElBQUE7QUFDQTs7QUFFQSxTQUFBSixXQUFBLElBQUEsRUFBQTtBQUNBQSxhQUFBMkIsYUFBQSxDQUFBQyxXQUFBLENBQUE1QixNQUFBO0FBQ0FBLGVBQUEsSUFBQTtBQUNBOztBQUVBLFNBQUFjLEVBQUEsRUFBQTtBQUNBQTtBQUNBO0FBQ0EsS0FuQ0E7O0FBcUNBLFFBQUFiLE9BQUEsRUFBQTtBQUNBL0Isc0JBQUFLLElBQUEsQ0FBQSxZQUFBO0FBQ0FtRDtBQUNBLE1BRkE7QUFHQSxLQUpBLE1BSUE7QUFDQUE7QUFDQTtBQUNBLElBN0NBOztBQWdEQXhELG9CQUFBMkQsTUFBQSxHQUFBLFVBQUFmLEVBQUEsRUFBQTtBQUNBWCxpQkFBQVksSUFBQSxDQUFBRCxFQUFBO0FBQ0EsSUFGQTs7QUFLQTVDLG9CQUFBNEQsUUFBQSxHQUFBLFlBQUE7QUFDQTFCLGlDQUFBbEMsaUJBQUE4QyxZQUFBOztBQUVBOUMscUJBQUE4QyxZQUFBLEdBQUEsWUFBQTtBQUNBdEIsWUFBQWpCLE1BQUEsR0FBQVAsaUJBQUEyQyxvQkFBQTtBQUNBbkIsWUFBQXhCLGlCQUFBMEMsb0JBQUE7QUFDQSxLQUhBO0FBSUEsSUFQQTs7QUFVQSxPQUFBcEIsUUFBQSxTQUFBQSxLQUFBLENBQUFzQixFQUFBLEVBQUE7QUFDQSxRQUFBdEQsQ0FBQTs7QUFFQXlDLGNBQUEsS0FBQTs7QUFFQSxRQUFBeEIsV0FBQSxJQUFBLEVBQUE7QUFDQUEsY0FBQWlCLE9BQUFqQixNQUFBO0FBQ0E7O0FBRUEsU0FBQWpCLElBQUEsQ0FBQSxFQUFBQSxJQUFBMkMsYUFBQXBDLE1BQUEsRUFBQVAsR0FBQSxFQUFBO0FBQ0EyQyxrQkFBQTNDLENBQUEsRUFBQWlCLE1BQUE7QUFDQTs7QUFFQSxRQUFBcUMsRUFBQSxFQUFBO0FBQ0FBLFFBQUFyQyxNQUFBO0FBQ0E7O0FBRUEsU0FBQWpCLElBQUEsQ0FBQSxFQUFBQSxJQUFBMEMsVUFBQW5DLE1BQUEsRUFBQVAsR0FBQSxFQUFBO0FBQ0EwQyxlQUFBMUMsQ0FBQSxFQUFBaUIsTUFBQTtBQUNBOztBQUVBeUIsZ0JBQUEsRUFBQTtBQUNBLElBdEJBOztBQXlCQSxVQUFBaEMsZ0JBQUE7QUFFQSxHQTFOQTtBRmtRQyxFQTdOc0IsRUE2TnJCLEVBN05xQixDRHJDdkIsRUFBQSxFQ2tRTyxFRGxRUCxFQ2tRVSxDQUFDLENBQUQsQ0RsUVYiLCJmaWxlIjoiYXBwL3NjcmlwdHMvbWFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24gKGdsb2JhbCl7XG5nbG9iYWwuR29vZ2xlTWFwc0xvYWRlciA9IHJlcXVpcmUoJ2dvb2dsZS1tYXBzJyk7XG5cbmNvbnN0IEdvb2dsZU1hcHNMb2FkZXIgPSBnbG9iYWwuR29vZ2xlTWFwc0xvYWRlcjtcblxuZnVuY3Rpb24gcmVuZGVyTWFwKCkge1xuICBjb25zdCB0aXlDaW5jeSA9IHtcbiAgICBsYXQ6IDM5LjEwNTMwNzMsXG4gICAgbG5nOiAtODQuNTEyMTI0MlxuICB9O1xuXG4gIEdvb2dsZU1hcHNMb2FkZXIubG9hZChnb29nbGUgPT4ge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICBjZW50ZXI6IHRpeUNpbmN5LFxuICAgICAgem9vbTogMTUsXG4gICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlLFxuICAgICAgZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogdHJ1ZSxcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBwb3NpdGlvbjogdGl5Q2luY3ksXG4gICAgICBtYXBcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gIEdvb2dsZU1hcHNMb2FkZXIuS0VZID0gJ0FJemFTeUJaak5LWUp6cDFWVTQwN0dhaDh1T1VWSFpqQzdqTFgxVSc7XG4gIHJlbmRlck1hcCgpO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShpbml0TWFwKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG5cbn0se1wiZ29vZ2xlLW1hcHNcIjoyfV0sMjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuXG5cdGlmIChyb290ID09PSBudWxsKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdHb29nbGUtbWFwcyBwYWNrYWdlIGNhbiBiZSB1c2VkIG9ubHkgaW4gYnJvd3NlcicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHRyb290Lkdvb2dsZU1hcHNMb2FkZXIgPSBmYWN0b3J5KCk7XG5cdH1cblxufSkodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBudWxsLCBmdW5jdGlvbigpIHtcblxuXG5cdCd1c2Ugc3RyaWN0JztcblxuXG5cdHZhciBnb29nbGVWZXJzaW9uID0gJzMuMTgnO1xuXG5cdHZhciBzY3JpcHQgPSBudWxsO1xuXG5cdHZhciBnb29nbGUgPSBudWxsO1xuXG5cdHZhciBsb2FkaW5nID0gZmFsc2U7XG5cblx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuXG5cdHZhciBvbkxvYWRFdmVudHMgPSBbXTtcblxuXHR2YXIgb3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgPSBudWxsO1xuXG5cblx0dmFyIEdvb2dsZU1hcHNMb2FkZXIgPSB7fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuVVJMID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcyc7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5LRVkgPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTID0gW107XG5cblx0R29vZ2xlTWFwc0xvYWRlci5DTElFTlQgPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTCA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5MQU5HVUFHRSA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5SRUdJT04gPSBudWxsO1xuXG5cdEdvb2dsZU1hcHNMb2FkZXIuVkVSU0lPTiA9IGdvb2dsZVZlcnNpb247XG5cblx0R29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRSA9ICdfX2dvb2dsZV9tYXBzX2FwaV9wcm92aWRlcl9pbml0aWFsaXphdG9yX18nO1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5fZ29vZ2xlTW9ja0FwaU9iamVjdCA9IHt9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5sb2FkID0gZnVuY3Rpb24oZm4pIHtcblx0XHRpZiAoZ29vZ2xlID09PSBudWxsKSB7XG5cdFx0XHRpZiAobG9hZGluZyA9PT0gdHJ1ZSkge1xuXHRcdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChmbik7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0XHRcdHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHJlYWR5KGZuKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlcigpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoZm4pIHtcblx0XHRcdGZuKGdvb2dsZSk7XG5cdFx0fVxuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXIgPSBmdW5jdGlvbigpIHtcblx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblx0XHRzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuXHRcdHNjcmlwdC5zcmMgPSBHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZVVybCgpO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5pc0xvYWRlZCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBnb29nbGUgIT09IG51bGw7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZVVybCA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB1cmwgPSBHb29nbGVNYXBzTG9hZGVyLlVSTDtcblxuXHRcdHVybCArPSAnP2NhbGxiYWNrPScgKyBHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FO1xuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuS0VZKSB7XG5cdFx0XHR1cmwgKz0gJyZrZXk9JyArIEdvb2dsZU1hcHNMb2FkZXIuS0VZO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkxJQlJBUklFUy5sZW5ndGggPiAwKSB7XG5cdFx0XHR1cmwgKz0gJyZsaWJyYXJpZXM9JyArIEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTLmpvaW4oJywnKTtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5DTElFTlQpIHtcblx0XHRcdHVybCArPSAnJmNsaWVudD0nICsgR29vZ2xlTWFwc0xvYWRlci5DTElFTlQgKyAnJnY9JyArIEdvb2dsZU1hcHNMb2FkZXIuVkVSU0lPTjtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMKSB7XG5cdFx0XHR1cmwgKz0gJyZjaGFubmVsPScgKyBHb29nbGVNYXBzTG9hZGVyLkNIQU5ORUw7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0UpIHtcblx0XHRcdHVybCArPSAnJmxhbmd1YWdlPScgKyBHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLlJFR0lPTikge1xuXHRcdFx0dXJsICs9ICcmcmVnaW9uPScgKyBHb29nbGVNYXBzTG9hZGVyLlJFR0lPTjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5yZWxlYXNlID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgcmVsZWFzZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5LRVkgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMgPSBbXTtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuQ0xJRU5UID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTCA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuVkVSU0lPTiA9IGdvb2dsZVZlcnNpb247XG5cblx0XHRcdGdvb2dsZSA9IG51bGw7XG5cdFx0XHRsb2FkaW5nID0gZmFsc2U7XG5cdFx0XHRjYWxsYmFja3MgPSBbXTtcblx0XHRcdG9uTG9hZEV2ZW50cyA9IFtdO1xuXG5cdFx0XHRpZiAodHlwZW9mIHdpbmRvdy5nb29nbGUgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRlbGV0ZSB3aW5kb3cuZ29vZ2xlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodHlwZW9mIHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZGVsZXRlIHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kICE9PSBudWxsKSB7XG5cdFx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyID0gb3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2Q7XG5cdFx0XHRcdG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHNjcmlwdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRzY3JpcHQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXHRcdFx0XHRzY3JpcHQgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZm4pIHtcblx0XHRcdFx0Zm4oKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aWYgKGxvYWRpbmcpIHtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIubG9hZChmdW5jdGlvbigpIHtcblx0XHRcdFx0cmVsZWFzZSgpO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbGVhc2UoKTtcblx0XHR9XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLm9uTG9hZCA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0b25Mb2FkRXZlbnRzLnB1c2goZm4pO1xuXHR9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5tYWtlTW9jayA9IGZ1bmN0aW9uKCkge1xuXHRcdG9yaWdpbmFsQ3JlYXRlTG9hZGVyTWV0aG9kID0gR29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXI7XG5cblx0XHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luZG93Lmdvb2dsZSA9IEdvb2dsZU1hcHNMb2FkZXIuX2dvb2dsZU1vY2tBcGlPYmplY3Q7XG5cdFx0XHR3aW5kb3dbR29vZ2xlTWFwc0xvYWRlci5XSU5ET1dfQ0FMTEJBQ0tfTkFNRV0oKTtcblx0XHR9O1xuXHR9O1xuXG5cblx0dmFyIHJlYWR5ID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgaTtcblxuXHRcdGxvYWRpbmcgPSBmYWxzZTtcblxuXHRcdGlmIChnb29nbGUgPT09IG51bGwpIHtcblx0XHRcdGdvb2dsZSA9IHdpbmRvdy5nb29nbGU7XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IG9uTG9hZEV2ZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0b25Mb2FkRXZlbnRzW2ldKGdvb2dsZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGZuKSB7XG5cdFx0XHRmbihnb29nbGUpO1xuXHRcdH1cblxuXHRcdGZvciAoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNhbGxiYWNrc1tpXShnb29nbGUpO1xuXHRcdH1cblxuXHRcdGNhbGxiYWNrcyA9IFtdO1xuXHR9O1xuXG5cblx0cmV0dXJuIEdvb2dsZU1hcHNMb2FkZXI7XG5cbn0pO1xuXG59LHt9XX0se30sWzFdKVxuXG4iLCJnbG9iYWwuR29vZ2xlTWFwc0xvYWRlciA9IHJlcXVpcmUoJ2dvb2dsZS1tYXBzJyk7XG5cbmNvbnN0IEdvb2dsZU1hcHNMb2FkZXIgPSBnbG9iYWwuR29vZ2xlTWFwc0xvYWRlcjtcblxuZnVuY3Rpb24gcmVuZGVyTWFwKCkge1xuICBjb25zdCB0aXlDaW5jeSA9IHtcbiAgICBsYXQ6IDM5LjEwNTMwNzMsXG4gICAgbG5nOiAtODQuNTEyMTI0MlxuICB9O1xuXG4gIEdvb2dsZU1hcHNMb2FkZXIubG9hZChnb29nbGUgPT4ge1xuICAgIGNvbnN0IG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICBjZW50ZXI6IHRpeUNpbmN5LFxuICAgICAgem9vbTogMTUsXG4gICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlLFxuICAgICAgZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogdHJ1ZSxcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBwb3NpdGlvbjogdGl5Q2luY3ksXG4gICAgICBtYXBcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gIEdvb2dsZU1hcHNMb2FkZXIuS0VZID0gJ0FJemFTeUJaak5LWUp6cDFWVTQwN0dhaDh1T1VWSFpqQzdqTFgxVSc7XG4gIHJlbmRlck1hcCgpO1xufVxuXG4kKGRvY3VtZW50KS5yZWFkeShpbml0TWFwKTtcbiIsIihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG5cblx0aWYgKHJvb3QgPT09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0dvb2dsZS1tYXBzIHBhY2thZ2UgY2FuIGJlIHVzZWQgb25seSBpbiBicm93c2VyJyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0ZGVmaW5lKGZhY3RvcnkpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9IGVsc2Uge1xuXHRcdHJvb3QuR29vZ2xlTWFwc0xvYWRlciA9IGZhY3RvcnkoKTtcblx0fVxuXG59KSh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IG51bGwsIGZ1bmN0aW9uKCkge1xuXG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cblx0dmFyIGdvb2dsZVZlcnNpb24gPSAnMy4xOCc7XG5cblx0dmFyIHNjcmlwdCA9IG51bGw7XG5cblx0dmFyIGdvb2dsZSA9IG51bGw7XG5cblx0dmFyIGxvYWRpbmcgPSBmYWxzZTtcblxuXHR2YXIgY2FsbGJhY2tzID0gW107XG5cblx0dmFyIG9uTG9hZEV2ZW50cyA9IFtdO1xuXG5cdHZhciBvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZCA9IG51bGw7XG5cblxuXHR2YXIgR29vZ2xlTWFwc0xvYWRlciA9IHt9O1xuXG5cblx0R29vZ2xlTWFwc0xvYWRlci5VUkwgPSAnaHR0cHM6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzJztcblxuXHRHb29nbGVNYXBzTG9hZGVyLktFWSA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMgPSBbXTtcblxuXHRHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLkxBTkdVQUdFID0gbnVsbDtcblxuXHRHb29nbGVNYXBzTG9hZGVyLlJFR0lPTiA9IG51bGw7XG5cblx0R29vZ2xlTWFwc0xvYWRlci5WRVJTSU9OID0gZ29vZ2xlVmVyc2lvbjtcblxuXHRHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FID0gJ19fZ29vZ2xlX21hcHNfYXBpX3Byb3ZpZGVyX2luaXRpYWxpemF0b3JfXyc7XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLl9nb29nbGVNb2NrQXBpT2JqZWN0ID0ge307XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmxvYWQgPSBmdW5jdGlvbihmbikge1xuXHRcdGlmIChnb29nbGUgPT09IG51bGwpIHtcblx0XHRcdGlmIChsb2FkaW5nID09PSB0cnVlKSB7XG5cdFx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGZuKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9hZGluZyA9IHRydWU7XG5cblx0XHRcdFx0d2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0cmVhZHkoZm4pO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChmbikge1xuXHRcdFx0Zm4oZ29vZ2xlKTtcblx0XHR9XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlciA9IGZ1bmN0aW9uKCkge1xuXHRcdHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuXHRcdHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG5cdFx0c2NyaXB0LnNyYyA9IEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlVXJsKCk7XG5cblx0XHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLmlzTG9hZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGdvb2dsZSAhPT0gbnVsbDtcblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlVXJsID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHVybCA9IEdvb2dsZU1hcHNMb2FkZXIuVVJMO1xuXG5cdFx0dXJsICs9ICc/Y2FsbGJhY2s9JyArIEdvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUU7XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5LRVkpIHtcblx0XHRcdHVybCArPSAnJmtleT0nICsgR29vZ2xlTWFwc0xvYWRlci5LRVk7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuTElCUkFSSUVTLmxlbmd0aCA+IDApIHtcblx0XHRcdHVybCArPSAnJmxpYnJhcmllcz0nICsgR29vZ2xlTWFwc0xvYWRlci5MSUJSQVJJRVMuam9pbignLCcpO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCkge1xuXHRcdFx0dXJsICs9ICcmY2xpZW50PScgKyBHb29nbGVNYXBzTG9hZGVyLkNMSUVOVCArICcmdj0nICsgR29vZ2xlTWFwc0xvYWRlci5WRVJTSU9OO1xuXHRcdH1cblxuXHRcdGlmIChHb29nbGVNYXBzTG9hZGVyLkNIQU5ORUwpIHtcblx0XHRcdHVybCArPSAnJmNoYW5uZWw9JyArIEdvb2dsZU1hcHNMb2FkZXIuQ0hBTk5FTDtcblx0XHR9XG5cblx0XHRpZiAoR29vZ2xlTWFwc0xvYWRlci5MQU5HVUFHRSkge1xuXHRcdFx0dXJsICs9ICcmbGFuZ3VhZ2U9JyArIEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0U7XG5cdFx0fVxuXG5cdFx0aWYgKEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OKSB7XG5cdFx0XHR1cmwgKz0gJyZyZWdpb249JyArIEdvb2dsZU1hcHNMb2FkZXIuUkVHSU9OO1xuXHRcdH1cblxuXHRcdHJldHVybiB1cmw7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLnJlbGVhc2UgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciByZWxlYXNlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLktFWSA9IG51bGw7XG5cdFx0XHRHb29nbGVNYXBzTG9hZGVyLkxJQlJBUklFUyA9IFtdO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5DTElFTlQgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5DSEFOTkVMID0gbnVsbDtcblx0XHRcdEdvb2dsZU1hcHNMb2FkZXIuTEFOR1VBR0UgPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5SRUdJT04gPSBudWxsO1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5WRVJTSU9OID0gZ29vZ2xlVmVyc2lvbjtcblxuXHRcdFx0Z29vZ2xlID0gbnVsbDtcblx0XHRcdGxvYWRpbmcgPSBmYWxzZTtcblx0XHRcdGNhbGxiYWNrcyA9IFtdO1xuXHRcdFx0b25Mb2FkRXZlbnRzID0gW107XG5cblx0XHRcdGlmICh0eXBlb2Ygd2luZG93Lmdvb2dsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZGVsZXRlIHdpbmRvdy5nb29nbGU7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2Ygd2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdICE9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkZWxldGUgd2luZG93W0dvb2dsZU1hcHNMb2FkZXIuV0lORE9XX0NBTExCQUNLX05BTUVdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgIT09IG51bGwpIHtcblx0XHRcdFx0R29vZ2xlTWFwc0xvYWRlci5jcmVhdGVMb2FkZXIgPSBvcmlnaW5hbENyZWF0ZUxvYWRlck1ldGhvZDtcblx0XHRcdFx0b3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgPSBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2NyaXB0ICE9PSBudWxsKSB7XG5cdFx0XHRcdHNjcmlwdC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHNjcmlwdCk7XG5cdFx0XHRcdHNjcmlwdCA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmbikge1xuXHRcdFx0XHRmbigpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAobG9hZGluZykge1xuXHRcdFx0R29vZ2xlTWFwc0xvYWRlci5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZWxlYXNlKCk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVsZWFzZSgpO1xuXHRcdH1cblx0fTtcblxuXG5cdEdvb2dsZU1hcHNMb2FkZXIub25Mb2FkID0gZnVuY3Rpb24oZm4pIHtcblx0XHRvbkxvYWRFdmVudHMucHVzaChmbik7XG5cdH07XG5cblxuXHRHb29nbGVNYXBzTG9hZGVyLm1ha2VNb2NrID0gZnVuY3Rpb24oKSB7XG5cdFx0b3JpZ2luYWxDcmVhdGVMb2FkZXJNZXRob2QgPSBHb29nbGVNYXBzTG9hZGVyLmNyZWF0ZUxvYWRlcjtcblxuXHRcdEdvb2dsZU1hcHNMb2FkZXIuY3JlYXRlTG9hZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR3aW5kb3cuZ29vZ2xlID0gR29vZ2xlTWFwc0xvYWRlci5fZ29vZ2xlTW9ja0FwaU9iamVjdDtcblx0XHRcdHdpbmRvd1tHb29nbGVNYXBzTG9hZGVyLldJTkRPV19DQUxMQkFDS19OQU1FXSgpO1xuXHRcdH07XG5cdH07XG5cblxuXHR2YXIgcmVhZHkgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBpO1xuXG5cdFx0bG9hZGluZyA9IGZhbHNlO1xuXG5cdFx0aWYgKGdvb2dsZSA9PT0gbnVsbCkge1xuXHRcdFx0Z29vZ2xlID0gd2luZG93Lmdvb2dsZTtcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgb25Mb2FkRXZlbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRvbkxvYWRFdmVudHNbaV0oZ29vZ2xlKTtcblx0XHR9XG5cblx0XHRpZiAoZm4pIHtcblx0XHRcdGZuKGdvb2dsZSk7XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y2FsbGJhY2tzW2ldKGdvb2dsZSk7XG5cdFx0fVxuXG5cdFx0Y2FsbGJhY2tzID0gW107XG5cdH07XG5cblxuXHRyZXR1cm4gR29vZ2xlTWFwc0xvYWRlcjtcblxufSk7XG4iXX0=
