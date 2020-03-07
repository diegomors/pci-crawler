var fs = require('fs');
var shell = require('shelljs');
var Crawler = require("crawler");

var list = new Crawler({
    maxConnections: 1,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;

            var resultado = $('.resultado').text();
            if (resultado && resultado.trim() === 'Sua pesquisa não encontrou nenhuma prova correspondente') {
                done();
                return;
            }

            $('.prova_download').each(function (i, e) {
                var elem = $(e);
                var elemName = elem.text();

                if (elemName.match(/SISTEMA/gi)) {
                    item.queue(e.attribs.href);
                }
            });

            pageIndex++;
            list.queue(pageUrl + pageIndex);
        }
        done();
    }
});

var item = new Crawler({
    maxConnections: 100,
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;

            var title = $('#download > h2').text().replace(/\//g, '-');
            var year = $('.linkd > li').eq(1).text().replace(/Ano:\s*/g, '');
            var folder = year + ' - ' + title;

            console.log(folder);
            $('.pdf_download > li > a').each(function (i, e) {
                console.log($(e).text());
                download.queue({ uri: e.attribs.href, folder: folder, filename: $(e).text() });
            });
        }
        done();
    }
});

var download = new Crawler({
    maxConnections: 500,
    encoding: null,
    jQuery: false,
    callback: function (err, res, done) {
        if (err) {
            console.error(err.stack);
        } else {
            var folder = './out/' + res.options.folder;
            shell.mkdir('-p', folder);
            fs.createWriteStream(folder + '/' + res.options.filename).write(res.body);
        }

        done();
    }
});


var pageIndex = 1;
var pageUrl = 'https://www.pciconcursos.com.br/provas/fcc/';

list.queue(pageUrl + pageIndex);