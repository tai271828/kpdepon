$(document).ready(function () {
    var stat = {
        ".pon": 0,
        ".ka": 0,
        "key": "-",
        "player": 0
    };

    var sounds = {
        ".pon": new Howl({
            buffer: true,
            urls: ["pon.wav"],
            onend: function () {
                reset(".pon")
            }
        }),
        ".ka": new Howl({
            buffer: true,
            urls: ["ka.wav"],
            onend: function () {
                reset(".ka")
            }
        })
    };

    $(document).keydown(function (e) {
        switch (e.which) {
        // x .
        case 88:
        case 190:
            play(".pon");
            break;
        // a and '
        case 65:
        case 222:
            play(".ka");
            break;
        case 81:
            var url = prompt("youtube url?");
            var vidId = url.match(/v=([^&]*)&?/)[1];
            playBGM(vidId);
            break;
        }
    });

    function play(id) {
        sounds[id].play();
        stat["key"] = id[1];
        setTimeout(function () {
            stat["key"] = "-";
        }, 100);
        if (1 === stat[id]) {
            $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
            setTimeout(function () {
                $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
            }, 20);
            setTimeout(function () {
                reset(id);
            }, 60);
        } else {
            $(id).attr("src", "./imgs/animate.gif").addClass("glowing");
            setTimeout(function () {
                $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
            }, 100);
            stat[id] = 1;
        }
    }

    function reset(id) {
        $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
        stat[id] = 0;
    }

    var clickType = ((null !== document.ontouchstart)? "click":"touchstart");
    $(".pon").bind(clickType, function () {play(".pon");});
    $(".ka").bind(clickType, function () {play(".ka");});
    setTimeout(function () {
        $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    }, 1000);

    // expermintal player

    function logRecordText(key) {
        $("#recordText").val($("#recordText").val() + key);
    }

    function playRecordText(pos) {
        var text = $("#recordText").val();
        if (pos > text.length) {
            return;
        }

        switch (text[pos]) {
        case "p":
            play(".pon");
            break;
        case "k":
            play(".ka");
            break;
        }

        stat["player"] = setTimeout(function () {
            playRecordText(pos+1);
        }, 100)
    }

    $("#btn_record").bind("click", function () {
        $("#recordText").val("");
        stat["player"] = setInterval(function () {
            logRecordText(stat["key"]);
        }, 100);
    });

    $("#btn_play").bind("click", function () {
        playRecordText(0);
    });

    $("#btn_stop").bind("click", function () {
        clearInterval(stat["player"]);
        stat["player"] = 0;
        $("#recordText").val($("#recordText").val().replace(/^--+/, '-').replace(/--+$/, '-'));
    });

    var patterns = ["-p--p--k---ppp-p--k----p--p--k---ppp-p--k-kk-", "-p----k---p-p--p--k-----p----k---p-p--p--k-"];
    var pattern = patterns[Math.floor(Math.random() * patterns.length)]

    $("#recordText").val(pattern);


    // youtube player
    function playBGM(vidId) {
        var player = new YT.Player('yt_video', {
            height: 200,
            width: 300,
            videoId: vidId,
            events: {
                onReady: function(e) { e.target.playVideo(); },
                onStateChange: function(e) {
                    if(e.data == YT.PlayerState.ENDED) { setBGM(getBGMId(vidId)); }
                }
            }
        });
        $("#yt_video").height(300).show();
    };

    function setBGM(vidId) {
        $("#yt_video").hide();
        if("undefined" === typeof(vidId)) {
            var vidId = getBGMId();
        }

        $("#yt_video").replaceWith("<div id=\"yt_video\"></div>");
        playBGM(vidId);
    }

    $("#yt_video").hide();

    var str = window.location.hash.substr(1);
    try {
        var vidId = str.match(/v=([^&]*)&?/)[1];
        setTimeout(function() {
            playBGM(vidId);
        }, 1000);
    } catch (err) {
        // do nothing
    }
});
