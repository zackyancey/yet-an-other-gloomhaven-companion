# Adding classes

This page shows what parts of the code you need to change to add your own class
to the app. Don't be daunted by what looks like a wall of text, it's mostly so
long because I wanted to make it accessible regardless of level of programming
experience. Adding a class is mostly just copy-pasting from another class, this
is just a reference to save some searching around.

To get a class to show up at all you need to at least add the abilities section
with one card (the card back image), the rest you can add as needed.

## Name and abilities

The code refers to each class using a two-letter abbreviation. When adding a
class you need to add that abbreviation to `classNames_custom` in
`js/database_custom.js`, eg:

```javascript
classNames_custom = {
  bm: 'Brewmaster',
  rw: 'Rootwhisperer',
  // ...
  cc: 'CoolNewClass',
}
```
Make sure the abbreviation isn't already taken by another custom or official class.

Further down in `database_custom.js` there is a big list named
`abilities_custom`, you'll need to add your class to it:

```javascript
abilities_custom = [
  {
    "name": "bm",
    "max": 10,
    "hidden": false,
    "position": 2,

    "cards": [
      //...
    ]
  },
  // ...
  {
      "name": "cc",
      "max": 11,
      "hidden": false,
      "position": 12,

      "cards": [
          // we'll get to that next
      ]
  },
]
```

The fields are:

* name: The abbreviation you chose
* max: Your class' hand size
* hidden: leave it at `false` (it's used to hide unlockable classes in GH)
* position: look at the `position` value for the class right before this and add 1

`cards` is where all your ability cards go. They will look something like:

```javascript
{
    "cards": [
      {
        "name": "cc-back",
        "points": 0,
        "image": "character-ability-cards/CC/cc-back.png",
        "xws": "hpback",
        "level": 0
      },
      {
        "name": "first ability",
        "points": 3,
        "image": "character-ability-cards/CC/first-ability.png",
        "xws": "firstability",
        "level": 1
      },
    ]
}
```

The first card here is used for the ability card back, the rest are any
rule/ability cards to include.

The fields here are:

* name: The name of the ability
* points: Should be 0 for the card back, then start counting up from 3 for the
  abilities.
* image: A path to the card image, relative to the project root (the folder with
  `index.html` in it).
* level: Card level. Use 0 for back, rules, and level X cards.
* xws: The name again, but without spaces. I don't think this is actually used
  anywhere, though.

## Modifiers

Modifiers are stored in the other big list in `js/database_custom.js`,
`attack_modifiers_categories_custom`. To add your modifier deck to the list:

```javascript
attack_modifiers_categories_custom = [
  {
    "name": "am-bm",
    "cards": [
      // ...
    ]
  },
  {
    "name": "am-cc",
    "cards": [
      {
        "name": "am-CC-00",
        "points": 0,
        "image": "attack-modifiers/CC/am-cc-plus1.png",
        "xws": "amcc00"
      },
      {
        "name": "am-CC-01",
        "points": 1,
        "image": "attack-modifiers/CC/am-cc-plus1.png",
        "xws": "amcc01"
      },
    ]
  },
]
```

The fields are:

* name (the first one): This needs to be `am-xx`, where xx is the abbreviation you're using for
  the class.
* name (on each card): This can be anything, but is generally `am-cc-00`, etc.
* points: Start at 0 and go up for each card.
* image: A path to the card image, relative to the project root (the folder with
  `index.html` in it).
* xws: Again, I don't think this is needed, but it's the name without all
  non-alphanumeric characters removed.

Note that for multiples of the same modifier card you should add multiple
entries with different names and the same image path.

## Perks

The modifiers page allows you to look at the perks for the class you're using.
To get this to work you'll need to add an image of the perks list. Crop the
character sheet down to just the perks, then put it at `data/perks/xx.png`,
where xx is the abbreviation used for your class. No changes to the code are
needed.

## Items

Items are in `js/database_common.js`, in a list called `allitems`. Base game
items are grouped by number, but each custom class is given its own category
like so:

```javascript
allItems = [
    {
        "name": "1-14",
        "items": [
            // ...
        ]
    },
    // ...
    {
        "name": "CoolNewClass",
        "items": [
            {
                "name": "item 1",
                "points": 1701,
                "image": "items/CC/item-1.png",
                "xws": "item1",
                "type": "body"
            },
            {
                "name": "item 2",
                "points": 1702,
                "image": "items/CC/item-2.png",
                "xws": "item2",
                "type": "2H"
            },
        ]
    },
```

fields are:

* name (first one): A name for the item category, probably just the name of the
  associated class.
* name (for each item): The name of the item
* points: Just needs to be unique for each item. I've been incrementing it by
  100 for each class for uniformity, but it can be any number that's not taken.
* image: A path to the card image, relative to the project root (the folder with
  `index.html` in it).
* xws: just the name without spaces. I don't think this is used anywhere.
* type: one of `"head"`, `"body"`, `"1H"`, `"2H"`, `"foot"`, or `"consumable"`

