///EVENT LISTENERS
$(".bottom-box").on('click', deleteAndChangeQuality);
$('.save-btn').on('click', clickSave);

//////CREATE NEW CARD IN HTML

function newCard(card) {
    return '<div id="' + card.id + '"class="card-container"><h2 class="title-of-card">'  
            + card.title +  '</h2>'
            + '<button class="delete-button"></button>'
            +'<p class="body-of-card">'
            + card.body + '</p>'
            + '<button class="upvote"></button>' 
            + '<button class="downvote"></button>' 
            + '<p class="quality">' + 'quality:' + '<span class="qualityVariable">' + card.quality + '</span>' + '</p>'
            + '<hr>' 
            + '</div>';
};

//////SAVE FUNCTION

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

///////STORE CARD FUNCTION

function localStoreCard(card) {
  var cardString = JSON.stringify(card);
  localStorage.setItem(card.id, cardString);
}

//////CREATE THE CARD OBJECT FUNCTION

function CreateCard(title, body) {
  this.numCards = $('.card-container').length;
  this.id = 'card' + this.numCards;
  this.title = title;
  this.body = body;
  this.quality = "swill";
}

/////LOAD STUFF ON PAGE LOAD

window.onload = function() {
  for(i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var cardData = JSON.parse(localStorage.getItem(key));
    $( ".bottom-box" ).prepend(newCard(cardData));
  }
}

///DELETE AND CHANGE QUALITY FUNCTION

function deleteAndChangeQuality(event) {
    var currentQuality = $($(event.target).siblings('p.quality').children()[0]).text().trim();
    var qualityVariable;

    if (event.target.className === "upvote" || event.target.className === "downvote"){

        if (event.target.className === "upvote" && currentQuality === "plausible"){
            qualityVariable = "genius";
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);
               
        } else if (event.target.className === "upvote" && currentQuality === "swill") {
            qualityVariable = "plausible";
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);
               
        } else if (event.target.className === "downvote" && currentQuality === "plausible") {
            qualityVariable = "swill"
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (event.target.className === "downvote" && currentQuality === "genius") {
            qualityVariable = "plausible"
            $($(event.target).siblings('p.quality').children()[0]).text(qualityVariable);

        } else if (event.target.className === "downvote" && currentQuality === "swill") {
            qualityVariable = "swill";
        
        } else if (event.target.className === "upvote" && currentQuality === "genius") {
            qualityVariable = "genius";
        }

    var cardHTML = $(event.target).closest('.card-container');
    var cardHTMLId = cardHTML[0].id;
    var cardObjectInJSON = localStorage.getItem(cardHTMLId);
    var cardObjectInJS = JSON.parse(cardObjectInJSON);

    cardObjectInJS.quality = qualityVariable;

    var newCardJSON = JSON.stringify(cardObjectInJS);
    localStorage.setItem(cardHTMLId, newCardJSON);
    }
   
    else if (event.target.className === "delete-button") {
        var cardHTML = $(event.target).closest('.card-container').remove();
        var cardHTMLId = cardHTML[0].id;
        localStorage.removeItem(cardHTMLId);
    }
};
      










