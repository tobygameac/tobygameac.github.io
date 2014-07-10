"use strict";
var geometries = {};
var textures = {};
function initPieceFactory () {

	// common textures
	var tiling = 4;
	var colors = [];
	for(var c = 0; c<2; c++) {
		colors[c] = textures['texture/wood-'+c+'.jpg'].clone();
		colors[c].tile(tiling);
	}
	var norm = textures['texture/wood_N.jpg'].clone();
	norm.tile(tiling);
	var spec = textures['texture/wood_S.jpg'].clone();
	spec.tile(tiling);

	function createPiece(name,color) {
		var size = BOARD_SIZE/COLS * PIECE_SIZE;
		// container for the piece and its reflexion
		var piece = new THREE.Object3D();
		// base material for all the piece (only lightmap changes)
		var material = new THREE.MeshPhongMaterial({
			color:0xffffff,
			specular:0xaaaaaa,
			shininess:60.0,
			map:colors[color],
			normalMap:norm,
			specularMap:spec,
			wireframe:WIREFRAME
		});
		material.normalScale.set(0.3,0.3);

		// urls of geometry and lightmap
		var urlJson = '3D/json/'+name+'.json';
		var urlAO   = 'texture/'+name+'-ao.jpg';

		var geo = geometries[urlJson];
		// no need to clone this texture
		// since its pretty specific
		var light = textures[urlAO];
		light.format = THREE.LuminanceFormat;

		material.lightMap = light;

		var mesh  = new THREE.Mesh(geo,material);
		if (SHADOW) {
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		}
		mesh.scale.set(size,size,size);
		// we rotate pieces so they face each other (mostly relevant for knight)
		mesh.rotation.y += (color == WHITE) ? -Math.PI/2 : Math.PI/2;

		piece.add(mesh);

		piece.name = name;
		piece.color = color;

		return piece;
	}

	// make it global
	window.createPiece = createPiece;
}
