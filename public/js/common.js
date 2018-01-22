$(function () {
    var $floatDiv = $(".main_float_area");
    $floatDiv.css({ "top": "828px", "left": ($(window).width() / 2 + 600 + 10) + "px" });
    var $nav = $(".nav_area")//.css({ "position": "fixed", "z-index": "9999" });
    var $floatNav = $nav.clone().attr("id", "floatNav").hide().css({ "position": "absolute", "left": "0", "z-index": "9999" }).appendTo(document.body);

    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop < 828) {
            $floatDiv.stop().animate({ top: 828 + 10 });
        } else {
            $floatDiv.stop().animate({ top: scrollTop + 150 });
        }
        //
        if ($("#floatNav").length > 0) {

        }
        if (scrollTop < 31) {
            $floatNav.hide();
            //$nav.css({ "top": "31"});
        } else {
            //$floatNav.css({ "position": "absolute", "top": "0", "z-index": "9999" });
             $floatNav.show().css("top", scrollTop);
            //$nav.css({ "top": "31" });
        }


    });

    $("#wxCode").hover(function () { $(this).children("img").fadeIn(); }, function () { $(this).children("img").fadeOut(); });

    $(".nav li").hover(function () {
        if ($(this).children(".selectDiv").length > 0) {
            $(this).children(".selectDiv").slideDown();
            //$(this).children("a.normal").slideUp();
        } else {
            //var $a = $(this).children("a");
            //var $selectDiv = $("<div/>").addClass("selectDiv").hide().appendTo(this);
            //$a.appendTo($selectDiv);
            //$selectDiv.slideDown();
        }
        if ($(this).children(".navMenu").length > 0) {
            $(this).children(".navMenu").slideDown();
        }
        if ($(this).children(".normal").length > 0) {
            $(this).children(".normal").fadeOut();
        }
    }, function () {
        if ($(this).children(".selectDiv").length > 0) {
            $(this).children(".selectDiv").slideUp();
            //$(this).children("a.normal").slideDown();
        }
        if ($(this).children(".navMenu").length > 0) {
            $(this).children(".navMenu").slideUp();
        }
        if ($(this).children(".normal").length > 0) {
            $(this).children(".normal").fadeIn();
        }
    });

    $(".logo").hover(function () {
        $(this).children(".descInfoArea").slideDown();
    }, function () {
        $(this).children(".descInfoArea").slideUp();
    });

    $(".main_desc_area div.img,.main_news_list .imgBox,.index_health_list div.img").hover(function () {
        var $this = $(this).css({ "position": "relative" });
        $this.children("img").css("z-index", "1");
        if ($this.children(".p_floatDiv").length > 0) {
            $this.children(".p_floatDiv").slideDown();
        } else {

            var $floatDiv = $("<div/>").addClass("p_floatDiv").css({
                "width": ($this.width() - 40) + "px",
                "height": ($this.height() - 40) + "px",
                "line-height": ($this.height() - 40) + "px",
                "z-index": "2",
                "padding": "20px"
            }).hide().appendTo($this);
            var $a = $("<a/>").css({ "border": "1px #ffffff solid", "display": "block" }).attr({ "href": "#" }).html("VIEW DETAIL").appendTo($floatDiv);
            $floatDiv.slideDown();
        }
    }, function () {
        var $this = $(this);
        if ($this.children(".p_floatDiv").length > 0) {
            $this.children(".p_floatDiv").slideUp();
        }
    });

    $(".main_desc_area .item").hover(function () {
        var $this = $(this);
        if ($this.children(".info").length > 0) {
            $this.children(".info").addClass("hover");
            //$this.children(".info").animate({
            //    background: "url(../images/img13.jpg) repeat-x !important"
            //}, 1000);
        }
    }, function () {
        var $this = $(this);
        if ($this.children(".info").length > 0) {
            $this.children(".info").animate().removeClass("hover");

            //$this.children(".info").animate({
            //    background: "url(../images/img14.jpg) repeat-x !important"
            //}, 1000);
        }
    });
});
(function () {
    //»Øµ½¶¥²¿
    goToTop = function () {
        var $window = $(window);
        var sTop = $window.scrollTop();
        //$(window).scrollTop(0);
        var termId = setInterval(function () {
            sTop -= 50;
            if (sTop <= 0) {
                clearInterval(termId);
            }
            //window.scrollTo(0, sTop);
            $window.scrollTop(sTop);
        }, 1);
    };
})();