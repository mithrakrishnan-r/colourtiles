document.addEventListener("DOMContentLoaded", game);

function game() {

    var movesNum; // number of moves initiated by user
    var movescell = document.getElementById("movesnum"); // where # of moves are displayed
    movesNum = 0;
    var a = 1;
    var b = 0;

    // Data structure to hold positions of tiles
    var parentX = document.querySelector(".sliding-puzzle").clientHeight;
    var baseDistance = 15.5;
    var tileMap = {
        1: {
            tileNumber: 1,
            position: 1,
            top: 0,
            left: 0
        },
        2: {
            tileNumber: 2,
            position: 2,
            top: 0,
            left: baseDistance * 1
        },
        3: {
            tileNumber: 3,
            position: 3,
            top: 0,
            left: baseDistance * 2
        },
        4: {
            tileNumber: 4,
            position: 4,
            top: 0,
            left: baseDistance * 3
        },
        5: {
            tileNumber: 5,
            position: 5,
            top: 0,
            left: baseDistance * 4
        },
        6: {
            tileNumber: 6,
            position: 6,
            top: baseDistance,
            left: 0
        },
        7: {
            tileNumber: 7,
            position: 7,
            top: baseDistance,
            left: baseDistance
        },
        8: {
            tileNumber: 8,
            position: 8,
            top: baseDistance,
            left: baseDistance * 2
        },

        9: {
            tileNumber: 9,
            position: 9,
            top: baseDistance,
            left: baseDistance * 3
        },

        10: {
            tileNumber: 10,
            position: 10,
            top: baseDistance,
            left: baseDistance * 4
        },

        11: {
            tileNumber: 11,
            position: 11,
            top: baseDistance * 2,
            left: 0
        },

        12: {
            tileNumber: 12,
            position: 12,
            top: baseDistance * 2,
            left: baseDistance
        },

        13: {
            tileNumber: 13,
            position: 13,
            top: baseDistance * 2,
            left: baseDistance * 2
        },

        14: {
            tileNumber: 14,
            position: 14,
            top: baseDistance * 2,
            left: baseDistance * 3
        },
        15: {
            tileNumber: 15,
            position: 15,
            top: baseDistance * 2,
            left: baseDistance * 4
        },
        16: {
            tileNumber: 16,
            position: 16,
            top: baseDistance * 3,
            left: 0
        },

        17: {
            tileNumber: 17,
            position: 17,
            top: baseDistance * 3,
            left: baseDistance
        },

        18: {
            tileNumber: 18,
            position: 18,
            top: baseDistance * 3,
            left: baseDistance * 2
        },

        19: {
            tileNumber: 19,
            position: 19,
            top: baseDistance * 3,
            left: baseDistance * 3
        },

        20: {
            tileNumber: 20,
            position: 20,
            top: baseDistance * 3,
            left: baseDistance * 4
        },

        21: {
            tileNumber: 21,
            position: 21,
            top: baseDistance * 4,
            left: 0
        },

        22: {
            tileNumber: 22,
            position: 22,
            top: baseDistance * 4,
            left: baseDistance
        },

        23: {
            tileNumber: 23,
            position: 23,
            top: baseDistance * 4,
            left: baseDistance * 2
        },

        24: {
            tileNumber: 24,
            position: 24,
            top: baseDistance * 4,
            left: baseDistance * 3
        },

        empty: {
            position: 25,
            top: baseDistance * 4,
            left: baseDistance * 4
        }
    }

    // Array of tileNumbers in order of last moved
    var history = [];

    // Movement map
    function movementMap(position) {

        if (position == 25) return [20, 24];
        if (position == 24) return [19, 23, 25];
        if (position == 23) return [18, 22, 24];
        if (position == 22) return [17, 21, 23];
        if (position == 21) return [16, 22];
        if (position == 20) return [15, 19, 25];
        if (position == 19) return [14, 18, 20, 24];
        if (position == 18) return [13, 17, 19, 23];
        if (position == 17) return [12, 16, 18, 22];
        if (position == 16) return [11, 17, 21];
        if (position == 15) return [10, 14, 20];
        if (position == 14) return [9, 13, 19, 15];
        if (position == 13) return [8, 12, 14, 18];
        if (position == 12) return [7, 11, 13, 17];
        if (position == 11) return [6, 12, 16];
        if (position == 10) return [5, 9, 15];
        if (position == 9) return [4, 8, 10, 14];
        if (position == 8) return [7, 3, 9, 13];
        if (position == 7) return [2, 6, 8, 12];
        if (position == 6) return [1, 7, 11];
        if (position == 5) return [4, 10];
        if (position == 4) return [3, 5, 9];
        if (position == 3) return [2, 4, 8];
        if (position == 2) return [1, 3, 7];
        if (position == 1) return [2, 6];
    }


    // Board setup according to the tileMap
    document.querySelector('#shuffle').addEventListener('click', shuffle, true);
    document.querySelector('#solve').addEventListener('click', solve, true);
    var tiles = document.querySelectorAll('.tile');
    var delay = -50;
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].addEventListener('click', tileClicked, true);

        var tileId = tiles[i].innerHTML;
        delay += 50;
        setTimeout(setup, delay, tiles[i]);
    }

    function setup(tile) {
        var tileId = tile.innerHTML;
        // tile.style.left = tileMap[tileId].left + '%';
        // tile.style.top = tileMap[tileId].top + '%';
        var xMovement = parentX * (tileMap[tileId].left / 100);
        var yMovement = parentX * (tileMap[tileId].top / 100);
        var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
        tile.style.webkitTransform = translateString;
        recolorTile(tile, tileId);
    }

    function tileClicked(event) {
        var tileNumber = event.target.innerHTML;
        moveTile(event.target);

        if (checkSolution()) {
            window.alert("You win!");
        }
    }

    // Moves tile to empty spot
    // Returns error message if tile cannot be moved
    function moveTile(tile, recordHistory = true) {

        // Check if Tile can be moved 
        // (must be touching empty tile)
        // (must be directly perpendicular to empty tile)
        var tileNumber = tile.innerHTML;
        if (!tileMovable(tileNumber)) {
            console.log("Tile " + tileNumber + " can't be moved.");
            return;
        }

        // Push to history
        if (recordHistory == true) {

            if (history.length >= 5) {
                if (history[history.length - 1] != history[history.length - 5]) history.push(tileNumber);
            } else {
                history.push(tileNumber);
            }
        }

        // Swap tile with empty tile
        var emptyTop = tileMap.empty.top;
        var emptyLeft = tileMap.empty.left;
        var emptyPosition = tileMap.empty.position;
        tileMap.empty.top = tileMap[tileNumber].top;
        tileMap.empty.left = tileMap[tileNumber].left;
        tileMap.empty.position = tileMap[tileNumber].position;

        // tile.style.top = emptyTop  + '%'; 
        // tile.style.left = emptyLeft  + '%';

        var xMovement = parentX * (emptyLeft / 100);
        var yMovement = parentX * (emptyTop / 100);
        var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
        tile.style.webkitTransform = translateString;

        tileMap[tileNumber].top = emptyTop;
        tileMap[tileNumber].left = emptyLeft;
        tileMap[tileNumber].position = emptyPosition;


        recolorTile(tile, tileNumber);
    }


    // Determines whether a given tile can be moved
    function tileMovable(tileNumber) {
        var selectedTile = tileMap[tileNumber];
        var emptyTile = tileMap.empty;
        var movableTiles = movementMap(emptyTile.position);

        if (movableTiles.includes(selectedTile.position)) {
            //movescell.innerHTML = movesNum;
            if (movesNum <= 21) {
                movesNum++;

            }
            if (movesNum > 21) {
                //movescell.innerHTML = movesNum;
                //movesNum=1;

                movesNum++;
                // movesNum=movesNum-21;
                movescell.innerHTML = a;
                a = a + 1;
            }
            return true;
        } else {
            return false;
        }



    }

    // Returns true/false based on if the puzzle has been solved
    function checkSolution() {

        //if(tileMap[7].position==1 && tileMap[8].position==2 && tileMap[9].position==3 && tileMap[12].position==4 && tileMap[13].position==5 && tileMap[14].position==6 && tileMap[17].position==7 &&tileMap[18].position==8 && tileMap[19].position==9){return true}
        //if((tileMap[1].position==7||tileMap[7].position==7||tileMap[13].position==7||tileMap[19].position==7)&&(tileMap[2].position==8||tileMap[8].position==8||tileMap[14].position==8||tileMap[20].position==8)&&(tileMap[3].position==9||tileMap[9].position==9||tileMap[15].position==9||tileMap[21].position==9)&&(tileMap[4].position==12)){return true}
        if ((tileMap[1].position == 7 || tileMap[7].position == 7 || tileMap[13].position == 7 || tileMap[19].position == 7) && (tileMap[2].position == 8 || tileMap[8].position == 8 || tileMap[14].position == 8 || tileMap[20].position == 8) && (tileMap[3].position == 9 || tileMap[9].position == 9 || tileMap[15].position == 9 || tileMap[21].position == 9) && (tileMap[4].position == 12 || tileMap[10].position == 12 || tileMap[16].position == 12 || tileMap[22].position == 12) && (tileMap[5].position == 13 || tileMap[11].position == 13 || tileMap[17].position == 13 || tileMap[23].position == 13) && (tileMap[6].position == 14 || tileMap[12].position == 14 || tileMap[18].position == 14 || tileMap[24].position == 14) && (tileMap[1].position == 17 || tileMap[7].position == 17 || tileMap[13].position == 17 || tileMap[19].position == 17) && (tileMap[2].position == 18 || tileMap[8].position == 18 || tileMap[14].position == 18 || tileMap[20].position == 18) && (tileMap[3].position == 19 || tileMap[9].position == 19 || tileMap[15].position == 19 || tileMap[21].position == 19)) { return true }
    }
    // Check if tile is in correct place!
    function recolorTile(tile, tileId) {
        if (tileId == tileMap[tileId].position) {
            tile.classList.remove("error");
        } else {
            tile.classList.add("error");
        }
    }


    // Shuffles the current tiles
    shuffleTimeouts = [];

    function shuffle() {
        clearTimers(solveTimeouts);
        var boardTiles = document.querySelectorAll('.tile');
        var shuffleDelay = 200;
        shuffleLoop();

        var shuffleCounter = 0;
        while (shuffleCounter < 20) {
            shuffleDelay += 200;
            shuffleTimeouts.push(setTimeout(shuffleLoop, shuffleDelay));
            shuffleCounter++;
        }
    }

    var lastShuffled;

    function shuffleLoop() {
        var emptyPosition = tileMap.empty.position;
        var shuffleTiles = movementMap(emptyPosition);
        var tilePosition = shuffleTiles[Math.floor(Math.floor(Math.random() * shuffleTiles.length))];
        var locatedTile;
        for (var i = 1; i <= 24; i++) {
            if (tileMap[i].position == tilePosition) {
                var locatedTileNumber = tileMap[i].tileNumber;
                locatedTile = tiles[locatedTileNumber - 1];
            }
        }
        if (lastShuffled != locatedTileNumber) {
            moveTile(locatedTile);
            lastShuffled = locatedTileNumber;
        } else {
            shuffleLoop();
        }

    }


    function clearTimers(timeoutArray) {
        for (var i = 0; i < timeoutArray.length; i++) {
            clearTimeout(timeoutArray[i])
        }
    }

    // Temporary function for solving puzzle.
    // To be reimplemented with a more sophisticated algorithm
    solveTimeouts = []

    function solve() {
        clearTimers(shuffleTimeouts);


        repeater = history.length;

        for (var i = 0; i < repeater; i++) {
            console.log("started");
            solveTimeouts.push(setTimeout(moveTile, i * 100, tiles[history.pop() - 1], false));
        }
    }



}