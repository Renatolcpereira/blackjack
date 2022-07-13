(function () {
    'use strict';

    // Array cartas do baralho
    /* let allCards = ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12","p13",
            "e1","e2","e3","e4","e5","e6","e7","e8","e9","e10","e11","e12","e13",
            "c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13",
            "o1","o2","o3","o4","o5","o6","o7","o8","o9","o10","o11","o12","o13"] */
    let allCards = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13",
            "e01","e02","e03","e04","e05","e06","e07","e08","e09","e10","e11","e12","e13",
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
    const dealerPack = document.getElementById('dealerpack');
    let dealerScore = 0;

    // Player vars
    const playerPack = document.getElementById('playerpack');
    const pl1Cards = [];
    let pl1TotalCards = 0;
    let pl1CardPosX = 0;
    let pl1CardPosY = 0;
    let pl1Score = 0;

    // Cards vars
    const cardsPack = document.getElementById('playcardsboard');
    let CardsPosX = 0;
    let CardsPosY = 0;

    shuffleCards();
    console.log(allCards);

    document.getElementById('start').addEventListener('click', function (event) { 
        event.preventDefault();
        const MyP = document.querySelectorAll('section p')
        MyP.forEach(element => { element.remove() });

        dealerPack.style.display = "block";
        playerPack.style.display = "block";
        document.getElementById('dealerscore').style.display = "block";
        document.getElementById('score1').style.display = "block";
        document.getElementById('control').style.display = "block";
        document.querySelector('h2').innerHTML = "Boa sorte !"
        getBoardsPositions();
        setTimeout( dealerCardMoveFunc, 0);
        setTimeout( dealerCardMoveFunc, 600);
        setTimeout( PlayerCardMoveFunc, 1200);
        setTimeout( PlayerCardMoveFunc, 1800);
        setTimeout( calcScore, 2400);
    })

    document.getElementById('continue').addEventListener('click', function (event) {
        event.preventDefault();
        setTimeout( PlayerCardMoveFunc, 0);
        setTimeout( calcScore, 600);
    });

    document.getElementById('pass').addEventListener('click', function (event) {
        event.preventDefault();
        playerTurn = false;
        document.getElementById('control').style.display = "none";
        
        if (!checkWinningCondition()) {
            let id1 = null;
            let id2 = null;
            id1 = setTimeout( dealerCardMoveFunc, 0);
            id2 = setTimeout( calcScore, 600);
        }

        if (!checkWinningCondition()) {
            setTimeout ( function () {  
                if (!checkWinningCondition()) {
                    let id3 = null;
                    let id4 = null;
                    id3 = setTimeout( dealerCardMoveFunc, 0);
                    id4 = setTimeout( calcScore, 600);
                }
            }, 1200);
        }

        if (!checkWinningCondition()) {
            setTimeout ( function () {  
                if (!checkWinningCondition()) {
                    let id3 = null;
                    let id4 = null;
                    id3 = setTimeout( dealerCardMoveFunc, 0);
                    id4 = setTimeout( calcScore, 600);
                }
            }, 2400);
        }
    });


    // Function get Cards positions
    function getBoardsPositions() {
        const playerBoardPos = playerPack.getBoundingClientRect();
        const dealerBoardPos = dealerPack.getBoundingClientRect();
        const cardBoardPos = cardsPack.getBoundingClientRect();
        pl1CardPosX = playerBoardPos.left;
        pl1CardPosY = playerBoardPos.top;
        dealerCardPosX = dealerBoardPos.left;
        dealerCardPosY = dealerBoardPos.top;
        CardsPosX = cardBoardPos.left;
        CardsPosY = cardBoardPos.top;
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
        dealerPack.innerHTML += `<div id="dealercard1${dealerTotalCards}" style="left: ${CardsPosX-dealerCardPosX}px; top: ${CardsPosY-dealerCardPosY}px;"><img src="img/back-blue.jpg"></div>`;
        cardMove(`dealercard1${dealerTotalCards}`, CardsPosX-dealerCardPosX, CardsPosY-dealerCardPosY, (dealerTotalCards-1)*15, 0 );
        removedCard = allCards.shift();
        dealerCards.push(removedCard);
        setTimeout(showCardFunc ,600, `dealercard1${dealerTotalCards}`, removedCard);
    }

    function PlayerCardMoveFunc() {  
        pl1TotalCards++;
        playerPack.innerHTML += `<div id="p1card1${pl1TotalCards}" style="left: ${CardsPosX-pl1CardPosX}px; top: ${CardsPosY-pl1CardPosY}px;"><img src="img/back-blue.jpg"></div>`;
        cardMove(`p1card1${pl1TotalCards}`, CardsPosX-pl1CardPosX, CardsPosY-pl1CardPosY, (pl1TotalCards-1)*15, 0 );
        removedCard = allCards.shift();
        pl1Cards.push(removedCard);
        setTimeout(showCardFunc ,600, `p1card1${pl1TotalCards}`, removedCard);
    }

    // Function to move cards
    function cardMove(card, posX1, posY1, posX2, posY2) {
        let i = 0;
        let elem = document.getElementById(card);
        let constX = (posX1 -posX2) / 100;
        let constY = (posY2 -posY1) / 100;
        console.log(card);
        console.log(`posX1: ${posX1}, posY1: ${posY1}, posX2: ${posX2}, posY2: ${posY2}`);
        console.log(`constX: ${constX} e constY: ${constY}`);

        clearInterval(id);
        id = setInterval(frame, 5);

        function frame() {
            if (i > 100) {
                clearInterval(id);
            } else {
                i++
                posY1 += constY
                posX1 -= constX
                elem.style.top = Math.round(posY1) + "px"; 
                elem.style.left = Math.round(posX1) + "px"; 
            }
        }
               
    }

    function showCardFunc (myCard, rmvCard) {  
        document.getElementById(myCard).innerHTML = `<img src="img/${rmvCard}.jpg">`; 
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
            console.log(pl1Score);
            document.getElementById('score1').innerHTML = `<strong>${pl1Score} pontos</strong>`;
            checkWinningCondition();
  
        });

        dealerCards.forEach(card => {
            let temp = 0;
            temp = Number(card.slice(1, 3));
            if (temp > 10) {temp = 10}
            dealerScore += temp;
            console.log(dealerScore);
            document.getElementById('dealerscore').innerHTML = `<strong>${dealerScore} pontos</strong>`;
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
        }

        if (pl1Score === 21 || dealerScore > 21 ) {
             // Pl1 Wins
             pl2wins = true;
        }

        if ( pl1Score > 21 || dealerScore === 21 || (dealerScore > pl1Score && !playerTurn) ) {
            // Pl1 Blows
            dealerWins = true;
        }
        
        if ( dealerScore == 11 && dealerCards.length == 2 && (Number(dealerCards[0].slice(1, 3)) == 1 || Number(dealerCards[1].slice(1, 3)) == 1) ) {
            // Pl1 Blows
            dealerWins = true;
        }

        if ( pl2wins ) {
            document.getElementById('control').style.display = "none";
            document.querySelector('h2').innerHTML = `<a href="#" id="start">Ganhou! Click para iniciar</a>`;
            document.getElementById('start').addEventListener('click', function(event){
                event.preventDefault();
                location.reload();
            });
            return true;          
        } else if ( dealerWins ) {
            document.getElementById('control').style.display = "none";
            document.querySelector('h2').innerHTML = `<a href="#" id="start">Perdeu! Click para iniciar</a>`;
            document.getElementById('start').addEventListener('click', function(event){
                event.preventDefault();
                location.reload();
            });
            return true;
        } else {
            return false;
        };
     };
     

})();