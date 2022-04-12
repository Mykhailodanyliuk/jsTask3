const createtable = require('table').table
const crypto = require("crypto");
const prompt = require("prompt-sync")();

function isUniqueElements (M){
    for (var j = 0, R = true, J = M.length - 1; j < J; j++)
    for (var k = j + 1, K = J + 1; k < K; k++) R = (R && M [j] != M [k]);
    return R;
}

class key{
    genarateKey(){
        let key = crypto.randomBytes(256/8).toString('hex')
        return key
    }
}

class hmac{
    generateHmac(key,move){
        return crypto.createHmac('sha256',key).update(`${move}`).digest('hex')
    }
}

class infoTable{
    generateTable(gameElements) {
        let helpTable = new Array(gameElements.length+1);
        for (let i = 0; i < helpTable.length; i++) {
            helpTable[i] = new Array(gameElements.length+1);
        }
        helpTable[0][0] = '';
        for (let i = 0; i < gameElements.length ; i++) helpTable[0][i+1] = gameElements[i];
        for (let i = 0; i < gameElements.length ; i++) helpTable[i+1][0] = gameElements[i];
        return helpTable;
    }
}


class resultTable {
    fillTable(table){
        let gameElements = table[0].slice(1)
        // console.log(gameElements)
        for (let i = 1; i < gameElements.length+1 ; i++){
            for (let j = 1; j < gameElements.length+1 ; j++){
                let indexJ = gameElements.indexOf(table[0][j])
                let indexI = gameElements.indexOf(table[i][0])
                if (table[0][j] == table[i][0]){
                    table[i][j] = 'Draw'
                }else if (indexJ - indexI < -(gameElements.length-1)/2 || (indexJ - indexI <=  (gameElements.length-1)/2 && indexJ - indexI > 0)){
                    table[i][j] = 'Win'
                }else{
                    table[i][j] = 'Lose'
                }
            }
        }
        return table
    }
}
const moves = process.argv.slice(2)
let userMove , computerMove,gameTable

if ((moves.length >=3 && moves.length % 2 == 1) && isUniqueElements(moves)){
    let myTable = new infoTable();
    emptyTable= (myTable.generateTable(moves))
    let resTable = new resultTable()
    gameTable = resTable.fillTable(emptyTable)
    let exit = true
    while (exit){
        let key1 = new key()
        let keyGame = key1.genarateKey()
        computerMove = crypto.randomInt(1,moves.length)
        gameHmac = new hmac()
        let computerHMAC = gameHmac.generateHmac(keyGame,computerMove)    
        console.log('HMAC: ' + computerHMAC)
        console.log('Available moves:')
        for (let i = 0 ; i < moves.length; i++) console.log((i+1)+' - ' +moves[i])
        console.log('? - help')
        console.log('0 - exit')
        userMove = prompt('Enter your move:')
        if (userMove === '?'){
            console.log(createtable(gameTable))
            console.log("The user's moves are arranged vertically")
            userMove = prompt('Enter your move:')
        }
        if (userMove == '0'){
            exit = false
            break
        }
        console.log('Your move: ' + moves[parseInt(userMove)-1])
        console.log('Computer move: ' + moves[parseInt(computerMove)-1])
        if (parseInt(userMove) <= moves.length){
            console.log(gameTable[parseInt(userMove)][parseInt(computerMove)])
        }
        console.log('HMAC key :' + keyGame)
        console.log("")
        console.log("NEW GAME")
        
    }
}else{
    console.log('You have entered incorrect data. Arguments should not be repeated and the number should be more than 3 and odd. Please try again')
}