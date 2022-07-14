(function (){
    'use strict';

    // Array cartas do baralho
    let allCards = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13",
                    "e01","e02","e03","e04","e05","e06","e07","e08","e09","e10","e11","e12","e13",
                    "c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13",
                    "o01","o02","o03","o04","o05","o06","o07","o08","o09","o10","o11","o12","o13"]
    const totalcards = (allCards.length);
    let totalUsedCards = 0;
    let removedCard = "";
    let id = null;
    let playerTurn = true;

    // dealer vars
    let dealerTotalCards = 0;
    const dealerCards = [];
    let dealerCardPosX = 0;
    let dealerCardPosY = 0;
    const dealerPack = $('#dealerpack');
    let dealerScore = 0;

    // Player vars
    const playerPack = $('#playerpack');
    const pl1Cards = [];
    let pl1TotalCards = 0;
    let pl1CardPosX = 0;
    let pl1CardPosY = 0;
    let pl1Score = 0;

    // Cards vars
    const cardsPack = $('#playcardsboard');
    let CardsPosX = 0;
    let CardsPosY = 0;

    shuffleCards();
    
    $('#start').on('click', function (event) {
        event.preventDefault();
        $('section p').remove();
        dealerPack.css( "display", "block" );
        playerPack.css( "display", "block" );
        $('#dealerscore').css( "display", "block" );
        $('#score1').css( "display", "block" );
        $('#control').css( "display", "block" );
        $('h2').html("Boa sorte !");
        getBoardsPositions();
        setTimeout( dealerCardMoveFunc, 0);
        setTimeout( dealerCardMoveFunc, 600);
        setTimeout( PlayerCardMoveFunc, 1200);
        setTimeout( PlayerCardMoveFunc, 1800);
    });

    $('#continue').on('click', function (event) {
        event.preventDefault();
        setTimeout( PlayerCardMoveFunc, 0);
        setTimeout( calcScore, 600);
    });

    $('#pass').on('click', function (event) {
        event.preventDefault();
        playerTurn = false;
        $('#control').css( "display", "none");
        
        if (!checkWinningCondition()) {
            let id1 = null;
            let id2 = null;
            id1 = setTimeout( dealerCardMoveFunc, 0);
            id2 = setTimeout( calcScore, 600);
        }

        // add cards to dealer till end game
        let cicle = setInterval( () => {
            if (!checkWinningCondition()) {
                let id1 = null;
                let id2 = null;
                id1 = setTimeout( dealerCardMoveFunc, 0);
                id2 = setTimeout( calcScore, 600);
            } else {
                clearInterval(cicle);
            }
        }, 1200);
    });

    // Function shuffle cards
    function shuffleCards () {
        let tempArr = [];
        for ( let i = 0; i < totalcards - 1; i++ ) {
            // The following line removes one random element from temparr 
            // and pushes it onto tempArr 
            tempArr.push(allCards.splice(Math.floor(Math.random()*allCards.length),1)[0]);
        }
        // Push the remaining item onto tempArr 
        tempArr.push(allCards[0]); 
        allCards=tempArr;
    };

    // Function get Cards positions
    function getBoardsPositions() {
        pl1CardPosX = playerPack.offset().left;
        pl1CardPosY = playerPack.offset().top;
        dealerCardPosX = dealerPack.offset().left;
        dealerCardPosY = dealerPack.offset().top;
        CardsPosX = cardsPack.offset().left;
        CardsPosY = cardsPack.offset().top + 7;
        console.log(`Dealer posX: ${dealerCardPosX} Dealer posY: ${dealerCardPosY}`);
        console.log(`Cards posX: ${CardsPosX} Cards posY: ${CardsPosY}`);
        console.log(`Player posX: ${pl1CardPosX} Player posY: ${pl1CardPosY}`);
    };

    // Function shuffle cards
    function shuffleCards () {
        let tempArr = [];
        for ( let i = 0; i < totalcards - 1; i++ ) {
            // The following line removes one random element from arr 
            // and pushes it onto tempArr 
            tempArr.push(allCards.splice(Math.floor(Math.random()*allCards.length),1)[0]);
        }
        // Push the remaining item onto tempArr 
        tempArr.push(allCards[0]); 
        allCards=tempArr;
    };
    

    // Callback functions to call cardMove()
    function dealerCardMoveFunc() {  
        dealerTotalCards++;
        dealerPack.append(`<div id="dealercard1${dealerTotalCards}" style="left: ${CardsPosX-dealerCardPosX}px; top: ${CardsPosY-dealerCardPosY}px;"><img src="img/back-blue.jpg"></div>`);
        removedCard = allCards.shift();
        dealerCards.push(removedCard);
        cardMove(`dealercard1${dealerTotalCards}`, removedCard, (dealerTotalCards-1)*15, 0 );
    }

    function PlayerCardMoveFunc() {  
        pl1TotalCards++;
        playerPack.append(`<div id="p1card1${pl1TotalCards}" style="left: ${CardsPosX-pl1CardPosX}px; top: ${CardsPosY-pl1CardPosY}px;"><img src="img/back-blue.jpg"></div>`);
        removedCard = allCards.shift();
        pl1Cards.push(removedCard);
        cardMove(`p1card1${pl1TotalCards}`, removedCard, (pl1TotalCards-1)*15, 0 );
    }


    // Function to move cards
    function cardMove(card, rmvCard, posX, posY) {
            $(`#${card}`).animate({ left: `${posX}px`, top: `${posY}px`}, 500, 'swing' , function () {
            $(`#${card}`).html(`<img src="img/${rmvCard}.jpg">`);
            calcScore();
        });               
    }

    // Function to calc score
    function calcScore () {
        pl1Score = 0;
        dealerScore =0;
        pl1Cards.forEach(card => {
            let temp = 0;
            temp = Number(card.slice(1, 3));
            if (temp > 10) {temp = 10}
            pl1Score += temp;
            $('#score1').html(`<strong>${pl1Score} pontos</strong>`);
            checkWinningCondition();
        });
        dealerCards.forEach(card => {
            let temp = 0;
            temp = Number(card.slice(1, 3));
            if (temp > 10) {temp = 10}
            dealerScore += temp;
            $('#dealerscore').html(`<strong>${dealerScore} pontos</strong>`);
            checkWinningCondition();
        });     
    };

    // Function to check winning condition
    function checkWinningCondition() {
        let pl2wins = false;
        let dealerWins = false;
        if(pl1Score == 11 && pl1Cards.length == 2 && (Number(pl1Cards[0].slice(1, 3)) == 1 || Number(pl1Cards[1].slice(1, 3)) == 1) ) {
            // Pl1 Wins
            pl2wins = true;
            pl1Score = 21;
        }
        if (pl1Score === 21 || dealerScore > 21 ) {
             // Pl1 Wins
             pl2wins = true;
        }
        if ( pl1Score > 21 || dealerScore === 21 || (dealerScore >= pl1Score && !playerTurn) ) {
            // Pl1 Blows
            dealerWins = true;
            let pl2wins = false;
        }
        if ( dealerScore == 11 && dealerCards.length == 2 && (Number(dealerCards[0].slice(1, 3)) == 1 || Number(dealerCards[1].slice(1, 3)) == 1) ) {
            // Pl1 Blows
            dealerWins = true;
            let pl2wins = false;
            dealerScore = 21;
        }
        if ( pl2wins ) {
            $('#control').css( "display", "none" );
            $('h2').html(`<a href="#" id="start">Ganhou! Click para iniciar</a>`);
            $('#score1').html(`<strong>${pl1Score} pontos</strong>`);
            $('#start').on('click', function(event){
                event.preventDefault();
                location.reload();
            });
            return true;          
        } else if ( dealerWins ) {
            $('#control').css( "display", "none" );
            $('h2').html(`<a href="#" id="start">Perdeu! Click para iniciar</a>`);
            $('#dealerscore').html(`<strong>${dealerScore} pontos</strong>`);
            $('#start').on('click', function(event){
                event.preventDefault();
                location.reload();
            });
            return true;
        } else {
            return false;
        };
     };

})();