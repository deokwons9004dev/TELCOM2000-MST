var log = console.log;

/**
 * Get the MST from the given adjacency matrix using Prim's algorithm.
 * @param  {Number[][]} matrix     - Adjacency matrix of graph.
 * @param  {Number}     startIndex - (Optional) Index of the vertex to start Prim's algorithm on.
 * @return {Number[][]} mstMatrix  - Adjacency matrix of resulting MST.
 */
function primMST (matrix, startIndex) {
	var keyArray           = new Array(matrix.length);
	var mstParentNodeArray = new Array(matrix.length);
	var mstSet             = new Set();
	startIndex             = startIndex || 0;
		
	// O(n): Initialize every node key value to MAX except startIndex.
	for (var i = 0; i < keyArray.length; i++) {
		if (i == startIndex) keyArray[i] = 0;
		else                 keyArray[i] = Number.MAX_SAFE_INTEGER;		
	}
	
	// O(n^2): Do inner O(n) computation O(n) times.
	while (mstSet.size < matrix.length) {
		
		// O(n): Get the node index with min key value from keyArray.
		//       Node index must not already be added to mstSet.
		var minKeyIndex = 0;
		var minKey      = Number.MAX_SAFE_INTEGER;
		for (var i = 0; i < keyArray.length; i++) {
			if (keyArray[i] < minKey && !mstSet.has(i)) {
				minKey      = keyArray[i];
				minKeyIndex = i;
			}
		}
		
		// O(1): Insert node index to mstSet.
		mstSet.add(minKeyIndex);
		
		// O(n): Update the key value for neighboring vertices of the min key vertex.
		//       Also make the min key vertex the parent vertex for these neighboring vertices.
		for (var i = 0; i < matrix[minKeyIndex].length; i++) {
			
			// Here, each i is the vertex index for neighboring vertices.
			// NOTE: There must be an edge between min key vertex and neighbor vertex i.
			// NOTE: Neighbor vertex i must not already be added to mstSet.
			// NOTE: The edge weight between min key vertex and neighbor i must be smaller than key value of i.
			if (matrix[minKeyIndex][i] != 0 && !mstSet.has(i) && matrix[minKeyIndex][i] < keyArray[i]) {
				keyArray[i]           = matrix[minKeyIndex][i];
				mstParentNodeArray[i] = minKeyIndex;
			}
		}
		
		log('minKeyIndex :', minKeyIndex);
		log('keyArray    :', keyArray);
		log('mstSet      :', mstSet);
	}
	
	log('mstParentNodeArray: ', mstParentNodeArray);
	
	// O(n^2): Initialize the returning MST matrix.
	var mstMatrix = new Array(matrix.length);
	for (var i = 0; i < mstMatrix.length; i++) {
		mstMatrix[i] = new Array(matrix.length);
		for (var j = 0; j < mstMatrix[i].length; j++) {
			mstMatrix[i][j] = 0;
		}
	}
	
	// Fill the MST using the computed MST parent node array.
	for (var i = 0; i < matrix.length; i++) {
		if (mstParentNodeArray[i] == undefined) continue;
		mstMatrix[mstParentNodeArray[i]][i] = matrix[mstParentNodeArray[i]][i];
		mstMatrix[i][mstParentNodeArray[i]] = matrix[mstParentNodeArray[i]][i];
	}
	
	return mstMatrix;
}

//var arpanetMatrix = [
//		[0,0.3,0,0,0,0,0.1,2,0,0,0,0,0,0,0,0,0,0,0],    // RAND
//		[0.3,0,0.7,0,0,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0],  // UCSB
//		[0,0.7,0,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0],    // SU
//		[0,0,0.1,0,0.1,0,0,0.1,0,0,0,0,0,0,0,0,0,0,0],  // UCB
//		[0,0,0,0.1,0,1,0,0,0,0,0,0,0,0,8,0,0,0,0],    // SRI
//		[0,0.3,0,0,1,0,0.1,0,0,0,0,0,0,0,0,0,0,0,0],    // UCLA
//		[0.1,0,0,0,0,0.1,0,0,5,0,0,0,0,0,0,0,0,0,0],    // SDC
//		[2,0,0,0.1,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],      // UTAH
//		[0,0,0,0,0,0,5,0,0,0.4,0,1.8,0,0,0,0,0,0,0],    // WU
//		[0,0,0,0,0,0,0,4,0.4,0,1,0,0,0,0,0,0,0,0],      // ILL
//		[0,0,0,0,0,0,0,0,0,1,0,0,0,1.5,0,0,0,0,1.8],    // MICH
//		[0,0,0,0,0,0,0,0,1.8,0,0,0,0.5,0,0,0,1.4,0,0],  // CMU
//		[0,0,0,0,0,0,0,0,0,0,0,0.5,0,0.6,0,0,0,0,0],    // ARPA
//		[0,0,0,0,0,0,0,0,0,0,1.5,0,0.6,0,0,0.6,0,0,0],  // BTL
//		[0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0.3],    // HARV
//		[0,0,0,0,0,0,0,0,0,0,0,0,0,0.6,0.1,0,0.1,0,0],  // LL
//		[0,0,0,0,0,0,0,0,0,0,0,1.4,0,0,0,0.1,0,0.1,0],  // BBN
//		[0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,0,0.3],    // MAC
//		[0,0,0,0,0,0,0,0,0,0,1.8,0,0,0,0.3,0,0,0.3,0]   // DART
//	]
//
//
//var mstMatrix = primMST(arpanetMatrix);
//log(mstMatrix);