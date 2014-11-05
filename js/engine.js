var containerWidth = window.innerWidth, containerHeight = window.innerHeight;

var container, stats;

var camera, scene, renderer;

var cube, group = new THREE.Object3D();

var targetRotationY = 0, targetRotationX = 0;
var targetRotationYOnMouseDown = 0, targetRotationXOnMouseDown = 0;
var dragged = false;

var morphs = [];
var clock = new THREE.Clock();

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var geometry;

var speed = {
    x: 0,
    y: 0
};

init([3,3,3]);
animate();

var bgCanvas = document.getElementById('backgroundImage');
bgCanvas.width = getWidth();
bgCanvas.height = getHeight();
var ctx = bgCanvas.getContext("2d");
var currentBg = null;
var bgIndex;

var backgrounds = [
'http://www.hdwallpapers.in/walls/boat_sea_beach-normal.jpg',
'http://cnasstudent.ucr.edu/images/statistics-arrow.jpg',
'http://upload.wikimedia.org/wikipedia/commons/9/94/Caribbean_flamingo.jpg',
'http://d1jqu7g1y74ds1.cloudfront.net/wp-content/uploads/2010/06/Moon.jpg',
'http://www.carnetverona.it/_files/contents/immagini/20120126/_cid_22b243bb_4980_4aa4_84b8_ef9d820a2e89.jpg',
'http://static.cibocanigatti.it/animali-da-cortile/pecore-e-capre/la-capra_O1.jpg'
];
var bgToBeLoaded = backgrounds.length;

for (var b_i = 0; b_i < backgrounds.length; b_i ++) {
    var src = backgrounds[b_i];
    var bg = new Image();
    bg.src = src;
    bg.onload = function() {
        bgToBeLoaded --;
    }
    backgrounds[b_i] = bg;
}

function getWidth() {
  if (self.innerHeight) {
    return self.innerWidth;
}

if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientWidth;
}

if (document.body) {
    return document.body.clientWidth;
}
}

function getHeight() {
  if (self.innerHeight) {
    return self.innerHeight;
}

if (document.documentElement && document.documentElement.clientHeight) {
    return document.documentElement.clientHeight;
}

if (document.body) {
    return document.body.clientHeight;
}
}

