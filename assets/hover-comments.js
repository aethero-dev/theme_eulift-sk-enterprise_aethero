//var zeman_comment = "<button id='phone-comment' class='btn btn--primary'style='position:fixed; color: black; background: #fff; right: 200px; border: 1px solid black; z-index: 2147483645;'>{{ 'general.custom-comments.zeman_comment' | t }}</button>"


$(document).on('mouseenter','#phone-zeman', function (event) {
      $('#phone-comment').css('visibility','visible');
}).on('mouseleave','#phone-zeman',  function(){
   $('#phone-comment').css('visibility', 'hidden');
});


