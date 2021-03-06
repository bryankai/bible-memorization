(function() {
  'use strict';
  let id
  // authe gate
  request('/auth/token')
    .then(response => {
      // user is logged in
      id = response.data.id
    })
    .catch(error => {
      // user is not logged in
      window.location = '/index.html'
    })
    // load user name
    .then(function() {
      return request(`/users/${id}`, 'get')
    })
    .then(response => {
      name = response.data.data.name
      document.getElementById('userName').innerHTML = name
    })
    // load deck information
    .then(response => {
      return request(`/users/${id}/decks`, 'get')
    })
    .then(response => {
      const {data} = response.data
      data.forEach(dbDeck => {
        const deckGrid = document.querySelector('.decks-grid')
        const deck = document.createElement('div')
        deck.classList.add('flip-container','card', 'border-light', 'mb-3')
        deck.addEventListener('mouseenter', event => {
          event.target.classList.toggle('flip')
        })
        deck.addEventListener('mouseleave', event => {
          event.target.classList.toggle('flip')
        })
        deck.addEventListener('click', event => {
          window.location = `/deck.html?deckId=${dbDeck.id}`
        })
        deckGrid.appendChild(deck)

        const flipper = document.createElement('div')
        flipper.classList.add('flipper')
        deck.appendChild(flipper)

        const front = document.createElement('div')
        front.classList.add('front')
        // const frontLink = document.createElement('a')
        // frontLink.href = `deck.html?deckId=${dbDeck.id}`
        const frontText = document.createElement('div')
        frontText.classList.add('frontText')
        frontText.innerHTML = dbDeck.deckName
        flipper.appendChild(front)
        // front.appendChild(frontLink)
        front.appendChild(frontText)

        const back = document.createElement('div')
        back.classList.add('back')
        const backText = document.createElement('div')
        backText.classList.add('backText')
        backText.innerHTML = dbDeck.description
        flipper.appendChild(back)
        back.appendChild(backText)
      })
      // get user score
      return getUserScore(id)
    })
    .then(userScore => {
      document.getElementById('userScore').innerHTML=userScore
    });

  // Create New Deck Event Listener
  document.querySelector('.form-create-deck').addEventListener('submit', function(event){
    event.preventDefault()
    const deckName = event.target.name.value
    const description = event.target.description.value
    const users_id = id
    request(`/users/${id}/decks`, 'post', { deckName , description, users_id })
    window.location = '/dashboard.html'
  })
})();
