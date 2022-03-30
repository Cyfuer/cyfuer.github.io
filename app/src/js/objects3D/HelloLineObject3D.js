'use strict';

var THREE = require('three');
var TweenLite = require('tweenlite');
var loop = require('../utils/loopUtil');

require('../fonts/helvetiker_bold.typeface')

/**
 * Hello title
 *
 * @class Title
 * @constructor
 * @requires THREE, TweenLite, SPRITE3D, HASH, FontLoader
 */
function TitleLine() {
    var object, uniforms, attributes, inTween, geometry;

    var text = "hello world",

        height = 1,
        size = 20,

        curveSegments = 1,
        steps = 12,

        bevelThickness = 1,
        bevelSize = 1.5,
        bevelSegments = 10,
        bevelEnabled = false,

        font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
        weight = "bold", // normal bold
        style = "normal"; // normal italic

    init();
    this.el = object;


    inTween = TweenLite.to({}, 5, {
        paused: true,
        ease: window.Linear.easeNone,
        onUpdate: updateLine,
        onComplete: loop
    });
    inTween.resume();

    function init() {

        attributes = {

            displacement: { type: 'v3', value: [] },
            customColor: { type: 'c', value: [] }

        };

        uniforms = {

            amplitude: { type: "f", value: 5.0 },
            opacity: { type: "f", value: 0.3 },
            color: { type: "c", value: new THREE.Color(0xffffff) }

        };

        var shaderMaterial = new THREE.ShaderMaterial({

            uniforms: uniforms,
            attributes: attributes,
            vertexShader: document.getElementById('helloline-vertexshader').textContent,
            fragmentShader: document.getElementById('helloline-fragmentshader').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true

        });

        shaderMaterial.linewidth = 1;

        geometry = new THREE.TextGeometry(text, {

            size: size,
            height: height,
            curveSegments: curveSegments,

            font: font,
            weight: weight,
            style: style,

            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelEnabled: bevelEnabled,
            bevelSegments: bevelSegments,

            steps: steps

        });

        geometry.dynamic = true;

        geometry.center();

        object = new THREE.Line(geometry, shaderMaterial, THREE.LineStrip);

        var vertices = object.geometry.vertices;

        var displacement = attributes.displacement.value;
        var color = attributes.customColor.value;

        for (var v = 0; v < vertices.length; v++) {

            displacement[v] = new THREE.Vector3();

            color[v] = new THREE.Color(0x666666);
            // color[ v ].setHSL( 0, 0, Math.cos(v / vertices.length * 1.2) );
            // color[v].setHSL(0, 0, Math.cos(v * 0.45) + 0.2);

        }

        object.rotation.x = 0.2;
        object.scale.set(0.3, 0.3, 0.3);
    }

    function updateLine() {
        var time = Date.now() * 0.001;

        // object.rotation.y = 0.25 * time;
        var scal = Math.sin(0.5 * time) * 0.5;
        uniforms.amplitude.value = scal;

        // uniforms.color.value.offsetHSL( 0, 0, 0.0035 * scal );


        var nx, ny, nz, value;

        for (var i = 0, il = attributes.displacement.value.length; i < il; i++) {
            let a = Math.random();
            nx = 0.2 * (0.5 - a);
            ny = 0.2 * (0.5 - a);
            nz = 0.3 * (0.5 - a);

            value = attributes.displacement.value[i];

            value.x += nx;
            value.y += ny;
            value.z += nz;

        }

        attributes.displacement.needsUpdate = true;
    }

    this.in = function() {
        inTween.play();
    };

    this.out = function() {
        inTween.reverse();
    };

    this.start = function() {
        inTween.resume();
    };

    this.stop = function() {
        inTween.pause();
    };
}

module.exports = TitleLine;