$( document ).ready(function() {
    var frame1 = $('#sense-strand').text();
    var a = frame1.substring(0,1);
    var b = frame1.substring(1,2);
    var c = frame1.substring(2,3);
    var x = frame1.substring(3,frame1.length);
    $('#sense-strand').html('<p><div style="background-color:lightblue;display:inline;">'+ a +'</div>' + '<div style="background-color:lightgreen;display:inline;">'+ b +'</div>' + '<div style="background-color:lightpink;display:inline;">'+ c +'</div>' + x + '</p>');
    console.log( "ready!" );
});