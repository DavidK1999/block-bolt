const $gameBoard = $('<div>').addClass('game-board');
const $gameBoardEdge = $('<div>').addClass('game-board-edges');
const $spaceOffset = [];
let $player1History = [];
const leftBound = 394;
const topBound = 255;
const rightBound = 772;
const bottomBound = 632;

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
    }

    allowMovement() {
        this.player1.move();
        this.player2.move();
    }
    

    getPlayerPositions() {
        if(this.gameActive === true) {
            $('body').on('keyup', (e) => {
                this.generatePlayer1Trail(this.player1.getCurrentPosition().top, this.player1.getCurrentPosition().left);
                this.generatePlayer2Trail(this.player2.getCurrentPosition().top, this.player2.getCurrentPosition().left);
            });
        }
    }

    generatePlayer1Trail(top, left) {
        console.log(top);
        console.log(left);
        let $player1CurrentSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).offset().top === top
                    && $(this).offset().left === left;
            });
            let restore = $player1CurrentSpace.get(0);
            console.log(restore);
            console.log($player1CurrentSpace);
            // $player1History.push($player1CurrentSpace.get(0));
            // console.log($player1History);
        $player1CurrentSpace.append(this.player1.playerSprite);
        if($('.player-one').parent().hasClass('dead-space')) {
            $(".player-one").remove();
            this.player2.score += 1;
            window.setTimeout(() => {
                window.alert('Player 2 wins');
            }, 500);
            this.reset();
        };
        $player1CurrentSpace.animate({backgroundColor: 'black'}, 1000);
        setTimeout(() => {
            $player1CurrentSpace.addClass('dead-space');
        }, 800);

        $(restore).animate({backgroundColor: '#646464'}, 1100);
        setTimeout(() => {
            $(restore).remove('dead-space');
            $(restore).addClass('active-space');
        }, 800);
    }
    
    generatePlayer2Trail(top, left) {
        console.log(top);
        console.log(left);
        let $player2CurrentSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).offset().top === top
                    && $(this).offset().left === left;
            });
            let restore = $player2CurrentSpace.get(0);
            console.log(restore);
            console.log($player2CurrentSpace);
            // $player1History.push($player1CurrentSpace.get(0));
            // console.log($player1History);
        $player2CurrentSpace.append(this.player2.playerSprite);
        if($('.player-two').parent().hasClass('dead-space')) {
            $(".player-two").remove();
            this.player1.score += 1;
            window.setTimeout(() => {
                window.alert('Player 1 wins');
            }, 500);
            this.reset();
        };
        $player2CurrentSpace.animate({backgroundColor: 'black'}, 1000);
        setTimeout(() => {
            $player2CurrentSpace.addClass('dead-space');
        }, 800);

        $(restore).animate({backgroundColor: '#646464'}, 1100);
        setTimeout(() => {
            $(restore).remove('dead-space');
            $(restore).addClass('active-space');
        }, 800);
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
        this.gameActive = true;
        game.createBoard(400);
        game.addPlayersToBoard();
        game.getSpacePositions();
        game.allowMovement();
        game.getPlayerPositions();
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
                console.log(e.which);
                switch(e.which) {
                    case this.leftKeyCode:
                        if(this.getCurrentPosition().left >= leftBound) {
                            this.playerSprite.animate({left: '-=20'}, 100);
                        } 
                        break;
                    case this.upKeyCode:
                        if(this.getCurrentPosition().top >= topBound) {
                            this.playerSprite.animate({top: '-=20'}, 100);
                        } 
                        break;
                    case this.rightKeyCode:
                        if(this.getCurrentPosition().left <= rightBound) {
                        this.playerSprite.animate({left: '+=20'}, 100);
                        }
                        break;
                    case this.downKeyCode:
                        if(this.getCurrentPosition().top <= bottomBound) {
                            this.playerSprite.animate({top: '+=20'}, 100);
                        }
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
game.start();