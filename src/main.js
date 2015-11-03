"use strict";

var Angular = require('angular');
var AngularRoute = require('angular-route');

var app = angular.module('todo', ['ngRoute']);

app.factory("todoList"), function() {
	var test = false;
	return test;
}

app.controller('TodoCtrl', function($scope, $rootScope) {
	
	$rootScope.todoList = $rootScope.todoList || [], 
	$rootScope.completedList = $rootScope.completedList || [], 
	$rootScope.count = $rootScope.count || 0;

	$scope.submitText = function() {
		
		var inputValue = $scope.newTodo.trim(),
			newItem = {};
		
		if (inputValue.length > 0){
			newItem = {
				id: 	$scope.count,
				value: 	inputValue
			}
			$rootScope.todoList.push(newItem);
			$rootScope.count++;
			$scope.newTodo = '';
		}

	}

	$scope.removeItem = function(itemToRemove, listToRemoveFrom, listName) {

		for(var i = 0; i < listToRemoveFrom.length; i++) {
		    var obj = listToRemoveFrom[i];

		    if(itemToRemove.id == obj.id) {
		        listToRemoveFrom.splice(i, 1);
		  		i--;

		  		if (listName === 'todo'){
		  			$rootScope.todoList = listToRemoveFrom;
		  		} else {
		  			$rootScope.completedList = listToRemoveFrom;
		  		}

		    }
		}

	}

	$scope.addItem = function(itemToAdd, listToAddTo, listName) {

		listToAddTo.push(itemToAdd);

		if (listName === 'todo'){
  			$rootScope.todoList = listToAddTo;
  		} else {
  			$rootScope.completedList = listToAddTo;
  		}
	}

	$scope.markCompleted = function(item) {

		this.removeItem(item, $rootScope.todoList, 'todo');
		this.addItem(item, $rootScope.completedList, 'completed');
	}

	$scope.markTodo = function(item) {

		this.removeItem(item, $rootScope.completedList, 'completed');
		this.addItem(item, $rootScope.todoList, 'todo');
	}

	$scope.deleteAll = function(list) {

		if (list === 'todo'){
  			$rootScope.todoList = [];
  		} else {
  			$rootScope.completedList = [];
  		}
	}

	$scope.showEditItem = function(item) {
		var inputItemTextbox = document.getElementsByClassName('editText'+item.id)[0],
			spanDisplayText = document.getElementsByClassName('listItem'+item.id)[0];
			
	    spanDisplayText.style.display = "none";
	    inputItemTextbox.value = item.value;
	    inputItemTextbox.style.display = "inline-block";
    }

    $scope.hideEditItem = function(item) {
	    document.getElementsByClassName('listItem'+item.id)[0].style.display = "inline-block";
	    document.getElementsByClassName('editText'+item.id)[0].style.display = "none";
    }

    $scope.editItem = function(item, list, listName) {

		for(var i = 0; i < list.length; i++) {
		    var obj = list[i];
		    if(list[i].id == obj.id) {
		        list[i].value = document.getElementsByClassName('editText'+item.id)[0].value;
		    }
		}

		if (listName === 'todo'){
  			$rootScope.todoList = list;
  		} else {
  			$rootScope.completedList = list;
  		}

    	this.hideEditItem(item);
    }

});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/todo', {
            templateUrl: '/views/todo.html',
            controller: 'TodoCtrl'
        })
        .when('/completed', {
            templateUrl: '/views/completed.html',
            controller: 'TodoCtrl'
        })
        .otherwise({
            redirectTo: '/todo'
        });
}]);