function init(texelization) {

    container = document.getElementById('container');
    container.style.width = containerWidth + 'px';
    container.style.height = containerHeight + 'px';
    container.style.position = 'relative';

    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'Drag to spin the pack';
    container.appendChild(info);

    camera = new THREE.PerspectiveCamera(45, containerWidth / containerHeight, 1, 1000);
    //camera.position.y = 150;
    camera.position.z = 800;
    scene = new THREE.Scene();
    camera.lookAt(scene.position);


    var numbersTextures = [
    'textures/red-number-1.jpg',
    'textures/red-number-2.jpg',
    'textures/red-number-3.jpg',
    'textures/red-number-4.jpg',
    'textures/red-number-5.jpg',
    'textures/red-number-6.jpg'
    ];

    var cube = createCube({
        width: 300,
        height: 300,
        depth: 300
    }, numbersTextures);
    cube.overdraw = true;

    var cube_1 = createCube({
        width: 100,
        height: 100,
        depth: 100
    }, numbersTextures);

    cube_1.overdraw = true;
    cube_1.position.y = 200;
    cube_1.position.x = -100;
    cube_1.position.z = -100;

    var cube_2 = createCube({
        width: 100,
        height: 40,
        depth: 100
    }, numbersTextures);

    cube_2.overdraw = true;
    cube_2.position.y = 170;
    cube_2.position.x = 0;
    cube_2.position.z = -100;

    var cube_3 = createCube({
        width: 100,
        height: 70,
        depth: 100
    }, numbersTextures);

    cube_3.overdraw = true;
    cube_3.position.y = 185;
    cube_3.position.x = 100;
    cube_3.position.z = -100;

    var loader = new THREE.JSONLoader();
    loader.load( 'obj/obj1.js', function(geometry){
        console.log("obj is loaded");
        var material = new THREE.MeshLambertMaterial({color: 0x55B663});
        var mesh = new THREE.Mesh( geometry, material);
        mesh.position.z = 63;
        mesh.scale.set(100, 100, 100);

        var yAxis = new THREE.Vector3( 1, 0, 0 );
        rotateAroundObjectAxis(mesh, yAxis, Math.PI / 2);

        group.add(mesh);
    });

    loader.load( 'obj/flamingo.js', function(geometry){
        console.log("flamingo is loaded");
        morphColorsToFaceColors( geometry );
        geometry.computeMorphNormals();

        var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
        var meshAnim = new THREE.MorphAnimMesh( geometry, material );

        meshAnim.duration = 1000;

        var s = 0.35;
        meshAnim.scale.set( s, s, s );
        meshAnim.position.y = 15;
        meshAnim.rotation.y = -1;

        meshAnim.castShadow = true;
        meshAnim.receiveShadow = true;
        morphs.push( meshAnim );
        meshAnim.position.z = -240;
        meshAnim.scale.set(1.6, 1.6, 1.6);

        var yAxis = new THREE.Vector3( -1, 0, 0 );
        rotateAroundObjectAxis(meshAnim, yAxis, Math.PI / 2);

        group.add(meshAnim);
    });

    group.add(cube);
    group.add(cube_1);
    group.add(cube_2);
    group.add(cube_3);
    scene.add(group);

    /*var ax = new THREE.Vector3(1, 0, 0);
    rotateAroundObjectAxis(group, ax, Math.PI/2);
    var ax = new THREE.Vector3(0, 1, 0);
    rotateAroundObjectAxis(group, ax, Math.PI/2);*/
    targetRotationX = group.rotation.x;
    targetRotationY = group.rotation.y;

    // add subtle ambient lighting
    var ambientLight = new THREE.AmbientLight(0xbbbbbb);
    scene.add(ambientLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0x88cd73);
    directionalLight.position.set(-100, 200, 100);
    scene.add(directionalLight);

    group.add(buildAxes( 1000 ));

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerWidth, containerHeight);

    container.appendChild(renderer.domElement);

    document.getElementById('container').addEventListener('mousedown', onDocumentMouseDown, false);
    document.getElementById('container').addEventListener('touchstart', onDocumentTouchStart, false);
    document.getElementById('container').addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);


    bgCanvas.width = getWidth();
    bgCanvas.height = getHeight();
    currentBg = null;
}

//

function onDocumentMouseDown(event) {
    console.dir(event);
    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationYOnMouseDown = targetRotationY;
    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationXOnMouseDown = targetRotationX;
    dragged = true;
}

function onDocumentMouseMove(event) {
    dragged = true;
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = targetRotationYOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
    targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
    dragged = false;
}

function onDocumentMouseOut(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationYOnMouseDown = targetRotationY;
        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationXOnMouseDown = targetRotationX;
    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length === 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationY = targetRotationYOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
        mouseY = event.touches[0].pageY - windowHalfY;
        targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05;
    }

}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    speed.x = (targetRotationX - group.rotation.x) * 0.05;
    speed.y = (targetRotationY - group.rotation.y) * 0.05;
    if( dragged) {
        group.rotation.y += speed.y;
        group.rotation.x += speed.x;
    } else {
        if (Math.abs((targetRotationY - group.rotation.y) * 0.05) > 0.005){
            group.rotation.y += speed.y;
        }
        if (Math.abs((targetRotationX - group.rotation.x) * 0.05) > 0.005){
            group.rotation.x += speed.x;
        }

    }

    if (isRotationSlow(speed, 0.005) ) {
        bgIndex = getVisibleFace(group.rotation);

        if (!bgToBeLoaded && ctx && (currentBg !== bgIndex)) {
            currentBg = bgIndex;
            (function() {
                var alpha = 0;
                var fadeIn = setInterval(function() {
                    if (alpha >= 1) {
                        clearInterval(fadeIn);
                        var infos = document.getElementById('html_info').children;
                        for (var i = 0; i < infos.length; i ++) {
                            infos[i].style.display = 'none';
                        }
                        document.getElementById('info_' + currentBg).style.display = 'block';
                    }
                    alpha += .1;
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(backgrounds[bgIndex],0,0,bgCanvas.width,bgCanvas.height);

                }, 20);
            })();
        }
    }

    var delta = clock.getDelta();

    //controls.update();

    for ( var i = 0; i < morphs.length; i ++ ) {

        morph = morphs[ i ];
        morph.updateAnimation( 1000 * delta );

    }

    renderer.render(scene, camera);
}



