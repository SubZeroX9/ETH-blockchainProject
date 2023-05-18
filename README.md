# ETH-blockchainProject

durk card game on ETH test network build with smartcontract

# Durak Game

A card game project developed with React, simulating the classic Russian card game Durak. Now hosted on GitHub Pages!

## Table of Contents

1. [Installation](#installation)
2. [Deployment](#deployment)
3. [Usage](#usage)
4. [Features](#features)
5. [Contributing](#contributing)
6. [License](#license)

## Installation

Before starting, make sure you have Node.js and npm installed on your computer.

To install the project:

1. Clone the repository:
   git clone https://github.com/SubZeroX9/ETH-blockchainProject

2. Install the project dependencies:
   cd durak-card-game
   npm install

## Deployment

To deploy the game to GitHub Pages:

1. Install the `gh-pages` package:
   npm install gh-pages --save-dev

2. Add the `homepage` field in your `package.json`:
   "homepage": "http://<your-github-username>.github.io/durak-game"

3. Add the `predeploy` and `deploy` scripts in your `package.json` file:
   "scripts": {
   "start": "react-scripts start",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build",
   "test": "react-scripts test",
   "eject": "react-scripts eject"
   }

4. Push your changes to GitHub:
   git add .
   git commit -m "Setup for deployment to GitHub Pages"
   git push

5. Run the deploy script:
   npm run deploy

Now your game is available at `http://<your-github-username>.github.io/durak-game`

## Usage

To run the game locally, use the following command:
npm start

This will start the local server. You can now play the game by going to `http://localhost:3000` in your browser.

## Features

- Allows 2-6 players.
- Customizable game rules.
- Durak tokens system for scoring.
- Interactive UI.

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check [issues page](https://github.com/username/durak-game/issues) if you want to contribute.

## License

[MIT](https://choosealicense.com/licenses/mit/)
