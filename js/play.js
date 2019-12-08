const $gameBoard = $('<div>').addClass('game-board');
const $gameBoardEdge = $('<div>').addClass('game-board-edges');
const $spaceOffset = [];
let $player1History = [];
const leftBound = 20;
const topBound = 20;
const rightBound = 360;
const bottomBound = 360;

class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.gameActive = false;
    }

    createBoard(numberOfSpaces) {
        for(let i = 0; i < numberOfSpaces; i++) {
            let $activeSpace = $('<div>').addClass('active-space').attr('id', i);
            $gameBoard.append($activeSpace);
        }
        $('body').append($gameBoardEdge);
        $gameBoardEdge.append($gameBoard);
        $gameBoard.children('.active-space').eq(0).attr('class', 'start');
        $gameBoard.children('.active-space').eq(numberOfSpaces - 2).attr('class', 'start');
    }

    getSpacePositions() {
        let $blocks = $gameBoard.children('.active-space');
        for(let i = 0; i < $blocks.length; i++) {
            $spaceOffset.push($blocks.eq(i).offset());
        }
    }

    addPlayersToBoard() {
        $('.start').eq(0).append(this.player1.playerSprite);
        $('.start').eq(1).append(this.player2.playerSprite);
        this.getPositions();
    }

    allowMovement() {
        this.player1.move();
        this.player2.move();
    }

    getPositions() {
        window.setInterval(() => {
            let top1 = this.player1.getCurrentPosition().top;
            let left1 = this.player1.getCurrentPosition().left;

            let top2 = this.player2.getCurrentPosition().top;
            let left2 = this.player2.getCurrentPosition().left;
            
            this.appendToPresent(top1, left1, top2, left2)
        });
    }

    appendToPresent(top1, left1, top2, left2) {
        let $player1CurrentSpace = $gameBoard
            .find('.active-space')
            .filter(function() {
                return $(this).position().top === top1
                    && $(this).position().left === left1;
            });

            this.player1.playerSprite.appendTo($player1CurrentSpace);

        let $player2CurrentSpace = $gameBoard
            .find('.active-space')
            .filter(function() {
            return $(this).position().top === top2
                && $(this).position().left === left2;
            });

            this.player2.playerSprite.appendTo($player2CurrentSpace);
    }

    getPlayerPositions() {
        $('body').on('keyup', (e) => {
            if(e.which == 65 ||  e.which == 87 || e.which == 68 || e.which == 83) {
                this.generatePlayer1Trail(this.player1.getCurrentPosition().top, this.player1.getCurrentPosition().left);
            } else {
                this.generatePlayer2Trail(this.player2.getCurrentPosition().top, this.player2.getCurrentPosition().left);
            }
        });
    }

    generateCoins() {
        let randomNumber = Math.floor(Math.random() * $('.active-space').length + 1);
        let coin = $('<div>(I)</div>').addClass('coin');
        $('.active-space').eq(randomNumber).append(coin).animate({backgroundColor: '#646464'}, 900);
    }
    
    generatePlayer1Trail(top, left) {
        let $player1CurrentSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).position().top === top
                    && $(this).position().left === left;
            });
            
        let restore = $player1CurrentSpace.get(0);
            
        if(this.player1.playerSprite.siblings().hasClass('coin')) {
            $('.coin').remove();
            this.generateCoins();
            return this.player1.score++;
        }
        
        $(restore).animate({backgroundColor: 'black'}, 5000);
        setTimeout(() => {
            $(restore).attr('class','dead-space');
            if($('.player-one').parent().hasClass('dead-space')) {
                $('.player-one').remove()
                this.player2.score ++;
                game.start();
            }
        }, 215);
        
        $(restore).animate({backgroundColor: '#646464'}, 3000);
        window.setTimeout(() => {
            $(restore).attr('class', 'active-space');
        }, 2999);


        // if($('.player-one').parent().hasClass('dead-space')) {
        //     $(".player-one").remove();
        //     this.player2.score += 1;
        //     window.setTimeout(() => {
        //         window.alert('Player 2 wins');
        //     }, 500);
        //     this.reset();
        // };
    }
    
    generatePlayer2Trail(top, left) {
        let $player2CurrentSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).position().top === top
                    && $(this).position().left === left;
            });
        
        let restore = $player2CurrentSpace.get(0);

        if(this.player2.playerSprite.siblings().hasClass('coin')) {
            $('.coin').remove();
            this.generateCoins();
            return this.player2.score ++;
        }
        
        $(restore).animate({backgroundColor: 'black'}, 5000);
        setTimeout(() => {
            $(restore).attr('class','dead-space');
            if($('.player-two').parent().hasClass('dead-space')) {
                $(".player-two").remove();
            }
        }, 215);
        
        $(restore).animate({backgroundColor: '#646464'}, 3000);
        setTimeout(() => {
            $(restore).attr('class', 'active-space');
        }, 2999);
    }

    playerScore() {
        window.setInterval(() => {
            $('.player-one-score').text(`Player 1: ${this.player1.score}`);
            $('.player-two-score').text(`Player 2: ${this.player2.score}`);
        });
    
    }

    reset() {
        window.setTimeout(() => {
            $gameBoardEdge.remove();
            $gameBoard.remove();
            location.reload();

        }, 500);
    }

    start() {
        $gameBoardEdge.empty();
        $gameBoard.empty();
        game.createBoard(400);
        game.addPlayersToBoard();
        game.getSpacePositions();
        game.allowMovement();
        game.getPlayerPositions();
        game.generateCoins();
        game.playerScore();
    };
}



class Player {
    constructor(playerSprite, keycodes, identifier) {
        this.playerSprite = $(`<div>${identifier}</div>`).addClass('player').addClass(playerSprite);
        this.leftKeyCode= keycodes[0];
        this.upKeyCode = keycodes[1]
        this.rightKeyCode = keycodes[2];
        this.downKeyCode = keycodes[3];
        this.score = 0;
    }

    move() {
            $('body').on('keyup', (e) => {
                switch(e.which) {
                    case this.leftKeyCode:
                        if(this.getCurrentPosition().left >= leftBound) {
                            this.playerSprite.animate({left: '-=20'}, 75);
                        } 
                        break;
                    case this.upKeyCode:
                        if(this.getCurrentPosition().top >= topBound) {
                            this.playerSprite.animate({top: '-=20'}, 75);
                        } 
                        break;
                    case this.rightKeyCode:
                        if(this.getCurrentPosition().left <= rightBound) {
                        this.playerSprite.animate({left: '+=20'}, 75);
                        }
                        break;
                    case this.downKeyCode:
                        if(this.getCurrentPosition().top <= bottomBound) {
                            this.playerSprite.animate({top: '+=20'}, 75);
                        }
                        break;
                }
            });
        }

    getCurrentPosition() {
        return this.playerSprite.position();
    }
}

const player1 = new Player('player-one', [65, 87, 68, 83], 1);
const player2 = new Player('player-two', [37, 38, 39, 40], 2);
const game = new Game(player1, player2);


// $('body').on('keyup', (e)  => {
//     if(e.which == 65 ||  e.which == 87 || e.which == 68 || e.which == 83) {
//         console.log('Hi');
//     } else {
//         console.log('Yo');
//     }
// });

$(() => {
game.start();
});