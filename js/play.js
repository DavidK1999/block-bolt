const $gameBoard = $('<div>').addClass('game-board');
const $gameBoardEdge = $('<div>').addClass('game-board-edges');
const $spaceCooridnates = [];
const leftBound = 20;
const topBound = 20;
const rightBound = 360;
const bottomBound = 360;
const deadSpaceTrailDelay = 50;
const activeSpaceRestoreDelay = 1500;
const respawnTime = 2000;
let pointsOnBoard = [];

class Game {
    constructor() {
        this.player1;
        this.player2;
        this.player1Score = 0;
        this.player2Score = 0;
        this.winScore = 10;
    }

    createPlayers() {
        this.player1= new Player('player-one', [65, 87, 68, 83], 1);
        this.player2 = new Player('player-two', [37, 38, 39, 40], 2);
    }

    createBoard(numberOfSpaces) {
        for(let i = 0; i < numberOfSpaces; i++) {
            let $activeSpace = $('<div>').addClass('active-space').attr('id', i);
            $gameBoard.append($activeSpace);
        }
        //Adds the visual "bound" to contain the players
        $('body').append($gameBoardEdge);
        
        $gameBoardEdge.append($gameBoard);
        
        // Creates starting spaces for players
        $gameBoard.children('.active-space').eq(0).attr('class', 'start');
        $gameBoard.children('.active-space').eq(numberOfSpaces - 2).attr('class', 'start');
    }

