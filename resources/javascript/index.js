// Status
var isLoading;
var isAnimating;

var allPages;
var allElements;

function showTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  text = (hours >= 12) ? "PM " : "AM ";
  text += ((hours > 12) ? hours - 12 : hours) + ":";
  text += ((minutes < 10) ? "0" : "") + minutes + ":";
  text += ((seconds < 10) ? "0" : "") + seconds;
  if (hours >= 22 || hours < 6) text += " Time to sleep!";
  else if (hours >= 6 && hours < 12) text += " Good morning!";
  else if (hours >= 12 && hours < 17) text += " Good afternoon!";
  else text += " What a beautiful day!";
  // clock.innerHTML = text;
  // window.setTimeout(function() {showTime();}, 1000);
}

function hideAllImages() {
  var imgs = window.document.getElementsByTagName("img");
  for (i = 0; i < imgs.length; i++) {
    imgs[i].style.display = "none";
  }
}

function imageEventsHandler() {
  $("img").click(function() {
    var imgSrc = $(this).attr("src");

    $("#gallery").css("background", "rgba(0, 0, 0, 0.9) url(" + imgSrc + ") no-repeat center center");
    $("#gallery").css("position", "fixed");
    $("#gallery").css("top", "0%");
    $("#gallery").css("left", "0%");
    $("#gallery").css("width", "100%");
    $("#gallery").css("height", "100%");
    $("#gallery").css("z-index", "100");
    $("#gallery").fadeIn(100);

    $("body").css("overflow", "hidden");
  });

  $("#gallery").click(function() {
    $("#gallery").fadeOut(100);
    $("#gallery").css("z-index", "-1");
    $("#gallery").css("background", "");

    $("body").css("overflow", "");
  });

  $(window).keydown(function() {
    $("#gallery").click();
  });
}

function topLinkHandler() {
  $(window).scroll(function () { 
    var scrollPosition = $(window).scrollTop();
    if (scrollPosition == 0) {
      //window.document.getElementById("topLink").style.display = "none";
      $("#topLink").fadeOut(300);
    } else {
      //window.document.getElementById("topLink").style.display = "";
      $("#topLink").fadeIn(300);
    }
  });

  $("#topLink").click(function() {
    $(window).scrollTop(0);
  });
}

function straightAllFrame() {
  for (var i = 0; i < allPages.length; i++) {
    allPages[i].style.webkitTransform = "";
    allPages[i].style.mozTransform = "";
    allPages[i].style.msTransform = "";
    allPages[i].style.otransform = "";
    allPages[i].style.transform = "";
  }
  isAnimating = false;
  $(".menuFrame").fadeIn(500);
  var frameId = window.location.hash.substr(1) + "Frame";
  $("#" + frameId).css("overflow", "visible");
  $("#" + frameId).css("position", "absolute");
  var optionId = window.location.hash.substr(1) + "Option";
  //$("#" + optionId).css("font-size", "2em");
  $("#" + optionId).css("background", "rgba(0, 255, 0, 0.3)");
}

function menuEffectStart() {
  if (isLoading || isAnimating) {
    return ;
  }
  isAnimating = true;
  $(".menuFrame").fadeOut(250);
  var frameName = window.location.hash.substr(1) + "Frame", first = 0;
  for (var i = 0; i < allPages.length; i++) {
    if (allPages[i].style.display == "") first = i;
    var pageId = allPages[i].id;
    var optionId = pageId.substr(0, pageId.search("Frame")) + "Option";
    //$("#" + optionId).css("font-size", "1em");
    $("#" + optionId).css("background", "");
  }
  menuEventsEffect1(frameName, first, first);
}

function menuEventsEffect1(frameName, first, now) {
  var degree = 2;
  var skewString = "skew(" + 0 + "deg, " + degree + "deg)";
  for (var i = 0; i < allPages.length; i++) {
    var index = (i + now) % allPages.length;
    if (i != 0) {
      allPages[index].style.background = "rgba(0, 0, 0, 0.3)";
    } else {
      allPages[index].style.background = "rgba(255, 255, 255, 1)";
    }
    allPages[index].style.display = "";
    allPages[index].style.position = "absolute";
    allPages[index].style.overflow = "hidden";
    allPages[index].style.height = "40%";
    allPages[index].style.zIndex = (allPages.length - i).toString();
    allPages[index].style.top = (25 - i * 3).toString() + "%";
    allPages[index].style.left = (25 - i * 3).toString() + "%";
    /* allPages[index].style.webkitTransform = skewString;
    allPages[index].style.mozTransform = skewString;
    allPages[index].style.msTransform = skewString;
    allPages[index].style.oTransform = skewString;
    allPages[index].style.transform = skewString; */
  }
  if (allPages[now].id != frameName && ((now + 1) % allPages.length) != first) {
    window.setTimeout(function() {menuEventsEffect1(frameName, first, (now + 1) % allPages.length);}, 100);
  } else {
    window.setTimeout(function() {menuEventsEffect2(frameName);}, 250);
  }
}

function menuEventsEffect2(frameName) {
  for (var i = 0; i < allPages.length; i++) {
    allPages[i].style.background = "";
    if (allPages[i].id == frameName) {
      allPages[i].style.height = "";
      $("#" + frameName).animate({top : "0%", left : "15%"}, 250);
    } else {
      $("#" + allPages[i].id).fadeOut(50);
    }
  }
  window.setTimeout(function() {straightAllFrame();}, 250);
}

function menuOptionHoverEventsHandler() {
  $(".menuOption").hover(function() {
    if (isAnimating) {
      return ;
    }
    window.location.href = $(this).attr("href");
  }, function() {
    // do nothing when hover out
  });
}

function hashHandler() {
  $(window).load(function() {
    allPages = window.document.getElementsByClassName("mainFrame");
    allElements = window.document.getElementsByClassName("*");
    isLoading = false;
    $(".topFrame").fadeIn(500);
    $(".menuFrame").fadeIn(500);
    $(".bottomFrame").fadeIn(500);
    if (window.location.hash != "") {
      menuEffectStart();
    }
  });
  $(window).on("hashchange", function() {
    menuEffectStart();
  });
}

$(function main() {
  isLoading = true;
  isAnimating = false;
  hashHandler();
  menuOptionHoverEventsHandler();
  showTime();
  topLinkHandler();
  //hideAllImages();
  imageEventsHandler();
});
