(function (){
    'use strict';

    // Array cartas do baralho
    let allCards = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13", 
                     "e01","e02","e03","e04","e05","e06","e07","e08","e09","e10","e11","e12","e13", 
                     "c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13", 
                     "o01","o02","o03","o04","o05","o06","o07","o08","o09","o10","o11","o12","o13"]
                     
    /* let allCards = ["p01","c01","p13","e13","p09","p10","p07","p08","p09","p10","p11","p12","p13", 
                     "e01","e02","e03","e04","e05","e06","e07","e08","e09","e10","e11","e12","e13", 
                     "c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13", 
                     "o01","o02","o03","o04","o05","o06","o07","o08","o09","o10","o11","o12","o13"] */

    let gameControl = {
        pack1: { player: "player1A", bet: 0, packposX: 0, packposY: 0, points1: 0, points2: 0, winCondition: null, 
            blackjack: false, cards: { 
                                /* card1: { card: "p01", reveal: true },
                                card2: { card: "e07", reveal: true },
                                card3: { card: "c12", reveal: true } */
            } },
        pack2: { player: "player1B", bet: 0, packposX: 0, packposY: 0, points1: 0, points2: 0, winCondition: null, 
            blackjack: false, cards: { 
                                /* card1: { card: "p01", reveal: true },
                                card2: { card: "e07", reveal: true },
                                card3: { card: "c12", reveal: true } */
            } }
    };

    let packs = Object.values(gameControl);
    let removedCard = "";
    let playerTurn = "player1A";
    let totalPlayers = 1;
    let firstTime = true; // var to avoid infinite loop inside checkWinningCondition funct
    let playerCoins = 500;
    let playBoardWidth = $('#playerboard').width();
    let endGameVar = false;
    let shiftCondtion = null;

    // dealer vars
    let dealerTotalCards = 0;
    let dealerCards = {card1: { card: "",reveal: false }, card2: { card: "",reveal: false }};
    let dealerCardPosX = 0;
    let dealerCardPosY = 0;
    let dealerScore = [ 0 , 0 ];
    let dealerWins = [ null, null ];
    let dlPoints = 0;
    let dealerBlackjack = false;

    // Player vars
    let plTotalCards = 0;
    let player1APass = false;
    let player1BPass = false;
    let pl1point = 0;
    let pl2point = 0;
    let bet1A = 0;
    let bet1B = 0;
    let doubleA = false;
    let doubleB = false;

    // Cards vars
    let cardsPosX = 0;
    let cardsPosY = 0;

    playRoll(false);

    // When the user clicks on div, open the popup
    $('#infobox').on('click', function (event) {
        event.preventDefault();
        $('#myPopup').toggle("show");
    });

    

    function playRoll(startroll) {
        if (startroll) {
            // restart the game vars
            allCards = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13", 
                        "e01","e02","e03","e04","e05","e06","e07","e08","e09","e10","e11","e12","e13", 
                        "c01","c02","c03","c04","c05","c06","c07","c08","c09","c10","c11","c12","c13", 
                        "o01","o02","o03","o04","o05","o06","o07","o08","o09","o10","o11","o12","o13"];
            gameControl = {
            pack1: { player: "player1A", bet: 0, packposX: 0, packposY: 0, points1: 0, points2: 0, winCondition: null, 
                blackjack: false, cards: { } },
            pack2: { player: "player1B", bet: 0, packposX: 0, packposY: 0, points1: 0, points2: 0, winCondition: null, 
                blackjack: false, cards: { } } 
            };
            packs = Object.values(gameControl)
            removedCard = "";
            playerTurn = "player1A";
            totalPlayers = 1;
            firstTime = true;
            dealerTotalCards = 0;
            dealerCards = {card1: { card: "",reveal: false }, card2: { card: "",reveal: false }};
            dealerScore = [ 0 , 0 ];
            dealerWins = [ null, null ];
            bet1A = 0;
            bet1B = 0;
            plTotalCards = 0;
            player1APass = false;
            player1BPass = false;
            pl1point = 0;
            pl2point = 0;
            dlPoints = 0;
            doubleA = false;
            doubleB = false;
            dealerBlackjack = false;
            playBoardWidth = $('#playerboard').width();
            $('#player1BContent').animate({ left: `50%` }, 500, 'swing', function () {
                $('#player1BContent').css( "display" , "none" ); 
            } );
            $('#bet1B').animate({ left: `50%` }, 500, 'swing', function () {
                $('#bet1B').css( "display" , "none" );
            } );
            $('#bet1A').animate({ left: `50%` }, 550, 'swing' );
            $('#player1AContent').animate({ left: `50%` }, 550, 'swing', getBoardsPositions );
            $('#player1Apack').html('');
            $('#dealerpack').html('');
            $('#player1Bpack').html('');
            $('#player1AScore').html('<strong>0 pontos</strong>');
            $('#player1BScore').html('<strong>0 pontos</strong>');
            $('#dealerscore').html('<strong>0 pontos</strong>');
            $('#bet1A').html("$0");
            $('#bet1B').html("$0");
            $('#btn1Asplit').off();
            $('#btn1Acontinue').off();
            $('#btn1Bcontinue').off();
            $('#btn1Apass').off();
            $('#btn1Bpass').off();
            $('#btn1Adouble').off();
            $('#btn1Bdouble').off();
            $('#btn1Agiveup').off();
            $('#btn1Bgiveup').off();
            $('#player1AContent').off();
            $('#player1BContent').off();
            $('#btn1Acontinue').css( "display" , "inline-block" );
            $('#btn1Bcontinue').css( "display" , "inline-block" );
            $('#btn1Apass').css( "display" , "inline-block" );
            $('#btn1Bpass').css( "display" , "inline-block" );
            $('#btn1Agiveup').css( "display", "inline-block" );
            $('#btn1Bgiveup').css( "display", "inline-block" );
            $('#player1AContent').css("background-color", "transparent");
            $('#player1BContent').css("background-color", "transparent");
        };

        shuffleCards();
        $('#cash').html(`$${playerCoins}`);

        // Start Button click event
        $('#start').one('click', function (event) {
            event.preventDefault();
            $('#dealerboard p').remove();
            $('#playerContent p').remove();
            $('#playerContent').remove();
            $('#dealerpack').css( "display", "block" );
            $('#dealerscore').css( "display", "block" );
            $('.cardpack').css( "display", "block" );
            $('.score').css( "display", "block");

            $('#playerboard').css({"border": "0", "width": "100%"});
            $('#player1AContent').css( "display", "block" );
            
            $('#player1AControl').css( "display", "block" );
            $('h2').html("Boa sorte !");

            if ( playerCoins < 50 ) {
                $('h2').html("Sem fundos!<br>Reload Page");
                $('#btn1Asplit').css( "display", "none" );
                $('#btn1Adouble').css( "display", "none" );
                $('#btn1Acontinue').css( "display", "none" );
                $('#btn1Apass').css( "display", "none" );

            } else {
                packs[0].bet = 50;
                playerCoins -= packs[0].bet;
                $('#bet1A').html(`$${packs[0].bet}`);
                $('#cash').html(`$${playerCoins}`);
                if ( playerCoins >= packs[0].bet ) { $('#btn1Adouble').css( "display", "inline-block" ); };
                getBoardsPositions();
                dealerCardFunc(true, function () { dealerCardFunc(false); });
                playerCardFunc(true, function () { playerCardFunc(true);  });
                setTimeout( function () { checkSplit(); }, 1000); 
            }         
        });

        // Player 1A - Continue Buttom
        $('#btn1Acontinue').on('click', function (event) {
            event.preventDefault();
            $('#btn1Asplit').css( "display", "none" );
            $('#btn1Adouble').css( "display", "none" );
            $('#btn1Agiveup').css( "display", "none" );
            $('h2').html("Boa Sorte!");
            switchPlayer("player1A");
            playerCardFunc(true);
        });
        
        // Player 1B Continue Buttom
        $('#btn1Bcontinue').on('click', function (event) {
            event.preventDefault();
            $('#btn1Bdouble').css( "display", "none" );
            $('#btn1Bgiveup').css( "display", "none" );
            $('h2').html("Boa Sorte!");
            playerTurn = true;
            switchPlayer("player1B");
            playerCardFunc(true);
        });

        // Player 1A - Pass Buttom
        $('#btn1Apass').on('click', function (event) {
            event.preventDefault();
            $('h2').html("Boa Sorte!");
            if ( totalPlayers == 1) {
                dealerTurnFunc();
            } else {
                if ( !player1BPass ) {
                    player1APass = true;
                    $('#btn1Acontinue').css("display","none");
                    $('#btn1Apass').css("display","none");
                    $('#player1AControl').css("display","none");
                    $('#btn1Agiveup').css( "display", "none" );
                    $('#player1AContent').off();
                    switchPlayer("player1B");
                } else {
                    dealerTurnFunc();
                }
            }
        });

        // Player 1B - Pass Buttom
        $('#btn1Bpass').on('click', function (event) {
            $('h2').html("Boa Sorte!");
            event.preventDefault();
            if ( !player1APass) {
                player1BPass = true;
                $('#btn1Bcontinue').css("display","none");
                $('#btn1Bpass').css("display","none");
                $('#player1BControl').css("display","none");
                $('#btn1Bgiveup').css( "display", "none" );
                $('#player1BContent').off();
                switchPlayer("player1A");
            } else {
                dealerTurnFunc();
            }
        });

        // Player 1A - Double Buttom
        $('#btn1Adouble').one('click', function () {
            doubleA = true;
            playerCoins -= packs[0].bet;
            packs[0].bet += packs[0].bet;
            $('#bet1A').html(`$${packs[0].bet}`);
            $('#cash').html(`$${playerCoins}`);
            $('#btn1Adouble').css( "display", "none" );
            playerCardFunc(true);
            $('h2').html("Boa Sorte!");
        });

        // Player 1B - Double Buttom
        $('#btn1Bdouble').one('click', function () {
            doubleB = true;
            playerCoins -= packs[1].bet;
            packs[1].bet += packs[1].bet;
            $('#bet1B').html(`$${packs[1].bet}`);
            $('#cash').html(`$${playerCoins}`);
            $('#btn1Bdouble').css( "display", "none" );
            playerCardFunc(true);
            $('h2').html("Boa Sorte!");
        });

        // Player 1A - Giveup Buttom
        $('#btn1Agiveup').one('click', function () {
            $('#btn1Asplit').css( "display", "none" );
            $('#btn1Adouble').css( "display", "none" );
            $('#btn1Agiveup').css( "display", "none" );
            $('#btn1Acontinue').css( "display", "none" );
            $('#btn1Apass').css( "display", "none" );
            packs[0].winCondition = "giveup";
            dealerWins[0] = true;
            player1APass = true;
            if ( totalPlayers == 1 || ( totalPlayers == 2 && player1BPass ) ) {
                endGame();
            } else {
                $('h2').html(`Mesa 2 desistiu!`);
                switchPlayer("player1B");
            };      
        });

        // Player 1B - Giveup Buttom
        $('#btn1Bgiveup').one('click', function () {
            $('#btn1Bsplit').css( "display", "none" );
            $('#btn1Bdouble').css( "display", "none" );
            $('#btn1Bgiveup').css( "display", "none" );
            $('#btn1Bcontinue').css( "display", "none" );
            $('#btn1Bpass').css( "display", "none" );
            packs[1].winCondition = "giveup";
            dealerWins[1] = true;
            player1BPass = true;
            if ( player1APass ) {
                endGame();
            } else {
                $('h2').html(`Mesa 1 desistiu!`);
                switchPlayer("player1A");
            };
        });

        // Player 1A - Switch
        $('#player1AContent').on('click', "#player1Apack", function(){ 
            if ( packs[0].winCondition == null ) {
                switchPlayer("player1A"); 
            }
        });

        // Player 1B - Switch
        $('#player1BContent').on('click', "#player1Bpack", function(){ 
            if ( packs[1].winCondition == null ) {
                switchPlayer("player1B"); 
            } 
        });
    };

    // Function to switch playerContent
    function switchPlayer (player) {
        if ( totalPlayers == 2 && player == "player1A" && !player1APass) {
            $('#player1AContent').css("background-color", "#337207");
            $('#player1AControl').css("display","block");
            $('#player1BContent').css("background-color", "transparent");
            $('#player1BControl').css("display","none");
            if ( playerCoins >= packs[0].bet && !doubleA ) { $('#btn1Adouble').css( "display", "inline-block" ); };
            if ( packs[1].winCondition != null ) { $('#player1BContent').off(); }
            playerTurn = "player1A";
            console.log("Mudança de player de B -> A");
            console.log(packs[0].cards);
            console.log("-----------------");
        } 
        if ( totalPlayers == 2 && player == "player1B" && !player1BPass ) {
            $('#player1BContent').css("background-color", "#337207");
            $('#player1BControl').css("display","block");
            $('#player1AContent').css("background-color", "transparent");
            $('#player1AControl').css("display","none");
            if ( playerCoins >= packs[1].bet && !doubleB ) { $('#btn1Bdouble').css( "display", "inline-block" ); };
            if ( packs[0].winCondition != null ) { $('#player1AContent').off(); }
            playerTurn = "player1B";
            console.log("Mudança de player de A -> B");
            console.log(packs[1].cards);
            console.log("-----------------");          
        }
        if ( player == "dealer") {
            $('#player1BContent').css("background-color", "#transparent");
            $('#player1AContent').css("background-color", "#transparent");
            $('#player1AControl').css("display","none");
            $('#player1BControl').css("display","none");
            playerTurn = "dealer";
            console.log("Mudança para o Croupie");
            console.log(dealerCards);
            console.log("-----------------");
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
        cardsPosX = Math.round($('#playcardsboard').offset().left);
        cardsPosY = Math.round($('#playcardsboard').offset().top) + 7;
        console.log(`Player1A X - ${packs[0].packposX} / Y - ${packs[0].packposY}`);
        console.log(`Player1B X - ${packs[1].packposX} / Y - ${packs[1].packposY}`);
        console.log(`Dealer X - ${dealerCardPosX} / Y - ${dealerCardPosY}`);
        console.log("----------------------------")
    };

    // Function shuffle cards
    function shuffleCards () {
        let tempArr = [];
        for ( let i = 0; i < allCards.length - 1; i++ ) {
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
                console.log(`Total Players: ${totalPlayers}`);
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
        switchPlayer("dealer");
        console.log("******* Looping do Dealer **********");
        endGameVar = false;

        dealerCards.card2.reveal = true;
        $(`#dealercard12`).html(`<img src="img/${dealerCards.card2.card}.jpg">`);
        calcScore();
        
        if (!endGameVar) {
            setTimeout( dealerCardFunc (true), 0);
            if (!endGameVar) {
                let t = 1 ;
                // add cards to dealer till end game
                let cicle = setInterval( () => {
                    if (!endGameVar && t < 5) {
                        let id = null;
                        id = setTimeout( dealerCardFunc (true), 500 * (t - 1));
                        t++;
                        if ( t == 5) {console.log("limite de cartas atingido"); console.log("FFFIIIMMMM por limite"); };
                    } else {
                        clearInterval(cicle);
                        console.log("FFFFFFFIIIIIIIMMMMMMM");
                        endGame();
                    }
                }, 1200);
            } else {
                console.log("FFFFFFFIIIIIIIMMMMMMM");
                endGame();
            } 
        } else {
            console.log("FFFFFFFIIIIIIIMMMMMMM");
            endGame();
        }   
    };

    // Function to calc score
    function calcScore () {
        console.log("----- Calculando Score -------");
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
                    temp = Number(cardsArray[j][1].card.slice(1, 3));
                    if (temp > 10) {temp = 10};
                    if (temp == 1) {
                        packs[i].points1 += 1;
                        packs[i].points2 += 11;
                    } else {
                        packs[i].points1 += temp;
                        packs[i].points2 += temp;
                    };
                    if ( packs[i].points2 < 21 ) { 
                        $(`#${packs[i].player}Score`).html(`<strong>${packs[i].points2} pontos</strong>`);
                    } else if ( packs[i].points2 == 21 && cardsArray.length == 2 ) { 
                        $(`#${packs[i].player}Score`).html(`<strong> Blackjack </strong>`);
                    } else if ( packs[i].points2 == 21  ) { 
                        $(`#${packs[i].player}Score`).html(`<strong>${packs[i].points2} pontos</strong>`);
                    } else {
                        $(`#${packs[i].player}Score`).html(`<strong>${packs[i].points1} pontos</strong>`);
                    }
                };     
            };
            // Check for BlackJack for players
            if ( cardsArray.length == 2 && packs[i].points2 == 21 ) { packs[i].blackjack = true; }
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
                if ( dealerScore[1] < 21) { 
                    $('#dealerscore').html(`<strong>${dealerScore[1]} pontos</strong>`);
                } else if (dealerScore[1] == 21 && cards.length == 2 ) {
                    $('#dealerscore').html(`<strong> Blackjack </strong>`);
                } else if (dealerScore[1] == 21) {
                    $('#dealerscore').html(`<strong>${dealerScore[1]} pontos</strong>`);
                } else {
                    $('#dealerscore').html(`<strong>${dealerScore[0]} pontos</strong>`);
                }
            }
        }
        // Check for BlackJack for dealer
        if ( cards.length == 2 && dealerScore[1] == 21 ) { dealerBlackjack = true; }

        if ( dealerScore[0] == 21 || dealerScore[1] == 21 ) { dlPoints = 21;}
        else if ( dealerScore[1] > 21 ) { dlPoints = dealerScore[0];}
        else { dlPoints = dealerScore[1];}

        if ( packs[0].points1 == 21 || packs[0].points2 == 21 ) { pl1point = 21; } 
        else if ( packs[0].points2 > 21 ) { pl1point = packs[0].points1; } 
        else { pl1point = packs[0].points2; }

        if ( packs[1].points1 == 21 || packs[1].points2 == 21 ) { pl2point = 21; } 
        else if ( packs[1].points2 > 21 ) { pl2point = packs[1].points1; } 
        else { pl2point = packs[1].points2; }

        shiftCondtion = null;
        // check player1A
        if ( playerTurn == "player1A" && packs[0].winCondition == null ) {
            shiftCondtion = rules (0, pl1point); 
            if ( shiftCondtion && totalPlayers == 2 && !player1BPass) {
                player1APass = true; 
                switchPlayer("player1B");
                return;
            }
        }

        // check player1B
        if ( playerTurn == "player1B" && packs[1].winCondition == null ) {
            shiftCondtion = rules (1, pl2point); 
            if ( shiftCondtion && totalPlayers == 2 && !player1APass) {
                player1BPass = true; 
                switchPlayer("player1A");
                return;
            }
        }

        // check dealer
        if ( playerTurn == "dealer" ) {
            if (  packs[0].winCondition == null ) {
                rules (0, pl1point);
            } else if ( dealerWins[0] == null || ( dealerWins[0] == false && dlPoints < 22 ) ) {
                rules (0, pl1point); 
            }
            if ( totalPlayers == 2) { 
                if (  packs[1].winCondition == null ) {
                    rules (1, pl2point);
                } else if ( dealerWins[1] == null || ( dealerWins[1] == false && dlPoints < 22 ) ) {
                    rules (1, pl2point); 
                }
            };
        }           

        // check end of Player1A turn and shift to dealer
        if  ( totalPlayers == 1 && packs[0].winCondition != null ) {
            if ( pl1point > 21 ) {
                endGameVar = true;
                endGame();
                return
            }
            if ( firstTime && playerTurn != "dealer" ) {
                firstTime = false; 
                dealerTurnFunc(); 
                return
            }
            if ( dealerWins[0] != null ) {
                endGameVar = true;
                return
            }
        }

        if ( totalPlayers == 2 && ( packs[0].winCondition != null || player1APass ) && ( packs[1].winCondition != null || player1BPass ) ) {
            if ( pl1point > 21 && pl2point > 21) {
                endGameVar = true;
                endGame();
                return
            }
            if ( firstTime && playerTurn != "dealer" ) {
                firstTime = false; 
                dealerTurnFunc(); 
                return
            }
            if ( dealerWins[0] != null && dealerWins[1] != null ) {
                endGameVar = true;
                return
            }
        }
    };

    function rules (i , plPoints) {
        if ( playerTurn == "dealer" ) {
            if ( dealerBlackjack ) {
                if ( packs[i].blackjack ) { packs[i].winCondition = "deuce"; dealerWins[i] = "deuce"; return}
                else { packs[i].winCondition = false; dealerWins[i] = true; return }
            }
            if ( packs[i].winCondition == "giveup" ) { dealerWins[i] = true; return }
            if ( plPoints != 21 && dlPoints == 21) { packs[i].winCondition = false; dealerWins[i] = true; }
            if ( plPoints < 21 && dlPoints < 21 && plPoints < dlPoints  ) { packs[i].winCondition = false; dealerWins[i] = true;}
            if ( plPoints < 21 && dlPoints > 21 ) { packs[i].winCondition = true; dealerWins[i] = false; }
            if ( plPoints > 21 && dlPoints > 21 ) { packs[i].winCondition = false; dealerWins[i] = false; }
            if ( plPoints == dlPoints ) { packs[i].winCondition = "deuce"; dealerWins[i] = "deuce"; }
            if ( dlPoints > 21 ) { dealerWins[i] = false; }
        } else {
            if ( plPoints == 21) { packs[i].winCondition = true; return true; }
            if ( plPoints > 21 ) { packs[i].winCondition = false; return true; }
        }
        console.log(`rodando - rules ${i}`);
        console.log(`Player 1A - win: ${packs[0].winCondition} /  Pts - ${pl1point} pontos`);
        console.log(`Player 1B - win: ${packs[1].winCondition} / Pts - ${pl2point} pontos`);
        console.log(`Croupie - win/A: ${dealerWins[0]} / Pts - ${dlPoints} pontos`);
        console.log(`Croupie - win/B: ${dealerWins[1]} / Pts - ${dlPoints} pontos`);
        console.log(`Rodada de ${playerTurn}`)
        console.log("--------------------------------");
        return false;
    }

    // Function to announce end game
    function endGame () {  
        console.log("rodando Endgame");
        let text = `<a href="#" id="start">`;
        console.log(`BlackJack 1A: ${packs[0].blackjack}`);
        console.log(`BlackJack 1B: ${packs[1].blackjack}`);
        console.log(`BlackJack Dealer: ${dealerBlackjack}`);
        bet1A = 0;
        bet1B = 0;
        if ( totalPlayers == 1 ) {
            if  ( packs[0].winCondition == true ) { 
                // player 1A wins
                if ( packs[0].blackjack ) {
                    bet1A += ( packs[0].bet * 1.5 );
                    text += `Ganhou! $${( packs[0].bet * 1.5 )}`;
                } else {
                    bet1A += packs[0].bet;
                    text += `Ganhou! $${packs[0].bet}`;
                };
            } else if ( packs[0].winCondition == false ) {
                // player 1A lost
                text += `Perdeu!`;
                bet1A = 0;
                packs[0].bet = 0;
            } else if ( packs[0].winCondition == "deuce" ) {
                // player 1A deuce
                text += `Empate! +$0`;
                bet1A = 0;
            } else if ( packs[0].winCondition == "giveup" ) {
                // player 1A giveup
                text += `Desistiu! -$${packs[0].bet/2}`;
                bet1A = -( packs[0].bet / 2);
            }
        }

        if ( totalPlayers == 2 ) {
            if ( packs[1].winCondition == true ) {
                if ( packs[1].blackjack ) {
                    bet1B += ( packs[1].bet * 1.5 );
                    text += `Mesa 1: Ganhou $${( packs[1].bet)*1.5 }`;
                } else {
                    bet1B += packs[1].bet;
                    text += `Mesa 1: Ganhou $${packs[1].bet}`;
                };
            } else if ( packs[1].winCondition == false) {
                text += "Mesa 1: Perdeu";
                bet1B = 0;
                packs[1].bet = 0;
            } else if ( packs[1].winCondition == "deuce" ) {
                text += `Mesa 1: Empatou +$0`;
                bet1B = 0;
            } else if ( packs[1].winCondition == "giveup" ) {
                text += `Mesa 1: Desistiu -$${packs[1].bet/2}`;
                bet1B = -( packs[1].bet / 2);
            };
            text += "<br>";
            if ( packs[0].winCondition == true) {
                if ( packs[0].blackjack ) {
                    bet1A += ( packs[0].bet * 1.5 );
                    text += `Mesa 2: Ganhou! $${( packs[0].bet * 1.5 )}`;
                } else {
                    bet1A += packs[0].bet;
                    text += `Mesa 2: Ganhou! $${packs[0].bet}`;
                };
            } else if ( packs[0].winCondition == false ) {
                text += `Mesa 2: Perdeu`;
                bet1A = 0;
                packs[0].bet = 0;
            } else if ( packs[0].winCondition == "deuce" ) {
                text += `Mesa 2: Empatou +$0`;
                bet1A = 0;
            } else if ( packs[0].winCondition == "giveup" ) {
                text += `Mesa 2: Desistiu -$${packs[0].bet/2}`;
                bet1A = -( packs[0].bet / 2);
            };
        }

        text += `<br><span style="font-size: 16px;">Click para iniciar</span></a>`;
        
        $('.control').css( "display", "none" );
        setTimeout( function () {
            $('h2').html(text);
            if ( packs[0].winCondition == false ) {
                $('#bet1A').html(`$${packs[0].bet}`);
            } else if ( packs[0].winCondition == "giveup" ) {
                $('#bet1A').html(`$${packs[0].bet} <span style="font-size:14px;">-$${bet1A*(-1)}</span>`);
            } else {
                $('#bet1A').html(`$${packs[0].bet} <span style="font-size:14px;">+$${bet1A}</span>`);
            }
            if ( packs[1].winCondition == false ) {
                $('#bet1B').html(`$${packs[1].bet}`);
            } else if ( packs[1].winCondition == "giveup" ) {
                $('#bet1B').html(`$${packs[1].bet} <span style="font-size:14px;">-$${bet1B*(-1)}</span>`);
            } else {
                $('#bet1B').html(`$${packs[1].bet} <span style="font-size:14px;">+$${bet1B}</span>`);
            }
            console.log(`Player A - $${packs[0].bet}`);
            console.log(`Player A - Winning: ${packs[0].winCondition}`);
            console.log(`Croupie/A - Winning: ${dealerWins[0]}`);
            console.log(`Player B - $${packs[1].bet}`);
            console.log(`Player B - Winning: ${packs[1].winCondition}`);
            console.log(`Croupie/B - Winning: ${dealerWins[1]}`);
            console.log(`bet1A - $${bet1A}`);
            console.log(`bet1B - $${bet1B}`);
            console.log(`Total Player - $${playerCoins}`);
            console.log('--------------------------');
            playerCoins += ( packs[0].bet + bet1A + packs[1].bet + bet1B );
            $('#cash').html(`$${playerCoins}`);
            $('#start').one('click', function(event){
                event.preventDefault();
                playRoll(true);
            });
        }, 300 );
        if ( packs[0].blackjack ) {
            $('#player1AScore').html(`<strong>Blackjack</strong>`);
        } else {
            $('#player1AScore').html(`<strong>${pl1point} pontos</strong>`);
        }
        if ( packs[1].blackjack ) {
            $('#player1BScore').html(`<strong>Blackjack</strong>`);
        } else {
            $('#player1BScore').html(`<strong>${pl2point} pontos</strong>`);
        }
        if ( dealerBlackjack) {
            $('#dealerscore').html(`<strong>Blackjack</strong>`);
        } else {
            $('#dealerscore').html(`<strong>${dlPoints} pontos</strong>`);
        }
        
        return true;
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
            if (temp1 == temp2 && playerCoins > packs[0].bet ) {
                $('#btn1Asplit').css( "display", "inline-block" );
                $('#player1AControl').css( "display", "block" );
                $('#btn1Asplit').one('click', function () {
                    console.log(" ////// Dividiu ///////");
                    console.log(gameControl);
                    console.log("----------------------")
                    totalPlayers = 2 ;
                    packs[1].bet = packs[0].bet;
                    playerCoins -= packs[1].bet;
                    $('#cash').html(`$${playerCoins}`);
                    $('#player1BContent').css( "display", "block" );
                    $('#bet1B').css( "display", "block" );
                    $('#bet1B').html(`$${packs[1].bet}`);
                    $('#btn1Asplit').css( "display", "none" );
                    getBoardsPositions();
                    //remove card from pack1
                    removedCard = cardsArray[1][1].card;
                    console.log(removedCard);
                    delete gameControl.pack1.cards.card2
                    $('#p0card2').clone().appendTo("#player1Bpack");
                    $("#player1Bpack div").attr( "id", 'p1card1');
                    $('#p1card1').css("left","0px");
                    $('#p0card2').remove();
                    playBoardWidth = $('#playerboard').width();
                    $('#player1BContent').animate({ left: `${(playBoardWidth/2)-80}px` }, 500, 'swing' );
                    $('#bet1B').animate({ left: `${(playBoardWidth/2)-80}px` }, 500, 'swing' );
                    $('#bet1A').animate({ left: `${(playBoardWidth/2)+80}px` }, 550, 'swing' );
                    $('#player1AContent').animate({ left: `${(playBoardWidth/2)+80}px` }, 550, 'swing', getBoardsPositions );
                    // add card to pack2
                    gameControl["pack2"].cards = { 
                                card1: { card: removedCard, reveal: true }
                            };
                    $('bet1B').html(`$${packs[1].bet}`);
                    switchPlayer("player1B");
                    calcScore();
                    // Split with an "A"
                    // just one card for each Player and turn to Dealer
                    if ( temp1 == 1 ) {
                        playerCardFunc(true);
                        switchPlayer("player1A");
                        playerCardFunc(true);
                        switchPlayer("delaer");
                        calcScore()
                        setTimeout ( dealerTurnFunc(), 1000 );
                        return
                    }
                    
                });
            }
        }
    };
})();