    generatePoints(numberOfPoints) {
        for(let i = 0; i < numberOfPoints; i++) {
            let point = $('<div>').addClass('point').attr('id', `point${i}`);

            let spawnLimits = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).position().top >= topBound
                    && $(this).position().top <= bottomBound
                    && $(this).position().left >= leftBound
                    && $(this).position().left <= rightBound;
            });
            let randomNumber = Math.floor(Math.random() * spawnLimits.length + 1);
            spawnLimits.eq(randomNumber).append(point);
        }
    }

    replacePoint(pointID) {
        // Gets the id of the point touched by player and replaces it somewhere else on the board
        $(`#${pointID}`).remove();
        let randomNumber = Math.floor(Math.random() * $('.active-space').length + 1);
        let point = $('<div>').addClass('point').attr('id', pointID);
        setTimeout(() => {$('.active-space').eq(randomNumber).append(point)}, 10);
    }

    getSpaceCoordinates() {
        // Useful for getting bound information
        let $spaces = $gameBoard.children('.active-space');
        for(let i = 0; i < $spaces.length; i++) {
            $spaceCooridnates.push($spaces.eq(i).position());
        }
    }

    addPlayersToBoard() {
        console.log(this.player1);
        $('.start').eq(0).append(this.player1.playerSprite);
        $('.start').eq(1).append(this.player2.playerSprite);
        
        //Gets Player Current Positions after they have been added to the board
        this.getPlayerCurrentPositions();
    }
    
    allowMovement() {
        this.player1.move();
        this.player2.move();
    }

    getPlayerCurrentPositions() {
        return window.setInterval(() => {
            //Player One Current Positions
            let top1 = this.player1.getCurrentPosition().top;
            let left1 = this.player1.getCurrentPosition().left;
            //Player Two Current Positions
            let top2 = this.player2.getCurrentPosition().top;
            let left2 = this.player2.getCurrentPosition().left;
            
            this.appendPlayerBasedOnCurrentPosition(top1, left1, top2, left2)
        });
    }

    appendPlayerBasedOnCurrentPosition(top1, left1, top2, left2) {
        // Filters for the space that matches the players current position after they have been animated a direction
        let $player1CurrentSpace = $gameBoard
            .find('.active-space')
            .filter(function() {
                return $(this).position().top === top1
                    && $(this).position().left === left1;
            });
            // Appends the player to that space 

            this.player1.playerSprite.appendTo($player1CurrentSpace);
            

        let $player2CurrentSpace = $gameBoard
            .find('.active-space')
            .filter(function() {
            return $(this).position().top === top2
                && $(this).position().left === left2;
            });

            this.player2.playerSprite.appendTo($player2CurrentSpace);
            
            this.checkPointCollision(this.player1.playerSprite, this.player2.playerSprite);
    }

    getPlayerPreviousPositions() {
        // Gets the player previous space as this information is updated when the player presses the key, not after they have been animated a direction
        $('body').on('keyup', (e) => {
            if(e.which == 65 ||  e.which == 87 || e.which == 68 || e.which == 83) {
                this.generatePlayer1Trail(this.player1.getCurrentPosition().top, this.player1.getCurrentPosition().left);
            } else {
                this.generatePlayer2Trail(this.player2.getCurrentPosition().top, this.player2.getCurrentPosition().left);
            }
        });
    }
    
    generatePlayer1Trail(top, left) {
        // Filters for spaces that are not yet "dead spaces" and that are based on the players previous positions
        let $player1PreviousSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).position().top === top
                    && $(this).position().left === left;
            });

        // Animates the previous spaces black to denote a dead space. A delay is added to then allow the player to move to the next space 
        // before being polled for it's position more than once. After this, the previous space is then given the "dead-space" class
        // Animation and class delay is the same to let the player know when it is safe to move back onto a space
        
        $player1PreviousSpace.animate({backgroundColor: `white`}, deadSpaceTrailDelay, "linear");
        setTimeout(() => {
            $player1PreviousSpace.addClass('dead-space');
            if($('.player-one').parent().hasClass('dead-space')) {
                $('audio')[1].play();
                this.player1.playerSprite.remove();
                setTimeout(() => {this.respawnPlayer1()}, respawnTime);
            }
        }, deadSpaceTrailDelay);
        $player1PreviousSpace.animate({backgroundColor: 'black'}, activeSpaceRestoreDelay, "linear", () => $player1PreviousSpace.removeClass('dead-space'));
    }
    
    generatePlayer2Trail(top, left) {
        console.log(top);
        console.log(left);
        let $player2PreviousSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).position().top === top
                    && $(this).position().left === left;
            });

    $player2PreviousSpace.animate({backgroundColor: `white`}, deadSpaceTrailDelay, "linear");
        setTimeout(() => {
            $player2PreviousSpace.addClass('dead-space');
            if($('.player-two').parent().hasClass('dead-space')) {
                $('audio')[1].play();
                console.log('Dead');
                this.player2.playerSprite.remove();
                setTimeout(() => {this.respawnPlayer2()}, respawnTime);
            }
        }, deadSpaceTrailDelay);
        $player2PreviousSpace.animate({backgroundColor: 'black'}, activeSpaceRestoreDelay, "linear", () => $player2PreviousSpace.removeClass('dead-space'));
    }

    respawnPlayer1() {
        this.player1 = new Player('player-one', [65, 87, 68, 83], 1);
        this.player1.playerSprite.appendTo('#0');
        this.player1.playerSprite.position();
        this.player1.move();
    }
    
    respawnPlayer2() {
        this.player2.playerSprite.remove();
        this.player2 = new Player('player-two', [37, 38, 39, 40], 2);
        this.player2.playerSprite.appendTo('#399');
        this.player2.playerSprite.position();
        this.player2.move();
    }

    checkPointCollision(player1, player2) {
        if($('.player').siblings().hasClass('point')) {
            $('audio')[2].play();
        };


        if(player1.siblings().hasClass('point')) {
            this.replacePoint(player1.siblings().attr('id'));
            this.player1Score++;
            this.checkForWin();
        }
        
        if(player2.siblings().hasClass('point')) {
            this.replacePoint(player2.siblings().attr('id'));
            this.player2Score++;
            this.checkForWin();
        }
    }

    displayPlayerScore() {
        window.setInterval(() => {
            $('.player-one-score').text(`Player 1 : ${this.player1Score}`);
            $('.player-two-score').text(`Player 2 : ${this.player2Score}`);
        });
    }

    checkForWin() {
        setTimeout(() => {
            if(this.player1Score === this.winScore) {
                alert('Player 1 Wins');
                location.reload();
            }
            if(this.player2Score === this.winScore) {
                alert('Player 2 Wins');
                location.reload();
            }
        }, 500);
    }
    updateColors() {
        window.setInterval(() => {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            $gameBoardEdge.animate({backgroundColor: `rgb(${r}, ${g}, ${b})`});
            $('.start').animate({backgroundColor: `rgb(${r}, ${g}, ${b})`});
            $('.point').animate({backgroundColor: `rgb(${r}, ${g}, ${b})`});
        }, 1000);
    }

    start() {
        game.createPlayers();
        game.createBoard(400);
        this.addPlayersToBoard();
        game.getSpaceCoordinates();
        game.allowMovement();
        game.getPlayerPreviousPositions();
        game.generatePoints(6);
        game.displayPlayerScore();
        game.updateColors();
        game.checkForWin();
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
        this.identifier = identifier;
    }

    move() {
        $('body').on('keyup', (e) => {
            switch(e.which) {
                case this.leftKeyCode:
                    if(this.getCurrentPosition().left >= leftBound) this.playerSprite.animate({left: '-=20'}, deadSpaceTrailDelay);
                    break;
                case this.upKeyCode:
                    if(this.getCurrentPosition().top >= topBound) this.playerSprite.animate({top: '-=20'}, deadSpaceTrailDelay);
                    break;
                case this.rightKeyCode:
                    if(this.getCurrentPosition().left <= rightBound) this.playerSprite.animate({left: '+=20'}, deadSpaceTrailDelay);
                    break;
                case this.downKeyCode:
                    if(this.getCurrentPosition().top <= bottomBound) this.playerSprite.animate({top: '+=20'}, deadSpaceTrailDelay);
                    break;
            }
        });
    }

    getCurrentPosition() {
        return this.playerSprite.position();
    }
}
// const player1 = new Player('player-one', [65, 87, 68, 83], 1);
// const player2 = new Player('player-two', [37, 38, 39, 40], 2);
const game = new Game();
$(() => {
    $('audio')[0].play();
    game.start();
});