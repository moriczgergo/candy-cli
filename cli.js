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
    console.log("");
    console.log("\tcreate <reference|catalog> <path> [content]");
    console.log("\tCreates a reference or catalog.");
    console.log("\t\tpath");
    console.log("\t\tPath of specified reference or catalog. (ex. /helloWorld, /helloCatalog/)");
    console.log("\t\tcontent");
    console.log("\t\tNew content of specified reference. (ex. \"# Hello World\\n\\nHello world!\\n\")");
    console.log("");
    console.log("\tedit <path> <content>");
    console.log("\tEdits and existing reference.");
    console.log("\t\tpath");
    console.log("\t\tPath of specified reference or catalog. (ex. /helloWorld, /helloCatalog/)");
}

var ws = new WebSocket(process.env.CANDY_URL || 'ws://localhost:4540');

if (!process.argv[2]) {
    help();
    process.exit(0);
}

ws.on('open', function() {
    switch(process.argv[2]) {
        case "reference":
            if (!process.argv[3]) {
                console.log("Parameters not met.");
                help();
                process.exit(1);
            }
            ws.send(JSON.stringify({
                type: "reference",
                path: process.argv[3]
            }));
            break;
        case "list":
            if (!process.argv[3]) {
                console.log("Parameters not met.");
                help();
                process.exit(1);
            }
            ws.send(JSON.stringify({
                type: "list",
                path: process.argv[3]
            }));
            break;
        case "create":
            if (!process.argv[3] || !process.argv[4]) {
                console.log("Parameters not met.");
                help();
                process.exit(1);
            }
            switch (process.argv[3]) {
                case "reference":
                    ws.send(JSON.stringify({
                        type: "newReference",
                        path: process.argv[4],
                        data: process.argv[5]
                    }));
                    break;
                case "catalog":
                    ws.send(JSON.stringify({
                        type: "newCatalog",
                        path: process.argv[4]
                    }));
                    break;
                default:
                    console.log("Unknown subcommand.");
                    help();
                    process.exit(1);
            }
            break;
        case "edit":
            if (!process.argv[3] || !process.argv[4]) {
                console.log("Parameters not met.");
                help();
                process.exit(1);
            }
            ws.send(JSON.stringify({
                type: "edit",
                path: process.argv[3],
                data: process.argv[4]
            }));
            break;
        default:
            console.log("Unknown command.");
            help();
            process.exit(1);
    }
});

ws.on('message', function(data) {
    switch(JSON.parse(data).type) {
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
        case "newReference":
            var path = JSON.parse(data).path;
            if (path) {
                console.log("Reference created.");
            } else {
                console.log("Reference couldn't be created. (Missing parents.)");
            }
            break;
        case "newCatalog":
            var path = JSON.parse(data).path;
            if (path) {
                console.log("Catalog created.");
            } else {
                console.log("Catalog couldn't be created. (Missing parents.)");
            }
            break;
        case "edit":
            var path = JSON.parse(data).path;
            if (path) {
                console.log("File edited successfully.");
            } else {
                console.log("File couldn't be edited. (Missing parents.)");
            }
            break;
        default:
            console.log("Unknown command.");
            help();
            process.exit(1);
    }
    ws.close();
});