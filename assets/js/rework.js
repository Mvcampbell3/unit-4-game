$(document).ready(function(){

    var game = {
        // stats for players
        kenStart: 6,
        kenGrow: 6,
        kenCounter: 12,
        kenHP: 200,
        kenWinPic: "assets/images/ken.jpg",
        kenLossPic: "assets/images/kenBeat.jpg",

        ryuStart: 22,
        ryuGrow: 3,
        ryuCounter: 15,
        ryuHP: 196,
        ryuWinPic: "assets/images/ryu.jpg",
        ryuLossPic: "assets/images/ryuBeat.jpg",

        chunLiStart: 10,
        chunLiGrow: 5,
        chunLiCounter: 10,
        chunLiHP: 225,
        chunLiWinPic: "assets/images/chunLi.jpg",
        chunLiLossPic: "assets/images/chunLiBeat.jpg",

        mBisonStart: 14,
        mBisonGrow: 3,
        mBisonCounter: 30,
        mBisonHP: 178,
        mBisonWinPic: "assets/images/mBison.jpg",
        mBisonLossPic: "assets/images/mBisonBeat.jpg",

        // game vars
        goodHP: 0,
        goodStrength: 0,
        grow: 0,
        badStrength: 0,
        badHP: 0,

        badIDArray: [],
        badJQArray: [],


        // methods

        pickPlayer: function () {
            // Set the good player and bad players
            console.log($(this));
            $(this).attr("class", "box good");
            $(".start").attr("class", "box bad");
            $(".goodArea").html($(".good"));
            game.assignGoodStats();
            console.log(game.goodHP);
            console.log(game.goodStrength);
            console.log(game.grow);
            $(".bad").each(function () {
                var badID = $(this).attr("id");
                game.badIDArray.push(badID);
                game.badJQArray.push($(this));
            });
            // change text on title
            $(".directions").text("Select Opponent");
        },

        assignGoodStats: function () {
            // Take the stats from the player picked and assign them to good-stats
            switch ($(".good").attr("id")) {
                case "ken":
                    game.goodHP = game.kenHP;
                    game.goodStrength = game.kenStart;
                    game.grow = game.kenGrow;
                    $(".goodBar").css({ width: game.kenHP });
                    break;
                case "ryu":
                    game.goodHP = game.ryuHP;
                    game.goodStrength = game.ryuStart;
                    game.grow = game.ryuGrow;
                    $(".goodBar").css({ width: game.ryuHP });
                    break;
                case "chunLi":
                    game.goodHP = game.chunLiHP;
                    game.goodStrength = game.chunLiStart;
                    game.grow = game.chunLiGrow;
                    $(".goodBar").css({ width: game.chunLiHP });
                    break;
                case "mBison":
                    game.goodHP = game.mBisonHP;
                    game.goodStrength = game.mBisonStart;
                    game.grow = game.mBisonGrow;
                    $(".goodBar").css({ width: game.mBisonHP });
                    break;

                default:
                    console.log("assignGoodStats switch not working");
            }
        },

        pickFighter: function () {
            // determine who is fighting and who is staying on sidelines
            console.log($(this));
            $(this).attr("class", "box fighter");
            $(".bad").removeClass("bad").addClass("outFight");
            // grab fighter's stats and put them into the fight
            switch ($(".fighter").attr("id")) {
                case "ken":
                    game.badHP = game.kenHP;
                    game.badStrength = game.kenCounter;
                    $(".badBar").css({ width: game.kenHP });
                    break;
                case "ryu":
                    game.badHP = game.ryuHP;
                    game.badStrength = game.ryuCounter;
                    $(".badBar").css({ width: game.ryuHP });
                    break;
                case "chunLi":
                    game.badHP = game.chunLiHP;
                    game.badStrength = game.chunLiCounter;
                    $(".badBar").css({ width: game.chunLiHP });
                    break;
                case "mBison":
                    game.badHP = game.mBisonHP;
                    game.badStrength = game.mBisonCounter;
                    $(".badBar").css({ width: game.mBisonHP });
                    break;
                default:
                    console.log("pickFighter switch not working")
            };
            // Move fighters to fight area and fade it in
            $(".goodFighter").html($(".good"));
            $(".badFighter").html($(".fighter"));
            $(".fightScreen").fadeIn();
            $(".container").fadeOut();
            // set buttons to be active
            $(".disabled").attr("class", "btn active");
            game.updatePageStats();
            document.getElementById("playerSelectAudio").pause();
            document.getElementById("playerSelectAudio").currentTime = 0;
            document.getElementById("fightAudio").play();

        },

        round: function () {
            // good attack and grow
            game.badHP = game.badHP - game.goodStrength;
            game.goodStrength = game.goodStrength + game.grow;
            // Set bad stats back to stat array
            game.updateBadStats();
            game.widthColorBad();
            if (game.badHP > 0) {
                game.goodHP = game.goodHP - game.badStrength;
                game.updatePageStats();
                game.widthColorGood();
                if (game.goodHP > 0) {
                    // round over fight continues
                } else {
                    // round over player losses
                    $(".active").removeClass("active").addClass("disabled");
                    game.changeBackgroundBeat($(".good").attr("id"));
                    game.goodHP = 0;
                    game.updatePageStats();
                    game.endGameLost();

                };
            } else {
                // round over player wins fight
                game.changeBackgroundBeat($(".fighter").attr("id"));
                game.badHP = 0;
                game.updatePageStats();
                $(".badHP-place").text("0");
                // splice losing fighter from badIDArray
                game.loserSpliced();
                // set losing fighter class
                $(".fighter").attr("class", "box loser");
                // set remaining bads class
                $(".outFight").removeClass("outFight").addClass("bad");
                // move everyone back to start
                $(".active").attr("class", "btn disabled");
                $(".fightScreen").fadeOut(1000);

                document.getElementById("fightAudio").pause();
                document.getElementById("fightAudio").currentTime = 0;
                document.getElementById("playerSelectAudio").play();
                if (game.badIDArray.length > 0) {
                    // populate the html
                    setTimeout(function () {
                        $(".playerPick").html($(".bad"));
                        $(".goodArea").html($(".good"));
                        $(".container").fadeIn();
                        $(".grave").html($(".loser"));
                    }, 1000);
                } else {
                    game.endGame();
                }
            }

        },

        endGame: function () {
            setTimeout(function(){
                $(".container").fadeOut();
                $(".endScreen").fadeIn();
                $("#playerSelectAudio")[0].pause();
                $("#playerSelectAudio")[0].currentTime = 0;
                $("#congratsAudio")[0].play()
                $(".pressStartEnd").addClass("active");
                $(".endScreen").css({"background-image": "url(assets/images/winScreen.jpg)"});

                switch ($(".good").attr("id")) {
                    case "ken":
                        $("#endGamePic").attr("src", game.kenWinPic);
                        break;
                    case "ryu":
                        $("#endGamePic").attr("src", game.ryuWinPic);
                        break;
                    case "chunLi":
                        $("#endGamePic").attr("src", game.chunLiWinPic);
                        break;
                    case "mBison":
                        $("#endGamePic").attr("src", game.mBisonWinPic);
                        break;
                    default:
                        console.log("endgamepic did not run");
                };
            }, 1000);
        },

        endGameLost: function(){
            console.log("end game bad called");
            setTimeout(function(){
                console.log("end game bad called");

                $(".fightScreen").fadeOut();
                $(".endScreen").fadeIn();
                $("#fightAudio")[0].pause();
                $("#fightAudio")[0].currentTime = 0;
                $("#continueAudio")[0].play();
                $(".endScreen").css({"background-image": "url('')"});
                $(".pressStartEnd").addClass("active");
                switch ($(".good").attr("id")) {
                    case "ken":
                        $("#endGamePic").attr("src", game.kenLossPic);
                        break;
                    case "ryu":
                        $("#endGamePic").attr("src", game.ryuLossPic);
                        break;
                    case "chunLi":
                        $("#endGamePic").attr("src", game.chunLiLossPic);
                        break;
                    case "mBison":
                        $("#endGamePic").attr("src", game.mBisonLossPic);
                        break;
                    default:
                        console.log("endgamepic-lose did not run");
                };
            }, 1000);

        },

        updateBadStats: function () {
            // update the stats to the stats area, used for run aways
            switch ($(".fighter").attr("id")) {
                case "ken":
                    game.kenHP = game.badHP;
                    $(".badBar").css({ width: game.kenHP });
                    break;
                case "ryu":
                    game.ryuHP = game.badHP;
                    $(".badBar").css({ width: game.ryuHP });
                    break;
                case "chunLi":
                    game.chunLiHP = game.badHP;
                    $(".badBar").css({ width: game.chunLiHP });
                    break;
                case "mBison":
                    game.mBisonHP = game.badHP;
                    $(".badBar").css({ width: game.mBisonHP });
                    break;
                default:
                    console.log("round switch for updating stats not working");
            };
        },

        updateGoodHPStats: function () {
            // update the stats to the stats area, used for run aways
            switch ($(".good").attr("id")) {
                case "ken":
                    game.kenHP = game.goodHP;
                    $(".goodBar").css({ width: game.kenHP });
                    break;
                case "ryu":
                    game.ryuHP = game.goodHP;
                    $(".goodBar").css({ width: game.ryuHP });
                    break;
                case "chunLi":
                    game.chunLiHP = game.goodHP;
                    $(".goodBar").css({ width: game.chunLiHP });
                    break;
                case "mBison":
                    game.mBisonHP = game.goodHP;
                    $(".goodBar").css({ width: game.mBisonHP });
                    break;
                default:
                    console.log("round switch for updating good stats not working");
            };
        },

        updatePageStats: function () {
            $(".goodHP-place").text(game.goodHP);
            $(".goodStr-place").text(game.goodStrength);
            $(".badHP-place").text(game.badHP);
            $(".badStr-place").text(game.badStrength);
            this.updateGoodHPStats();
            this.displayHP();
        },

        displayHP: function () {
            // take HP value and post it to the html, if less then zero, posts zero
            if (game.kenHP > 0) {
                $("#kenHP-place").text(game.kenHP);
            } else {
                $("#kenHP-place").text("0");
            };
            if (game.ryuHP > 0) {
                $("#ryuHP-place").text(game.ryuHP);
            } else {
                $("#ryuHP-place").text("0");
            };
            if (game.chunLiHP > 0) {
                $("#chunLiHP-place").text(game.chunLiHP);
            } else {
                $("#chunLiHP-place").text("0");
            };
            if (game.mBisonHP > 0) {
                $("#mBisonHP-place").text(game.mBisonHP);
            } else {
                $("#mBisonHP-place").text("0");
            };
        },


        changeBackgroundBeat: function(id) {
            document.getElementById(id).style.backgroundImage = "url(assets/images/" + id + "BeatBW.jpg";
        },

        runAway: function () {
            // put fighters back in start area and clear fightScreen
            $(".fighter").attr("class", "box bad");
            $(".outFight").addClass("bad").removeClass("outFight");
            $(".goodArea").html($(".good"));
            $(".playerPick").html($(".bad"));
            $(".fightScreen").fadeOut();
            $(".container").fadeIn();

        },

        loadScreen: function () {
            // Go from start screen to player select screen
            $(".pressStart").removeClass("active");
            $(".startScreen").fadeOut();
            $("#playerSelectAudio")[0].play();
            setTimeout(function () {
                $(".container").fadeIn();
            }, 1000);

        },

        widthColorGood: function () {
            // make good fighter's health bar responsive
            console.log($(".goodBar").width());
            var myWidth = $(".goodBar").width();
            if (myWidth > 100) {
                $(".goodBar").css("backgroundColor", "green");
                console.log("green back good");
            } else if (myWidth > 50 && myWidth <= 100) {
                $(".goodBar").css("backgroundColor", "yellow");
                console.log("yellow back good");
            } else {
                $(".goodBar").css("backgroundColor", "red");
                console.log("red back good");
            }
        },

        widthColorBad: function () {
            // make bad fighters health bar responsive
            console.log($(".badBar").width());
            var myWidth = $(".badBar").width();
            if (myWidth > 100) {
                $(".badBar").css("backgroundColor", "green");
                console.log("green back bad");
            } else if (myWidth > 50 && myWidth <= 100) {
                $(".badBar").css("backgroundColor", "yellow");
                console.log("yellow back bad");
            } else {
                $(".badBar").css("backgroundColor", "red");
                console.log("red back bad");
            }
        },

        loserSpliced: function () {
            // take losers out of badArrayID to check if game is over
            var fighterID = $(".fighter").attr("id");

            var fighterIndex = game.badIDArray.indexOf(fighterID);

            if (fighterIndex != -1) {
                game.badIDArray.splice(fighterIndex, 1);
                console.log("spliced");
                console.log(game.badIDArray);
            }
        },

        restart: function(){
            // resets EVERYTHING that the game changes through playing
            // this was not as fun as I though it would be
            game.kenStart = 6;
            game.kenHP = 200;
            game.ryuStart = 22;
            game.ryuHP = 196;
            game.chunLiStart = 10;
            game.chunLiHP = 225;
            game.mBisonStart = 14;
            game.mBisonHP = 178;

            // game vars
            game.goodHP = 0;
            game.goodStrength = 0;
            game.grow = 0;
            game.badStrength = 0;
            game.badHP = 0;

            game.badIDArray = [];
            game.badJQArray = [];
            $("#continueAudio")[0].pause();
            $("#continueAudio")[0].currentTime = 0;
            $("#congratsAudio")[0].pause();
            $("#congratsAudio")[0].currentTime = 0;
            $(".pressStartEnd").removeClass("active");
            $(".pressStart").addClass("active");
            $(".box").attr("class", "box start");
            $(".playerPick").html($(".start"));
            $(".directions").text("Select Your Fighter");

            // Couldn't get this to work with jQuery selectors..
            // This is was I couldn't use it earlier to change background with id arg in function

            // $("#ken").css("background-image", "assets/images/ken.jpg");
            // $("#ryu").css("background-image", "assets/images/ryu.jpg");
            // $("#chunLi").css("background-image", "assets/images/chunLi.jpg");
            // $("#mBison").css("background-image", "assets/images/mBison.jpg");

            // Works with Javascript 
            document.getElementById("ken").style.backgroundImage = "url(assets/images/ken.jpg)";
            document.getElementById("ryu").style.backgroundImage = "url(assets/images/ryu.jpg)";
            document.getElementById("chunLi").style.backgroundImage = "url(assets/images/chunLi.jpg)";
            document.getElementById("mBison").style.backgroundImage = "url(assets/images/mBison.jpg)";

            $(".container").fadeOut();
            $(".endScreen").fadeOut();
            $(".fightScreen").fadeOut();
            game.updatePageStats();
            $(".startScreen").fadeIn();
            
        },

    };

    // click events

    $(".startArea").on("click", ".start", game.pickPlayer);

    $(".playerPick").on("click", ".bad", game.pickFighter);

    $("#attackArea").on("click", ".active", game.round);

    $("#runArea").on("click", ".active", game.runAway);

    $(".startScreen").on("click", ".active", game.loadScreen);

    $(".wrapper").on("click", ".active", game.restart);

});