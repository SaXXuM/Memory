function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'images.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init(json) {
    const NUMBERS_OF_CARDS = 6;
    var cards = Array.prototype.slice.call(document.querySelectorAll('.image'), 0),
        images = JSON.parse(json),
        cardImages = [],
        openedCardIndex,
        numOpened = 0;


    function getCardIndex(card) {
        var cardIndex = undefined;
        cards.forEach(function (el, ind) {
            if (el === card) {
                cardIndex = ind;
                return;
            }
        });
        return cardIndex;
    }

    function showImage(card) {
        card.style.backgroundImage = "url('images/" + images[cardImages[getCardIndex(card)]] + "')";
    }

    function hideImage(card) {
        card.style.backgroundImage = "none";
        numOpened--;
    }

    document.querySelector('.button').onclick = function() {
        cardImages = [];
        openedCardIndex = undefined;
        cards.forEach(function (el) {
            el.classList.remove('opened');
        });
        startGame();
    };

    document.querySelector('.field').onclick = function(event) {
        var target = event.target;
        if (!target.classList.contains('image') || target.classList.contains('opened') || numOpened > 0 ||
            openedCardIndex === getCardIndex(target)) return;
        showImage(target);
        if (openedCardIndex === undefined) {
            openedCardIndex = getCardIndex(target);
        } else {
            if (cardImages[openedCardIndex] !== cardImages[getCardIndex(target)]) {
                numOpened = 2;
                setTimeout(hideImage, 2000, target);
                setTimeout(hideImage, 2000, cards[openedCardIndex]);
            } else {
                target.classList.add('opened');
                cards[openedCardIndex].classList.add('opened');
            }
            openedCardIndex = undefined;
        }
    };

    function startGame() {
        for (var i = 0; i < NUMBERS_OF_CARDS; i++) {
            if (cardImages[i] === undefined) {
                do {
                    var selectedImageIndex = Math.floor(Math.random() * images.length);
                } while (cardImages.indexOf(selectedImageIndex) >= 0);
                cardImages[i] = selectedImageIndex;

                do {
                    var pairIndex = Math.floor(Math.random() * NUMBERS_OF_CARDS);
                } while (cardImages[pairIndex] !== undefined);
                cardImages[pairIndex] = selectedImageIndex;
            }
        }

        cards.forEach(function (el) {
            showImage(el);
            setTimeout(hideImage, 4000, el);
        });
    };
    startGame();

};

document.addEventListener("DOMContentLoaded", loadJSON(init));
