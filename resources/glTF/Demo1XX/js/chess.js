"use strict";



var camera;
// list of valid move after each move
// used mostly for cell highlighting
var validMoves = null;
// chess game variables
var g_allMoves = [];

var g_playerWhite = false;
var g_backgroundEngine;


(function() {
	// general setup
	var scene, renderer;
	var cameraControls, effectController;
	// for picking
	var projector;
	// 3D board representation
	var chessBoard;
	// for proper timing
	var clock = new THREE.Clock();

	var g_backgroundEngineValid = true;

	// array for picking
	var board3D = [];


	/*
	 * BASIC SETUP
	 */
	function init() {
		// initialize everything for 3D

		// CANVAS PARAMETERS 
		var canvasWidth  = window.innerWidth;
		var canvasHeight = window.innerHeight;
		var canvasRatio  = canvasWidth / canvasHeight;

		// RENDERER
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.setSize(canvasWidth, canvasHeight);

		if ( SHADOW ) {
			renderer.shadowMapEnabled = true;
			renderer.shadowMapType =  THREE.PCFSoftShadowMap;
			renderer.shadowMapCascade = true;
		}

		// black background
		renderer.setClearColor( 0x000000, 1.0 );
		document.body.appendChild( renderer.domElement );

		// CAMERA
		camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
		// CONTROLS
		cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
		// limitations
		cameraControls.minPolarAngle = 0;
		cameraControls.maxPolarAngle = 270 * Math.PI/180;
		cameraControls.minDistance   = 0;
		cameraControls.maxDistance   = 1000;
		cameraControls.userZoomSpeed = 1.0;
		// default position behind white 
		// (might want to change that according to color selection)
		camera.position.set( 0, 100, 100 );


		// LIGHTING
		var spotlight = new THREE.SpotLight( 0xFFFFFF, 1.0);
		spotlight.position.set( 0, 300, 0 );
		spotlight.angle =  Math.PI / 2;
		spotlight.exponent = 50.0;
		spotlight.target.position.set( 0, 0, 0 );

		var whiteLight = new THREE.PointLight( 0xFFEEDD, 0.2);
		whiteLight.position.set(0,0,100);
		var blackLight = new THREE.PointLight( 0xFFEEDD, 0.2);
		blackLight.position.set(0,0,-100);

		// generate createPiece and createCell functions
		initPieceFactory();

		// create and fill the scene with default stuff
		scene = new THREE.Scene();
		scene.add(spotlight);
		scene.add(whiteLight);
		scene.add(blackLight);

		// to make everything black in the background
		scene.fog = new THREE.FogExp2( 0x000000, 0.001 );
		// little reddish to fake a bit of bounce lighting
		scene.add(new THREE.AmbientLight(0x330000));

		// avoid stretching
		window.addEventListener('resize',onResize,false);
	}

	function onResize() {
		var canvas = renderer.domElement;
		var w = window.innerWidth;
		var h = window.innerHeight;
		renderer.setSize(w,h);
		// have to change the projection
		// else the image will be stretched
		camera.aspect = w/h;
		camera.updateProjectionMatrix();
	}

	function animate() {
		window.requestAnimationFrame(animate);
		render();
	}

	function render() {
		var delta = clock.getDelta();
		cameraControls.update(delta);
		renderer.render(scene, camera);
	}

	function updateBoard3D() {
		// list all the pieces
		board3D = [];
		for (var y = 0; y < ROWS; y++) {
			for (var x = 0; x < COLS; x++) {
			        var type = Math.floor(Math.random() * 6);
                                var pieceColor = (Math.floor(Math.random() * 2) == 0) ? WHITE : BLACK;
				var pieceName = null;
				switch (type) {
				case 0:
					pieceName = "pawn";
					break;
				case 1:
					pieceName = "knight";
					break;
				case 2:
					pieceName = "bishop";
					break;
				case 3:
					pieceName = "rook";
					break;
				case 4:
					pieceName = "queen";
					break;
				case 5:
					pieceName = "king";
					break;
				}

				if (pieceName !== null) {
					board3D[x+y*COLS] = createPiece(pieceName,pieceColor);
				}
			}
		}
	}

	function clearBoard() {
		// remove all pieces from the board
		var cell;
		board3D.forEach(function(piece) {
			scene.remove(piece);
			cell = new Cell(piece.cell);
		});
	}

	function fillBoard() {
		// place all the pieces on the board
		var cell;
		board3D.forEach(function(piece,index) {
			cell = new Cell(index);
			piece.position = cell.getWorldPosition();
			piece.cell = index;
			scene.add(piece);
		});
	}



	function redrawBoard() {
		clearBoard();
		updateBoard3D();
		fillBoard();
	}


	// all resources (meshs and textures) are loaded
	function onLoaded () {
		//bar.container.style.display = "none";
		removeLoader();

		init();
		if (DEBUG) {
			window.scene = scene;
			window.renderer = renderer;
		}
                redrawBoard();
		animate();

		//setTimeout(loadFEN('8/Q5P1/8/8/8/8/8/2K1k3 w - -'),2000);

	}

	window.onLoaded = onLoaded;
	window.redrawBoard = redrawBoard;

})();
