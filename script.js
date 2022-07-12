(function () {
    'use strict';

    // Array cartas do baralho
    let allCards = ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12","p13",
            "e1","e2","e3","e4","e5","e6","e7","e8","e9","e10","e11","e12","e13",
            "c1","c2","c3","c4","c5","c6","c7","c8","c9","c10","c11","c12","c13",
            "o1","o2","o3","o4","o5","o6","o7","o8","o9","o10","o11","o12","o13"]
    const totalcards = (allCards.length);

    // dealer vars
    let dealerTotalCards = 0;
    let dealerCardPosX = 0;
    let dealerCardPosY = 0;
    const dealerPack = document.getElementById('dealerpack');

    // Player vars
    const playerPack = document.getElementById('playerpack');
    let pl1TotalCards = 0;
    let pl1CardPosX = 0;
    let pl1CardPosY = 0;

    // Cards vars
    const cardsPack = document.getElementById('playcardsboard');
    let CardsPosX = 0;
    let CardsPosY = 0;


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

    shuffleCards();

    document.getElementById('start').addEventListener('click', function (event) { 
        event.preventDefault();
        const MyP = document.querySelectorAll('section p')
        MyP.forEach(element => { element.remove() });

        dealerPack.style.display = "block";
        document.getElementById('dealerscore').style.display = "none"
        playerPack.style.display = "block";
        document.getElementById('score1').style.display = "block";
        document.getElementById('control').style.display = "block";

        getBoardsPositions();

        // Add initials cards
        if ( true ){
            dealerTotalCards++;
            dealerPack.innerHTML += `<div id="cpcard1${pl1TotalCards+1}" style="left: ${CardsPosX-dealerCardPosX}px; top: ${CardsPosY-dealerCardPosY}px;"><img src="img/back-blue.jpg"></div>`;
            
            dealerTotalCards++;
            dealerPack.innerHTML += `<div id="cpcard1${pl1TotalCards+1}" style="left: ${CardsPosX-dealerCardPosX}px; top: ${CardsPosY-dealerCardPosY}px;"><img src="img/back-blue.jpg"></div>`;
            
            pl1TotalCards++;
            playerPack.innerHTML += `<div id="p1card1${dealerTotalCards+1}" style="left: ${CardsPosX-pl1CardPosX}px; top: ${CardsPosY-pl1CardPosY}px;"><img src="img/back-blue.jpg"></div>`;
            
            pl1TotalCards++;
            playerPack.innerHTML += `<div id="p1card1${dealerTotalCards+1}" style="left: ${CardsPosX-pl1CardPosX}px; top: ${CardsPosY-pl1CardPosY}px;"><img src="img/back-blue.jpg"></div>`;
        }
       
    })

})();