"use strict";

var Angular = require('angular');
var AngularUIRouter = require('angular-ui-router');
var _ = require('lodash');
var app = angular.module('app', ['ui.router']);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	$urlRouterProvider.otherwise('/todo');
	$stateProvider
		.state('todo', {
			url: '/todo',
			templateUrl: 'views/todo.html',
			controller: 'ListCtrl'
		})
		.state('completed', {
			url: '/completed',
			templateUrl: 'views/completed.html',
			controller: 'ListCtrl'
		})
		.state('""', {
			url: '/todo',
			templateUrl: 'views/completed.html',
			controller: 'ListCtrl'
		})
}]);

// ********************** Factory ********************** //

app.factory('todoFactory', function(){
	var data = {
			todoList: [],
			completedList: [],
			count: 1,
			showDeleteAllTodo: false,
			showDeleteAllCompleted: false,
			submitText: function(inputValue) {
				var newItem = {};
				newItem = {
					id: 	data.count,
					value: 	inputValue
				}
				data.todoList.push(newItem);
				data.count++;
			},
			removeItem: function(itemToRemove, listName) {
				if (listName === 'todo') {
					_.remove(data.todoList, itemToRemove);
				} else {
					_.remove(data.completedList, itemToRemove);
				}
			},
			addItem: function(itemToAdd, listName) {
				if (listName === 'todo'){
					data.todoList.push(itemToAdd);
		  		} else {
					data.completedList.push(itemToAdd);
		  		}
			},
			toggleDeleteAll: function () {
				data.showDeleteAllTodo = data.todoList.length > 0;
				data.showDeleteAllCompleted = data.completedList.length > 0;
			}
		};

	return data;
});

// ********************** Directives ********************** //

app.directive('todoListItem', ['todoFactory', function(todoFactory) {
  return {
  	restrict: 'E',
    // scope: {
    //   item: '=',
    //   listName: '=',
	//   icons: '='
    // },
	scope: false,
    templateUrl: 'views/item.html'
  };
}]);

app.directive('deleteAll', ['todoFactory', function(todoFactory) {
  return {
  	restrict: 'E',
	scope: false,
    templateUrl: 'views/deleteAll.html'
  };
}]);

// ********************** Controllers ********************** //

app.controller('InputCtrl', ['$scope', 'todoFactory', function($scope, todoFactory) {
	$scope.submitText = function() {
		if ($scope.newTodo.length > 0){
			var inputValue = $scope.newTodo.trim();
			todoFactory.submitText(inputValue);
			$scope.newTodo = '';
		}
		todoFactory.toggleDeleteAll();
		window.location = 'http://localhost:9011/#/todo';
	}
}]);

app.controller('ListCtrl', ['$scope', 'todoFactory', function($scope, todoFactory) {
	$scope.editable = false;
	$scope.data = todoFactory;

	$scope.removeItem = function(itemToRemove, listName) {
		todoFactory.removeItem(itemToRemove, listName);
		this.toggleDeleteAll();
	}

	$scope.addItem = function(itemToAdd, listName) {
		todoFactory.addItem(itemToAdd, listName);
		this.toggleDeleteAll();
	}

	$scope.changeList = function(item, listName) {
		if (listName === 'todo') {
			this.removeItem(item, 'todo');
			this.addItem(item, 'completed');
		} else {
			this.removeItem(item, 'completed');
			this.addItem(item, 'todo');
		}
	}

	$scope.deleteAll = function(listName) {
		if (listName === 'todo'){
  			todoFactory.todoList = [];
  		} else {
			todoFactory.completedList = [];
  		}
		this.toggleDeleteAll();
	}

	$scope.showEditItem = function(item) {
		$scope.editable = true;
    }

    $scope.editItem = function(item, listName) {
		var editedItem = {
			id: item.id,
			value: document.getElementsByClassName('editText'+item.id)[0].value
		}

		if(listName === 'todo') {
			_.remove(todoFactory.todoList, item);
			todoFactory.todoList.push(editedItem);
		} else {
			_.remove(todoFactory.completedList, item);
			todoFactory.completedList.push(editedItem);
		}
    	$scope.editable = false;
    }

	$scope.toggleDeleteAll = function() {
		$scope.data.toggleDeleteAll();
	}

}]);

app.controller('TodoCtrl', ['$scope', 'todoFactory', function($scope, todoFactory) {
	$scope.listName = "todo";
	$scope.changeItemIcon = "unchecked";
}]);

app.controller('CompletedCtrl', ['$scope', 'todoFactory', function($scope, todoFactory) {
	$scope.listName = "completed";
	$scope.changeItemIcon = "check";
}]);
