var goodHP = 200;
var goodStr;
var goodGr;
var badFightHP;
var badFightStr;

var badArray = [];
var whichBad;



var statBad = {
    bad0HP: 150,
    bad0Str: 8,
    bad1HP: 175,
    bad1Str: 15,
    bad2HP: 130,
    bad2Str: 50,
};

var goodStrSet = {
    kenSt: 6,
    kenGr: 6,
    ryuSt: 22,
    ryuGr: 3,
    chunLiSt: 8,
    chunLiGr: 4,
    mBisonSt: 9,
    mBisonGr: 5,
};


// Functions

    // Post Good Stats to page
function postGood(){
    $(".goodHP-place").text(goodHP);
    $(".goodStr-place").text(goodStr);
    console.log("posting good stats")
};
    // Post Bad Fight Stats to page
function postBad(){
    $(".badHP-place").text(badFightHP);
    $(".badStr-place").text(badFightStr);
};

function postBoth(){
    postGood();
    postBad();
};

function setGoodStr(){
    console.log($(".good").attr("id") + " good id");
    var goodID = $(".good").attr("id");
    switch (goodID) {
        case "ken":
            console.log("right type");
            goodStr = goodStrSet.kenSt;
            goodGr = goodStrSet.kenGr;
            break;
        case "ryu":
            goodStr = goodStrSet.ryuSt;
            goodGr = goodStrSet.ryuGr;
            break;
        case "chunLi":
            goodStr = goodStrSet.chunLiSt;
            goodGr = goodStrSet.chunLiGr;
            break;
        case "mBison":
            goodStr = goodStrSet.mBisonSt;
            goodGr = goodStrSet.mBisonGr;
            console.log(goodStrSet.mBisonSt)
            console.log(goodStr)
            break;
        default:
            console.log("wrong type");
    }
}
 

    // place the values from fight back into statbad object
    // used for running away and not losing stats
    // may need to thing about not updating so they can "heal" as penalty
function statBadUpdate(){
    switch (whichBad) {
        case 0:
            statBad.bad0HP = badFightHP;
            break;
        case 1:
            statBad.bad1HP = badFightHP;
            break;
        case 2:
            statBad.bad2HP = badFightHP;
            break;
        default:
            console.log(" switch statBad update not working as expected")
    }
};

function changeBackground(){
    switch ($(".fighter").attr("id")){
        case "ken":
            $(".fighter").css("background-image", "url(assets/images/kenBeat.jpg)");
            break;
        case "ryu":
            $(".fighter").css("background-image", "url(assets/images/ryuBeat.jpg)");
            break;
        case "chunLi":
            $(".fighter").css("background-image", "url(assets/images/chunLiBeat.jpg)");
            break;
        case "mBison":
            $(".fighter").css("background-image", "url(assets/images/mBisonBeat.jpg)");
            break;
        default:
            console.log("background switch not working");
    }
};

// each round will fun through once and see if there is a winner and what to do if there is
// if both make it through nothing happens
function round() {
    badFightHP = badFightHP - goodStr;
    goodStr = goodStr + goodGr;
    postBoth();
    statBadUpdate();
    if (badFightHP > 0) {
        goodHP = goodHP - badFightStr;
        postBoth();
        if (goodHP > 0){
            // round over both alive
            

        } else {
            // round over bad win
            // set good class to loser and populate in grave
            $(".good").attr("class", "box loser");
            console.log("you lost");
            // turn off buttons
            $(".active").attr("class", "btn disabled");
            $(".fighter").attr("class", "box good");
            $(".winner").text("You lost to: ")
            $(".fightScreen").fadeOut();


        };
    } else {
        // round over good win
        // set fighter class to loser class and populate the html in grave
        changeBackground();
        $(".fighter").attr("class", "box bad loser");
        // set remaing bad back to class bad
        $(".outFight").attr("class", "box bad alive");
        // turn off buttons
        $(".active").attr("class", "btn disabled");
        $(".fightScreen").fadeOut();
        $(".goodArea").html($(".good"));
        $(".playerPick").html($(".bad"));
    }
};
// can call this between rounds if fighter is selected
// should only be active then anyway
function runAway() {
    // replace fighter class with bad
    $(".fighter").attr("class", "box bad alive");
    // replace outfight with bad class and place in badArea
    $(".outFight").attr("class", "box bad alive");
    $(".playerPick").html($(".bad"));
    // clear stats on page for bad
    $(".badHP-place").text("0");
    $(".badStr-place").text("0");
    $(".goodArea").html($(".good"));
    $(".fightScreen").fadeOut();
}



// On click events
    // Pick your good character
$(".playerPick").on("click", ".start", function(){
    console.log($(this));
    // Changing from start class to good/bad and assigning to those areas
    $(this).addClass("good").removeClass("start");
    $(".start").removeClass("start").addClass("bad alive");
    $(".goodArea").html($(".good"));
    setGoodStr();
    // hiding startArea

    // posting good stats to page
    postGood();
    // pushing into badArray
    $(".bad").each(function(){
        badArray.push($(this).attr("id"));
    });
    console.log(badArray);
    
});
    //Pick your fight
$(".startArea").on("click", ".alive", function(){
    console.log($(this));
    // Adding class of fight to bad picked, adding outFight to rest
    // removing class bad from each
    $(this).removeClass("bad").addClass("fighter");
    $(".alive").removeClass("bad").addClass("outFight");
    // sending fighters to fightArea
    $(".badFighter").html($(".fighter"));
    $(".goodFighter").html($(".good"));
    // setting whichbad----------------------------------------------------only place where is set
    whichBad = badArray.indexOf($(".fighter").attr("id"));
    console.log(whichBad);
    // use whichBad in switch
    switch (whichBad) {
        case 0:
            badFightHP = statBad.bad0HP;
            badFightStr = statBad.bad0Str;
            break;
        case 1:
            badFightHP = statBad.bad1HP;
            badFightStr = statBad.bad1Str;
            break;
        case 2:
            badFightHP = statBad.bad2HP;
            badFightStr = statBad.bad2Str;
            break;
        default:
            console.log("switch in .badArea click event not working as expected");
    };
    postBad();
    // setting buttons to active;
    $(".disabled").attr("class", "btn active");
    $(".fightScreen").fadeIn();
});

$("#attackArea").on("click", ".active", round);
$("#runArea").on("click", ".active", runAway);
