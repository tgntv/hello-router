
var path = require("path");
var fs = require("fs");

function route(handle, pathname, response, request) {
  console.log("About to route a request for " + pathname);

  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else {
	  var filename = path.join(process.cwd(), pathname);
	  path.exists(filename, function(exists) {
	    if(!exists) {
			  console.log("No request handler found for " + pathname);
		    response.writeHead(404, {"Content-Type": "text/plain"});
		    response.write("404 Not found\n");
		    response.end();

      } else {

       	fs.readFile(filename, "binary", function(err, file) {
	      	if(err) {
	        	response.writeHead(500, {"Content-Type": "text/plain"});
	          response.end(err + "\n");
	        } else {
	          response.writeHead(200);
	          response.end(file, "binary");
	        }
	      });
	    }
	  });
  }
}

exports.route = route;
