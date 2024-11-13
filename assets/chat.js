var zeman = "<div id='zeman'><img src='https://cdn.shopify.com/s/files/1/0755/1526/5333/files/chat3.svg?v=1685966497' style='position: fixed; align: right; bottom: 80px; right: 20px; z-index: 39; height: 100px;' /></div>";
var button = "<button id='zeman-button' class='btn btn--primary'style='position: fixed; align: right; background: #333a40; bottom: 10px; right: 25px; z-index: 39;'><a href='tel:00421949558495' style='color:white;'>Zavolajte mi<br>+421 949 558 495</a></button>"

var button_close = "<button id='zeman-button-close' class='btn btn--primary'style='position:fixed; align:right; background: #333a40; bottom: 20px; right:25px; z-index: 39;'><a href='tel:00421949558495' style='color:white;'>Teraz nie som na drôte.<br> Prezvoňte ma, zavolám vám späť.<br>+421 949 558 495</a></button>"



function insertImage() {
  $(".shopify-section-group-footer-group").after(zeman);
  $("#shopify-section-sections--23772361261435__footer").after(button);
  $("#shopify-section-sections--23772361261435__footer").after(button_close);
}

function openingHours(){
  var openHours = [{
      openHour: -1,
      openMinute: -1,
      closeHour: -1,
      closeMinute: -1,
  },
  {
    openHour: 8,
      openMinute: 00,
      closeHour: 17,
      closeMinute: 00,
  },
  {
    openHour: 8,
    openMinute: 00,
    closeHour: 17,
    closeMinute: 00,
  },
  {
    openHour: 8,
    openMinute: 00,
    closeHour: 17,
    closeMinute: 00,
  },
  {
    openHour: 8,
    openMinute: 00,
    closeHour: 17,
    closeMinute: 00,
  },
  {
    openHour: 8,
    openMinute: 00,
    closeHour: 17,
    closeMinute: 00,
  },
  {
    openHour: -1,
    openMinute: -1,
    closeHour: -1,
    closeMinute: -1,
  }];

  var d = new Date($.now());
  var dayOfWeek = d.getDay();
  var hour = d.getHours();
  var mins = d.getMinutes();
  var todayHours = openHours[dayOfWeek];
  var open = true;

  //console.log(hour);
  //console.log(todayHours.closeHour);

  if (hour >= todayHours.openHour && hour <= todayHours.closeHour) {
     if ((hour == todayHours.openHour && mins < todayHours.openMinute) || (hour == todayHours.closeHour && mins > todayHours.closeMinute)) {
    open = false;
  } else {
    open = true;
  }
  } else {
  open = false;
  }

  //console.log(open);

  if (open) {
    $("#zeman-button").css('visibility','visible');
    $("#zeman-button-close").css('visibility','hidden');
  } else {
    $("#zeman-button").css('visibility','hidden');
    $("#zeman-button-close").css('visibility','visible');
  }
}


function showPhone(){
  $("#zeman").on( "click", function() {
  $("#zeman").animate({left: '250px'});
  });
}

jQuery(document).ready(function(){
   
  var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        insertImage();
        openingHours();
        showPhone();
     
    }    
}, 1000);
});


