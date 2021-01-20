// Smooth page scroll to element
$('a[href^="#"]').on('click', function(event) {

    var target = $(this.getAttribute('href'));

    if( target.length ) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }

});
// Search bar
function myFunction(){
    let value = document.getElementById("searchid").value
    // console.log("mmmmmm",value)
    window.open(`https://explorer.arisen.network/account/${value}`)
}
// donate page close model
function closemodl(){
    modal.style.display = "none";
}