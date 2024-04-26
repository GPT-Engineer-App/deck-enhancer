# deck-enhancer

a website, where players of Pokemon Trading card game can enter their deck (list of 60 cards), and the website will then analyze the deck, and make strategic recommendations on how to improve it.
To do this, the website will first use the PokemonTCG API to retrieve all data and info about each individual card in the deck. 
It will then use the API of LimitlessTCG (https://docs.limitlesstcg.com/developer.html) to look at the most successful decks and strategies, and run some sort of analyis. 
The end result will be a data-informed, strategically recommended list of cards to enhance the users deck.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/deck-enhancer.git
cd deck-enhancer
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
