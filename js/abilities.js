Array.prototype.move = function(from, to) {
    if(from >= 0 && to >= 0 && from < this.length && to < this.length) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    }
};

var abilitiesManagement = {
    data: {
        /* Ability information */
        abilities : [],
        abilityCategory: null,
        abilitiesChosen: [],
        twoAbilitiesSelected: [],
        abilitiesOnBoard: [],
        longRestMode: false,
        shortRestMode: false,
        cardToLose: null,
        cardsPlayed: [],
        className: '',
        chosenCardExchanger: null,
    },
    methods: {
        deleteUploadedClass: function() {
            this.abilities[0].hidden = true;
            this.abilities[0].max = undefined;
            this.classNames.zz = undefined;

            this.abilities[0].cards.forEach(card =>{
                if (card.image.startsWith("blob:")) {
                    URL.revokeObjectURL(card.image)
                }
            })
            this.abilities[0].cards = []

            this.modifiers[0].cards.forEach(card =>{
                if (card.image.startsWith("blob:")) {
                    URL.revokeObjectURL(card.image)
                }
            })
            this.modifiers[0].cards = []
        },
        uploadClass: async function(event) {
            document.getElementById("uploaderror").textContent = "";
            if (event.target.value == "") {
                return;
            }
            document.getElementById("uploading").textContent = "Loading..."
            this.deleteUploadedClass()
            try {
                blobReader = new zip.BlobReader(event.target.files[0]);
                const zipReader = new zip.ZipReader(blobReader);

                // Read the zip file
                entries = {};
                (await zipReader.getEntries()).forEach(entry => {
                    entries[entry.filename] = entry;
                });

                // Read the class.json config file
                if (!("class.json" in entries)) {
                    throw "Couldn't find `class.json` in the zip file."
                }
                writer = new zip.TextWriter();
                const class_json = JSON.parse(await entries["class.json"].getData(writer));

                // Set up the class data
                this.classNames.zz = class_json.name;
                this.abilities[0].max = class_json.handsize

                // Card back
                back_path = class_json.back;
                if (!(back_path in entries)) {
                    throw "Couldn't find `" + back_path + "` in the zip file."
                }
                writer = new zip.BlobWriter();
                this.abilities[0].cards.push({
                        "name": "zz-back",
                        "points": 0,
                        "image": URL.createObjectURL(await entries[back_path].getData(writer)),
                        "xws": "hpback",
                        "level": 0
                })

                // Ability cards
                for(var i = 0; i < class_json.abilities.length; i++) {
                    path = class_json.abilities[i][0];
                    level = class_json.abilities[i][1];

                    if (!(path in entries)) {
                        throw "Couldn't find `" + path + "` in the zip file."
                    }

                    writer = new zip.BlobWriter();
                    url = URL.createObjectURL(await entries[path].getData(writer));

                    this.abilities[0].cards.push({
                        "name": path,
                        "points": i+3,
                        "image": URL.createObjectURL(await entries[path].getData(writer)),
                        "xws": path,
                        "level": level
                    })
                }

                // Modifier cards
                var i = 0;
                for(var j = 0; j < class_json.modifiers.length; j++) {
                    path = class_json.modifiers[j][0];
                    count = class_json.modifiers[j][1];

                    if (!(path in entries)) {
                        throw "Couldn't find `" + path + "` in the zip file."
                    }

                    writer = new zip.BlobWriter();
                    url = URL.createObjectURL(await entries[path].getData(writer))
                    for (var k=0; k<count; k++){
                        this.modifiers[0].cards.push({
                            "name": path + k.toString(),
                            "points": i,
                            "image": url,
                            "xws": "path"
                          })
                        i++;
                    }
                }

            } catch (err) {
                document.getElementById("uploaderror").textContent = "Error uploading class: " + err;
                this.deleteUploadedClass();
                event.target.value = "";
            }
            this.abilities[0].hidden = false;
            document.getElementById("uploading").textContent = ""
        },
        displayAbilities: function(param) {
            this.classChosen = true;
            this.displayModifiers(param.name.substring(0,2))
            if (this.abilityCategory == param) {
                this.abilityCategory = null
            } else {
                this.abilityCategory = param
                this.abilityCategory.cards.sort((a, b) => a.level - b.level)
            }
            this.$forceUpdate()

        },
        displayAbilitiesToExchange: function(param) {
            if (this.chosenCardExchanger == param) {
                this.chosenCardExchanger = null
            } else {
                this.chosenCardExchanger = param
            }
        },
        addAbility: function(card) {
            card.duration = 0
            if (!this.abilitiesChosen.includes(card)) {
                if (this.abilitiesChosen.length < this.abilityCategory.max)
                    this.abilitiesChosen.push(card)
            } else {
                this.removeAbility(card)
            }
        },
        acceptAbility: function(card) {
            card.duration = 0
            if (!this.abilitiesChosen.includes(card)) {
                this.abilitiesChosen.push(card)
            } else {
                this.removeAbility(card)
            }
        },
        removeAbility: function(card) {
            indexOfCardToRemove = this.abilitiesChosen.indexOf(card)
            this.abilitiesChosen.splice(indexOfCardToRemove, 1)
        },
        shortRest: function() {
            this.cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed && (card.duration == 0 || card.duration == null)))

            if (this.cardsPlayed.length > 0) {
                this.shortRestMode = true
                var cardIndexToDestroy = getRandomInt(this.cardsPlayed.length)
                this.cardToLose = this.cardsPlayed[cardIndexToDestroy]
                this.cardToLose.destroyed = true
                this.cardsPlayed.splice(cardIndexToDestroy, 1)
                this.cardsPlayed.forEach(card => card.played = false)

                if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                    this.showRedAlert('You do not have enough cards in your end to continue.')
                }
            } else {
                this.showRedAlert('You need discarded cards to rest.')
            }

            this.$forceUpdate()
        },
        rerollShortRest: function() {
            this.cardToLose.destroyed = false
            this.cardToLose.played = false
            this.cardsPlayed.forEach(c => c.played = true)
            this.shortRest()
            this.shortRestMode = false
            this.$forceUpdate()
        },
        longRest: function() {
            this.longRestMode = true
            this.$forceUpdate()
        },
        canRest: function() {
            return this.abilitiesChosen != null && this.abilitiesChosen.filter(card => card.played && ! card.destroyed).filter(card => card.duration == 0 || card.duration == null).length >= 2
        },
        destroyLongRestCard: function(card) {
            card.destroyed = true
            var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed && (card.duration == 0 || card.duration == null)))
            cardsPlayed.forEach(card => card.played = false)

            this.abilitiesChosen.filter(elem => elem.duration > 0).forEach(elem => elem.duration --)
            this.turn ++

            this.gearChosen.forEach(gear => {
                if (gear.played && ! gear.lost) {
                    gear.played = false
                }
            })

            if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                this.showRedAlert('You do not have enough cards in your end to continue.')
            }

            this.longRestMode = false
            this.$forceUpdate()
        },
        pickCard: function(card) {
            if (this.twoAbilitiesSelected.includes(card)) {
                this.cancelCard(card)
            } else if (this.twoAbilitiesSelected.length < 2 && !card.played && !card.destroyed) {
                this.twoAbilitiesSelected.push(card)
            }
        },
        cancelCard: function(card) {
            indexOfCardToRemove = this.twoAbilitiesSelected.indexOf(card)
            this.twoAbilitiesSelected.splice(indexOfCardToRemove, 1)
        },
        fetchCard: function(card) {
            card.played = false
            card.destroyed = false
            this.$forceUpdate()
        },
        destroyCard: function(card) {
            if(card.canBeExchanged){
                this.removeAbility(card)
            }else{
                this.cancelCard(card)
                card.destroyed = true
                card.played = true
                card.duration = 0
                this.$forceUpdate()
            }
        },
        playCard: function(card) {
            this.cancelCard(card)
            card.destroyed = false
            card.played = true
            card.duration = 0
            this.$forceUpdate()
        },
        useCard: function(card) {
            card.numberOfTimesUsed ++
            this.$forceUpdate()
        },
        keepAbilityOneTurn(card) {
            card.duration = 1
            this.$forceUpdate()
        },
        keepAbilityManyTurns(card) {
            card.duration = -1
            card.numberOfTimesUsed = 0
            this.$forceUpdate()
        },
        updateCardPosition: function(oldIndex, newIndex) {
            this.abilitiesChosen.move(oldIndex, newIndex)
        },
        play: function() {
            if (this.twoAbilitiesSelected.length != 2) {
                if(this.abilitiesChosen.length == 0) {
                    this.showRedAlert('You need to build you deck in the Abilities section.')
                } else {
                    this.showRedAlert('You have to select two cards.')
                }
            } else {
                this.twoAbilitiesSelected.forEach(card => {
                    if(card.canBeExchanged){
                        this.removeAbility(card)
                    } else {
                        card.played = true
                    }
                })
                this.twoAbilitiesSelected = []
                this.abilitiesChosen.filter(elem => elem.duration > 0).forEach(elem => elem.duration --)
                this.turn ++
                this.shortRestMode = false
                this.$forceUpdate()
                this.roundEndShuffle()
            }
        }
    }
}
