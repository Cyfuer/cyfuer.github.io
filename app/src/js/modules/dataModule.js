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

var DATA = (function () {
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

    function isEmptyString(obj){
        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }
    

    async function loadData() {
        try {
            // blog
            if (true){
                const blogTypeDatabaseId = '191253ba5d8e45e9b4c75b74086387bf';
                const blogDatabaseId = '06946b0476c14d159ec1642faf34c2b2';

                const blogTypeResponse = await notion.databases.query({
                    database_id: blogTypeDatabaseId,
                    sorts: [
                        {
                            property: 'Sort',
                            direction: 'ascending',
                        }
                    ]
                });
                const blogResponse = await notion.databases.query({
                    database_id: blogDatabaseId,
                    sorts: [
                        {
                            property: 'Sort',
                            direction: 'ascending',
                        }
                    ]
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

                data.blog = blogTypes;
            }

            // block
            if (true) {
                const blockTypeDatabaseId = '5d19b5a2b3404c879fcf0dee7040a2ef';
                const blockDatabaseId = 'd663fbe8f3694b6b88939ff4afc85c33';

                const blockTypeResponse = await notion.databases.query({
                    database_id: blockTypeDatabaseId,
                    sorts: [
                        {
                            property: 'Sort',
                            direction: 'ascending',
                        }
                    ]
                });
                const blockResponse = await notion.databases.query({
                    database_id: blockDatabaseId,
                    sorts: [
                        {
                            property: 'Sort',
                            direction: 'ascending',
                        }
                    ]
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

                data.block = blockTypes;
            }

            // book
            if (true) {
                const bookDatabaseId = 'd4aef22070484563b83eb961910a0279';
                const bookResponse = await notion.databases.query({
                    database_id: bookDatabaseId,
                    sorts: [
                        {
                            property: 'Recently',
                            direction: 'descending',
                        }
                    ]
                });

                console.log(bookResponse);

                var years = [];
                var books = [];
                var currentYear = {
                    title: '',
                    books:[]
                };
                bookResponse.results.forEach(element => {
                    var book = {};
                    book.author = notion_readRichText(element.properties.Author.rich_text);
                    book.desc = notion_readRichText(element.properties.Desc.rich_text);
                    book.img = element.properties.Img.url;
                    book.name = notion_readRichText(element.properties.Name.title);
                    book.recently = notion_readDate(element.properties.Recently.date);
                    book.recommend = element.properties.Recommend.number;
                    book.tags = element.properties.Tags.multi_select;
                    book.type = element.properties.Type.select.name;
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

                data.book = books;
            }

            // product
            if (true) {
                const productDatabaseId = 'cd1ff5996923466f921a61d21cefe270';
                const productResponse = await notion.databases.query({
                    database_id: productDatabaseId,
                    sorts: [
                        {
                            property: 'Date',
                            direction: 'descending',
                        }
                    ]
                });

                var years = [];
                var products = [];
                var currentYear = {
                    title: '',
                    products:[]
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

            // myproducts
            if (true) {
                data.myproduct = [

                ];
            }

            // hobby
            if (true) {
                data.hobby = [

                ];
            }

            console.log('---' + escape(JSON.stringify(data)));
            console.log('0---\n');
            console.log(Cipher);

            // escape 解决中文乱码问题
            console.log('json:' + Cipher.cipher(escape(JSON.stringify(data))));

        } catch (error) {
            console.error(error.body);
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }

            return instance;
        },
    }
})();

module.exports = DATA.getInstance();