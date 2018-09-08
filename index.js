///EVENT LISTENERS

$(".bottom-box").on('click', articleButtonDelegator);
$('.save-btn').on('click', clickSave);
$('#search-input').on('keyup', search);

//////SAVING -> ADDING HTML CAR -> SAVING TO LOCAL STORAGE

function clickSave(event) {
    event.preventDefault();
    if ($('#title-input').val() === "" || $('#body-input').val() === "") {
       return false;
    };  
    var card = new CreateCard($('#title-input').val(), $('#body-input').val())
    $( ".bottom-box" ).prepend(newCard(card)); 
    localStoreCard(card);
    $('form')[0].reset();
};

function CreateCard(title, body) {
  this.numCards = $('.card-container').length;
  this.id = 'card' + this.numCards;
  this.title = title;
  this.body = body;
  this.quality = "swill";
}

function newCard(card) {
  return '<div id="' + card.id + '"class="card-container"><h2 class="title-of-card">'  
          + card.title +  '</h2>'
          + '<button class="card-btn delete-button"></button>'
          +'<p class="body-of-card">'
          + card.body + '</p>'
          + '<button class="card-btn upvote"></button>' 
          + '<button class="card-btn downvote"></button>' 
          + '<p class="quality">' + 'quality: ' + '<span class="qualityVariable">' + card.quality + '</span>' + '</p>'
          + '<hr>' 
          + '</div>';
};

function localStoreCard(card) {
  var cardString = JSON.stringify(card);
  localStorage.setItem(card.id, cardString);
}

/////LOAD STUFF ON PAGE LOAD

window.onload = function() {
  for(i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var cardData = JSON.parse(localStorage.getItem(key));
    $( ".bottom-box" ).prepend(newCard(cardData));
  }
}

///DELETE AND CHANGE QUALITY FUNCTIONS

function articleButtonDelegator(e){
  if ($(e.target).hasClass('delete-button')) deleteCard(e);
  if ($(e.target).hasClass('upvote')) changeQuality(e);
  if ($(e.target).hasClass('downvote')) changeQuality(e);
}

function deleteCard(e) {
  var cardHTML = $(e.target).closest('.card-container').remove();
  var cardHTMLId = cardHTML[0].id;
  localStorage.removeItem(cardHTMLId);
}

function changeQuality(e) {
    var currentQuality = $($(e.target).siblings('p.quality').children()[0]).text().trim();
    var qualityVariable;

    if (e.target.className === "upvote" || e.target.className === "downvote"){

        if (e.target.className === "upvote" && currentQuality === "plausible"){
            qualityVariable = "genius";
            $($(e.target).siblings('p.quality').children()[0]).text(qualityVariable);
               
        } else if (e.target.className === "upvote" && currentQuality === "swill") {
            qualityVariable = "plausible";
            $($(e.target).siblings('p.quality').children()[0]).text(qualityVariable);
               
        } else if (e.target.className === "downvote" && currentQuality === "plausible") {
            qualityVariable = "swill"
            $($(e.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (e.target.className === "downvote" && currentQuality === "genius") {
            qualityVariable = "plausible"
            $($(e.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (e.target.className === "downvote" && currentQuality === "swill") {
            qualityVariable = "swill";
        
        } else if (e.target.className === "upvote" && currentQuality === "genius") {
            qualityVariable = "genius";
        }

    var cardHTML = $(e.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].id;
    var cardObjectInJSON = localStorage.getItem(cardHTMLId);
    var cardObjectInJS = JSON.parse(cardObjectInJSON);

    cardObjectInJS.quality = qualityVariable;

    var newCardJSON = JSON.stringify(cardObjectInJS);
    localStorage.setItem(cardHTMLId, newCardJSON);
    }
};

/*SEARCH FUNCTION*/

function search(e) {
  var value = $(e.target).val().toLowerCase();
  var cards = $('.card-container');
  cards.each(function(i, card){
    $(card).toggle($(card).text().toLowerCase().indexOf(value) !== -1)
  })
}






