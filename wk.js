#!/usr/bin/env node

var BG_RED = "\x1b[41m";
var FG_RED = "\x1b[31m"
var RESET = "\x1b[0m";

var FS = require('fs');

var args = process.argv.slice(2);
var command = args[0];

var SOURCE_DISPATCHER = 'aWYgKHR5cGVvZiBfX3drID09ICJ1bmRlZmluZWQiKQoJdmFyIF9fd2sgPSB7fTsKCl9fd2suZXZlbnRzID0ge307CgpmdW5jdGlvbiBzdWIoYWN0aW9uICwgZikKewoJaWYgKHR5cGVvZiBfX3drLmV2ZW50c1thY3Rpb25dID09ICd1bmRlZmluZWQnKQoJCV9fd2suZXZlbnRzW2FjdGlvbl0gPSBbXTsKCglfX3drLmV2ZW50c1thY3Rpb25dLnB1c2goZik7Cn0KCmZ1bmN0aW9uIHVuc3ViKGFjdGlvbiAsIGYpCnsKCWlmICh0eXBlb2YgX193ay5ldmVudHNbYWN0aW9uXSA9PSAndW5kZWZpbmVkJykKCQlyZXR1cm47CgoJZm9yICh2YXIgaT0wO2k8X193ay5ldmVudHNbYWN0aW9uXS5sZW5ndGg7aSsrKQoJewoJCWlmIChfX3drLmV2ZW50c1thY3Rpb25dW2ldID09IGYpCgkJewoJCQlfX3drLmV2ZW50c1thY3Rpb25dLnNwbGljZShpLDEpOwoJCQlpLS07CgkJfQoJfQp9CgpmdW5jdGlvbiBwdWIoYWN0aW9uKQp7CglpZiAoIChhY3Rpb24gfCAwKSAhPSBhY3Rpb24pCgkJdGhyb3coJ2JhZCBhY3Rpb24nKTsKCglpZiAodHlwZW9mIF9fd2suZXZlbnRzW2FjdGlvbl0gPT0gJ3VuZGVmaW5lZCcpCgkJcmV0dXJuOwoKCWZvciAodmFyIGk9MDtpPF9fd2suZXZlbnRzW2FjdGlvbl0ubGVuZ3RoO2krKykKCQlfX3drLmV2ZW50c1thY3Rpb25dW2ldKCk7Cn0KCnZhciBzaWcgPSBmdW5jdGlvbihhY3Rpb24pCnsKCXJldHVybiBmdW5jdGlvbigpeyBwdWIoYWN0aW9uKSB9Cn0K';
var SOURCE_ELEMENT = 'RWxlbWVudC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKHN0cikKewoJc3RyID0gJy4nK3N0cjsKCXJldHVybiB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGwoc3RyKVswXTsKfQ==';
var SOURCE_STORE = 'dmFyIHN0b3JlID0ge307CnN0b3JlLl8gPSB7fTsKCnN0b3JlLmhhcyA9IGZ1bmN0aW9uKGtleSkKewoJcmV0dXJuIHR5cGVvZiBzdG9yZS5fW2tleV0gIT0gJ3VuZGVmaW5lZCcKfQoKc3RvcmUuZ2V0ID0gZnVuY3Rpb24oa2V5KQp7CglyZXR1cm4gc3RvcmUuX1trZXldOwp9CgpzdG9yZS5zZXQgPSBmdW5jdGlvbihrZXksdmFsdWUpCnsKCXJldHVybiBzdG9yZS5fW2tleV0gPSB2YWx1ZTsKfQo=';
var SOURCE_UTIL = 'dmFyIHV0aWwgPSB7fTsKdXRpbC5yYW5kb21BbHBoYU51bSA9IGZ1bmN0aW9uKGxlbmd0aCkKewoJLy8gNjIgY2hhcnMgCgkvLyBNYXRoLmxvZzIoNjIpID0gNS45NTQgYml0IGVudHJvcHkgcGVyIGNoYXJhY3RlcgoJLy8gbGVuZ3RoID0gMjIgd2lsbCBnaXZlIHlvdSBhIH4xMjggYml0IHJhbmRvbW5lc3MKCXZhciBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHJxc3R1d3Z4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVXVlhZWicKCXZhciByID0gJyc7Cglmb3IgKHZhciBpPTA7aTxsZW5ndGg7aSsrKQoJCXIgKz0gYWxwaGFiZXRbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYWxwaGFiZXQubGVuZ3RoKV07CgkKCXJldHVybiByOwp9Cg==';

var commands = {
	"init"  : init,
	"deinit"  : deinit,
	"start" : start,
	"new" : newComponent
}
args = args.slice(1);

if (typeof commands[command] == 'undefined')
	printSmallHelp(command);
else
	commands[command](args);


function printSmallHelp(c)
{
	if (typeof c != 'undefined')
		error("invalid command: " + c);
	log("usage:");
	log("	wk init   | initializes a new project with boilerplate code");
	log("	wk start  | auto-builds components and serves them under ./dist folder");
	log("	wk new    | creates a new component under ./components folder");
}

