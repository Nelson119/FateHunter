var ltIE9 = (navigator.userAgent.replace(/^.*MSIE\s+(\d+\.\d+).*$/ig, '$1') * 1) < 9;
var isIE = (navigator.userAgent.replace(/^.*MSIE\*$/ig, '$1') * 1) == "MSIE";


    /************************/
    /* share
    /************************/
$(function () {
    window.share = {};
    share.image = $("link[rel$=image_src]").attr('href') || $("meta[property$=image]").attr('content') || $("img:first").attr('src');
    share.desciption = $("meta[name=description]").attr('content') || $("meta[property$=description]").attr('content') || "";

    var defaultUrl =  $("meta[property$=url]").attr('content') || location.href;

    var defaultUrl = $('meta').filter(function (r) {
        return $(this).attr('property') === 'og:url';
    }).attr('content') || location.href.replace(/^(.*\/(\/.*)*\/).*$/, '$1');
    share.f = function (url) {
        var shareLink = 'http://www.facebook.com/sharer.php?t=loading&u=' + encodeURIComponent(url || defaultUrl);
        window.open(shareLink, '_blank', 'height=480,width=620,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no');
    };
    share.t = function (url) {
        var shareLink = 'http://twitter.com/intent/tweet?url=' + encodeURIComponent(url || defaultUrl) + '&text=' + encodeURIComponent(share.desciption);
        window.open(shareLink, '_blank', 'height=480,width=620,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no');
    };
    share.g = function (url) {
        var shareLink = 'https://plus.google.com/share?url=' + encodeURIComponent(url || defaultUrl);
        window.open(shareLink, '_blank', 'height=480,width=620,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no');
    };
    share.w = function (url) {
        var shareLink = 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(url || defaultUrl) +
            '&title=' + encodeURIComponent(share.desciption) + '&pic=' + encodeURIComponent(this.image);
        window.open(shareLink, '_blank', 'height=480,width=620,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no');
    };
    share.r = function (url) {
        var shareLink = 'http://share.renren.com/share/buttonshare?link=' + encodeURIComponent(url || defaultUrl) +
            '&title=' + encodeURIComponent(share.desciption);
        window.open(shareLink, '_blank', 'wheight=480,width=620,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no');
    };

    window.slide = {};

    slide.next = function () {
        var next = $($(".viewport .active").next()[0] || $(".viewport li").first()[0]);
        var o = $(".viewport .active");
        $(".viewport .overlay").css("z-index", 5);
        next.css("z-index", 2).fadeTo(1, 1, function () {
            o.css("z-index", 3).fadeTo(1, 1, function () {
                o.animate({
                    marginLeft: -80 + 'px',
                    opacity:0
                },450, function () {
                    $(".viewport li,.viewport .overlay").removeAttr("style");
                    next.addClass('active').siblings().removeClass('active');
                });
            });

        });
    };
    slide.prev = function () {
        var next = $($(".viewport .active").prev()[0] || $(".viewport li").last()[0]);
        var o = $(".viewport .active");
        $(".viewport .overlay").css("z-index", 5);
        next.css("z-index", 2).fadeTo(1, 1, function () {
            o.css("z-index", 3).fadeTo(1, 1, function () {
                o.animate({
                    marginLeft: 80 + 'px',
                    opacity: 0
                }, 450, function () {
                    $(".viewport li,.viewport .overlay").removeAttr("style");
                    next.addClass('active').siblings().removeClass('active');
                });
            });

        });
    };

    if ($(".hero .left-bottom a").length) {
        $(".slide-nav li").unbind("click").on("click", function () {
            if ($(this).index() == $(".slide-viewport li.active").index())
                return false;
            $(this).addClass("active").siblings().removeClass("active");
            var active = $(".slide-viewport li.active");
            var target = $(".slide-viewport li").eq($(this).index());
            target.siblings().removeAttr("style");
            active.removeAttr("style").css("z-index", 1).css('height', "auto").fadeTo(1, 1, function () {
                target.removeAttr("style").css("z-index", 0).css("height", "auto").fadeTo(1, 1, function () {
                    target.addClass("active").siblings().removeAttr("class");
                    active.stop().animate({
                        opacity: 0,
                        marginTop: (active.index() > target.index() ? 1 : -1) * 75
                    }, 250, function () {
                        target.removeAttr("style");
                        active.removeAttr("style");
                    });
                });
            });


        });
        $(".slide-nav").unbind("touchend click mouseover").bind("touchend click mouseover", function (e) {
            var o = $(this);
            if (o.hasClass("freeze"))
                return;

            o.addClass("freeze");

            var cursorPosition = e.clientY + $(window).scrollTop();
            var elementOffsetTop = $(".nav-range").offset().top;


            var percent = (cursorPosition - elementOffsetTop) / $(".nav-range").height() * -1;

            if ((Math.round(percent * ($("ul", o).height() + 18 - $(".nav-range").height()))) > $("ul", o).css("margin-top").replace(/px/,'')){
                $(".slide-nav .upward").addClass("on");
                $(".slide-nav .downward").removeClass("on");
            }
            else {
                $(".slide-nav .upward").removeClass("on");
                $(".slide-nav .downward").addClass("on");
            }
            $("ul", o).stop().animate({
                marginTop: Math.round(percent * ($("ul", o).height() + 18 - $(".nav-range").height()))
            }, 250)

            var freezTick = setTimeout(function () {
                o.removeClass("freeze");
            }, 10);
        });
        $(".slide-nav").on("mouseout", function () {
            $(".slide-nav .upward,.slide-nav .downward").removeClass("on");
        });
        $(".hero .left-bottom a").colorbox({ iframe: true, innerWidth: $(window).width() * .85, innerHeight: $(window).height() * .85 });
    }
});


