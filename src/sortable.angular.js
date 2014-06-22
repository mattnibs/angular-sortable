angular.module('ui.sortable', [])
.directive('uiSortable', ['$parse', '$timeout',
	function($parse, $timeout) {
		return {
			require: 'ngModel',
			// link: function(originalScope, element, attrs) {
			// 	scope.log(attrs);
			// }
			link: function(scope, element, attrs, ngModel) {

				var rows = element[0].querySelectorAll('tr.ng-scope');
				var currentDraggingElement;
				var dragSourceElement;
				var callbacks = {};
				console.log(element);

				callbacks.handleDragStart = function(e) {
					// here we probably need to replace the current element with some blank placeholder or something
					dragSourceElement = this;
					currentDraggingElement = this.cloneNode(true);
					//this.style.opacity = 0;

					// setup Dragging Element and append it to table
					console.log(e);
					currentDraggingElement.style.position = 'absolute';
					currentDraggingElement.style.top = e.y + this.clientHeight;
					currentDraggingElement.style.left = 0;
					currentDraggingElement.draggable = false;

					// make table relative
					//element.css('position', 'relative');
					element.append(currentDraggingElement);
					//console.log(clone[0]);

					//e.dataTransfer.effectAllowed = 'move';
  					e.dataTransfer.setData('text/html', this.innerHTML);
  					//e.dataTransfer.setDragImage(null,0,0);
				}

				callbacks.handleDrag = function(e) {
					console.log(e);
				}

				callbacks.handleDragOver = function(e) {
				    if (e.preventDefault) {
				    	e.preventDefault(); // Necessary. Allows us to drop.
				  	}

				  	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

				  	return false;
				}

				callbacks.handleDragEnter = function(e) {
				  	// this / e.target is the current hover target.
				  	this.classList.add('over');
				}

				callbacks.handleDragLeave = function(e) {
				  	this.classList.remove('over');  // this / e.target is previous target element.
				}

				callbacks.handleDrop = function(e) {
				  // this / e.target is current target element.
				  console.log('dropped');
				  	dragSourceElement.style.opacity = 1;


					if (e.stopPropagation) {
				    	e.stopPropagation(); // stops the browser from redirecting.
				  	}

					// See the section on the DataTransfer object.
					if (dragSourceElement != this) {
    					// Set the source column's HTML to the HTML of the column we dropped on.
    					
    					dragSourceElement.innerHTML = this.innerHTML;
    					this.innerHTML = e.dataTransfer.getData('text/html');

    					var dragSourceIndex = dragSourceElement.sortableIndex;
    					var dropSourceIndex = this.sortableIndex;

    					scope.$apply(function() {
    						ngModel.$modelValue.splice(
                    			dropSourceIndex, 0,
                    			ngModel.$modelValue.splice(dragSourceIndex, 1)[0]);

    						console.log(ngModel);
    					})
  					}

				  return false;
				}

				callbacks.handleDragEnd = function(e) {
					// this/e.target is the source node.
					rows = element[0].querySelectorAll('tr.ng-scope');
					console.log(rows);
					[].forEach.call(rows, function (row) {
						console.log(row);
						row.classList.remove('over');
					});
				}

				//watch for changes to list
				scope.$watch(attrs.ngModel+'.length', function() {
					
					// update rows
					rows = element[0].querySelectorAll('tr.ng-scope');

					//now we have to register all these events
					angular.forEach(rows, function(value, key) {
						//value.draggable = true;
						value.sortableIndex = key;
						console.log(key);
						value.draggable = true;
						value.addEventListener('dragstart', callbacks.handleDragStart, false);
						value.addEventListener('dragenter', callbacks.handleDragEnter, false);
						value.addEventListener('dragover', callbacks.handleDragOver, false);
						value.addEventListener('dragleave', callbacks.handleDragLeave, false);
						value.addEventListener('drop', callbacks.handleDrop, false);
  						value.addEventListener('dragend', callbacks.handleDragEnd, false);
  						value.addEventListener('drag', callbacks.handleDrag, false)
					});
				})

				
				
			}
		}
	}
])