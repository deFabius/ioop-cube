function buildAxes( length ) {
	var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

    }

    function buildAxis( src, dst, colorHex, dashed ) {
    	var geom = new THREE.Geometry(),
    	mat; 

    	if(dashed) {
    		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
    	} else {
    		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
    	}

    	geom.vertices.push( src.clone() );
    	geom.vertices.push( dst.clone() );
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LinePieces );

        return axis;

    }

    function rotateAroundWorldAxis( object, axis, radians ) {

    	var rotationMatrix = new THREE.Matrix4();

    	rotationMatrix.makeRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiply( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setFromRotationMatrix( object.matrix );
}

function rotateAroundObjectAxis(object, axis, radians) {
	rotObjectMatrix = new THREE.Matrix4();
	rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
}

function morphColorsToFaceColors( geometry ) {

	if ( geometry.morphColors && geometry.morphColors.length ) {

		var colorMap = geometry.morphColors[ 0 ];

		for ( var i = 0; i < colorMap.colors.length; i ++ ) {

			geometry.faces[ i ].color = colorMap.colors[ i ];

		}

	}

}

// helper to generate cube
function createCube(sizes, txtSrc) {
	var textures = [txtSrc[0], txtSrc[2], txtSrc[4], txtSrc[5], txtSrc[3], txtSrc[1]];
	var geometry = new THREE.CubeGeometry(sizes.width, sizes.height, sizes.depth);
	var materials = [];
	console.log(geometry.faces.length)
	for (var i = 0; i < textures.length; i ++) {
		var img = new Image();
		img.src = textures[i];
		var tex = new THREE.Texture(img);
		img.tex = tex;
		img.onload = function () {
			this.tex.needsUpdate = true;
		};
		var mat = new THREE.MeshLambertMaterial({ map:tex });
		materials.push(mat);
	}

    // material
    var material = new THREE.MeshFaceMaterial(materials);

    return new THREE.Mesh(geometry, material);
}

function getVisibleFace(objRot) {
	var radiansConv = 180 / Math.PI;
	var rotationXDegrees = (objRot.x * radiansConv) % 360;
	var rotationYDegrees = (objRot.y * radiansConv) % 360;
	document.getElementById('targetRotationX').innerHTML = rotationXDegrees;
	document.getElementById('targetRotationY').innerHTML = rotationYDegrees;

	var bgIndex = 0;
	if ((rotationXDegrees >= -45 && rotationXDegrees < 45) ||
		rotationXDegrees < -335) {
		if (rotationYDegrees >= -45 && rotationYDegrees < 45) {
			bgIndex = 0;
		} else if ((rotationYDegrees >= 45 && rotationYDegrees < 135) ||
		(rotationYDegrees >= -315 && rotationYDegrees < -225)) {
			bgIndex = 1;
		} else if ((rotationYDegrees >= 135 && rotationYDegrees < 225) ||
		(rotationYDegrees >= -225 && rotationYDegrees < -135)) {
			bgIndex = 2;
		} else if ((rotationYDegrees >= 225 && rotationYDegrees < 315) ||
		(rotationYDegrees >= -135 && rotationYDegrees < -45)) {
			bgIndex = 3;
		}
	} else if ((rotationXDegrees >= 45 && rotationXDegrees < 135) ||
		(rotationXDegrees >= -315 && rotationXDegrees < -225)) {
		if (rotationYDegrees >= -45 && rotationYDegrees < 45) {
			bgIndex = 4;
		} else if ((rotationYDegrees >= 45 && rotationYDegrees < 135) ||
		(rotationYDegrees >= -315 && rotationYDegrees < -225)) {
			bgIndex = 1;
		} else if ((rotationYDegrees >= 135 && rotationYDegrees < 225) ||
		(rotationYDegrees >= -225 && rotationYDegrees < -135)) {
			bgIndex = 2;
		} else if ((rotationYDegrees >= 225 && rotationYDegrees < 315) ||
		(rotationYDegrees >= -135 && rotationYDegrees < -45)) {
			bgIndex = 3;
		}
	}

	return bgIndex;
}

function isRotationSlow (speed, delta) {
	return (Math.abs(speed.x) < delta) && (Math.abs(speed.y) < delta);
}


function showMessage(form) {
	console.dir(this);
	alert('message');
	return false;
}


