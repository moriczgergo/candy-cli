# candy-cli
A command line interface for Candy.

## Setup

 1. Run `npm i candy-cli -g` (or `yarn global add candy-cli`).
 2. Set optional environment values.
 3. Done!

## Environment values

 * `CANDY_URL` (optional) - Custom URL of Candy. (ex. `ws://192.168.2.1:4540`) (default: `ws://localhost:4540`)

## Commands

 * `reference` - Displays the specified reference. (ex. `candy reference /helloWorld`)
 * `list` - Lists and seperates catalogs and references in the specified catalog. (ex. `candy list /`)