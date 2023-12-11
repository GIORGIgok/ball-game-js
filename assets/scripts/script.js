// selecting the character and game elements from the DOM
let character = document.getElementById("character");
let game = document.getElementById("game");

// variables for interval, both key press check, counter, and current blocks
let interval;
let both = 0;
let counter = 0;
let currentBlocks = [];

// func. to move the character to the left
function moveLeft() {
    let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left > 0) {
        character.style.left = left - 2 + "px";
    }
}

// func. to move the character to the right
function moveRight() {
    let left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left < 380) {
        character.style.left = left + 2 + "px";
    }
}

// event listener for keydown to start character movement
document.addEventListener("keydown", event => {
    if (both == 0) {
        both++;
        if (event.key === "ArrowLeft") {
            interval = setInterval(moveLeft, 1);
        }
        if (event.key === "ArrowRight") {
            interval = setInterval(moveRight, 1);
        }
    }
});

// event listener for keyup to stop character movement
document.addEventListener("keyup", _event => {
    clearInterval(interval);
    both = 0;
});

// interval function to create and move blocks
let blocks = setInterval(function () {
    let blockLast = document.getElementById("block" + (counter - 1));
    let holeLast = document.getElementById("hole" + (counter - 1));

    // variables to store the top positions of the last block and hole
    let blockLastTop = 0;
    let holeLastTop = 0;

    // checking if there are previous blocks
    if (counter > 0) {
        blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }

    // checking if a new block and hole should be created
    if (blockLastTop < 400 || counter == 0) {
        let block = document.createElement("div");
        let hole = document.createElement("div");

        // setting attributes for the new block and hole
        block.setAttribute("class", "block");
        hole.setAttribute("class", "hole");
        block.setAttribute("id", "block" + counter);
        hole.setAttribute("id", "hole" + counter);

        // positioning the new block and hole
        block.style.top = blockLastTop + 100 + "px";
        hole.style.top = holeLastTop + 100 + "px";
        let random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";

        // appending the new block and hole to the game element
        game.appendChild(block);
        game.appendChild(hole);

        // updating the currentBlocks array and counter
        currentBlocks.push(counter);
        counter++;
    }

    // getting the current position of the character
    let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    let drop = 0;

    // checking if the character has reached the top of the game window
    if (characterTop <= 0) {
        alert("Game over. Score: " + (counter - 9));
        clearInterval(blocks);
        location.reload();
    }

    // looping through the current blocks and holes to check for collisions
    for (let i = 0; i < currentBlocks.length; i++) {
        let current = currentBlocks[i];
        let iblock = document.getElementById("block" + current);
        let ihole = document.getElementById("hole" + current);
        let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
        let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));

        // moving the block and hole upward
        iblock.style.top = iblockTop - 0.5 + "px";
        ihole.style.top = iblockTop - 0.5 + "px";

        // removing off-screen blocks and holes
        if (iblockTop < -20) {
            currentBlocks.shift();
            iblock.remove();
            ihole.remove();
        }

        // checking for collisions with the character
        if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
            drop++;

            if (iholeLeft <= characterLeft && iholeLeft + 20 >= characterLeft) {
                drop = 0;
            }
        }
    }

    // adjusting the character's position based on collisions
    if (drop == 0) {
        if (characterTop < 480) {
            character.style.top = characterTop + 2 + "px";
        }
    } else {
        character.style.top = characterTop - 0.5 + "px";
    }
}, 1);
