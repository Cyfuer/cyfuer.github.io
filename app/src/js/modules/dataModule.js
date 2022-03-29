'use strict';

var jQuery = require('jquery');
var Cipher = require('../utils/cipherUtil')
var { Client } = require("@notionhq/client");

/**
 * Handle navigation between heads/tails
 *
 * @module DATA
 * @event [heads:visible] Heads is at least partially in the viewport
 * @event [heads:invisible] Heads is completely out of the viewport
 * @requires jQuery, Events
 */

var DATA = (function() {
    var instance;
    var notion;
    var data = {};



    function init() {
        notion = new Client({ auth: 'secret_fDrblc7hdwVKSWGkKssppCISd2eSPgInEnz5WLWVOmD' });
        loadData();
    }

    function notion_readRichText(richText) {
        if (typeof(richText) != "undefined" && richText.length) {
            return richText[0].text.content;
        } else {
            return '';
        }
    }

    function notion_readDate(date) {
        if (date != null) {
            return date.start;
        } else {
            return '';
        }
    }

    function notion_readCover(cover) {
        if (cover == null) {
            return "";
        } else {
            if (cover.type === "file") {
                return cover.file.url;
            } else {
                return "";
            }
        }
    }

    function notion_readSelect(select) {
        if (select != null) {
            return select.name;
        } else {
            return "";
        }
    }

    function notion_readMultiSelect(multiSelect) {
        if (multiSelect != null && multiSelect.length > 0) {
            return multiSelect.map(x => { return x.name });
        } else {
            return [];
        }
    }

    function notion_readUTC(utc) {
        if (isEmptyString(utc)) {
            return "";
        } else {
            var date = new Date(utc);
            return formatTime(utc, "yyyy-MM-dd")
        }
    }

    function isEmptyString(obj) {
        if (typeof obj == "undefined" || obj == null || obj == "") {
            return true;
        } else {
            return false;
        }
    }

    function formatTime(time, format) {
        var date = new Date(time);
        var formatter = function(i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
            switch (a) {
                case 'yyyy':
                    return formatter(date.getFullYear());
                    break;
                case 'MM':
                    return formatter(date.getMonth() + 1);
                    break;
                case 'mm':
                    return formatter(date.getMinutes());
                    break;
                case 'dd':
                    return formatter(date.getDate());
                    break;
                case 'HH':
                    return formatter(date.getHours());
                    break;
                case 'ss':
                    return formatter(date.getSeconds());
                    break;
            }
        })
    }


    async function loadData() {
        try {
            var config = {
                blogType: true, // 博客类别
                blogs: true, // 最近博客列表
                blockchain: false, // 区块链类别
                books: true, // 书单
                videos: true, // 影视
                product: false, // 项目
                myproducts: false, // 我的项目
                hobby: false, // 爱好
                albums: false, // 相册
            };

            console.log('1------');


            // blog Type
            if (config.blogType) {
                const blogTypeDatabaseId = '191253ba5d8e45e9b4c75b74086387bf';
                const blogDatabaseId = '06946b0476c14d159ec1642faf34c2b2';

                const blogTypeResponse = await notion.databases.query({
                    database_id: blogTypeDatabaseId,
                    sorts: [{
                        property: 'Sort',
                        direction: 'ascending',
                    }]
                });
                const blogResponse = await notion.databases.query({
                    database_id: blogDatabaseId,
                    sorts: [{
                        property: 'Sort',
                        direction: 'ascending',
                    }]
                });

                var blogTypes = [];
                blogTypeResponse.results.forEach(element => {
                    var type = {};
                    type.title = notion_readRichText(element.properties.Name.title);
                    type.hidden = element.properties.Hidden.checkbox;
                    type.list = [];
                    blogTypes.push(type);
                });
                blogResponse.results.forEach(element => {
                    var blog = {};
                    blog.title = notion_readRichText(element.properties.Name.title);
                    blog.link = element.properties.Link.url;
                    blog.img = element.properties.Img.url;
                    blog.hidden = element.properties.Hidden.checkbox;
                    blog.type = element.properties.Type.select.name;

                    for (const blogType of blogTypes) {
                        if (blogType.title === blog.type) {
                            blogType.list.push(blog);
                            break;
                        }
                    }
                });

                data.blogType = blogTypes;
            }

            console.log('2------');

            // blogs
            if (config.blogs) {

                const blogDatabaseId = '1ea54bc16376469eb9ca4923bceeb12b';

                const blogResponse = await notion.databases.query({
                    database_id: blogDatabaseId,
                    sorts: [{
                        property: 'Last edited time',
                        direction: 'descending',
                    }],
                    page_size: 50
                });

                var blogs = [];
                blogResponse.results.forEach(element => {
                    var blog = {};
                    blog.title = notion_readRichText(element.properties.Title.title);
                    blog.date = notion_readUTC(element.last_edited_time);
                    blog.desc = notion_readRichText(element.properties.Desc.rich_text);
                    blog.type = notion_readSelect(element.properties.Type.select);
                    blog.tags = notion_readMultiSelect(element.properties.Tags.multi_select);
                    blog.link = "https://roomy-octopus-669.notion.site/" + element.id.replace(/-/g, "");
                    blogs.push(blog);
                });

                data.blogs = blogs;
            }
            console.log('3------');


            // blockchain
            if (config.blockchain) {
                const blockTypeDatabaseId = '5d19b5a2b3404c879fcf0dee7040a2ef';
                const blockDatabaseId = 'd663fbe8f3694b6b88939ff4afc85c33';

                const blockTypeResponse = await notion.databases.query({
                    database_id: blockTypeDatabaseId,
                    sorts: [{
                        property: 'Sort',
                        direction: 'ascending',
                    }]
                });
                const blockResponse = await notion.databases.query({
                    database_id: blockDatabaseId,
                    sorts: [{
                        property: 'Sort',
                        direction: 'ascending',
                    }]
                });

                var blockTypes = [];
                blockTypeResponse.results.forEach(element => {
                    var type = {};
                    type.title = notion_readRichText(element.properties.Name.title);
                    type.hidden = element.properties.Hidden.checkbox;
                    type.list = [];
                    blockTypes.push(type);
                });
                blockResponse.results.forEach(element => {
                    var blog = {};
                    blog.title = notion_readRichText(element.properties.Name.title);
                    blog.link = element.properties.Link.url;
                    blog.img = element.properties.Img.url;
                    blog.hidden = element.properties.Hidden.checkbox;
                    blog.type = element.properties.Type.select.name;

                    for (const blockType of blockTypes) {
                        if (blockType.title === blog.type) {
                            blockType.list.push(blog);
                            break;
                        }
                    }
                });

                data.blockchain = blockTypes;
            }
            console.log('4------');

            // books
            if (config.books) {
                const pageSize = 50;
                var startCursor;
                var years = [];
                var books = [];
                var currentYear = {
                    title: '',
                    books: []
                };
                var finished = false;
                const bookDatabaseId = 'd4aef22070484563b83eb961910a0279';

                while (!finished) {
                    var bookResponse = await notion.databases.query({
                        database_id: bookDatabaseId,
                        sorts: [{
                            property: 'Recently',
                            direction: 'descending',
                        }],
                        page_size: pageSize,
                        start_cursor: startCursor
                    });

                    bookResponse.results.forEach(element => {
                        var book = {};
                        book.author = notion_readRichText(element.properties.Author.rich_text);
                        book.desc = notion_readRichText(element.properties.Desc.rich_text);
                        book.img = element.properties.Img.url;
                        book.name = notion_readRichText(element.properties.Name.title);
                        book.recently = notion_readDate(element.properties.Recently.date);
                        book.recommend = element.properties.Recommend.number;
                        book.tags = notion_readMultiSelect(element.properties.Tags.multi_select);
                        book.type = notion_readSelect(element.properties.Type.select);
                        book.hidden = element.properties.Hidden.checkbox;

                        var _year;
                        if (!isEmptyString(book.recently)) {
                            _year = book.recently.split('-')[0];
                        } else {
                            var date = new Date;
                            _year = date.getFullYear();
                        }

                        if (years.indexOf(_year) > -1) {
                            currentYear.books.push(book);
                        } else {
                            currentYear = {
                                title: _year,
                                books: [book]
                            };
                            books.push(currentYear);
                            years.push(_year);
                        }
                    });

                    if (!bookResponse.has_more) {
                        finished = true;
                    } else {
                        startCursor = albumResponse.next_cursor;
                    }
                }


                data.books = books;
            }
            console.log('5------');

            // videos
            if (config.videos) {
                const pageSize = 50;
                var startCursor;
                var years = [];
                var books = [];
                var currentYear = {
                    title: '',
                    books: []
                };
                var finished = false;
                const bookDatabaseId = 'db858b1c989143ecb9fa86f163f5d33c';

                while (!finished) {
                    var bookResponse = await notion.databases.query({
                        database_id: bookDatabaseId,
                        sorts: [{
                            property: 'Recently',
                            direction: 'descending',
                        }],
                        page_size: pageSize,
                        start_cursor: startCursor
                    });

                    bookResponse.results.forEach(element => {
                        var book = {};
                        book.author = notion_readRichText(element.properties.Author.rich_text);
                        book.desc = notion_readRichText(element.properties.Desc.rich_text);
                        book.img = element.properties.Img.url;
                        book.name = notion_readRichText(element.properties.Name.title);
                        book.recently = notion_readDate(element.properties.Recently.date);
                        book.recommend = element.properties.Recommend.number;
                        book.tags = notion_readMultiSelect(element.properties.Tags.multi_select);
                        book.type = notion_readSelect(element.properties.Type.select);
                        book.hidden = element.properties.Hidden.checkbox;

                        var _year;
                        if (!isEmptyString(book.recently)) {
                            _year = book.recently.split('-')[0];
                        } else {
                            var date = new Date;
                            _year = date.getFullYear();
                        }

                        if (years.indexOf(_year) > -1) {
                            currentYear.books.push(book);
                        } else {
                            currentYear = {
                                title: _year,
                                books: [book]
                            };
                            books.push(currentYear);
                            years.push(_year);
                        }
                    });

                    if (!bookResponse.has_more) {
                        finished = true;
                    } else {
                        startCursor = albumResponse.next_cursor;
                    }
                }


                data.videos = books;
            }
            console.log('6------');


            // product
            if (config.product) {
                const productDatabaseId = 'cd1ff5996923466f921a61d21cefe270';
                const productResponse = await notion.databases.query({
                    database_id: productDatabaseId,
                    sorts: [{
                        property: 'Date',
                        direction: 'descending',
                    }]
                });

                var years = [];
                var products = [];
                var currentYear = {
                    title: '',
                    products: []
                };
                console.log(productResponse);
                productResponse.results.forEach(element => {
                    var product = {};
                    product.img = element.properties.Img.url;
                    product.name = notion_readRichText(element.properties.Name.title);
                    product.desc = notion_readRichText(element.properties.Desc.rich_text);
                    product.dutys = element.properties.Duty.multi_select;
                    product.tags = element.properties.Tags.multi_select;
                    product.date = notion_readDate(element.properties.Date.date);
                    product.hidden = element.properties.Hidden.checkbox;

                    var _year;
                    if (!isEmptyString(product.date)) {
                        _year = product.date.split('-')[0];
                    } else {
                        var date = new Date;
                        _year = date.getFullYear();
                    }

                    if (years.indexOf(_year) > -1) {
                        currentYear.products.push(product);
                    } else {
                        currentYear = {
                            title: _year,
                            products: [product]
                        };
                        products.push(currentYear);
                        years.push(_year);
                    }
                });

                data.product = products;
            }
            console.log('7------');

            // myproducts
            if (config.myproducts) {
                data.myproducts = [

                ];
            }
            console.log('8------');

            // hobby
            if (config.hobby) {
                data.hobby = [

                ];
            }
            console.log('9------');

            // albums
            if (config.albums) {

                console.log('10------1');
                const pageSize = 50;
                var startCursor;
                var albums = [];
                const albumDatabaseId = '027df2b72f114bbc8ab51158afb834ab';
                var finished = false;

                console.log('10------2');
                while (!finished) {
                    console.log('10------3');
                    var albumResponse = await notion.databases.query({
                        database_id: albumDatabaseId,
                        sorts: [{
                            property: 'Date',
                            direction: 'descending',
                        }],
                        page_size: pageSize,
                        start_cursor: startCursor
                    });
                    console.log('10------4');

                    albumResponse.results.forEach(element => {
                        var album = {};
                        console.log('10------4-1');
                        album.date = notion_readDate(element.properties.Date.date);
                        console.log('10------4-2');
                        album.width = element.properties.Width.number;
                        console.log('10------4-3');
                        album.height = element.properties.Height.number;
                        console.log('10------4-4');
                        // album.title = notion_readRichText(element.properties.Name.title);
                        album.cover = notion_readCover(element.cover);
                        console.log('10------4-5');
                        albums.push(album);
                    });

                    console.log('10------5');

                    if (!albumResponse.has_more) {
                        finished = true;
                        console.log('10------6');
                    } else {
                        startCursor = albumResponse.next_cursor;
                        console.log('10------7');
                    }
                }

                console.log('10------8');

                data.albums = albums;
            }
            console.log('10------');

            console.log(JSON.stringify(data));

            // escape 解决中文乱码问题
            console.log('json:\n' + Cipher.cipher(escape(JSON.stringify(data))));

        } catch (error) {
            console.error(error.body);
        }
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }

            return instance;
        },
    }
})();

module.exports = DATA.getInstance();