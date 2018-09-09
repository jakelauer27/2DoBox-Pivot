///EVENT LISTENERS

$('#title-input').on('keyup', countTitle);
$('#task-input').on('keyup', countBody);
$('.save-btn').on('click', clickSave);
$('#search-input').on('keyup', search);
$('.show-completed-button').on('click', showAllCompleted);
$('.filter-div').on('click', filterByImportance);
$('.show-all-btn').on('click', showAllCards);
$('.bottom-box').on('focusout', updateCardText);
$('.bottom-box').on('click', articleButtonDelegator);
$(document).on('keypress', updateCardTextOnEnter);
$('.show-more-todos-button').on('click', showMoreTodos);

//////SAVING -> ADDING HTML CAR -> SAVING TO LOCAL STORAGE

function clickSave(event) {
    event.preventDefault();
    if ($('#title-input').val() === "" || $('#task-input').val() === "") return false;
    var card = new CreateCard($('#title-input').val(), $('#task-input').val())
    $( ".bottom-box" ).prepend(makeCardHTML(card)); 
    localStoreCard(card);
    $('form')[0].reset();
};

function CreateCard(title, task) {
  this.id = Date.now();
  this.title = title;
  this.task = task;
  this.importanceArray = ['none', 'low', 'normal', 'high', 'critical']
  this.importanceIndex = 2;
  this.completed = "";
}

function makeCardHTML(card) {
  return `<div id="${card.id}" class="card-container ${card.completed}"><h2 class="title-of-card" contenteditable>${card.title}</h2>
          <button class="card-btn delete-button"></button>
          <p class="body-of-card" contenteditable>${card.task}</p>
          <button class="card-btn upvote"></button> 
          <button class="card-btn downvote"></button> 
          <p class="importance">importance: <span class="importance-variable">${card.importanceArray[card.importanceIndex]}</span></p>
          <button class="completed-button" aria-label="completed button">Completed</button>
          <hr>
          </div>`;
};

function localStoreCard(card) {
  var cardString = JSON.stringify(card);
  localStorage.setItem(card.id, cardString);
}

//////CARD BUTTON FUNCTIONS

function articleButtonDelegator(e) {
  if ($(e.target).hasClass('delete-button')) deleteCard(e);
  if ($(e.target).hasClass('upvote')) changeImportance(e, 1);
  if ($(e.target).hasClass('downvote')) changeImportance(e, -1);
  if ($(e.target).hasClass('completed-button')) completeTask(e);
}

function deleteCard(e) {
  var cardHTML = $(e.target).closest('.card-container').remove();
  var cardHTMLId = cardHTML[0].id;
  localStorage.removeItem(cardHTMLId);
}

function changeImportance(e, num) {
  var card = JSON.parse(localStorage.getItem($(e.target).parent().attr("id")));
  card.importanceIndex += num;
  if (card.importanceIndex > 4) card.importanceIndex = 4;
  if (card.importanceIndex < 0) card.importanceIndex = 0;
  ($(e.target).siblings('.importance').children().text(card.importanceArray[card.importanceIndex]));
  localStoreCard(card);
}

function completeTask(e) {
  var card = JSON.parse(localStorage.getItem($(e.target).parent().attr("id")));
  if(card.completed) {
    card.completed = "";
  } else {
    card.completed = "completed";
  };
  localStoreCard(card)
  $(e.target).parent().toggleClass('completed')
}

//CHANGE IDEA TEXT FUNCTIONS 

function updateCardTextOnEnter(e) {
  if(e.which == 13) {
    $('p, h2').blur();
		updateCardText(e);
  }
}

function updateCardText(e) {
  var card = JSON.parse(localStorage.getItem(e.target.parentNode.id));
  if ($(e.target).hasClass('title-of-card')) {
    card.title = ($(e.target).closest('.title-of-card').text());
  } else if ($(e.target).hasClass('body-of-card')) {
    card.task = ($(e.target).closest('.body-of-card').text());
  }
  localStoreCard(card);
};

////////SEARCH AND SORT FUNCTIONS

function search(e) {
  var value = $(e.target).val().toLowerCase();
  var cards = $('.card-container');
  cards.each(function(i, card){
    $(card).toggle($(card).find('.title-of-card').text().toLowerCase().indexOf(value) !== -1 
    || $(card).find('.body-of-card').text().toLowerCase().indexOf(value) !== -1
    )
  })
}

function showAllCompleted() {
  for(i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var cardData = JSON.parse(localStorage.getItem(key));
    if (cardData.completed) {
      $( ".bottom-box" ).prepend(makeCardHTML(cardData));
      }
    }
  $('.show-completed-button').attr("disabled", "disabled");
}

function showMoreTodos() {
  for(i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var cardData = JSON.parse(localStorage.getItem(key));
    if (!cardData.completed) $( ".bottom-box" ).prepend(makeCardHTML(cardData));
  }
}

function filterByImportance(e) {
  if ($(e.target).hasClass("show-all-btn")) return;
  var value = $(e.target).text().toLowerCase();
  var cards = $('.card-container');
  cards.each(function(i, card){
    $(card).toggle($(card).find('.importance-variable').text().toLowerCase().indexOf(value) !== -1 )
  })
}

function showAllCards() {
  var cards = $('.card-container');
  cards.each(function(i, card){
    $(card).toggle(true)
  })
}

/////COUNTER FUNCTIONS

function countTitle() {
  var count = $('#title-input').val().length;
  $('.character-count-title').text(count);
  if (count > 60) {
    $('.character-count-title').addClass("red");
    $('.save-btn').attr("disabled", "disabled");
  } else if (count < 60 && $('.character-count-title').hasClass('red')) {
    $('.character-count-title').removeClass("red");
    $('.save-btn').removeAttr("disabled");
  }
}

function countBody() {
  var count = $('#task-input').val().length;
  $('.character-count-task').text(count);
  if (count > 120) {
    $('.character-count-task').addClass("red");
    $('.save-btn').attr("disabled", "disabled");
  } else if (count < 120 &&  $('.character-count-task').hasClass('red')) {
    $('.character-count-task').removeClass("red");
    $('.save-btn').removeAttr("disabled");
  }
}

/////LOAD STUFF ON PAGE LOAD

window.onload = function() {
  var num = 0;
  if(localStorage.length > 9) {
    num = localStorage.length - 10;
  }
  for(i = num; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    var cardData = JSON.parse(localStorage.getItem(key));
    if (!cardData.completed) $( ".bottom-box" ).prepend(makeCardHTML(cardData));
  }
}




