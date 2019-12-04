const $gameBoard = $('.game-board');
const $blockOffset = [];
const $blockToBeRemoved = [];

// let selectedElement = document.getElementFromPoint(100, 100);
// console.log(selectedElement);

class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;

    }

    createBoard(x) {
        for(let i = 0; i < x; i++) {
            let $block = $('<div>').addClass('block').attr('id', i); 
            $gameBoard.append($block);
        }
    }

    getBlockPositions() {
        let $blocks = $gameBoard.children('.block');
        for(let i = 0; i < $blocks.length; i++) {
            $blockOffset.push($blocks.eq(i).offset());
        }
    }



    addPlayersToBoard() {
        $('#0').append(this.player1.sprite);
        $('#299').append(this.player2.sprite);
    }

    getPlayer1CurrentPosition() {
        window.setInterval(() => {
            console.log('Hi');
           this.getElsAt(this.player1.sprite.offset().top, this.player1.sprite.offset().left);
        });
    }
    
    getPlayer2CurrentPosition() {
        window.setInterval(() => {
            this.getElsAt(this.player2.sprite.offset().top, this.player2.sprite.offset().left);
        });
    }

    // https://stackoverflow.com/questions/3942776/using-jquery-to-find-an-element-at-a-particular-position Is where I found this function
    getElsAt(top, left) {
        $blockToBeRemoved.push($gameBoard
            .find(".block")
            .filter(function() {
                return $(this).offset().top == top
                    && $(this).offset().left == left;
            }, this.removeBlock()));
    }

    removeBlock() {
        for(const $block of $blockToBeRemoved) {
            // $block.animate({backgroundColor: 'black', filter: 'blur(5px'}, 700);
            window.setTimeout(() => {
                $block.removeClass('block');
                $block.addClass('hole');
            }, 100);
        }
    }
}

class Player {
    constructor(sprite) {
        this.sprite = sprite;
    }

    moveDown() {
        this.sprite.animate({top: '+=50'}, 100);
        console.log('Down');    
    }

    moveUp() {
        this.sprite.animate({top: '-=50'}, 100);
        console.log('Down');
    }

    moveRight() {
        this.sprite.animate({left: '+=50'}, 100);
        console.log('Right');   

    }

    moveLeft() {
        this.sprite.animate({left: '-=50'}, 100);
        console.log('Right');
    }
}

class Player1 extends Player {
    constructor(sprite) {
        super(sprite);
        this.sprite = $('<div>').addClass('player').addClass('player-one');
    }

    getInput() {
        $('body').on('keypress', (e) => {
            console.log(this.sprite.offset());
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
            }
        });
    }
}

class Player2 extends Player {
    constructor(sprite) {
        super(sprite);
        this.sprite = $('<div>').addClass('player').addClass('player-two');
    }

    getInput() {
        const move = $('body').on('keydown', (e) => {
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
            }
            let $previousPosition = this.sprite.position();
            return $previousPosition;
        });
        return move;
    }
}



$(() => {
    const player1 = new Player1();
    const player2 = new Player2();
    const game = new Game(player1, player2);
    game.createBoard(300);
    game.getBlockPositions();
    game.addPlayersToBoard();
    player1.getInput();
    player2.getInput()
    game.getPlayer1CurrentPosition();
    game.getPlayer2CurrentPosition();
});

