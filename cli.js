#!/usr/bin/env node
var removeMd = require('remove-markdown');
var WebSocket = require('ws');

function help() {
    console.log("Usage: candy <command> [params]");
    console.log("Commands:");
    console.log("\treference <referencePath>");
    console.log("\tDisplays the specified reference.");
    console.log("\t\treferencePath");
    console.log("\t\tPath of specified reference (ex. /helloWorld, /helloCatalog/helloWorld)");
    console.log("");
    console.log("\tlist <catalogPath>");
    console.log("\tLists and seperates catalogs and references in the specified catalog.");
    console.log("\t\tcatalogPath");
    console.log("\t\tPath of specified catalog (ex. /, /helloCatalog/)");
}

var ws = new WebSocket(process.env.CANDY_URL || 'ws://localhost:4540');

if (!process.argv[2]) {
    help();
    process.exit(0);
}

ws.on('open', function() {
    switch(process.argv[2]) {
        case "reference":
            ws.send(JSON.stringify({
                type: "reference",
                path: process.argv[3]
            }));
            break;
        case "list":
            ws.send(JSON.stringify({
                type: "list",
                path: process.argv[3]
            }));
            break;
        default:
            console.log("Unknown command.");
            help();
            process.exit(1);
    }
	console.log("Opened connection, sending test command...");
});

ws.on('message', function(data) {
    switch(process.argv[2]) {
        case "reference":
            var reference = JSON.parse(data).reference;
            if (reference) {
                console.log(removeMd(reference, {
                    stripListLeaders: true,
                    listUnicodeChar: '*',
                    gfm: true
                }));
            } else {
                console.log("Reference not found.");
            }
            break;
        case "list":
            var items = JSON.parse(data).items;
            if (items) {
                console.log(`References: ${items.references.join(', ')}`);
                console.log(`Catalogs: ${items.catalogs.join(', ')}`);
            } else {
                console.log("Catalog not found.");
            }
            break;
        default:
            console.log("Unknown command.");
            help();
            process.exit(1);
    }
    ws.close();
});