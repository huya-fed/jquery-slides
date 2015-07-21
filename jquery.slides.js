(function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = "slidesjs";
    defaults = {
        width: 940,
        height: 528,
        start: 1,
        navigation: {
            active: true,
            effect: "slide"
        },
        pagination: {
            active: true,
            effect: "slide"
        },
        play: {
            active: false,
            effect: "slide",
            interval: 5000,
            auto: false,
            pauseOnHover: false,
            restartDelay: 2500
        },
        effect: {
            slide: {
                speed: 500
            },
            fade: {
                speed: 300,
                crossfade: true
            }
        },
        callback: {
            loaded: function() {},
            start: function() {},
            complete: function() {}
        }
    };

    Plugin = function(element, options){
        this.element = element;
        this.options = $.extend(true, {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }


    Plugin.prototype.init = function() {
        var $element, nextButton, pagination, playButton, prevButton, stopButton,
        _this = this;
        $element = $(this.element);
        this.data = $.data(this);
        $.data(this, "animating", false);
        $.data(this, "total", $element.children().not(".slidesjs-navigation", $element).length);
        $.data(this, "current", this.options.start - 1);
        $.data(this, "vendorPrefix", this._getVendorPrefix());


        $element.css({
            overflow: "hidden"
        });

        $element.slidesContainer = $element.children().not(".slidesjs-navigation", $element).wrapAll("<div class='slidesjs-container'>", $element).parent().css({
            overflow: "hidden",
            position: "relative"
        });

        $(".slidesjs-container", $element).wrapInner("<div class='slidesjs-control'>", $element);

        $(".slidesjs-control", $element).css({
            position: "relative",
            left: 0
        }).children().addClass("slidesjs-slide").css({
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            overflow: 'hidden',
            webkitBackfaceVisibility: "hidden"
        });


        $.each($(".slidesjs-control", $element).children(), function(i) {
            var $slide;
            $slide = $(this);
            $slide.attr("slidesjs-index", i);
        });

        
        $element.fadeIn(0);
        this.update();


        //上一页、下一页按钮
        if (this.options.navigation.active) {
            prevButton = $("<a>", {
                "class": "slidesjs-previous slidesjs-navigation",
                href: "javascript:void(0)",
                text: "上一页"
            }).appendTo($element);

            nextButton = $("<a>", {
              "class": "slidesjs-next slidesjs-navigation",
              href: "javascript:void(0);",
              text: "下一页"
            }).appendTo($element);  
        }

        $(".slidesjs-next", $element).click(function(e) {
            e.preventDefault();
            _this.stop(true);
            _this.next(_this.options.navigation.effect);
        });
        $(".slidesjs-previous", $element).click(function(e) {
            e.preventDefault();
            _this.stop(true);
            _this.previous(_this.options.navigation.effect);
        });
      
        //开始、暂停
        if (this.options.play.active) {
            playButton = $("<a>", {
                "class": "slidesjs-play slidesjs-navigation",
                href: "javascript:void(0)",
                text: "开始"
            }).appendTo($element);

            stopButton = $("<a>", {
                "class": "slidesjs-stop slidesjs-navigation",
                href: "#",
                text: "暂停"
            }).appendTo($element);


            playButton.click(function(e) {
                e.preventDefault();
                _this.play(true);
            });
            stopButton.click(function(e) {
                e.preventDefault();
                _this.stop(true);
            });       
        }

        //页码
        if (this.options.pagination.active) {
            pagination = $("<ul>", {
                "class": "slidesjs-pagination"
            }).appendTo($element);

            $.each(new Array(this.data.total), function(i) {
                var paginationItem, paginationLink;
                paginationItem = $("<li>", {
                    "class": "slidesjs-pagination-item",
                    "data-slidesjs-item": i,
                    'text': i + 1
                }).appendTo(pagination);
            });

            pagination.on('click','.slidesjs-pagination-item',function(e){
                e.preventDefault();
                _this.stop(true);
                return _this.goto(($(e.currentTarget).attr("data-slidesjs-item") * 1) + 1);
            }) 
        }
        this._setActive();
        if (this.options.play.auto) {
            this.play();
        }
        this.options.callback.loaded(this.options.start);
    };
    Plugin.prototype._setActive = function(number) {
        var $element, current;
        $element = $(this.element);
        this.data = $.data(this);
        current = number > -1 ? number : this.data.current;
        $(".active", $element).removeClass("active");
        $(".slidesjs-pagination li:eq(" + current + ")", $element).addClass("active");
    };
    Plugin.prototype.update = function() {
        var $element, height, width;
        $element = $(this.element);
        this.data = $.data(this);
        $(".slidesjs-control", $element).children(":not(:eq(" + this.data.current + "))").css({
            display: "none",
            left: 0,
            zIndex: 0
        });

        $(".slidesjs-control, .slidesjs-container", $element).css({
            width: this.options.width,
            height: this.options.height
        });
    };
    Plugin.prototype.next = function(effect) {
        var $element;
        $element = $(this.element);
        this.data = $.data(this);
        $.data(this, "direction", "next");
        if (effect === void 0) {
            effect = this.options.navigation.effect;
        }
        if (effect === "fade") {
            this._fade();
        } else {
            this._slide();
        }
    };
    Plugin.prototype.previous = function(effect) {
        var $element;
        $element = $(this.element);
        this.data = $.data(this);
        $.data(this, "direction", "previous");
        if (effect === void 0) {
            effect = this.options.navigation.effect;
        }
        if (effect === "fade") {
            this._fade();
        } else {
            this._slide();
        }
    };
    Plugin.prototype.goto = function(number) {
        var $element, effect;
        $element = $(this.element);
        this.data = $.data(this);

        effect = this.options.pagination.effect;

        if (number > this.data.total) {
            number = this.data.total;
        } else if (number < 1) {
            number = 1;
        }

        if (typeof number === "number") {
            if (effect === "fade") {
                this._fade(number);
            } else {
                this._slide(number);
            }
        }
    };
    Plugin.prototype.play = function(next) {
        var $element, currentSlide, slidesContainer,
        _this = this;
        $element = $(this.element);
        this.data = $.data(this);
        if (!this.data.playInterval) {
            if (next) {
                currentSlide = this.data.current;
                this.data.direction = "next";
                if (this.options.play.effect === "fade") {
                    this._fade();
                } else {
                    this._slide();
                }
            }

            $.data(this, "playInterval", setInterval((function() {
                currentSlide = _this.data.current;
                _this.data.direction = "next";
                if (_this.options.play.effect === "fade") {
                    _this._fade();
                } else {
                    _this._slide();
                }
            }), this.options.play.interval));

            slidesContainer = $(".slidesjs-container", $element);
            if (this.options.play.pauseOnHover) {
                slidesContainer.unbind();
                slidesContainer.bind("mouseenter", function() {
                    _this.stop();
                });
                slidesContainer.bind("mouseleave", function() {
                    if (_this.options.play.restartDelay) {

                        _this.data.restartDelay && clearTimeout(_this.data.restartDelay);

                        $.data(_this, "restartDelay", setTimeout((function() {
                            _this.play(true);
                        }), _this.options.play.restartDelay));
                    } else {
                        _this.play();
                    }
                });
            }
            $(".slidesjs-play", $element).addClass("slidesjs-playing");
        }
    };
    Plugin.prototype.stop = function(clicked) {
        var $element;
        $element = $(this.element);
        this.data = $.data(this);
        this.data.playInterval && clearInterval(this.data.playInterval);
        if (this.options.play.pauseOnHover && clicked) {
            $(".slidesjs-container", $element).unbind();
        }
        $.data(this, "playInterval", null);
        $(".slidesjs-play", $element).removeClass("slidesjs-playing");
    };
    Plugin.prototype._slide = function(number) {
        var $element, currentSlide, direction, duration, next, prefix, slidesControl, timing, transform, value,
            _this = this;
            $element = $(this.element);
        this.data = $.data(this);
        //如果不在运动中，且不是当前的页码
        if (!this.data.animating && number !== this.data.current + 1) {
            $.data(this, "animating", true);
            currentSlide = this.data.current;
            //页码
            if (number > -1) {
                number = number - 1;
                value = number > currentSlide ? 1 : -1;
                direction = number > currentSlide ? -this.options.width : this.options.width;
                next = number;
            } else {
                //自动、上一页、下一页
                value = this.data.direction === "next" ? 1 : -1;
                direction = this.data.direction === "next" ? -this.options.width : this.options.width;
                next = currentSlide + value;
            }

            //最后一页    
            if (next === -1) {
                next = this.data.total - 1;
            }
            //第一页
            if (next === this.data.total) {
                next = 0;
            }

            this._setActive(next);

            slidesControl = $(".slidesjs-control", $element);
            //页码
            if (number > -1) {
                slidesControl.children(":not(:eq(" + currentSlide + "))").css({
                    display: "none",
                    left: 0,
                    zIndex: 0
                });
            }
            //定位
            slidesControl.children(":eq(" + next + ")").css({
                display: "block",
                left: value * this.options.width,
                zIndex: 10
            });

            this.options.callback.start(currentSlide + 1);

            if (this.data.vendorPrefix) {
                prefix = this.data.vendorPrefix;
                transform = prefix + "Transform";
                duration = prefix + "TransitionDuration";
                timing = prefix + "TransitionTimingFunction";

                slidesControl[0].style[transform] = "translateX(" + direction + "px)";
                slidesControl[0].style[duration] = this.options.effect.slide.speed + "ms";

                slidesControl.bind("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
                    slidesControl[0].style[transform] = "";
                    slidesControl[0].style[duration] = "";
                    slidesControl.children(":eq(" + next + ")").css({
                        left: 0
                    });
                
                    slidesControl.children(":not(:eq(" + next + "))").css({
                        display: "none",
                        left: 0,
                        zIndex: 0
                    });
                    slidesControl.unbind("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd");
                    $.data(_this, "current", next);
                    $.data(_this, "animating", false);
                    _this.options.callback.complete(next + 1);
                });
            } else {
                slidesControl.stop().animate({
                    left: direction
                }, this.options.effect.slide.speed, (function() {
                    slidesControl.css({
                        left: 0
                    });
                    slidesControl.children(":eq(" + next + ")").css({
                        left: 0
                    });
                    slidesControl.children(":eq(" + currentSlide + ")").css({
                        display: "none",
                        left: 0,
                        zIndex: 0
                    })
                    $.data(_this, "current", next);
                    $.data(_this, "animating", false);
                    _this.options.callback.complete(next + 1);
                }));
            }
      }
    };
    Plugin.prototype._fade = function(number) {
        var $element, currentSlide, next, slidesControl, value,
        _this = this;
        $element = $(this.element);
        this.data = $.data(this);
        if (!this.data.animating && number !== this.data.current + 1) {
            $.data(this, "animating", true);
            currentSlide = this.data.current;
            if (number) {
                number = number - 1;
                value = number > currentSlide ? 1 : -1;
                next = number;
            } else {
                value = this.data.direction === "next" ? 1 : -1;
                next = currentSlide + value;
            }
            if (next === -1) {
                next = this.data.total - 1;
            }
            if (next === this.data.total) {
                next = 0;
            }

            this._setActive(next);

            slidesControl = $(".slidesjs-control", $element);
            slidesControl.children(":eq(" + next + ")").css({
                display: "none",
                left: 0,
                zIndex: 10
            });
            this.options.callback.start(currentSlide + 1);

        if (this.options.effect.fade.crossfade) {
            slidesControl.children(":eq(" + this.data.current + ")").stop().fadeOut(this.options.effect.fade.speed);

            slidesControl.children(":eq(" + next + ")").stop().fadeIn(this.options.effect.fade.speed, (function() {
                slidesControl.children(":eq(" + next + ")").css({
                    zIndex: 0
                });
                $.data(_this, "animating", false);
                $.data(_this, "current", next);
                _this.options.callback.complete(next + 1);
            }));
        } else {
            slidesControl.children(":eq(" + currentSlide + ")").stop().fadeOut(this.options.effect.fade.speed, (function() {
                slidesControl.children(":eq(" + next + ")").stop().fadeIn(_this.options.effect.fade.speed, (function() {
                    slidesControl.children(":eq(" + next + ")").css({
                        zIndex: 10
                    });
                }));
                $.data(_this, "animating", false);
                $.data(_this, "current", next);
                _this.options.callback.complete(next + 1);
            }));
        }
      }
    };
    Plugin.prototype._getVendorPrefix = function() {
      var body, i, style, transition, vendor;
        body = document.body || document.documentElement;
        style = body.style;
        transition = "Transition";
        vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
        //transition = transition.charAt(0).toUpperCase() + transition.substr(1);
        i = 0;
        while (i < vendor.length) {
            if (typeof style[vendor[i] + transition] === "string") {
                return vendor[i];
            }
            i++;
        }
      return false;
    };
    return $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);
