const $gameBoard = $('<div>').addClass('game-board');
const $gameBoardEdge = $('<div>').addClass('game-board-edges');
const $spaceOffset = [];
const leftBound = 394;
const topBound = 255;
const rightBound = 772;
const bottomBound = 632;

class Player {
    constructor(playerSprite, keycodes, identifier) {
        this.playerSprite = $(`<div>${identifier}</div>`).addClass('player').addClass(playerSprite);
        this.leftKeyCode= keycodes[0];
        this.upKeyCode = keycodes[1]
        this.rightKeyCode = keycodes[2];
        this.downKeyCode = keycodes[3];
        this.score = 0;
        this.position = this.getCurrentPosition();
    }
    
    move() {
        $('body').on('keyup', (e) => {
            console.log(e.which);
            switch(e.which) {
                case this.leftKeyCode:
                    if(this.position.left >= leftBound) {
                        this.playerSprite.animate({left: '-=20'}, 100);
                    } 
                    break;
                case this.upKeyCode:
                    if(this.position.top >= topBound) {
                        this.playerSprite.animate({top: '-=20'}, 100);
                    } 
                    break;
                case this.rightKeyCode:
                    if(this.position.left <= rightBound) {
                    this.playerSprite.animate({left: '+=20'}, 100);
                    }
                    break;
                case this.downKeyCode:
                    if(this.position.top <= bottomBound) {
                        this.playerSprite.animate({top: '+=20'}, 100);
                    }
                    break;
            }
        });
    }
    
    getCurrentPosition() {
        window.setInterval(() => {
            let position = this.playerSprite.offset();
            return position;
        });
    }
}

class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
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

    addPlayersToBoard() {
        $('.start').eq(0).append(this.player1.playerSprite);
        $('.start').eq(1).append(this.player2.playerSprite);
    }

    allowPlayerMovement() {
        this.player1.move();
        this.player2.move();
        console.log(this.player1.position);
    }

    getPlayerCurrentPosition() {
        $('body').on('keyup', (e) => {
            console.log(this.player1.playerSprite.offset());
        });

    }

    // getPlayer1SpaceHistory() {
    //     let top = this.player1.position.top;
    //     let left = this.player1.position.left;
    //     let $player1History = $gameBoard
    //         .find(".active-space")
    //         .filter(function() {
    //             return $(this).offset().top === top
    //                 && $(this).offset().left === left;
    //         });
    //     console.log($player1History);
    // }

    getPlayer2SpaceHistory() {
        let top = this.player1TopOffset;
        let left = this.player1LeftOffset;
        let $player2History = $gameBoard
        .find(".active-space")
        .filter(function() {
            return $(this).offset().top === top
                && $(this).offset().left === left;
        }); 
        console.log($player2History); 
    }
}

const player1 = new Player('player-one', [65, 87, 68, 83], 1);
const player2 = new Player('player-two', [37, 38, 39, 40], 2);
const game = new Game(player1, player2);

game.createBoard(400);
game.addPlayersToBoard();
// game.allowPlayerMovement();
game.getPlayerCurrentPosition();
