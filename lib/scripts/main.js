
var app = angular.module('app', []);

app.filter('log', function () {
	return function (logData) {
		var finalLog = '';
		for (var i=0; i<arguments[0].length; i++) {
			var arg = arguments[0][i];
			switch (typeof arg) {
				case 'string':
					finalLog += ' ' + arg;
				break;
				case 'number':
					finalLog += ' ' + JSON.stringify(arg);
				break;
				default:
					var x;
					try {
						x = JSON.stringify(arg);
					} catch (error) {
						x = arg;
					}
					finalLog += ' ' + x;
				break;
			}
		}
		return finalLog;
	}
})

app.controller('mainController', function ($scope) {
	
	// Attributes
		$scope.iframe;
		$scope.logs;
		$scope.availableMethods;

	// Methods
		$scope.constructor = function () {
			$scope.logs = [];
			$scope.availableMethods = {
				log: {
					fntColor: '#000000',
					bgColor: '#FFFFFF'
				},
				warn: {
					fntColor: '#000000',
					bgColor: '#ffe28b'
				},
				error: {
					fntColor: '#000000',
					bgColor: '#ff8b8b'
				},
				info: {
					fntColor: '#1b3871',
					bgColor: '#FFFFFF'
				}
			}
			$scope.iframe = document.getElementById('mainIframe');
			$scope.changeIframeSrc(prompt('Type a url to debug'));
		}
		$scope.setupInterceptor = function () {
			var script = document.createElement('script');
			var iframeWindow = $scope.iframe.contentWindow;
			iframeWindow.inspectorFunction = function (method, data) {
				$scope.logs.unshift({
					method: method,
					data: data
				});
				$scope.$apply();
			}
			script.innerHTML = '';
			Object.keys($scope.availableMethods).forEach(function (methodName) {
				script.innerHTML = script.innerHTML + `
					console.`+methodName+` = function () {
						window.inspectorFunction('`+methodName+`', arguments);
					}
				`;
			});
			iframeWindow.document.body.appendChild(script);
		}
		$scope.changeIframeSrc = function (src) {
			if ($scope.iframe) $scope.iframe.src = src;
			setTimeout(function () {
				$scope.setupInterceptor();
			}, 1000);
		}

	// Construct
		$scope.constructor();

});