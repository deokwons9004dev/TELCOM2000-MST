// =========================
// Global Graph Data
// =========================
var arpanetMatrix = [
	[0,0.3,0,0,0,0,0.1,2,0,0,0,0,0,0,0,0,0,0,0],    // RAND
	[0.3,0,0.7,0,0,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0],  // UCSB
	[0,0.7,0,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0],    // SU
	[0,0,0.1,0,0.1,0,0,0.1,0,0,0,0,0,0,0,0,0,0,0],  // UCB
	[0,0,0,0.1,0,1,0,0,0,0,0,0,0,0,8,0,0,0,0],    // SRI
	[0,0.3,0,0,1,0,0.1,0,0,0,0,0,0,0,0,0,0,0,0],    // UCLA
	[0.1,0,0,0,0,0.1,0,0,5,0,0,0,0,0,0,0,0,0,0],    // SDC
	[2,0,0,0.1,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0],      // UTAH
	[0,0,0,0,0,0,5,0,0,0.4,0,1.8,0,0,0,0,0,0,0],    // WU
	[0,0,0,0,0,0,0,4,0.4,0,1,0,0,0,0,0,0,0,0],      // ILL
	[0,0,0,0,0,0,0,0,0,1,0,0,0,1.5,0,0,0,0,1.8],    // MICH
	[0,0,0,0,0,0,0,0,1.8,0,0,0,0.5,0,0,0,1.4,0,0],  // CMU
	[0,0,0,0,0,0,0,0,0,0,0,0.5,0,0.6,0,0,0,0,0],    // ARPA
	[0,0,0,0,0,0,0,0,0,0,1.5,0,0.6,0,0,0.6,0,0,0],  // BTL
	[0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0.1,0,0,0.3],    // HARV
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0.6,0.1,0,0.1,0,0],  // LL
	[0,0,0,0,0,0,0,0,0,0,0,1.4,0,0,0,0.1,0,0.1,0],  // BBN
	[0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0.1,0,0.3],    // MAC
	[0,0,0,0,0,0,0,0,0,0,1.8,0,0,0,0.3,0,0,0.3,0]   // DART
]
var indexVertexMap = {
	0 : { label: 'RAND', x: 2 , y: 13 },
	1 : { label: 'UCSB', x: 1 , y: 11 },
	2 : { label: 'SU'  , x: 2 , y: 8  },
	3 : { label: 'UCB' , x: 4 , y: 6  },
	4 : { label: 'SRI' , x: 5 , y: 8  },
	5 : { label: 'UCLA', x: 4 , y: 11 },
	6 : { label: 'SDC' , x: 5 , y: 13 },
	7 : { label: 'UTAH', x: 8 , y: 8  },
	8 : { label: 'WU'  , x: 11, y: 10 },
	9 : { label: 'ILL' , x: 13, y: 8  },
	10: { label: 'MICH', x: 16, y: 5  },
	11: { label: 'CMU' , x: 18, y: 8  },
	12: { label: 'ARPA', x: 19, y: 12 },
	13: { label: 'BTL' , x: 23, y: 11 },
	14: { label: 'HARV', x: 23, y: 7  },
	15: { label: 'LL'  , x: 24, y: 9  },
	16: { label: 'BBN' , x: 26, y: 7  },
	17: { label: 'MAC' , x: 25, y: 5  },
	18: { label: 'DART', x: 24, y: 3  }
}
var graph = null;

// =========================
// Button CLick Handlers
// =========================
function downloadPng () {
	if (graph == null) {
		alert('Graph is not rendered.');
		return;
	}
	graph.renderers[0].snapshot({
		format    : 'png',
//		background: 'white',
		labels    : false,
		download  : true
	});
}
function drawMST (startIndex) {
	$('#original').empty();
	
	// Compute the MST of the arpanet matrix based on the given starting index.
	var mstMatrix = primMST(arpanetMatrix, startIndex);
	
	// Initialize sigma graph data.	
	var g = { nodes: [], edges: [] };
	
	// Convert the AM nodes to sigma graph nodes.
	for (var i = 0; i < mstMatrix.length; i++) {		
		g.nodes.push({
			id   : i,
			label: indexVertexMap[i].label,
			x    : indexVertexMap[i].x,
			y    : indexVertexMap[i].y,
			size : 1.5,
			color: '#464646'
		})
	}
	// Create padding nodes to fit everything within container.
	g.nodes.push({
		id   : 99,
		x    : 0,
		y    : 8,
	})
	g.nodes.push({
		id   : 100,
		x    : 28,
		y    : 8,
	})
	
	// Convert the AM edges to sigma graph edges.
	var edgeID = 0;
	for (var i = 0; i < mstMatrix.length; i++) {
		for (var j = 0; j < mstMatrix[i].length; j++) {
			if (mstMatrix[i][j] > 0) {
				g.edges.push({
					id: edgeID,
					// Reference extremities:
					source: i,
					target: j,
					size  : mstMatrix[i][j],
					label : mstMatrix[i][j].toString(),
					color : '#FF5B5B'
				});
				edgeID += 1;
			}
		}
	}
	
	var s = new sigma({
		graph: g,
		renderer: {
			container: document.getElementById('original'),
			type     : 'canvas'
		},
		settings: {
			edgeLabelSize: 'proportional',
			defaultEdgeLabelSize: 15,
			edgeLabelThreshold  : 0.1,
			minEdgeSize  : 1,
			maxEdgeSize  : 10
		}
	});
	
	graph = s;
}

// =========================
// Onload Routines
// =========================
$(document).ready(function () {
	// Initialize sigma graph data.	
	var g = { nodes: [], edges: [] };
	
	// Convert the AM nodes to sigma graph nodes.
	for (var i = 0; i < arpanetMatrix.length; i++) {		
		g.nodes.push({
			id   : i,
			label: indexVertexMap[i].label,
			x    : indexVertexMap[i].x,
			y    : indexVertexMap[i].y,
			size : 1.5,
			color: '#464646'
		})
	}
	// Create padding nodes to fit everything within container.
	g.nodes.push({
		id   : 99,
		x    : 0,
		y    : 8,
	})
	g.nodes.push({
		id   : 100,
		x    : 28,
		y    : 8,
	})
	
	// Convert the AM edges to sigma graph edges.
	var edgeID = 0;
	for (var i = 0; i < arpanetMatrix.length; i++) {
		for (var j = 0; j < arpanetMatrix[i].length; j++) {
			if (arpanetMatrix[i][j] > 0) {
				g.edges.push({
					id: edgeID,
					// Reference extremities:
					source: i,
					target: j,
					size  : arpanetMatrix[i][j],
					label : arpanetMatrix[i][j].toString(),
					color : '#FF5B5B'
				});
				edgeID += 1;
			}
		}
	}
	
	var s = new sigma({
		graph: g,
		renderer: {
			container: document.getElementById('original'),
			type     : 'canvas'
		},
		settings: {
			edgeLabelSize: 'proportional',
			defaultEdgeLabelSize: 15,
			edgeLabelThreshold  : 0.1,
			minEdgeSize  : 1,
			maxEdgeSize  : 10
		}
	})
	
	graph = s;
	// Output.
//	s.refresh();
});