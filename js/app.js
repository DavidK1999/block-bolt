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
        this.sprite = $('<div>').addClass('player-one');
    }

    move() {
        
    }
}





$(() => {
    const game = new Game();
    const player = new Player();
    console.log(player);
    game.createBoard(100);
    game.addPlayersToBoard(player);
    console.log(player);
});