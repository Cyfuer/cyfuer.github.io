'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = require('jquery');
var TweenLite = require('tweenlite');
TweenLite.defaultEase = window.Quad.easeInOut;

require('./libs/waypointLib');

var APP = require('./modules/appModule');
var SCENE = require('./modules/sceneModule');
var SOUNDS = require('./modules/soundsModule');
var HASH = require('./modules/hashModule');
// data1:解开注释
// var DATA = require('./modules/dataModule');

var ImagesLoader = require('./classes/LoaderClass');

var Loader = require('./objects2D/LoaderObject2D');
var Menu = require('./objects2D/menuObject2D');
var Help = require('./objects2D/HelpObject2D');
var Wireframe = require('./objects2D/WireframeObject2D');

var helloSection = require('./sections/helloSection');
var beamsSection = require('./sections/beamsSection');
var dropSection = require('./sections/dropSection');
var ballSection = require('./sections/ballSection');
var flowSection = require('./sections/flowSection');
var neonsSection = require('./sections/neonsSection');
var heightSection = require('./sections/heightSection');
var waveSection = require('./sections/waveSection');
var faceSection = require('./sections/faceSection');
var rocksSection = require('./sections/rocksSection');
var galaxySection = require('./sections/galaxySection');
var gravitySection = require('./sections/gravitySection');
var citySection = require('./sections/citySection');
var endSection = require('./sections/endSection');

