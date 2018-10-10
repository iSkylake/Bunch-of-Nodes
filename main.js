(function(){

	// DOM cache
	const container = document.getElementsByClassName('containe')[0];
	const divTable = document.getElementsByClassName('div-table')[0];
	const btnSortUp = document.getElementsByClassName('btn-sort-up')[0];
	const btnSortDown = document.getElementsByClassName('btn-sort-down')[0];
	const startInput = document.getElementsByClassName('start-input')[0];
	const destInput = document.getElementsByClassName('dest-input')[0];
	const pathSubmit = document.getElementsByClassName('path-submit')[0];
	const pathResult = document.getElementsByClassName('path-result')[0];

	// NODES INITIALIZATION

	const count = 5000;
	nodes = generateNodes(count, 1234567);

	// LIST OF NODES FOR SORTING
	let nodeList = [];

	for(node in nodes){
		nodeList.push(parseInt(node.slice(4)));
	}

	// KEYBINDING

	btnSortUp.addEventListener('click', function(){
		nodeList = mergeSort(nodeList, 'up');
		render();
	});

	btnSortDown.addEventListener('click', function(){
		nodeList = mergeSort(nodeList, 'down');
		render();
	});

	pathSubmit.addEventListener('click', function(){
		let start = `node${startInput.value}`;
		let dest = `node${destInput.value}`;
		findPath(start, dest);
		startInput.value = "";
		destInput.value = "";
	});

	// MERGE SORT FOR ASC AND DESC

	function mergeSort(arr, order){
		if(arr.length <= 1){
			return arr;
		}

		let mid = Math.floor(arr.length/2);
		let left = mergeSort(arr.slice(0, mid), order);
		let right = mergeSort(arr.slice(mid, arr.length), order);

		let i = 0, j = 0, k = 0;
		let sorted = [];
		
		while(i < left.length && j < right.length){
			// Check if it is ascending or descending
			if(order === 'up'){
				if(left[i] < right[j]){
					sorted[k] = left[i];
					i++
				} else {
					sorted[k] = right[j];
					j++
				}
			} else {
				if(left[i] > right[j]){
					sorted[k] = left[i];
					i++
				} else {
					sorted[k] = right[j];
					j++
				}				
			}
			k++;
		}
 
		while(k < arr.length){
			if(i < left.length){
				sorted[k] = left[i];
				i++;
			}

			if(j < right.length){
				sorted[k] = right[j];
				j++
			}
			k++;
		}

		return sorted;
	}

	// FIND PATH HELPER FUNCTION

	function findPathHelper(current, dest, visited, path){
		visited[current] = true;
		path.push(current);

		if(current === dest){
			renderPath(path);
		} else {
			for(let node in nodes[current]){
				if(!visited[node]){
					findPathHelper(node, dest, visited, path);
				}
			}
		}
	}

	// FIND PATH (DFS)

	function findPath(start, dest){
		let visited = {};
		for(node in nodes){
			visited[node] = false;
		}

		let path = [];

		findPathHelper(start, dest, visited, path);
	}

	// CLEAR ELEMENT CHILDREN

	function clearDOMNode(parent){
		// Used to clear parent element before every render
		while(parent.hasChildNodes()){
			parent.removeChild(parent.childNodes[0]);
		}	
	}

	// RENDER PATH

	function renderPath(path){
		clearDOMNode(pathResult);
		for(let i=0; i<path.length; i++){
			if(i === path.length-1){
				pathResult.insertAdjacentHTML('beforeend', `${path[i].slice(4)}`);
			} else {
				pathResult.insertAdjacentHTML('beforeend', `${path[i].slice(4)} -> `);
			}
		}
	}

	// RENDER FUNCTION

	function render(){

		clearDOMNode(divTable);

		// Create table and header
		const table = document.createElement('table');
		const headerRow = `<tr><th colspan="10" class="table-header">BUNCH OF NODES</th></tr>`;
		table.insertAdjacentHTML('beforeend', headerRow);

		// Initiallize current node index and current index in row
		let currentNodeIndex = 0;
		let indexInRow = 0;

		// Iterate through array and create td in tr, up to 10 tr
		do{

			let tr = document.createElement('tr');

			for(let i=0; i<10; i++){
				let td = document.createElement('td');
				td.appendChild(document.createTextNode(nodeList[currentNodeIndex]));
				tr.appendChild(td);
				currentNodeIndex++;
			}

			table.appendChild(tr);

		}while(currentNodeIndex < count);

		// Append table to div
		divTable.appendChild(table);
	}

	// INITIAL RENDER

	render();

}());