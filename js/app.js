const $gameBoard = $('.game-board');

class Game {
    constructor() {

    }

    createBoard(x) {
        for(let i = 0; i < x; i++) {
            let $block = $('<div>').addClass('block').attr('id', i); 
            $gameBoard.append($block);
        }
    }

    addPlayersToBoard(player) {
        $('#1').append(player.sprite);

    }
}

class Player {
    constructor(sprite, controls, keycodes) {
        this.sprite = sprite;
    }

    moveDown() {
        this.sprite.animate({top: '+=52'}, 100);
        console.log('Down');    
    }

    moveUp() {
        this.sprite.animate({top: '-=52'}, 100);
        console.log('Down');
    }

    moveRight() {
        this.sprite.animate({left: '+=52'}, 100);
        console.log('Right');   

    }

    moveLeft() {
        this.sprite.animate({left: '-=52'}, 100);
        console.log('Right');
    }


}

class Player1 extends Player {
    constructor(sprite) {
        super(sprite);
        this.sprite = $('<div>').addClass('player-one');
    }

    getInput() {
        $('body').on('keypress', (e) => {
            console.log(e.which)
            //A is keycode 97
            // S is keycode 115
            // D is keycode 100
            // W is keycode 119
            switch(e.which) {
                case 97:
                    this.moveLeft();
                    break;
                case 115:
                    this.moveDown();
                    break;
                case 100:
                    this.moveRight();
                    break;
                case 119:
                   this.moveUp();
                    break;
                default:
                    console.log('Ruh roh');
            }
        });
    }
}

class Player2 extends Player {
    constructor(sprite) {
        super(sprite);
        this.sprite = $('<div>').addClass('player-two');
    }

    getInput() {
        $('body').on('keydown', (e) => {
            console.log(e.which)
            //<- is keycode 37
            // ^ is keycode 38
            // -> is keycode 39
            // v is keycode 40
            switch(e.which) {
                case 37:
                    this.moveLeft();
                    break;
                case 40:
                    this.moveDown();
                    break;
                case 39:
                    this.moveRight();
                    break;
                case 38:
                   this.moveUp();
                    break;
                default:
                    console.log('Ruh roh');
            }
        });
    }
}



$(() => {
    const game = new Game();
    const player1 = new Player1();
    const player2 = new Player2();
    game.createBoard(100);
    game.addPlayersToBoard(player1);
    game.addPlayersToBoard(player2);
    player1.getInput();
    player2.getInput();
});

