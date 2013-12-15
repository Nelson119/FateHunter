// Copyright (c) 2012 Ivan Kubrakov 
// Selectik: a jQuery custom select plugin http://brankub.github.com/selectik/
(function (b) {
    var e = !1,
        g = !1,
        f = !1,
        l = /android|iphone|ipad|ipod|android/i.test(navigator.userAgent.toLowerCase()),
        m = /opera/i.test(navigator.userAgent.toLowerCase()),
        n = /msie/i.test(navigator.userAgent.toLowerCase()),
        p = "[object OperaMini]" === Object.prototype.toString.call(window.operamini);
    Selectik = function (a) {
        this.config = b.extend(!0, {
            containerClass: "custom-select",
            width: 0,
            maxItems: 0,
            customScroll: 1,
            speedAnimation: 200,
            smartPosition: !0,
            minScrollHeight: 10
        }, a || {})
    };
    Selectik.prototype = {
        _init: function (a) {
            this.$cselect = b(a);
            this.cselect = a;
            this.mouseDown = this.fixScroll = this.change = this.scrollL = !1;
            0 == this.config.width && (this.$cselect.wrap("<span/>"), this.config.width = this.$cselect.parent().width(), this.$cselect.parent().replaceWith(this.$cselect));
            this._generateContainer();
            this._handlers()
        },
        _generateContainer: function () {
            this.$cselect.wrap('<div class="' + this.config.containerClass + ("disabled" === this.$cselect.attr("disabled") ? " disabled" : "") + '"></div>');
            this.$container = this.$cselect.parent();
            this._getList({
                refreshHtml: !1
            })
        },
        _getList: function (a) {
            this.count = this.cselect.length;
            a.refreshSelect && b(".select-list", this.$container).remove();
            var c = this._generateHtml(),
                d = 0 < this.config.maxItems && 1 == this.config.customScroll ? '<div class="select-scroll"><span class="scroll-drag">\x3c!-- --\x3e</span></div>' : "",
                h = 1 == this.config.customScroll ? "custom-scroll" : "default-scroll";
            this.$selected = b("option:selected", this.$cselect);
            c = a.refreshSelect ? '<div class="select-list ' + h + '">' + d + "<ul>" + c + "</ul></div>" : '<span class="custom-text">' + this.$selected[0].text + '</span><div class="select-list ' + h + '">' + d + "<ul>" + c + "</ul></div>";
            b(c).prependTo(this.$container);
            this.$list = b("ul", this.$container);
            this.$text = b(".custom-text", this.$container);
            this.$listContainer = b(".select-list", this.$container);
            this._clickHandler();
            b("li:eq(" + this.$selected.index() + ")", this.$list).addClass("selected");
            this.$container.removeClass("done");
            this.setWidthCS(this.config.width);
            this.standardTop = parseInt(this.$listContainer.css("top"));
            this._getLength({
                refreshSelect: a.refreshSelect
            })
        },
        _generateHtml: function () {
            this.$collection = this.$cselect.children();
            for (var a = "", c = 0; c < this.$collection.length; c++) var d = b(this.$collection[c]),
            a = a + ('<li class="' + ("disabled" === d.attr("disabled") ? "disabled" : "") + '" data-value="' + d[0].value + '">' + (d.data("selectik") ? d.data("selectik") : d[0].text) + "</li>");
            return a
        },
        _getLength: function (a) {
            a.refreshSelect || (this.heightItem = b("li:nth-child(1)", this.$list).outerHeight());
            this.count < this.config.maxItems || 0 == this.config.maxItems ? (this.$listContainer.hide(), this.$container.addClass("done"), this.scrollL = !1) : (this.scrollL = !0, this.heightList = this.heightItem * this.count, this.heightContainer = this.heightItem * this.config.maxItems, this.$list.css("height", this.heightContainer), this.$listContainer.hide(), this.$container.addClass("done"), 1 == this.config.customScroll && this._getScroll())
        },
        _getScroll: function () {
            var a = this.heightItem * this.count;
            this.heightShift = -a + this.heightContainer;
            this.$bgScroll = b(".select-scroll", this.$listContainer);
            this.$bgScroll.css("height", this.heightContainer);
            this.$scroll = b(".scroll-drag", this.$listContainer);
            this.$listContainer.addClass("maxlength");
            this.relating = a / this.heightContainer;
            this.heightScroll = this.heightContainer * (this.heightContainer / a);
            this.heightScroll < this.config.minScrollHeight && (this.heightScroll = this.config.minScrollHeight, this.fixScroll = !0);
            this.$scroll.css("height", this.heightScroll);
            0 < b(".selected", this.$list).length && this._shift(b(".selected", this.$list).index());
            this.config.customScroll && this._scrollHandlers()
        },
        _scrollHandlers: function () {
            var a, c = this;
            this.$list.bind("mousewheel", function (d, b) {
                a = parseInt(c.$list.css("top")) + b * c.heightItem;
                c._shiftHelper(a);
                return !1
            });
            this.$bgScroll.click(function (d) {
                d = 0.5 < (d.pageY - b(this).offset().top) / c.heightContainer ? -1 : 1;
                a = parseInt(c.$list.css("top")) + c.heightItem * d;
                c._shiftHelper(a);
                return !1
            });
            this.$text.on("mousedown", function (a) {
                c._draggable(a, !0)
            });
            this.$scroll.on("mousedown", function (a) {
                f = !1;
                c._draggable(a, !0)
            });
            b(document).on("mouseup", function (a) {
                c._draggable(a, !1)
            })
        },
        _draggable: function (a, c) {
            var d = this;
            if (c) {
                e = !1;
                a.preventDefault() && a.preventDefault();
                var h = parseInt(d.$scroll.css("top")),
                    g = a.clientY,
                    k = d.$text.outerHeight();
                b(document).bind("mousemove", function (a) {
                    if (f) {
                        var c = d.$list.parent().offset().top,
                            e = d.$list.outerHeight();
                        a = a.clientY - (c - (0 < d.topPosition ? k : 0) - b(window).scrollTop());
                        if (0 > a || a > e + k) e = 0 > a ? 1 : -1, e = parseInt(d.$list.css("top")) + e * d.heightItem, d._shiftHelper(e)
                    } else d._shiftHelper((g - a.clientY - h) * d.relating)
                })
            } else b(document).unbind("mousemove"), e = !0
        },
        _shiftHelper: function (a) {
            a = 0 < a ? 0 : a;
            a = a < this.heightShift ? this.heightShift : a;
            this.$list.css("top", a);
            this.$scroll.css("top", this.fixScroll ? -(a / this.relating + a / this.heightShift * this.config.minScrollHeight) : -(a / this.relating))
        },
        _shift: function (a) {
            0 > a || a == this.count || (this.topShift = a > this.count - this.config.maxItems ? this.heightList - this.heightContainer : this.heightItem * a, b(".selected", this.$list).removeClass("selected"), b("li:nth-child(" + (a + 1) + ")", this.$list).addClass("selected"), this.scrollL && this._shiftHelper(-this.topShift))
        },
        _clickHandler: function () {
            var a = this;
            this.$listContainer.off("mousedown", "li").on("mousedown", "li", function (c) {
                if (a.change) return a.change = !1, !0;
                a._checkDisabled(b(this), c) && (a.change = !0, a._changeSelected(b(this)))
            })
        },
        _handlers: function () {
            var a = this,
                c = b('input[type="reset"]', this.$cselect.parents("form"));
            0 < c.length && c.bind("click", function () {
                var d = 0 < a.$selected.length ? a.$selected.index() : 0;
                a._changeSelected(b("option:eq(" + d + ")", a.$cselect))
            });
            this.$cselect.bind("change", function () {
                if (a.change) return a.change = !1, !0;
                a._changeSelected(b("option:selected", b(this)))
            });
            this.$text.bind("click", function (b) {
                if (a.$container.hasClass("disabled") || f) return !1;
                a.$cselect.focus();
                a._fadeList(!1, !0)
            });
            this.$text.bind("mousedown", function (b) {
                a._checkDisabled(a.$container, b) && (b.preventDefault(), a.mouseDown = !0, setTimeout(function () {
                    a.mouseDown && (f = !0, a._fadeList(!1, !0))
                }, 300))
            });
            this.$text.bind("mouseup", function () {
                a.mouseDown = !1
            });
            this.$listContainer.on("mouseup", "li", function (c) {
                if (!f) return !0;
                b(this).hasClass("disabled") || (a.change = !0, a._changeSelected(b("option:eq(" + b(c.currentTarget).index() + ")", a.$cselect)), a.hideCS(!0), f = !1, a.$cselect.focus())
            });
            this.$cselect.bind("focus", function () {
                a.$container.addClass("active")
            });
            this.$cselect.bind("blur", function () {
                f || (a.hideCS(!0), a.$container.removeClass("active"))
            });
            this.$cselect.bind("keyup", function (b) {
                a._keysHandlers(b)
            });
            m && a.$cselect.bind("keydown", function () {
                g = !0
            })
        },
        _checkDisabled: function (a, b) {
            return a.hasClass("disabled") ? (b.preventDefault(), !1) : !0
        },
        _keysHandlers: function (a) {
            13 == a.keyCode && this.$listContainer.is(":visible") && this._fadeList(!0, !1);
            n || 27 == a.keyCode && this.$listContainer.is(":visible") && this._fadeList(!0, !0);
            this.$cselect.change();
            this.scrollL && this._shift(b("option:selected", this.$cselect).index())
        },
        _changeSelected: function (a) {
            var b = 0 < a.parents("select").length ? a.attr("value") : a.data("value"),
                d = a.text();
            this._changeSelectedHtml(b, d, a.index() + 1)
        },
        _changeSelectedHtml: function (a, c, d) {
            if (d > this.count || 0 == d) return !1;
            this.change = !0;
            var e = b(".selected", this.$list);
            b("option:eq(" + e.index() + ")", this.$cselect).prop("selected", !1);
            b("option:eq(" + (d - 1) + ")", this.$cselect).prop("selected", !0);
            this.$cselect.prop("value", a).change();
            e.removeClass("selected");
            b("li:nth-child(" + d + ")", this.$list).addClass("selected");
            this.$text.text(c)
        },
        _fadeList: function (a, c) {
            var d = b("." + this.config.containerClass + ".open_list");
            if (1 == d.length) d.children("select").data("selectik").hideCS();
            else {
                if (!c && (d.children(".select-list").stop(!0, !0).fadeOut(this.config.speedAnimation).parent().toggleClass("open_list"), a)) return;
                e = !1;
                this.positionCS();
                this.$listContainer.stop(!0, !0).fadeToggle(this.config.speedAnimation);
                this.$listContainer.parent().toggleClass("open_list");
                setTimeout(function () {
                    e = !0
                }, this.config.speedAnimation)
            }
        },
        hideCS: function (a) {
            this.$listContainer.fadeOut(this.config.speedAnimation);
            this.$container.removeClass("open_list");
            a || this.$cselect.focus();
            e = !0
        },
        showCS: function () {
            e = !1;
            this.$listContainer.fadeIn(this.config.speedAnimation);
            this.$container.addClass("open_list")
        },
        positionCS: function () {
            if (this.config.smartPosition) {
                elParent = this.$listContainer.parent();
                var a = this.scrollL ? this.config.maxItems * this.heightItem : this.count * this.heightItem,
                    c = this.scrollL ? this.config.maxItems : this.count,
                    d = b(window),
                    e = d.scrollTop(),
                    c = d.height() - (elParent.offset().top - e) - elParent.outerHeight() < a ? -c * this.heightItem - elParent.outerHeight() / 4 : this.standardTop;
                this.topPosition = elParent.offset().top - e < a && b("html").height() - elParent.offset().top > a ? this.standardTop : c;
                this.$listContainer.css("top", this.topPosition)
            }
        },
        refreshCS: function () {
            this._getList({
                refreshSelect: !0
            })
        },
        changeCS: function (a) {
            a = 0 < a.index ? a.index : b('option[value="' + a.value + '"]', this.$cselect).index() + 1;
            var c = b("option:nth-child(" + a + ")", this.$cselect),
                d = c.attr("value"),
                c = c.text();
            this._changeSelectedHtml(d, c, a)
        },
        disableCS: function () {
            this.$cselect.attr("disabled", !0);
            this.$container.addClass("disabled")
        },
        enableCS: function () {
            this.$cselect.attr("disabled", !1);
            this.$container.removeClass("disabled")
        },
        requiredCS: function () {
            this.$text.toggleClass("required")
        },
        setWidthCS: function (a) {
            b.each([this.$list, this.$text], function () {
                var c = b(this).parent(),
                    c = c.outerWidth() - c.width(),
                    d = b(this).outerWidth() - b(this).width(),
                    c = c + d;
                b(this).css("width", a - c)
            })
        }
    };
    b.fn.selectik = function (a, c) {
        if (!l && !p) return this.each(function () {
            if (!(0 < b("optgroup", this).length || "multiple" == b(this).attr("multiple")) && void 0 == b(this).data("selectik")) {
                var d = new Selectik(a);
                for (i in c) d[i] = c[i];
                d._init(this);
                b(this).data("selectik", d)
            }
        })
    };
    b(window).resize(function () {
        if (e) {
            var a = b(".open_list");
            0 < !a.length || a.children("select").data("selectik").positionCS(b(".select-list:visible"))
        }
    });
    b(document).bind("click", function (a) {
        b(a.target).hasClass("disabled") || (g ? g = !1 : e && (e = !1, a = b(".open_list"), 0 < a.length && (a.children("select").data("selectik").hideCS(), f = !1)))
    })
})(jQuery);