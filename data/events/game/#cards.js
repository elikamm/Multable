const Suits = [ "clubs", "diamonds", "hearts", "spades" ];
const Symbols = ["ace", "king", "queen", "jack", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

function getCards(count) {
    let symbols = Math.max(0, Math.min(Symbols.length, Math.floor(count / Suits.length))),
        joker = count % Suits.length, cards = [];
        
    for (let i = 0; i < joker; i++)
        cards.push("card/joker");
    for (let i = 0; i < symbols; i++)
        for (let j = 0; j < Suits.length; j++) {
            cards.push(`card/${Suits[j]}/${Symbols[i]}`);
        }
    
    cards = cards.sort(() => .5 - Math.random());
    
    return cards;
}

function isCard(type) {
    return type.startsWith("card/");
}

function getValue(symbol) {
    switch(symbol) {
        case "joker": return 0; case "ace": return 1;

        case "2": return 2; case "3": return 3; case "4": return 4;
        case "5": return 5; case "6": return 6; case "7": return 7;
        case "8": return 8; case "9": return 9; case "10": return 10;

        case "jack": return 11; case "queen": return 12; case "king": return 13;

        default: return -1;
    }
}