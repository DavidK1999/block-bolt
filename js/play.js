const $gameBoard = $('<div>').addClass('game-board');
const $gameBoardEdge = $('<div>').addClass('game-board-edges');
const $spaceCooridnates = [];
const leftBound = 20;
const topBound = 20;
const rightBound = 360;
const bottomBound = 360;
const deadSpaceTrailDelay = 50;
const activeSpaceRestoreDelay = 1500;
const winningScore = 5;
let pointsOnBoard = [];

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
        //Adds the visual "bound" to contain the players
        $('body').append($gameBoardEdge);
        
        $gameBoardEdge.append($gameBoard);
        
        // Creates starting spaces for players
        $gameBoard.children('.active-space').eq(0).attr('class', 'start');
        $gameBoard.children('.active-space').eq(numberOfSpaces - 2).attr('class', 'start');
    }

    generatePoints(numberOfPoints) {
        for(let i = 0; i < numberOfPoints; i++) {
            let randomNumber = Math.floor(Math.random() * $('.active-space').length + 1);
            let coin = $('<div>(I)</div>').addClass('coin').attr('id', `coin${i}`);
            $('.active-space').eq(randomNumber).append(coin);
        }
    }

    replacePoint(pointID) {
        $(`#${pointID}`).remove();
        let randomNumber = Math.floor(Math.random() * $('.active-space').length + 1);
        let coin = $('<div>(I)</div>').addClass('coin').attr('id', pointID);
        $('.active-space').eq(randomNumber).append(coin);
    }

    getSpaceCoordinates() {
        // Useful for getting bound information
        let $spaces = $gameBoard.children('.active-space');
        for(let i = 0; i < $spaces.length; i++) {
            $spaceCooridnates.push($spaces.eq(i).position());
        }
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
        setInterval(() => {
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
        
        $player1PreviousSpace.animate({backgroundColor: 'black'}, deadSpaceTrailDelay, "linear");
        setTimeout(() => {
            $player1PreviousSpace.addClass('dead-space');
            if($('.player-one').parent().hasClass('dead-space')) $(".player-one").remove()
        }, deadSpaceTrailDelay);
        $player1PreviousSpace.animate({backgroundColor: '#646464'}, activeSpaceRestoreDelay, "linear", () => $player1PreviousSpace.removeClass('dead-space'));
    }
    
    generatePlayer2Trail(top, left) {
        let $player2PreviousSpace = $gameBoard
            .find(".active-space")
            .filter(function() {
                return $(this).position().top === top
                    && $(this).position().left === left;
            });
        
        // if(this.player2.playerSprite.siblings().hasClass('coin')) {
        //     $('.coin').remove();
        //     this.generateCoins();
        //     return this.player2.score ++;
        // }
        
        $player2PreviousSpace.animate({backgroundColor: 'black'}, deadSpaceTrailDelay, "linear");
        setTimeout(() => {
            $player2PreviousSpace.addClass('dead-space');
            if($('.player-two').parent().hasClass('dead-space')) $(".player-two").remove();
        }, deadSpaceTrailDelay);
        $player2PreviousSpace.animate({backgroundColor: '#646464'}, activeSpaceRestoreDelay, "linear", () => $player2PreviousSpace.removeClass('dead-space'));
    }

    checkPointCollision(player1, player2) {
        if(player1.siblings().hasClass('coin')) {
            this.replacePoint(player1.siblings().attr('id'));
            return this.player1.score++;
        }
        
        // if(player2.siblings().hasClass('coin')) {
        //     $('.coin').remove();
        //     this.generatePoints();
        //     return this.player2.score++;
        // }
    }

    displayPlayerScore() {
        window.setInterval(() => {
            $('.player-one-score').text(`Player 1 : ${this.player1.score}`);
            $('.player-two-score').text(`Player 2 : ${this.player2.score}`);
        });
    }

    checkForWin() {
        if(this.player1.score === winningScore) alert('Player 1 Wins');
        if(this.player2.score === winningScore) alert('Player 2 Wins');
    }
    start() {
        $gameBoardEdge.empty();
        $gameBoard.empty();
        game.createBoard(400);
        game.getSpaceCoordinates();
        game.addPlayersToBoard();
        game.allowMovement();
        game.getPlayerPreviousPositions();
        game.generatePoints(3);
        game.displayPlayerScore();
        game.checkForWin();
        console.log(pointsOnBoard);
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
const player1 = new Player('player-one', [65, 87, 68, 83], 1);
const player2 = new Player('player-two', [37, 38, 39, 40], 2);
const game = new Game(player1, player2);
$(() => {
game.start();
});