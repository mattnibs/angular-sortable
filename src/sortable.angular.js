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
				var placeholder;
				var callbacks = {};



				function getRelativePosition(event) {
					// here's the page position
					var top = element[0].getBoundingClientRect().top + document.body.scrollTop;

					return event.gesture.center.clientY - top - 17;
				}

				callbacks.handleDragStart = function(e) {
					// here we probably need to replace the current element with some blank placeholder or something
					// console.log('okay we\'re dragging');

					// let's set up the dragging Element
					// ------------------------------------------------
					var selectedRow = angular.element(e.target.parentNode);
					placeholder = selectedRow.clone();
					placeholder.css('visibility', 'hidden');
					placeholder.addClass('placeholder');
					selectedRow.after(placeholder);

					var children = selectedRow.children();
					for(var i = 0; i < children.length; i++) {
						children[i].style.width =children[i].offsetWidth;
					}

					selectedRow.css('position', 'absolute');
					selectedRow.css('z-index', 1000);
					selectedRow.css('top', getRelativePosition(e));



					// add to table
					element.css('position', 'relative');
					// ------------------------------------------------

					// set to current dragging row
					currentDraggingElement = selectedRow;

				}

				callbacks.handleDrag = function(e) {
					currentDraggingElement.css('top', getRelativePosition(e));
					// here's where clever calculation will occur to detect if elements need to be move and what not
				}

				callbacks.handleDragEnd = function(e) {
					// 
					console.log('drag ends');
					this.style.opacity = 1;
					
				}

				//watch for changes to list
				scope.$watch(attrs.ngModel+'.length', function() {
					
					// update rows
					rows = element[0].querySelectorAll('tr.ng-scope');

					//now we have to register all these events
					angular.forEach(rows, function(value, key) {
						//value.draggable = true;
						value.sortableIndex = key;
						console.log(value);
						console.log(key);
						Hammer(value).on('dragstart', callbacks.handleDragStart);
						Hammer(value).on('dragend', callbacks.handleDragEnd);
						Hammer(value).on('drag', callbacks.handleDrag);
						// value.draggable = true;
						// value.addEventListener('dragstart', callbacks.handleDragStart, false);
						// value.addEventListener('dragenter', callbacks.handleDragEnter, false);
						// value.addEventListener('dragover', callbacks.handleDragOver, false);
						// value.addEventListener('dragleave', callbacks.handleDragLeave, false);
						// value.addEventListener('drop', callbacks.handleDrop, false);
  				// 		value.addEventListener('dragend', callbacks.handleDragEnd, false);
  				// 		value.addEventListener('drag', callbacks.handleDrag, false)
					});
				})

				
				
			}
		}
	}
])