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
    constructor() {
        this.sprite;
        this.controls;
    }

    move() {
        $(event.target).css("transform","translate(52px,0)");
    }
}

class Player1 extends Player {
    constructor(sprite, controls) {
        super(sprite,controls);
        this.sprite = $('<div>').addClass('player-one');
        this.controls = ['W','A','S','D'];
    }

    input() {
        $('body').on('keypress', (e) => {
            console.log(e.which)
            switch(e.which) {
                case 97:
                    this.moveLeft();
                    break;
                case 115:
                    console.log(e.which);
                    this.moveDown();
                    break;
                case 100:
                    this.moveRight();
                    break;
                case 119:
                    this.moveRight();
                    break;
                default:
                    console.log('Ruh roh');
            }
            //A is keycode 97
            // S is keycode 115
            // D is keycode 100
            // W is keycode 119
        });
    }

    moveDown() {
        this.sprite.animate({bottom: '-=52',});
    }

    moveUp() {
        this.sprite.animate({top: '+=52'});
    }

    moveRight() {
        this.sprite.animate({right: '-=52'});
    }

    moveLeft() {
        this.sprite.animate({left: '-=52'});
    }
}

$(() => {
    const game = new Game();
    const player1 = new Player1();
    game.createBoard(100);
    game.addPlayersToBoard(player1);
    player1.input();
    
});