
var tempFolder = 'c:/temp'; // Windows needs drive:/path
//var tempFolder = '/tmp'; // Linux needs /tmp

var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(response) {
  console.log("Request handler 'start' was called.");

  var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" '+
    'content="text/html; charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" '+
    'method="post">'+
    '<input type="file" name="upload" multiple="multiple">'+
    '<input type="submit" value="Upload file" />'+
    '</form>'+
    '</body>'+
    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

  var fileName = tempFolder + "/test.png";

    /* Possible error on Windows systems:
       tried to rename to an already existing file */
    fs.rename(files.upload.path, fileName, function(err) {
      if (err) {
        fs.unlink(fileName);
        fs.rename(files.upload.path, fileName);
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

function show(response) {
  console.log("Request handler 'show' was called.");

  var fileName = tempFolder + "/test.png";

  fs.readFile(fileName, "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();

			// delete temporary file
      fs.unlink(fileName);
    }
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.blackhole = function() {};