jQuery(function() {
    HASH.replacePlaceholders();

    var loader = new Loader();
    var help = new Help();
    var menu = new Menu();
    var imagesLoader = new ImagesLoader([
        './app/public/img/texture-ball.png',
        './app/public/img/texture-ballAlpha.png',
        './app/public/img/sprite-smoke.png',
        './app/public/img/sprite-AKQA.png'
    ]);

    // preload
    imagesLoader.start();

    imagesLoader.onProgress(function(percent) {
        loader.update(percent);
    });

    imagesLoader.onComplete(function() {
        loader.out();

        TweenLite.delayedCall(0.8, SCENE.in);
        TweenLite.delayedCall(1.5, function() {
            map.in();
            menu.setup();
        });
    });

    menu.onClick(function() {
        var $el = jQuery(this);
        var name = $el.attr('data-button') || '';
        if (name === 'home') {
            SCENE.goTo(0);
        } else if (name === 'blog') {
            SCENE.lock();
            APP.slide(SCENE.unlock);
            APP.switch('.tails__blog__nav');
        } else if (name === 'book') {
            SCENE.lock();
            APP.slide(SCENE.unlock);
            APP.switch('.tails__book__nav');
        } else if (name === 'message') {
            SCENE.goTo(7);
        } else if (name === 'me') {
            SCENE.lock();
            APP.slide(SCENE.unlock);
            APP.switch('.tails__about__nav');
        } else if (name === 'sounds') {
            SOUNDS.toggle();
            $el.html(SOUNDS.isMuted() ? '取消静音' : '静音');
        } else if (name === 'help') {
            help.in();
        } else if (name === 'quality') {
            var text;
            var quality;

            if (SCENE.getQuality() === 0.5) {
                text = '高清';
                quality = 1;
            } else {
                text = '流畅';
                quality = 0.5;
            }

            $el.html(text);
            SCENE.quality(quality);
        }
    });

    // scene
    var $heads = jQuery('.heads');
    var $viewport = $heads.find('.heads__viewport');

    SCENE.config({ quality: 1 });
    SCENE.setViewport($viewport);
    SCENE.addSections([
        helloSection,
        beamsSection,
        dropSection,
        ballSection,
        flowSection,
        // neonsSection,
        heightSection,
        waveSection,
        // faceSection,
        rocksSection,
        // galaxySection,
        // gravitySection,
        // citySection,
        endSection
    ]);

    SCENE.on('section:changeBegin', function() {
        var way = this.way;
        var to = this.to.name;
        var from = this.from.name;

        // in begin
        if (to === 'hello') {
            helloSection.in();
            helloSection.start();
            helloSection.smokeStart();

            beamsSection.out('up');
            beamsSection.start();
        } else if (to === 'beams') {
            helloSection.smokeStart();

            helloSection.stop();

            beamsSection.in();
            beamsSection.start();
        } else if (to === 'drop') {
            beamsSection.out('down');
            beamsSection.start();

            dropSection.in();
            dropSection.start();
        } else if (to === 'ball') {
            dropSection.out('down');
            dropSection.start();

            ballSection.in();
            ballSection.start();

            flowSection.fieldIn();
            flowSection.start();
        } else if (to === 'flow') {
            flowSection.in();
            flowSection.fieldIn();
            flowSection.start();

            // neonsSection.smokeStart();

            heightSection.show();
        } else if (to === 'neons') {
            flowSection.fieldIn();
            flowSection.start();

            neonsSection.start();
            neonsSection.smokeStart();

            heightSection.show();
        } else if (to === 'height') {
            flowSection.fieldIn();
            flowSection.start();

            // neonsSection.smokeStart();

            heightSection.show();
            heightSection.in();
            heightSection.start();
        } else if (to === 'wave') {
            heightSection.show();

            waveSection.in(way);
            waveSection.start();

            rocksSection.show();
        } else if (to === 'face') {
            faceSection.in();
            faceSection.start();

            rocksSection.show();
        } else if (to === 'rocks') {
            rocksSection.show();
            rocksSection.in();
            rocksSection.start();
        } else if (to === 'galaxy') {
            rocksSection.show();

            galaxySection.in(way);
            galaxySection.start();

            gravitySection.show();
        } else if (to === 'gravity') {
            gravitySection.show();
            gravitySection.in();
            gravitySection.start();
        } else if (to === 'end') {
            rocksSection.show();

            endSection.in();
        }

        // out begin
        if (from === to) {

        } else if (from === 'hello') {
            helloSection.out(way);
        } else if (from === 'beams') {
            beamsSection.out(way);
        } else if (from === 'drop') {
            dropSection.out(way);
        } else if (from === 'ball') {
            ballSection.out(way);
        } else if (from === 'flow') {
            flowSection.out(way);
        } else if (from === 'neons') {
            neonsSection.out(way);
        } else if (from === 'height') {
            heightSection.out(way);
        } else if (from === 'wave') {
            waveSection.out(way);
        } else if (from === 'face') {
            faceSection.out(way);
        } else if (from === 'rocks') {
            rocksSection.out(way);
        } else if (from === 'galaxy') {
            galaxySection.out(way);
        } else if (from === 'gravity') {
            gravitySection.out(way);
        } else if (from === 'end') {
            endSection.out(way);
        }
    });

    SCENE.on('section:changeComplete', function() {
        var to = this.to.name;
        var from = this.from.name;

        // out complete
        if (from === 'hello') {
            helloSection.stop();

            if (to !== 'beams') {
                helloSection.smokeStop();
            }

            if (to !== 'beams' && to !== 'drop') {
                beamsSection.stop();
            }
        } else if (from === 'beams') {
            if (to !== 'hello') {
                helloSection.smokeStop();
            }

            if (to !== 'hello' && to !== 'drop') {
                beamsSection.stop();
            }
        } else if (from === 'drop') {
            if (to !== 'hello' && to !== 'beams') {
                beamsSection.stop();
            }

            if (to !== 'ball') {
                dropSection.stop();
            }
        } else if (from === 'ball') {
            ballSection.stop();

            if (to !== 'drop') {
                dropSection.stop();
            }

            if (to !== 'flow' && to !== 'neons' && to !== 'height') {
                flowSection.stop();
            }
        } else if (from === 'flow') {
            if (to !== 'neons' && to !== 'height') {
                // neonsSection.smokeStop();
            }

            if (to !== 'ball' && to !== 'neons' && to !== 'height') {
                flowSection.stop();
            }
        } else if (from === 'neons') {
            neonsSection.stop();

            if (to !== 'flow' && to !== 'height') {
                neonsSection.smokeStop();
            }

            if (to !== 'ball' && to !== 'flow' && to !== 'height') {
                flowSection.stop();
            }

            if (to !== 'height' && to !== 'wave') {
                heightSection.hide();
            }
        } else if (from === 'height') {
            heightSection.stop();

            if (to !== 'neons' && to !== 'wave') {
                heightSection.hide();
            }

            if (to !== 'flow' && to !== 'neons') {
                // neonsSection.smokeStop();
            }

            if (to !== 'ball' && to !== 'flow' && to !== 'neons') {
                flowSection.stop();
            }
        } else if (from === 'wave') {
            waveSection.stop();

            if (to !== 'neons' && to !== 'height') {
                heightSection.hide();
            }
        } else if (from === 'face') {
            faceSection.stop();

            if (to !== 'rocks' && to !== 'galaxy') {
                rocksSection.hide();
            }
        } else if (from === 'rocks') {
            rocksSection.stop();

            if (to !== 'face' && to !== 'galaxy') {
                rocksSection.hide();
            }
        } else if (from === 'galaxy') {
            galaxySection.stop();

            if (to !== 'face' && to !== 'rocks') {
                rocksSection.hide();
            }

            if (to !== 'gravity') {
                gravitySection.hide();
            }
        } else if (from === 'gravity') {
            gravitySection.stop();

            if (to !== 'galaxy') {
                gravitySection.hide();
            }
        }
    });

    var currentSectionName;
    var $content = jQuery('.heads__contents__container');
    SCENE.on('section:didClick', function() {
        return;
        menu.out();
        map.out();

        var current = this.sec.name;
        if (current === 'beams') {
            SCENE.retract(0, -62, 50);
            beamsSection.retract();
        } else if (current === 'drop') {
            SCENE.retract(0, -136, 68);
            dropSection.retract();
        } else if (current === 'ball') {
            SCENE.retract(0, -172, 60);
            ballSection.retract();
        } else if (current === 'flow') {
            SCENE.retract(-20, -220, 60);
            flowSection.retract();
        } else if (current === 'height') {
            SCENE.retract(-20, -284, 80);
            heightSection.retract();
        } else if (current === 'wave') {
            SCENE.retract(0, -306, 40);
            waveSection.retract();
        } else if (current === 'rocks') {
            SCENE.retract(0, -370, 40);
            rocksSection.retract();
        } else if (current === 'end') {
            SCENE.retract(0, -418, 40);
            endSection.retract();
        }


        $content.css("display", "block");
        $content.delay(300).animate({ opacity: 1, top: 0 }, 1000);

        currentSectionName = current;
    });

    jQuery('.heads__contents__quit').on('click', function() {
        menu.in();
        map.in();

        $content.animate({ opacity: 0, top: 100 }, 1000);
        setTimeout(() => {
            $content.css("display", "none");
        }, 1000);

        SCENE.tract();
        var current = currentSectionName;
        if (current === 'beams') {
            beamsSection.tract();
        } else if (current === 'drop') {
            dropSection.tract();
        } else if (current === 'ball') {
            ballSection.tract();
        } else if (current === 'flow') {
            flowSection.tract();
        } else if (current === 'height') {
            heightSection.tract();
        } else if (current === 'wave') {
            waveSection.tract();
        } else if (current === 'rocks') {
            rocksSection.tract();
        } else if (current === 'end') {
            endSection.tract();
        }
    });

    SCENE.on('end', function() {
        SCENE.lock();
        APP.slide(SCENE.unlock);
    });

    // map
    var map = SCENE.getMap();

    $heads.prepend(map.$el);

    map.init();

    map.onClick(function(index) {
        SCENE.goTo(index);
    });

    SCENE.on('section:changeBegin', function() {
        map.setActive(this.to.index);
    });

    // tails
    var wireframe = new Wireframe(jQuery('.wireframe'));

    var $tailsSections = jQuery('.tails__section');
    $tailsSections.find('.tails__section__el').animate({ opacity: 0, y: 100 }, 0);

    var waypoint = $tailsSections.waypoint({
        $viewport: jQuery('.tails__contents__asset'),
        offset: 0
    });

    $tailsSections.on('active', function() {
        var $el = jQuery(this);

        if ($el.attr('data-appeared')) {
            return false;
        }

        jQuery(this).find('.tails__section__el').each(function(i) {
            jQuery(this).stop().delay(i * 100).animate({ opacity: 1, y: 0 }, 500);
        });

        $el.attr('data-appeared', true);
    });

    jQuery('.tails__section--site').on('stateChange', function(e, state) {
        if (state === 'active') {
            wireframe.start();
            wireframe.in();
        } else {
            wireframe.stop();
        }
    });

    APP.on('slideBegin', function() {
        if (this.to === 'heads') {
            waypoint.stop();

            try {
                SOUNDS.background.fadeIn(1, 2000);
            } catch (e) {
                console.warn(e);
            }

        } else {
            SOUNDS.background.fadeOut(0, 2000);
        }
    });

    APP.on('slideComplete', function() {
        if (this.to === 'tails') {
            waypoint.start();
        }
    });

    // SCENE on/off
    APP.on('heads:visible', function() {
        SCENE.start();
    });

    APP.on('heads:invisible', function() {
        SCENE.stop();
    });

    APP.start();
    SCENE.start();

    SOUNDS.background.fadeIn(1, 2000);
});