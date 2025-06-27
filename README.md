# html-builder-cli
The fastest way to package an HTML project into a fully native desktop app
## Dependencies
Requires [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

[Wine](https://www.winehq.org/) is required for building Windows applications on non-Windows platforms.
## Installation
### Install from npm
In the command line, run `npm install html-builder-cli -g`
### Build from source
1. Clone this repository
2. Run `npm install -g`
### Install from aur
[![git](https://img.shields.io/aur/version/html-builder-cli-git)](https://aur.archlinux.org/packages/html-builder-cli-git)
## Usage
In your HTML project's directory, create a file called `manifest.json`. `manifest.json` should be a JSON file (not just a JS Object literal). It can have the following keys:
- `name` (required): the name of the application.
- `platforms` (required): an array of operating systems to build for. Each element of the array must be a string that is either `linux`, `mac`, or `windows`;
- `desc` (optional): a short description of the application.
- `version` (optional): the application's version. Must be a string in the format [`x.x.x`](https://www.akeeba.com/how-do-version-numbers-work.html). Defaults to `1.0.0`.
- `icon` (optional): the relative location of the icon file (preferably a PNG of size >= 512x512px). Defaults to `icon.png`. AN ICON FILE MUST BE PROVIDED.
- `indexFile` (optional): the relative location of the main HTML file to be displayed by the app. Defaults to `index.html`.
- `colorScheme` (optional): `dark`, `light`, or `system`. Defaults to `system`.
- `author` (optional): Info about the author. Can either by an object with keys `name`, `email`, and `url`, or a shorthand string with formal `"name <email> (url)"`.
- `id` (optional): the application's ID. Must be a string consisting of only lowercase letters, numbers, and hyphens. This helps with app updates.

Here is an example `manifest.json` file:
```json
{
    "id": "cool-app",
    "name": "Cool App",
    "author": "Cool Man <coolman@example.com> (https://example.com)",
    "desc": "An awesome desktop app I made!",
    "platforms": [
        "linux",
        "mac"
    ],
    "version": "1.1.1",
    "icon": "logo.png"
}
```
Once you have finished creating your `manifest.json` file, open the command line in the same directory and run `html-builder-cli`.
