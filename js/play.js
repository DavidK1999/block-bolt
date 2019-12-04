const $gameBoard = $('<div>').addClass('game-board');
const $blockOffset = [];


class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
    }

    createBoard(numberOfSpaces) {
        for(let i = 0; i < numberOfSpaces; i++) {
            let $activeSpace = $('<div>').addClass('active-space');
            $gameBoard.append($activeSpace);
        }
        $('body').append($gameBoard);
        $gameBoard.children('.active-space').eq(0).attr('class', 'start');
        $gameBoard.children('.active-space').eq(numberOfSpaces - 2).attr('class', 'start');
    }

    getSpacePositions() {
        let $blocks = $gameBoard.children('.active-space');
        for(let i = 0; i < $blocks.length; i++) {
            $blockOffset.push($blocks.eq(i).offset());
        }
    }

    addPlayersToBoard() {
        $('.start').eq(0).append(this.player1.playerSprite);
        $('.start').eq(1).append(this.player2.playerSprite);
    }

    allowMovement() {
        this.player1.move();
        this.player2.move();
    }

    getPlayerPositions() {
        window.setInterval(() => {
            this.generatePlayer1Trail(this.player1.getCurrentPosition().top, this.player1.getCurrentPosition().left);
            this.generatePlayer2Trail(this.player2.getCurrentPosition().top, this.player2.getCurrentPosition().left);
        });
    }

    generatePlayer1Trail(top, left) {
        let $player1CurrentSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).offset().top === top
                    && $(this).offset().left === left;
            });
        $player1CurrentSpace.append(this.player1.playerSprite);
        if($('.player-one').parent().hasClass('dead-space')) {
            $(".player-one").remove();
        };
        $player1CurrentSpace.animate({backgroundColor: 'black'}, 1000);
        setTimeout(() => {
            $player1CurrentSpace.addClass('dead-space');
        }, 800)
    }
    
    generatePlayer2Trail(top, left) {
        let $player2CurrentSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).offset().top === top
                    && $(this).offset().left === left;
            });
        $player2CurrentSpace.append(this.player2.playerSprite);
        if($('.player-two').parent().hasClass('dead-space')) {
            $(".player-two").remove();
        };
        $player2CurrentSpace.animate({backgroundColor: 'black'}, 1000);
        setTimeout(() => {
            $player2CurrentSpace.addClass('dead-space');
        }, 800)
    }
}

class Player {
    constructor(playerSprite, keycodes, identifier) {
        this.playerSprite = $(`<div>${identifier}</div>`).addClass('player').addClass(playerSprite);
        this.leftKeyCode= keycodes[0];
        this.upKeyCode = keycodes[1]
        this.rightKeyCode = keycodes[2];
        this.downKeyCode = keycodes[3];
    }

    move() {
        $('body').on('keyup', (e) => {
            console.log(e.which);
            switch(e.which) {
                case this.leftKeyCode:
                    this.playerSprite.animate({left: '-=20'}, 100);
                    break;
                case this.upKeyCode:
                    this.playerSprite.animate({top: '-=20'}, 100);
                    break;
                case this.rightKeyCode:
                    this.playerSprite.animate({left: '+=20'}, 100);
                    break;
                case this.downKeyCode:
                    this.playerSprite.animate({top: '+=20'}, 100);
                    break;
            }
        });
    }

    getCurrentPosition() {
        return this.playerSprite.offset();
    }
}

const player1 = new Player('player-one', [65, 87, 68, 83], 1);
const player2 = new Player('player-two', [37, 38, 39, 40], 2);
const game = new Game(player1, player2);
game.createBoard(400);
game.getSpacePositions();
game.addPlayersToBoard();
game.allowMovement();
game.getPlayerPositions();
console.log($('.start'));
