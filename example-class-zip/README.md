# Creating classes for upload

When using this website for custom classes, you can load a file from your computer to test classes that haven't been put up on the site yet. The file just needs to be a zip archive with all the necessary images and a .json file with some class info. This folder contains an example of all the files that would be used to make a class zip file, as well as an example file. You can upload `brute.zip` from this directory, and you'll have a second copy of the brute available.

The `class.json` file is required, and is used to identify all of the other files. It is structured as follows:

```json
{
    "name": "MyCustomClass",
    "back": "back.png",
    "handsize": 10,

    "abilities": [
        ["first ability.png", 1],
        ["second-ability.png", 0]
        ["third-ability.png", 2]
        ["fourth-ability.png", 2]
    ],
    "modifiers": [
        ["first-modifier.png", 2],
        ["second-modifier.png", 6]
    ]
}
```

* `name` is the name of the class.
* `back` is the file name for the ability card back image.
* `handsize` is the number of cards in the class' hand.
* `abilities` is a list of two-element entries: The filename of the card image, and the card's level (use 0 for rules cards/level x).
* `modifiers` is a list of two-element entries: The filename for the card image, and how many of that card to include.