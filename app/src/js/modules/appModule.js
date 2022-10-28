'use strict';

var jQuery = require('jquery');
var Cipher = require('../utils/cipherUtil');
var Events = require('../classes/EventsClass');


/**
 * Handle navigation between heads/tails
 *
 * @module APP
 * @event [heads:visible] Heads is at least partially in the viewport
 * @event [heads:invisible] Heads is completely out of the viewport
 * @requires jQuery, Events
 */
var APP = (function() {
    var instance;
    var isLoadBlogContent = false;


    function init() {
        var events = new Events();
        var xmlhttp;

        var $trigger = jQuery('.trigger');
        var $heads = jQuery('.heads');
        var $tails = jQuery('.tails');
        var $infoArrow = $heads.find('.trigger__info--arrow');
        var $infoHeads = $heads.find('.trigger__info--heads');
        var $infoTails = $heads.find('.trigger__info--tails');
        var $infoTailsNav = $tails.find('#tails_contents__nav');
        $infoTailsNav.css('opacity', 0);


        // reset scroll
        jQuery('body').stop().animate({ scrollTop: 0 }, 2000);

        function navigation() {

            var isOpen = false;
            var isSliding = false;

            // Update the location of the trigger area
            function updateTrigger() {
                var properties;

                if (isOpen) {
                    properties = { top: 0, bottom: 'auto' };
                } else {
                    properties = { top: 'auto', bottom: 0 };
                }

                $trigger.css(properties);
            }

            function open() {
                if (isSliding) {
                    return false;
                }

                var to;
                var y;

                if (isOpen) {
                    to = 'heads';
                    y = -90;
                    events.trigger('heads:visible');
                } else {
                    to = 'tails';
                    y = -10;
                    $infoArrow.stop().animate({ opacity: 0, bottom: 20 }, 500);
                }

                var props = { y: y + '%' };

                $heads.stop().animate(props, { duration: 400, easing: 'swing' });
                $tails.stop().animate(props, { duration: 400, easing: 'swing' });
            }

            function close() {
                if (isSliding) {
                    return false;
                }

                var to;
                var y;

                if (isOpen) {
                    to = 'heads';
                    y = -100;
                } else {
                    to = 'tails';
                    y = 0;
                    $infoArrow.stop().animate({ opacity: 0.5, bottom: 0 }, 500);
                }

                var props = { y: y + '%' };

                function onComplete() {
                    if (to === 'heads') {
                        events.trigger('heads:invisible');
                    }
                }

                $heads.stop().animate(props, { duration: 400, easing: 'swing' });
                $tails.stop().animate(props, { duration: 400, easing: 'swing', complete: onComplete });
            }

            // Slide between heads and tails 
            function slide(callback) {
                isSliding = true;

                var to;
                var y;
                var durations;

                if (isOpen) {
                    to = 'heads';
                    y = 0;
                    durations = [1050, 1000];
                    events.trigger('heads:visible');
                    $infoHeads.animate({ opacity: 0 }, 800);
                    $infoArrow.stop().animate({ opacity: 0.5, bottom: 0 }, 500);
                    $infoTailsNav.animate({ opacity: 0 }, 800);
                } else {
                    to = 'tails';
                    y = -100;
                    durations = [1000, 1050];
                    $infoTails.animate({ opacity: 0 }, 800);
                    $infoTailsNav.animate({ opacity: 1 }, 800);
                    $infoArrow.stop().animate({ opacity: 0, bottom: 20 }, 500);

                    blogContent();
                }

                events.trigger('slideBegin', { to: to });

                var props = { y: y + '%' };

                function onComplete() {
                    isSliding = false;

                    events.trigger('slideComplete', { to: to });

                    if (to === 'tails') {
                        events.trigger('heads:invisible');

                        $infoHeads.css('opacity', 1);
                        $infoTailsNav.css('opacity', 1);
                    } else {
                        $infoTails.css('opacity', 1);
                        $infoTailsNav.css('opacity', 0);
                    }

                    if (callback) {
                        callback();
                    }
                }

                $heads.stop().animate(props, { duration: durations[0], easing: 'easeInOutCubic' });
                $tails.stop().animate(props, { duration: durations[1], easing: 'easeInOutCubic', complete: onComplete });

                isOpen = !isOpen;

                updateTrigger();
            }

            $trigger.on({
                mouseenter: function() {
                    open();
                },
                mouseleave: function() {
                    close();
                },
                click: function() {
                    slide();
                }
            });

            events.on('endSlide', function() {
                slide(this);
            });

            $infoHeads.css('opacity', 0);
        }

        function blogTab() {
            var current = $(".nav .active");

            $("#tails_contents__nav a").on("click", function() {

                blogContent();

                console.log('2======');
                current.removeClass("active");
                var lastDiv = current.parent().attr("value");
                $('.tails__contents__asset').scrollTop();
                $('.tails__contents__asset .' + lastDiv).hide();
                $('.tails__contents__asset .' + lastDiv).scrollTop();

                current = $(this);
                current.addClass("active");
                var currentDiv = current.parent().attr("value");
                $('.tails__contents__asset .' + currentDiv).show();
                $('.tails__contents__asset .' + currentDiv).scrollTop();

                var position = $(this)
                    .parent()
                    .position();
                var width = $(this)
                    .parent()
                    .width();
                $("#tails_contents__nav .slide1").css({ opacity: 1, left: +position.left, width: width });
            });

            $("#tails_contents__nav a").on("mouseover", function() {
                var position = $(this)
                    .parent()
                    .position();
                var width = $(this)
                    .parent()
                    .width();
                $("#tails_contents__nav .slide2")
                    .css({
                        opacity: 1,
                        left: +position.left,
                        width: width
                    })
                    .addClass("squeeze");
            });

            $("#tails_contents__nav a").on("mouseout", function() {
                $("#tails_contents__nav .slide2")
                    .css({ opacity: 0 })
                    .removeClass("squeeze");
            });

            // setup
            var currentWidth = $("#tails_contents__nav .nav .active").parent().width();
            var currentPosition = $("#tails_contents__nav .nav .active").parent().position();
            $("#tails_contents__nav .slide1").css({ left: +currentPosition.left, width: currentWidth });

            $tails.find('.tails__blog').show();
            $tails.find('.tails__book').hide();
            $tails.find('.tails__video').hide();
            $tails.find('.tails__album').hide();
            $tails.find('.tails__about').hide();
            $tails.find('.tails__reflink').hide();
        }

        function switchTab(tabValue) {
            console.log('1======' + tabValue);
            console.log($(tabValue + ' a'));
            $(tabValue + ' a').trigger('click');
        }

        function blogContent() {
            if (!isLoadBlogContent) {
                isLoadBlogContent = true;
                loadData('./app/public/data/fakerdata.txt', function() {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        var json = xmlhttp.responseText;
                        if (typeof json != "undefined" && json != null && json !== '') {
                            var data = JSON.parse(unescape(Cipher.decipher(json)));
                            console.log(data);
                            generateTails(data);
                        }
                    } else {
                        return '';
                    }
                })
            }
        }

        function generateTails(data) {
            generateTailsBlog(safeArray(data.blogType), data.blogs);
            generateTailsBook(safeArray(data.books));
            generateTailsVideo(safeArray(data.videos));
            generateTailsAlbum(safeArray(data.albums));
            generateTailsReflink();
        }

        function generateTailsBlog(blogType, blogs) {
            // tails__blog__tags
            // var $tailsBlogTags = $tails.find('.tails__blog__tags');
            // blogType.forEach(element => {
            //     if (!element.hidden) {
            //         if (element.list != null && element.list.length > 0) {
            //             for (const item of element.list) {
            //                 if (!item.hidden) {
            //                     var el = `
            //                     <div class="box shadow">
            //                         <a href="${item.link}" target="_blank">${item.title}</a>
            //                         <div class="circle"></div>
            //                     </div>
            //                   `;
            //                     $tailsBlogTags.append(el);
            //                 }
            //             }
            //         }
            //     }
            // });

            // tails__blog__posts
            var $tailsBlogPosts = $tails.find('.tails__blog__posts');
            blogs.forEach(element => {
                var typeStr = "" + element.type;
                var tagStr = "";
                for (const tagItem of element.tags) {
                    if (tagStr.length > 0) {
                        tagStr += " · ";
                    }
                    tagStr += tagItem;
                }

                if (typeStr.length > 0 && tagStr.length > 0) {
                    typeStr += " · "
                }

                var el = `
                <div class="tails__blog__posts__item">
                <a href="${element.link}" target="_blank">
                    <div class="post__meta">${element.date}<span class="post__meta__tag">${typeStr}${tagStr}</span></div>
                    
                        <h3 class="post__title">${element.title}</h3>
                    
                    <div class="post__summary">${element.desc}</div>
                    </a>
                </div>
              `;
                $tailsBlogPosts.append(el);
            });
        }

        function generateTailsBook(books) {
            // tails__book
            const countInRow = 6;
            var $tailsBook = $tails.find('.tails__book');
            var $tailsBookContent = $tailsBook.find('.dy-videos');
            books.forEach(element => {
                var titleEl = `
                <h2>${element.title}年</h2>
                `;
                var $listEl = $(`<ul class="dy-video-list"></ul>`);
                $tailsBookContent.append(titleEl);

                var idx = 0;
                for (const bookItem of safeArray(element.books)) {
                    var tagStr = "";
                    for (const tagItem of bookItem.tags) {
                        if (tagStr.length > 0) {
                            tagStr += " | ";
                        }
                        tagStr += tagItem;
                    }
                    var metaPosition = (idx % countInRow) > (countInRow / 2) ? "dy-video-meta-left" : "dy-video-meta-right";
                    idx += 1;
                    var dateStr = bookItem.recently.substring(5);
                    var bookEl = `
                    <li data- class="dy-video-item ${metaPosition}">
                        <div class="dy-video-meta">
                            <div class="dy-video-meta-dy">
                                <div class="dy-video-title">${bookItem.name}</div>
                                <div class="dy-video-author">作者：${bookItem.author}</div>
                                <div class="dy-video-tag">标签：${tagStr}</div>
                                <div class="dy-video-gnosis">读后感：${bookItem.desc}</div>
                            </div>
                            <div class="dy-video-meta-bg"> </div>
                        </div>
                        <div class="dy-video-poster">
                            <a class="dy-video-link"> <img class="dy-video-img" src="${bookItem.img}" alt="${bookItem.name}"> <span class="dy-video-nocomplete"></span> <span class="dy-video-date"> ${bookItem.type} </span> <span class="dy-video-bg"></span> <span class="s-pay"></span>                                                </a>
                        </div>
                        <div class="dy-video-primary">
                            <div class="dy-video-title">${bookItem.name}</div>
                            <!-- <span class="dy-video-rating"> ${bookItem.name} </span> </div> -->
                            <div class="dy-video-desc">最近阅读：${dateStr}</div>
                        </div>
                    </li>
                    `;
                    $listEl.append(bookEl);
                }
                $tailsBookContent.append($listEl);
            });

        }

        function generateTailsVideo(videos) {
            // tails__video
            const countInRow = 6;
            var $tailsBook = $tails.find('.tails__video');
            var $tailsBookContent = $tailsBook.find('.dy-videos');
            videos.forEach(element => {
                var titleEl = `
    <h2>${element.title}年</h2>
    `;
                var $listEl = $(`<ul class="dy-video-list"></ul>`);
                $tailsBookContent.append(titleEl);
                var idx = 0;
                for (const bookItem of safeArray(element.books)) {
                    var tagStr = "";
                    for (const tagItem of bookItem.tags) {
                        if (tagStr.length > 0) {
                            tagStr += " | ";
                        }
                        tagStr += tagItem;
                    }

                    var metaPosition = (idx % countInRow) > (countInRow / 2) ? "dy-video-meta-left" : "dy-video-meta-right";
                    idx += 1;
                    var dateStr = bookItem.recently.substring(5);
                    var bookEl = `
        <li data- class="dy-video-item ${metaPosition}">
            <div class="dy-video-meta">
                <!-- <div class="dy-video-meta-bg"> </div> -->
                <div class="dy-video-meta-dy">
                    <div class="dy-video-title">${bookItem.name}</div>
                    <div class="dy-video-author">主演：${bookItem.author}</div>
                    <div class="dy-video-tag">标签：${tagStr}</div>
                    <div class="dy-video-gnosis">观后感：${bookItem.desc}</div>
                </div>
                <div class="dy-video-meta-bg"> </div>
            </div>
            <div class="dy-video-poster">
                <a class="dy-video-link"> <img class="dy-video-img" src="${bookItem.img}" alt="${bookItem.name}"> <span class="dy-video-nocomplete"></span> <span class="dy-video-date"> ${bookItem.type} </span> <span class="dy-video-bg"></span> <span class="s-pay"></span>                                                </a>
            </div>
            <div class="dy-video-primary">
                <div class="dy-video-title">${bookItem.name}</div>
                <!-- <span class="dy-video-rating"> ${bookItem.name} </span> </div> -->
                <div class="dy-video-desc">最近观看：${dateStr}</div>
            </div>
        </li>
        `;
                    $listEl.append(bookEl);
                }
                $tailsBookContent.append($listEl);
            });
        }

        function generateTailsAlbum(albums) {

            var $tailsAlbum = $tails.find('.tails__album');
            var width = 280;

            albums.forEach(element => {
                var h = parseInt(width * element.height / element.width);
                var el = `
                <img src="${element.cover}" class="tails__album__item" height="${h}px">
                `;

                $tailsAlbum.append(el);
            });

        }

        function generateTailsReflink() {
            var reflinks = [{
                "title": "",
                "list": [{
                    "name": "Alchemy",
                    "url": "https://auth.alchemy.com",
                    "img": "https://assets-global.website-files.com/5f973c970bea5548ad4287ef/630901d7a9a833c9902b187a_Frame%2013681.svg",
                    "desc": "Web3世界的AWS"
                }]
            }];

            // tails__video
            var $tailsReflink = $tails.find('.tails__reflink');
            reflinks.forEach(element => {
                var titleEl = `
    <h2>${element.title}</h2>
    `;
                var $listEl = $(`<div class="tails__reflink__list"></div>`);
                $tailsReflink.append(titleEl);
                for (const reflinkItem of safeArray(element.list)) {
                    var reflinkEl = `
                    <div class="tails__reflink__list__item">
                    <a href="${reflinkItem.url}" target="_blank">
                        <div class="item__content">
                            <div class="item__content__left">
                                <img src="${reflinkItem.img}" alt="" class="item__content__left__img">
                            </div>
                            <div class="item__content__right">
                                <div class="item__content__right__title">${reflinkItem.name}</div>
                                <div class="item__content__right__desc">${reflinkItem.desc}</div>
                            </div>

                        </div>
                    </a>
                </div>
        `;
                    $listEl.append(reflinkEl);
                }
                $tailsReflink.append($listEl);
            });
        }

        function safeArray(array) {
            if (typeof array != "undefined" && array != null && array.length > 0) {
                return array;
            } else {
                return [];
            }
        }

        function loadData(url, cfunc) {
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = cfunc;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        };

        function setup() {
            navigation();
            blogTab();

            setTimeout(() => {
                blogContent();
            }, 10000);

            return APP.getInstance();
        }

        return {
            /**
             * Start APP
             *
             * @method start
             */
            start: setup,

            /**
             * Listen to APP event bus
             *
             * @method on
             * @param {String} [event]
             * @param {Function} [callback]
             **/
            on: function() {
                events.on.apply(events, arguments);
            },

            /**
             * Trigger slide on APP event bus
             * 
             * @method slide
             **/
            slide: function(callback) {
                events.trigger('endSlide', callback);
            },

            switch: function(tabValue) {
                console.log('======' + tabValue);
                switchTab(tabValue);
            }
        };
    }

    return {
        /**
         * Return APP instance
         *
         * @method getInstance
         * @return {APP}
         */
        getInstance: function() {
            if (!instance) {
                instance = init();
            }

            return instance;
        }
    };
})();

module.exports = APP.getInstance();