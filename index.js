///EVENT LISTENERS

$(".bottom-box").on('click', articleButtonDelegator);
$('.save-btn').on('click', clickSave);
$('#search-input').on('keyup', search);
$(document).on("keypress", updateCardTextOnEnter);
$('bottom-section').on("focusout", updateCardText);

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
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.qualitiesArray = ['swill', 'plausible', 'genius']
  this.qualityIndex = 0;
}

function newCard(card) {
  return '<div id="' + card.id + '"class="card-container"><h2 class="title-of-card">'  
          + card.title +  '</h2>'
          + '<button class="card-btn delete-button"></button>'
          +'<p class="body-of-card">'
          + card.body + '</p>'
          + '<button class="card-btn upvote"></button>' 
          + '<button class="card-btn downvote"></button>' 
          + '<p class="quality">' + 'quality: ' + '<span class="qualityVariable">' + card.qualitiesArray[card.qualityIndex] + '</span>' + '</p>'
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

function articleButtonDelegator(e) {
  if ($(e.target).hasClass('delete-button')) deleteCard(e);
  if ($(e.target).hasClass('upvote')) changeQuality(e, 1);
  if ($(e.target).hasClass('downvote')) changeQuality(e, -1);
}

function deleteCard(e) {
  var cardHTML = $(e.target).closest('.card-container').remove();
  var cardHTMLId = cardHTML[0].id;
  localStorage.removeItem(cardHTMLId);
}

function changeQuality(e, num) {
  var card = JSON.parse(localStorage.getItem(e.target.parentNode.id));
  card.qualityIndex += num;
  if (card.qualityIndex > 2) {
    card.qualityIndex = 2;
  } else if (card.qualityIndex < 0) {
    card.qualityIndex = 0;
  }
  ($(e.target).siblings('.quality').children().text(card.qualitiesArray[card.qualityIndex]));;
  localStoreCard(card);
}

//CHANGE IDEA TEXT FUNCTIONS 

function updateCardTextOnEnter(e) {
  if(e.which == 13) {
    $('p, h2').blur();
		updateCardText(e);
  }
}

function updateCardText(e) {

}

///////////SEARCH FUNCTION

function search(e) {
  var value = $(e.target).val().toLowerCase();
  var cards = $('.card-container');
  cards.each(function(i, card){
    $(card).toggle($(card).text().toLowerCase().indexOf(value) !== -1)
  })
}






