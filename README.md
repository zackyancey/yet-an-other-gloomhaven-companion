# About this fork

This is a fork of the [gloomhaven deckbuilder](https://github.com/orichalque/yet-an-other-gloomhaven-companion) app, tweaked to be used with custom classes. You can access a hosted version here:

https://zackyancey.github.io/yet-an-other-gloomhaven-companion/

The hosted version includes custom classes released by the CCUG. You can find more information on those classes at [ghcustomcontent.com](https://www.ghcustomcontent.com/). You can also download this app and run it locally (see the [How to install](#How-to-install) section below) to add your own classes for playtesting. More info on how to add classes can be found [here](adding_classes.md).

The rest of the readme is from the original project:

---

# How to use

Like most of you I assume, my group of friends and I faced a new problem during the quarantine situation : how to continue our gloomhaven campaign online?
Our favorite way to do it was by placing a camera above the board, video share it to everyone, and use Gloomhaven Helper to track the game state. But since you can't manage each player' s deck of modifiers and abilities with it, we built another web app! You can use it to build your ability and modifier decks and manage your cards (discard, destroy, draw, etc.) If you want to try it, it's here:

https://www.gloomhaven-deck.com/

Nightly version:
https://gloomhaven-dev.netlify.com/

We've used it for a few sessions and it's pretty fun. Here's how it looks :

The 'Play' view allows the player to :
- Draw a modifier
- Shuffle the modifier deck
- Select cards to be played
- Burn a card
- Discard a card
- Restore a card
- Place a card on the board for one turn
- Place a card on the board until the end of the game
- Track the number of time a card placed on the board was used
- Perform a long or short sleep
- Save the player's deck
- Use your equipement 

The 'Abilities' view allows the player to :
- Select a faction
- Build the player's ability deck from the faction's card pool
- Filter the cards available by level

The 'Modifiers' view allows the player to :
- Select a faction
- Build the player's modifiers deck from the base deck (selected by default), the faction's card pool and the special modifiers

The 'Gear' view allows the player to : 
- Set your gear
- Pick your potions, considering your character level

We hope you find it as useful as we do! Feedback is very welcome, and don't hesitate to signal any bugs in the issue tracker

# How to install

If you find the deployed version slow, can can clone this repository and run it on your own machine. 
- Either directly open the `index.html` file with your favorite browser. This will work but the cookies won't be saved
- Run it locally on a HTTP Server. [Python's SimpleHttpServer](https://docs.python.org/2/library/simplehttpserver.html) works great for that.

# Want to contribute ?

Check the `dev` branch :-) 


