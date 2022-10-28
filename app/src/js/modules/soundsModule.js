'use strict';

var Howler = require('howler');
var Howl = require('howl');
var visibly = require('visibly');

/**
 * Sounds module
 *
 * @module SOUNDS
 * @requires Howler, visibly
 */
var SOUNDS = (function() {
    var instance;

    function init() {

        var isMuted = false;

        return {
            /**
             * Toggle on/off sounds
             *
             * @method toogle
             */
            toggle: function() {
                if (isMuted) {
                    Howler.unmute();
                } else {
                    Howler.mute();
                }

                isMuted = !isMuted;
            },

            /**
             * Is muted
             * @method isMuted
             * @return {Boolean}
             */
            isMuted: function() {
                return Howler._muted;
            },
            background: new Howl({
                urls: [
                    './app/public/sounds/background.mp3'
                ],
                loop: true,
                volume: 0.5
            })


        };
    }

    return {
        /**
         * Return SOUNDS instance
         *
         * @method getInstance
         * @return {SOUNDS}
         */
        getInstance: function() {
            if (!instance) {
                instance = init();
            }

            return instance;
        }
    };
})();

// tab active/inactive
visibly.onHidden(function() {
    Howler.mute();
});

visibly.onVisible(function() {
    Howler.unmute();
});

module.exports = SOUNDS.getInstance();