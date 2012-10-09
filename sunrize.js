


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


        this.setOptions(options);
        this.regGuiItems = {};//Object for register all gui Elements for the class
        this.dataObj = {};

        this.overlay = new Spinner(document.body, {
            'class': 'sunrize',
            message: 'Loading'
        });
        this._initGuiElements();

        var data = {
            item1: {
              content: 'hgfhgf',
              type: 'image'
            }
        }

        this._normalizeData(this.options.items);
        this.spinnerOgSize = $$('.spinner-content')[0].getSize();
    },

    goTo: function(direction) {
        alert(direction);
    }.protect(),

    _initGuiElements: function() {
        var buttonObj = this.options.buttons,
            self = this,
            guiCombined,
            guiElements;

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
                if(val.content && val.type) {
                    self.dataObj['item'+c] = val;
                    self.dataObj['item'+c].count = c;
                    if(!val.title) {
                        self.dataObj['item'+c].title = '';
                    }
                    c++;
                }


            });
            console.log(dataObj);

        } else if(dataTypeOf === 'elements') {
            //multiitems
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

        //console.log(self.dataObj);

        this._actionSwitch();
        //element collection

        // Sorry not supported
    }.protect(),

    displayHandler: {
        image: function(item) {
            alert('bild');
        },
        youtube: function(item) {
            alert('youtube');
        },
        htmlcontent: function(item) {
            alert('html');
        }
    },

    _actionSwitch: function(items) {
        var self = this;
        Object.each(self.dataObj, function(item, key) {
            self.displayHandler[item.type](item);
        });
    }.protect(),

    open: function(item) {
        this.overlay.show();
        //this.setTest(item);
    },

    close: function() {
        this.overlay.hide();
        /* old poc stuff

        $$('.spinner-content')[0].setStyle('overflow', 'hidden');
        $$('.sunrize-content').fade('out');
        var myEffect = new Fx.Morph($$('.spinner-content')[0], {
            link: 'chain',
            onComplete: function() {
                this.overlay.hide();
                $$('.sunrize-content')[0].set('html', '');
                $$('.spinner-content')[0].setStyles({
                    'width': 0,
                    'margin-left': 0
                });
            }.bind(this)
        });
        myEffect.start({
            'height': 0,
            'margin-top': -50,
            'borderWidth': 0
        })*/
    }
    /* old poc stuff
    setTest: function(item){

        console.log(item);
        $$('.spinner-content')[0].setStyle('overflow', 'visible');
        $$('.spinner-content')[0].setStyle('margin-top', 0);
        $$('.spinner-content')[0].setStyle('borderWidth', 1);

        var myImage = Asset.image(item, {
            id: 'myImage',
            title: 'myImage',
            onLoad: function(image) {
                $$('.spinner-msg').fade('out');

                var myEffect = new Fx.Morph($$('.spinner-content')[0], {
                    link: 'chain',
                    onComplete: function() {
                        image.inject($$('.sunrize-content')[0]);

                        $$('.sunrize-content')[0].fade('in');

                    }
                });


                myEffect.start({
                    'width': image.get('width'),
                    'margin-left': -(image.get('height') / 3),
                    'height': image.get('height'),
                    'margin-top': -(image.get('height') / 3)
                })


            }
        });

/*

    }*/
});