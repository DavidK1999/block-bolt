const gameBoard = document.createElement('div').classList.add('game-board');
const gameBoardEdge = document.createElement('div').classList.add('game-board-edges');
const body = document.getElementsByTagName('body')[0];
const $spaceCooridnates = [];
const leftBound = 20;
const topBound = 20;
const rightBound = 360;
const bottomBound = 360;
const deadSpaceTrailDelay = 50;
const activeSpaceRestoreDelay = 1500;
const respawnTime = 2000;
let spawnLimits;
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
            let activeSpace = document.createElement('div').classList.add('active-space');
            gameBoard.append(activeSpace);
        }
        //Adds the visual "bound" to contain the players
        bpdy.append(gameBoardEdge);
        
        gameBoardEdge.append(gameBoard);
        
        // Creates starting spaces for players
        gameBoard.children('.active-space')[0].setAttribute('class', 'start');
        gameBoard.children('.active-space')[numberOfSpaces - 2].setAttribute('class', 'start');
    }

    generatePoints(numberOfPoints) {
        for(let i = 0; i < numberOfPoints; i++) {
            let point = document.createElement('div').classList.add('point').setAttribute('id', i);

            spawnLimits = gameBoard
            .childNodes(".active-space")
            .filter(function() {
                return $(this).offsetTop > topBound
                    && $(this).offsetTop( < bottomBound
                    && $(this).offsetParent().left > leftBound
                    && $(this).offsetParent().left < rightBound;
            });
            let randomNumber = Math.floor(Math.random() * spawnLimits.length + 1);
            spawnLimits.eq(randomNumber).append(point);
        }
    }

    replacePoint(pointID) {
        // Gets the id of the point touched by player and replaces it somewhere else on the board
        $(`#${pointID}`).remove();
        let randomNumber = Math.floor(Math.random() * (spawnLimits.length + 1));
        let point = $('<div>').addClass('point').attr('id', pointID);
        setTimeout(() => {spawnLimits.eq(randomNumber).append(point)}, 10);
    }

    getSpaceCoordinates() {
        // Useful for getting bound information
        let $spaces = $gameBoard.children('.active-space');
        for(let i = 0; i < $spaces.length; i++) { $spaceCooridnates.push($spaces.eq(i).position());}
    }

    addPlayersToBoard() {
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
            let top1 = this.player1.getCurrentPosition().top;
            let left1 = this.player1.getCurrentPosition().left;
            let top2 = this.player2.getCurrentPosition().top;
            let left2 = this.player2.getCurrentPosition().left;
            this.appendPlayerBasedOnCurrentPosition(top1, left1, top2, left2)
        });
    }

    appendPlayerBasedOnCurrentPosition(top1, left1, top2, left2) {
        let $player1CurrentSpace = this.filteredSpace('.active-space', top1, left1);
        this.player1.playerSprite.appendTo($player1CurrentSpace);
        let $player2CurrentSpace = this.filteredSpace('.active-space', top2, left2);
        this.player2.playerSprite.appendTo($player2CurrentSpace);
        this.checkPointCollision(this.player1.playerSprite, this.player2.playerSprite);
    }

    getPlayerPreviousPositions() {
        // Gets the player previous space as this information is updated when the player presses the key, not after they have been animated a direction
        $('body').on('keyup', (e) => {
            if(e.which == 65 || e.which == 87 || e.which == 68 || e.which == 83) {
                this.generatePlayer1Trail(this.player1.getCurrentPosition().top, this.player1.getCurrentPosition().left);
            } else if(e.which === 37 || e.which ===  38 || e.which ===  39 || e.which ===  40) {
                this.generatePlayer2Trail(this.player2.getCurrentPosition().top, this.player2.getCurrentPosition().left);
            }
        });
    }
    
    generatePlayer1Trail(top, left) {
        let $player1PreviousSpace = this.filteredSpace('.active-space', top, left);
        this.animateTrail(this.player1, $player1PreviousSpace, 'white', deadSpaceTrailDelay, 'linear', 'dead-space');
        this.restoreTrail($player1PreviousSpace, 'black', activeSpaceRestoreDelay, 'linear', 'dead-space');
    }
    
    generatePlayer2Trail(top, left) {
        let $player2PreviousSpace = this.filteredSpace('.active-space', top, left);
        this.animateTrail(this.player2, $player2PreviousSpace, 'white', deadSpaceTrailDelay, 'linear', 'dead-space');
        this.restoreTrail($player2PreviousSpace, 'black', activeSpaceRestoreDelay, 'linear', 'dead-space');
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

    animateTrail(player, trailingSpace, trailColor, delay, easing, trailingSpaceClass) {
        trailingSpace.animate({backgroundColor: trailColor}, delay ,easing);
        setTimeout(() => {
            trailingSpace.addClass(trailingSpaceClass) ;
            this.checkPlayerRemoval(player)}, delay);
    }

    checkPlayerRemoval(player) {
        if(player.playerSprite.parent().hasClass('dead-space')) {
            $('audio')[1].play();
            player.playerSprite.remove();
            setTimeout(() => {player === this.player1 ? this.respawnPlayer1() : this.respawnPlayer2()}, respawnTime);
        }
    }
    
    restoreTrail(trailingSpace, trailColor, delay, easing, trailingSpaceClass) {
        trailingSpace.animate({backgroundColor: trailColor}, delay ,easing);
        setTimeout(() => {trailingSpace.removeClass(trailingSpaceClass)}, delay);
    }

    filteredSpace(spacesToBeFiltered, top, left) {
        let filteredSpace = $gameBoard
            .find(`${spacesToBeFiltered}`)
            .filter(function() {
                return $(this).position().top === top
                    && $(this).position().left === left;
            });

            return filteredSpace;
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
        game.generatePoints(5);
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
const game = new Game();
    $('audio')[0].play();
    game.start();
