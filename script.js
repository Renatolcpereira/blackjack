(function (){
    'use strict';

    // Array cartas do baralho
    let allCards = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13", 
                     "e01","e02","e03","e04","e05","e06","e07","e08","e09","e10","e11","e12","e13", 
                     "c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13", 
                     "o01","o02","o03","o04","o05","o06","o07","o08","o09","o10","o11","o12","o13"]

    /* let allCards = ["p01","p02","p07","p08","p09","p10","p11","p12","p13", 
                     "e01","e02","e07","e08","e09","e10","e11","e12","e13", 
                     "c01","c02","c07","c08","c09","c10","c11","c12","c13", 
                     "o01","o02","o07","o08","o09","o10","o11","o12","o13"] */
    let gameControl = {
        pack1: { player: "player1A", packposX: "0px", packposY: "0px", points1: 0, points2: 0, winCondition: null, 
            cards: { 
                /* card1: { card: "p01", reveal: true },
                card2: { card: "e07", reveal: true },
                card3: { card: "c12", reveal: true } */
            } },
        pack2: { player: "player1B", packposX: "0px", packposY: "0px", points1: 0, points2: 0, winCondition: null, 
            cards: { 
                /* card1: { card: "p01", reveal: true },
                card2: { card: "e07", reveal: true },
                card3: { card: "c12", reveal: true } */
            } },
    };

    let packs = Object.values(gameControl);
    const totalcards = (allCards.length);
    let removedCard = "";
    let playerTurn = "player1A";
    let dealerTurn = false;
    let totalPlayers = 1;
    let firstTime = true; // var to avoid infinite loop inside checkWinningCondition funtioc

    // dealer vars
    let dealerTotalCards = 0;
    const dealerCards = {card1: { card: "",reveal: false }, card2: { card: "",reveal: false }};
    let dealerCardPosX = 0;
    let dealerCardPosY = 0;
    let dealerScore = [ 0 , 0 ];
    let dealerWins = null;

    // Player vars
    let plTotalCards = 0;
    let player1APass = false;
    let player1BPass = false;

    // Cards vars
    const cardsPack = $('#playcardsboard');
    let cardsPosX = 0;
    let cardsPosY = 0;

    shuffleCards();
    
    // Start Button click event
    $('#start').on('click', function (event) {
        event.preventDefault();
        $('section p').remove();
        $('#playerContent').remove();
        $('#dealerpack').css( "display", "block" );
        $('#dealerscore').css( "display", "block" );
        $('.cardpack').css( "display", "block" );
        $('.score').css( "display", "block");

        $('#playerboard').css({"border": "0", "width": "100%"});
        $('#player1AContent').css( "display", "block" );
        
        $('.control').css( "display", "block" );
        $('h2').html("Boa sorte !");

        getBoardsPositions();
        dealerCardFunc(true, function () { dealerCardFunc(false); });
        playerCardFunc(true, function () { playerCardFunc(true);  });
        setTimeout( checkSplit, 1000, true);  
    });

    // Player 1A - Continue Buttom
    $('#btn1Acontinue').on('click', function (event) {
        event.preventDefault();
        $('#btn1Asplit').css( "display", "none" );
        switchPlayer("player1A");
        playerCardFunc(true);
    });
    
    // Player 1A - Pass Buttom
    $('#btn1Apass').on('click', function (event) {
        event.preventDefault();
        if ( totalPlayers == 1) {
            dealerTurnFunc();
        } else {
            if ( !player1BPass ) {
                player1APass = true;
                switchPlayer("player1B");
            } else {
                dealerTurnFunc();
            }
        }
    });

    // Player 1B clicked Continue
    $('#btn1Bcontinue').on('click', function (event) {
        event.preventDefault();
        playerTurn = true;
        switchPlayer("player1B");
        playerCardFunc(true);
    });

     // Player 1B - Pass Buttom
     $('#btn1Bpass').on('click', function (event) {
        event.preventDefault();
        if ( !player1APass) {
            player1BPass = true;
            switchPlayer("player1A");
            $('#btn1Bcontinue').css("display","none");
            $('#btn1Bpass').css("display","none");
            $('#player1BControl').html() = "<p>Aguarde</p>"
        } else {
            dealerTurnFunc();
        }
    });

    // Player 1A - Switch
    $('#player1AContent').on('click', function(){ 
        if ( packs[0].winCondition == null ) {
            switchPlayer("player1A"); 
        }
    });

    // Player 1B - Switch
    $('#player1BContent').on('click', function(){ 
        if ( packs[1].winCondition == null ) {
            switchPlayer("player1B"); 
        } 
    });

    // Function to switch playerContent
    function switchPlayer (player) {
        if ( totalPlayers == 2 ) { 
            if ( player == "player1A" ) {
                $('#player1AContent').css("background-color", "rgb(23, 171, 0)");
                $('#btn1Acontinue').css("display","inline");
                $('#btn1Apass').css("display","inline");
                $('#player1BContent').css("background-color", "rgb(19, 144, 0)");
                /* $('#btn1Bcontinue').css("display","none");
                $('#btn1Bpass').css("display","none"); */
                playerTurn = "player1A";
                console.log("Mudança de player de B -> A");
                console.log(packs[0].cards);
                console.log("-----------------");
            } else {
                $('#player1BContent').css("background-color", "rgb(23, 171, 0)");
                $('#btn1Bcontinue').css("display","inline");
                $('#btn1Bpass').css("display","inline");
                $('#player1AContent').css("background-color", "rgb(19, 144, 0)");
                /* $('#btn1Acontinue').css("display","none");
                $('#btn1Apass').css("display","none"); */
                playerTurn = "player1B";
                console.log("Mudança de player de A -> B");
                console.log(packs[1].cards);
                console.log("-----------------");
            }
        }
    };

    // Function get Cards positions
    function getBoardsPositions() {
        packs[0].packposX = Math.round($(`#player1Apack`).offset().left);
        packs[0].packposY = Math.round($(`#player1Apack`).offset().top);
        packs[1].packposX = Math.round($(`#player1Bpack`).offset().left);
        packs[1].packposY = Math.round($(`#player1Bpack`).offset().top);
        dealerCardPosX = Math.round($('#dealerpack').offset().left);
        dealerCardPosY = Math.round($('#dealerpack').offset().top);
        cardsPosX = Math.round(cardsPack.offset().left);
        cardsPosY = Math.round(cardsPack.offset().top) + 7;
        console.log(`Player1A X - ${packs[0].packposX} / Y - ${packs[0].packposY}`);
        console.log(`Player1B X - ${packs[1].packposX} / Y - ${packs[1].packposY}`);
        console.log(`Dealer X - ${dealerCardPosX} / Y - ${dealerCardPosY}`);
        console.log("----------------------------")
    };

    // Function shuffle cards
    function shuffleCards () {
        let tempArr = [];
        for ( let i = 0; i < totalcards - 1; i++ ) {
            tempArr.push(allCards.splice(Math.floor(Math.random()*allCards.length),1)[0]);
        }
        tempArr.push(allCards[0]); 
        allCards=tempArr;
    };
    
    // Function to add card one card to dealer
    function dealerCardFunc(reveal, callback) {
        dealerTotalCards++;
        // revome on card from allcards
        removedCard = allCards.shift();
        // push removed card 
        let nextCard = `card${dealerTotalCards}`;
        dealerCards[nextCard] = { card: removedCard, reveal: reveal };        
        $('#dealerpack').append(`<div id="dealercard1${dealerTotalCards}" style="left: ${cardsPosX-dealerCardPosX}px; top: ${cardsPosY-dealerCardPosY}px;"><img src="img/back-blue.jpg"></div>`);
        cardMove(`dealercard1${dealerTotalCards}`, removedCard, (dealerTotalCards-1)*15, 0 , reveal, callback);
    };
    
    // Function to add one card to players
    function playerCardFunc(reveal, callback ) {  
        let cardsArray = [];
        removedCard = allCards.shift();
        for (let i = 0; i < totalPlayers ; i++) {
            if ( packs[i].player === playerTurn ){
                console.log(`+ Carta para ${packs[i].player} - ${removedCard}`);
                cardsArray = Object.entries(packs[i].cards);
                console.log(cardsArray);
                plTotalCards = cardsArray.length;
                console.log(`Total cartas atual: ${plTotalCards}`);
                plTotalCards++;
                console.log(`Próxima carta: p${i}card${plTotalCards}`);
                packs[i].cards[`card${plTotalCards}`] = { card: removedCard, reveal: reveal };
                $(`#${packs[i].player}pack`).append(`<div id="p${i}card${plTotalCards}" style="left: ${cardsPosX-packs[i].packposX}px; top: ${cardsPosY-packs[i].packposY}px;"><img src="img/back-blue.jpg"></div>`);
                cardMove(`p${i}card${plTotalCards}`, removedCard, (plTotalCards-1)*15, 0, reveal, callback );
            }
        }
    };

    // Function to move and reveal cards
    function cardMove(card, rmvCard, posX, posY, reveal, callback) {
        $(`#${card}`).animate({ left: `${posX}px`, top: `${posY}px`}, 500, 'swing' , function () {
            console.log(`Movendo a carta: ${card} - ${rmvCard}`)
            console.log("---------------");
            if (reveal) { $(`#${card}`).html(`<img src="img/${rmvCard}.jpg">`) };
            calcScore();
            if (callback) { callback() };
        });               
    };

    // Function to add one card to dealer
    function dealerTurnFunc() { 
        dealerTurn = true;
            $('#btn1Acontinue').css("display","none");
            $('#btn1Apass').css("display","none");
            $('#btn1Asplit').css( "display", "none" );

            dealerCards.card2.reveal = true;
            $(`#dealercard12`).html(`<img src="img/${dealerCards.card2.card}.jpg">`);
            calcScore();
            
            if (!checkWinningCondition()) {
                let id = null;
                id = setTimeout( dealerCardFunc (true), 0);
            }
            let t = 1 ;
            // add cards to dealer till end game
            let cicle = setInterval( () => {
                if (!checkWinningCondition() && t < 5) {
                    let id = null;
                    id = setTimeout( dealerCardFunc (true), 0);
                    t++;
                    if ( t == 5) {console.log("limite de cartas atingido"); };
                } else {
                    clearInterval(cicle);
                }
            }, 1200);
    };

    // Function to calc score
    function calcScore () {
        let temp = 0;
        let cardsArray = Object.entries(packs[0].cards);

        for (let i=0; i < totalPlayers; i++) {
            // i = number of player
            temp = 0;
            packs[i].points1 = 0;
            packs[i].points2 = 0;

            cardsArray = Object.entries(packs[i].cards);
            for (let j = 0; j < cardsArray.length; j++){
                // j = number of cards

                if (cardsArray[j][1].reveal) {
                    console.log(`Somando pontos ${packs[i].player}: ${cardsArray[j][1].card} `);
                    temp = Number(cardsArray[j][1].card.slice(1, 3));
                    if (temp > 10) {temp = 10};
                    if (temp == 1) {
                        packs[i].points1 += 1;
                        packs[i].points2 += 11;
                    } else {
                        packs[i].points1 += temp;
                        packs[i].points2 += temp;
                    };
                    if (packs[i].points2 <= 21) { 
                        $(`#${packs[i].player}Score`).html(`<strong>${packs[i].points2} pontos</strong>`);
                    } else {
                        $(`#${packs[i].player}Score`).html(`<strong>${packs[i].points1} pontos</strong>`);
                    }
                };     
            };
        };

        dealerScore = [ 0 , 0 ];
        let cards = Object.keys(dealerCards);
        let vcards = Object.values(dealerCards);
        for (let i=0; i < cards.length; i++) {
            temp = 0;
            if (vcards[i].reveal) {
                temp = Number(vcards[i].card.slice(1, 3));
                if (temp > 10) {temp = 10}
                if (temp == 1) {
                    dealerScore[0] += 1
                    dealerScore[1] += 11
                } else {
                    dealerScore[0] += temp
                    dealerScore[1] += temp
                };
                if ( dealerScore[1] <= 21) { 
                    $('#dealerscore').html(`<strong>${dealerScore[1]} pontos</strong>`);
                } else {
                    $('#dealerscore').html(`<strong>${dealerScore[0]} pontos</strong>`);
                }
            }
        }
        console.log(`${dealerScore[0]} - ${dealerScore[1]}`);
        checkWinningCondition();
        
    };

    // Function to check winning condition
    function checkWinningCondition() {
        let dlPoints = 0;
        let pl1point = 0;
        let pl2point = 0;

        // check points
        if ( dealerScore[0] == 21 || dealerScore[1] == 21 ) { dlPoints = 21;}
        else if ( dealerScore[1] > 21 ) { dlPoints = dealerScore[0];}
        else { dlPoints = dealerScore[1];}

        if ( packs[0].points1 == 21 || packs[0].points2 == 21 ) { pl1point = 21; } 
        else if ( packs[0].points2 > 21 ) { pl1point = packs[0].points1; } 
        else { pl1point = packs[0].points2; }

        if ( packs[1].points1 == 21 || packs[1].points2 == 21 ) { pl2point = 21; } 
        else if ( packs[1].points2 > 21 ) { pl2point = packs[1].points1; } 
        else { pl2point = packs[1].points2; }

        // check player1A
        if ( playerTurn == "player1A" && packs[0].winCondition == null ) { rules (0, pl1point); }
        
        if ( playerTurn == "player1B" && packs[1].winCondition == null ) { rules (1, pl2point); }

        function rules (i , plPoints) {
            console.log(`rodando - rules ${i}`);
            if ( plPoints == 21 ) { packs[i].winCondition = true; }
            if ( dlPoints == 21) { dealerWins = true; }
            if ( plPoints > 21 ) { dealerWins = true; packs[i].winCondition = false; }
            if ( dlPoints > 21 ) { dealerWins = false; packs[i].winCondition = true; }
            if ( plPoints < 21 && dlPoints < 21 && plPoints < dlPoints && dealerTurn == true ) {
                dealerWins = true;
                packs[i].winCondition = false;
            }
        }

        if (pl1point == 21 && dealerWins == null && firstTime ) {
            console.log("******* Looping do Dealer **********");
            firstTime = false;
            dealerTurnFunc();
        }


        console.log(`Player 1A - win: ${packs[0].winCondition} /  Pts - ${pl1point} pontos`);
        console.log(`Player 1B - win: ${packs[1].winCondition} / Pts - ${pl2point} pontos`);
        console.log(`Croupie - win: ${dealerWins} / Pts - ${dlPoints} pontos`);
        console.log("--------------------------------");
        
        if ( totalPlayers == 1 && packs[0].winCondition ) { 
            // player 1A wins
            $('.control').css( "display", "none" );
            $('h2').html(`<a href="#" id="start">Ganhou! Click para iniciar</a>`);
            $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
            $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
            $('#btn1Acontinue').css("display","none");
            $('#btn1Apass').css("display","none");
            $('#start').on('click', function(event){
                event.preventDefault();
                location.reload();
            });
            return true;
        } else if ( totalPlayers == 1 && dealerWins ) {
            $('.control').css( "display", "none" );
            $('h2').html(`<a href="#" id="start">Perdeu! Click para iniciar</a>`);
            $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
            $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
            $('#start').on('click', function(event){
                event.preventDefault();
                location.reload();
            });
            // End Game
            return true;
        }

        if ( totalPlayers == 2 && playerTurn == "player1A" && packs[0].winCondition && packs[1].winCondition == null) { 
            switchPlayer("player1B"); 
            return true;
        }

        if ( totalPlayers == 2 && playerTurn == "player1B" && packs[1].winCondition && packs[0].winCondition == null) { 
            switchPlayer("player1A"); 
            return true;
        }

        if ( totalPlayers == 2 ) {
            if ( packs[0].winCondition && packs[1].winCondition ) {
                // player 1A and 1B wins
                $('.control').css( "display", "none" );
                $('h2').html(`<a href="#" id="start">P1 e P2 Ganharam! Click para iniciar</a>`);
                $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
                $('#player1BScore').html(`<strong>${pl2point} pontos</strong>`);
                $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
                $('#btn1Acontinue').css("display","none");
                $('#btn1Apass').css("display","none");
                $('#start').on('click', function(event){
                    event.preventDefault();
                    location.reload();
                });
                return true;
            } else if ( packs[0].winCondition && !packs[1].winCondition ) { 
                // player 1A wins and 1B lost
                $('.control').css( "display", "none" );
                $('h2').html(`<a href="#" id="start">P1 Ganhou! Click para iniciar</a>`);
                $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
                $('#player1BScore').html(`<strong>${pl2point} pontos</strong>`);
                $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
                $('#btn1Acontinue').css("display","none");
                $('#btn1Apass').css("display","none");
                $('#start').on('click', function(event){
                    event.preventDefault();
                    location.reload();
                });
                return true;
            } else if ( packs[1].winCondition && !packs[0].winCondition ) {
                // player 1A lost and 1B wins
                $('.control').css( "display", "none" );
                $('h2').html(`<a href="#" id="start">P1 Ganhou! Click para iniciar</a>`);
                $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
                $('#player1BScore').html(`<strong>${pl2point} pontos</strong>`);
                $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
                $('#btn1Acontinue').css("display","none");
                $('#btn1Apass').css("display","none");
                $('#start').on('click', function(event){
                    event.preventDefault();
                    location.reload();
                });
                return true;
            } else if ( dealerWins ) {
                $('.control').css( "display", "none" );
                $('h2').html(`<a href="#" id="start">Perdeu! Click para iniciar</a>`);
                $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
                $('#player1BScore').html(`<strong>${pl2point} pontos</strong>`);
                $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
                $('#start').on('click', function(event){
                    event.preventDefault();
                    location.reload();
                });
                // End Game
                return true;
            } else {
                return false;
            }
        } 
    };

    // Function to check split and manage second content move
    function checkSplit () {
        let cardsArray = [];
        let temp1 = 0;
        let temp2 = 0;
        cardsArray = Object.entries(packs[0].cards);
        if (cardsArray.length == 2){
            temp1 = Number(cardsArray[0][1].card.slice(1, 3));
            if (temp1 > 10 ) {temp1 = 10};
            temp2 = Number(cardsArray[1][1].card.slice(1, 3));
            if (temp2 > 10 ) {temp2 = 10};
            if (temp1 == temp2){
                // split palyerturn cards
                $('#btn1Asplit').css( "display", "inline" );
                $('#player1AControl').css( "display", "block" );
                $('#btn1Asplit').on('click', function () {
                    console.log(" ////// Dividiu ///////");
                    console.log(gameControl);
                    console.log("----------------------")
                    totalPlayers = 2 ;
                    $('#player1BContent').css( "display", "block" );
                    $('#btn1Asplit').css( "display", "none" );
                    getBoardsPositions();
                    //remove card from pack1
                    removedCard = gameControl.pack1.cards.card2.card;
                    delete gameControl.pack1.cards.card2
                    $('#p0card2').clone().appendTo("#player1Bpack");
                    $("#player1Bpack div").attr( "id", 'p1card1');
                    $('#p1card1').css("left","0px");
                    let playBoardWidth = $('#playerboard').width();
                    if ( playBoardWidth < 450) {
                        $('#player1BContent').animate({ top: `175px` }, 550, 'swing', getBoardsPositions );
                    } else {
                        $('#player1BContent').animate({ left: `${(playBoardWidth/2)-105}px` }, 500, 'swing' );
                        $('#player1AContent').animate({ left: `${(playBoardWidth/2)+105}px` }, 550, 'swing', getBoardsPositions );
                    }
                    
                    $('#p0card2').remove();
                    // add card to pack2
                    gameControl["pack2"].cards = { 
                                card1: { card: removedCard, reveal: true }
                            }
                    
                    calcScore();
                    switchPlayer ("player1A")
                });
            }
        }
    };
})();