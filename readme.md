# HigraphEdit 
...a prototype for a higraph editor product line based on GLSP

This implementation takes heavy insiration from the [Eclipse GLSP - Project Template: 🖥️ Node ● 🗂️ Custom JSON ● 🖼️ VS Code](https://github.com/eclipse-glsp/glsp-examples/tree/master/project-templates/node-json-vscode).

## Project structure
- [higraphEdit-client](./higraphEdit-client/): Basic code for the glsp-client implementation including specific views and css styles
- [higraphEdit-server](./higraphEdit-server/): The main part of the project. This folder includes the entire core for the glsp-server implementation
- [higraphEdit-vscode](./higraphEdit-vscode/): gluecode for packaging the [higraphEdit-client](./higraphEdit-client/) into a vscode plugin

## Prerequisites
The following libraries/frameworks need to be installed on your system:

- Node.js >=16.11.0
- Yarn >=1.7.0 <2.x.x

## Building the Editor

First you will have to clone the repository, navigate to the folder where this readme is placed and open in within VS Code. Next open a terminal in VS Code (and navigate within the opened terminal to the folder where this readme is placed).

To install all dependencies run the following command:

```bash
yarn install
```

After all dependencies got installed you can build and start the server. Since this is a prototype it is recomended starting the server in debugmode. To build all components and start the server run the follwoing command:

```bash
yarn build-and-debug
```

Now you can Start the Editor from within VS Codes Run-and-Debug section. In the Run-and-Debug section you have three options:
- `Launch HigraphEdit Diagram extension and attach to external GLSP Server`: This will start a external VS Code instance with the generated plugin that will connect to the server and execute the code once a `*.higraphedit` file is opened. This launchoption will also attach a debugger to the running server so breakpoints set in the servers code will be picked up.
- `Attach to running HigraphEdit Server`: Attaches the debugger to a running server without starting the client
- `Launch HigraphEdit Diagram Extension (External GLSP Server)`: Just launches a new instance of VS Code with the generated plugin

It is recomended to use option 1 `Launch HigraphEdit Diagram extension and attach to external GLSP Server` which should be selected by default so it can be executed by pressing the F5-key.

### Further yarn commands

To build all components run

```bash
yarn build
```
You can change into the subdirectories to build only specific parts of the application.

To run the server execute 
```bash
 yarn server -p 5007
```
or to start the server in debug mode
```
 yarn server start-debug -p 5007
```