function init(a)
{
	if (isProjectValid())
	{
		error("current folder is already initialized");
		return;
	}
	
	log("initializing a new project");
	if (!FS.existsSync("./dist")){FS.mkdirSync("./dist");}
	if (!FS.existsSync("./classes")){FS.mkdirSync("./classes");}
	if (!FS.existsSync("./components")){FS.mkdirSync("./components");}
	log("- folders created");
}

function deinit(a)
{
	if (FS.existsSync("./dist")){FS.rmdirSync("./dist");}
	if (FS.existsSync("./classes")){FS.rmdirSync("./classes");}
	if (FS.existsSync("./components")){FS.rmdirSync("./components");}
	log("- de initialized");
}

function start(a)
{
	if (!isProjectValid())
	{
		error("current folder is not a valid wk project, initialize first");
		log("usage:");
		log("	wk init   | initializes a new project with boilerplate code");
		return;
	}
	log("starting file server and auto-builder");

	FS.watch(BASE_INPUT_PATH, { "recursive" : true } , onchange);
	FS.watch(CLASS_INPUT_PATH, { "recursive" : true } , onchange);
	onchange();

	var finalhandler = require('finalhandler');
	var http = require('http');
	var serveStatic = require('serve-static');
	
	var serve = serveStatic('./dist', {'index': ['index.html', 'index.htm']});
	
	var server = http.createServer(
	function onRequest (req, res)
	{
		serve(req, res, finalhandler(req, res))
	})
	
	server.listen(3001);
	log("listening localhost:3001");
}

function newComponent(a)
{	
	if (a.length > 1)
	{
		error(a.join(" ") + " is not a valid component name, it has whitespaces in it");
		return;
	}
	if (a.length == 0)
	{
		log("usage:")
		log("	wk new ComponentName | creates a new component under ./components folder with given ComponentName");
		return;
	}

	if (!isProjectValid())
	{
		error("current folder is not a valid wk project, initialize first");
		log("usage:");
		log("	wk init   | initializes a new project with boilerplate code");
		return;
	}

	log("creating a new component named " + a[0]);
	log(a.length);
}

function error(m)
{
	console.log(FG_RED, m, RESET);
}

function log(m)
{
	console.log(RESET, m, RESET);
}

var BASE_INPUT_PATH = "./components/";
var CLASS_INPUT_PATH = "./classes/";
var OUTPUT_PATH = "./dist/dev";

function onchange()
{
	console.time('\x1b[32mbuild completed successfully\x1b[0m');	

	var files = FS.readdirSync(BASE_INPUT_PATH);
	var all = '';
	var css = '';
	var names = [];
	files.forEach(function(file)
	{
		if (file.indexOf('.') == 0)
			return;	

		names.push(file);
	});

	for (var i=0;i<names.length;i++)
	{
		var input = BASE_INPUT_PATH + names[i] + '/' + names[i];

		if (!FS.existsSync(input + '.html')) 
		{
			console.log('\x1b[31m%s\x1b[0m', 'missing file ->' + input + '.html  build cancelled');
			return;
		}

		if (!FS.existsSync(input + '.js')) 
		{
			console.log('\x1b[31m%s\x1b[0m', 'missing file ->' + input + '.js  build cancelled');			
			return;
		}

		var markup = FS.readFileSync(input + ".html","utf8");
		var js = FS.readFileSync(input + ".js","utf8");
		js = js.replace('{{markup}}', new Buffer(markup).toString('base64'));

		all += js + '\n';

		if (FS.existsSync(input + '.css')) 
			css += FS.readFileSync(input + ".css","utf8") + '\n';
	}

	files = FS.readdirSync(CLASS_INPUT_PATH);
	names = [];
	files.forEach(function(file)
	{
		if (file.indexOf('.') == 0)
			return;	

		names.push(file);
	});

	for (var i=0;i<names.length;i++)
	{
		var input = CLASS_INPUT_PATH + names[i];
		all += FS.readFileSync(input,"utf8") + '\n';
	}

	try { FS.unlinkSync( OUTPUT_PATH + ".js" ); } catch (e) { }
	FS.writeFileSync( OUTPUT_PATH + ".js" , all , 'utf8');

	try { FS.unlinkSync( OUTPUT_PATH + ".css" ); } catch (e) { }
	FS.writeFileSync( OUTPUT_PATH + ".css" , css , 'utf8');

	console.timeEnd('\x1b[32mbuild completed successfully\x1b[0m');
}

function isProjectValid()
{
	if (!FS.existsSync("./dist"))
	{
		// error("dist does not exist");
		return false;
	}


	if (!FS.existsSync("./components"))
	{
		// error("components folder is missing");
		return false;
	}
		

	if (!FS.existsSync("./classes"))
	{
		// error("classes does not exist");
		return false;
	}

	return true;
}