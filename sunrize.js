


var Sunrize = new Class({
    Implements: [Events, Options],
    options: {
        items: false,
        CustomGuiElements: {},// Include your own gui elements to the lightbox
        buttons: {
            close: {
                label: 'Close',
                hooks: {
                    onStart: function() {},
                    onEnd: function() {}
                }
            },
            next: {
                label: 'Next',
                hooks: {
                    onStart: function() {},
                    onEnd: function() {}
                }
            },
            previous: {
                label: 'Prev',
                hooks: {
                    onStart: function() {},
                    onEnd: function() {}
                }
            }
        }
    },

    initialize: function(options) {

        this.openStatus = false;
        this.setOptions(options);
        this.regGuiItems = {};//Object for register all gui Elements for the class
        this.dataObj = {};
        this.curItem = 0;

        // Todo implement Loading Message
        this.overlay = new Spinner(document.body, {
            'class': 'sunrize'
            //message: 'Loading'
        });



        this._initGuiElements();

        if(this.options.items)
            //this._normalizeData(this.options.items);
        this.spinnerOgSize = $$('.spinner-content')[0].getSize();
    },

    goTo: function(direction) {
        if(direction === 'previous') {
            this.curItem--;
        } else if(direction === 'next') {
            this.curItem++;
        }

        this._actionSwitch();
    },

    _initGuiElements: function() {
        var buttonObj = this.options.buttons,
            self = this,
            guiCombined,
            guiElements;

        // TODO make gui Elements accesible in the hole class
        guiElements = {
            close: {
                tag: 'div',
                placement: this.overlay.content,
                options: {
                    text: buttonObj.close.label || '',
                    'class': 'srize-close srize-btn',
                    events: {
                        'click': this.close.bind(this)
                    }
                }
            },
            next: {
                tag: 'div',
                placement: this.overlay.content,
                options: {
                    text: buttonObj.next.label || '',
                    'class': 'srize-next srize-direction srize-btn',
                    events: {
                        'click': this.goTo.bind(this).pass('next')
                    }
                }
            },
            previous: {
                tag: 'div',
                placement: this.overlay.content,
                options: {
                    text: buttonObj.previous.label || '',
                    'class': 'srize-previous srize-direction srize-btn',
                    events: {
                        'click': this.goTo.bind(this).pass('previous')
                    }
                }
            },
            contentMain: {
                tag: 'div',
                placement: this.overlay.content,
                options: {
                    'class': 'sunrize-content'
                }
            }
        };

        // Combining main Gui object elements and the custom object from the options
        guiCombined = Object.merge(guiElements, this.options.customGuiElements);

        /* Create, Register and inject the gui elements */
        Object.each(guiCombined, function(val, key) {
            var item = self.regGuiItems[key] = new Element(val.tag, val.options);
            item.inject(val.placement);
        });
    }.protect(),

    _normalizeData: function(data) {
        var checkType = function(item) {
            var dataType = typeOf(data);
            if(dataType === 'element') {
                if(item.get('tag') === 'a' && item.get('href').test(/\.(jpg|jpeg|png|gif|bmp)(.*)?$/i)) {
                    return 'image'
                }
            } else if(dataType === 'object') {
                if(item.content.test(/\.(jpg|jpeg|png|gif|bmp)(.*)?$/i)) {
                    return 'image'
                }
            }
        }


        var dataTypeOf = typeOf(data);
        var self = this;
        var blueprint = {
            content: '',
            count: 0,
            type: '',
            title: ''
        };





        //data object
        if(dataTypeOf === 'object') {
            //virtual or real item map
            /**
            * Example
            * {
            *     item1: {
            *         content: item,
             *         count
             *        type: image, inline, youtube etc.
             *        title:
            *     }
            * }
            * */

            var c = 0;
            Object.each(data, function(val, key, obj) {
                if(val.content) {
                    self.dataObj['item'+c] = val;
                    self.dataObj['item'+c].count = c;
                    if(!val.title) {
                        self.dataObj['item'+c].title = '';
                    }
                    self.dataObj['item'+c].type = checkType(val);
                    c++;
                }


            });
            //console.log(dataObj);

        } else if(dataTypeOf === 'elements') {
            //Todo add Elements as type
        } else if(dataTypeOf === 'element') {
            //single item no next or prev buttons needed
            var itemObj = Object.clone(blueprint);
            itemObj.content = data.get('href');
            if(data.get('title')) {
                itemObj.title = data.get('title');
            }
            itemObj.type = checkType(data);


            self.dataObj.item0 = itemObj;
        } else {
            throw Error('Sorry, the typ of item you are trying to include is not supported. Please checkout our wiki on github.');
        }


        this.curItem = this.dataObj.item0.count;
        this._actionSwitch();
        //element collection

        // Sorry not supported
    }.protect(),

    isOpen: function() {
        return (this.openStatus === true) ? true : false;
    }.protect(),

    displayHandler: {


        image: function(item) {
            this.regGuiItems.contentMain.set('html','');
            if(!this.isOpen()) {
                this.open();
            }
            var myImage = Asset.image(item.content, {
                id: 'myImage',
                title: 'myImage',
                onLoad: function(image) {
                    this.regGuiItems.contentMain.set('html','');
                    var width = image.get('width');
                    var height = image.get('height');

                    var myEffect = new Fx.Morph(document.getElement('.spinner-content'), {
                        onComplete: function() {
                            image.setStyle('opacity', 0);
                            image.inject(this.regGuiItems.contentMain);
                            image.fade('in');
                        }.bind(this)
                    });


                    //image.inject(this.regGuiItems.contentMain);
                    //Todo Check positioning bug
                    myEffect.start({
                        'width': width,
                        'height': height,
                        'margin-left': -(width / 2),
                        'margin-top': -(height / 2)
                    });
                    //
                }.bind(this)
            });
        },
        youtube: function(item) {
            alert('youtube');
        },
        htmlcontent: function(item) {
            alert('html');
        }
    },

    _actionSwitch: function(items) {
        //TODO refactoring

        var self = this;
        if(Object.getLength(self.dataObj) > 1 && Object.getLength(self.dataObj) > (self.curItem + 1)) {
            self.regGuiItems.next.setStyle('display', 'block');

        } else {
            self.regGuiItems.next.setStyle('display', 'none');
        }

        if(Object.getLength(self.dataObj) > 1 && self.curItem > 0) {
            self.regGuiItems.previous.setStyle('display', 'block');

        } else {
            self.regGuiItems.previous.setStyle('display', 'none');
        }

        self.displayHandler[self.dataObj['item'+self.curItem].type].call(this, self.dataObj['item'+self.curItem]);
    }.protect(),

    open: function(item, title) {
        item = item || false;
        title = item || false;
        //Todo add show button method
        this.regGuiItems.close.setStyle('display', 'block');
        this.openStatus = true;
        this._normalizeData(item);
        this.overlay.show();


        //this.setTest(item);
    },

    close: function() {
        this.openStatus = false;

        //TODO add Hide Method
        this.regGuiItems.next.setStyle('display', 'none');
        this.regGuiItems.previous.setStyle('display', 'none');
        this.regGuiItems.close.setStyle('display', 'none');

        this.overlay.hide();
        this.regGuiItems.contentMain.set('html', '');

        //TODO add a bether reset
        this.overlay.content.setStyles({
            'margin-left': 0,
            'margin-top': 0,
            'width': '0',
            'height': '0'
        });
    }
});