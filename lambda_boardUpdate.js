console.log('Loading event');
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log(event.game_id);
    console.log(event.start_stamp);
    console.log(event.player); // use the player to check consistency
    console.log(event.row);
    console.log(event.column);
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }
    
    function updateItem(game_id, start_stamp, new_turn, new_board) {
        var params = {
            TableName: 'Othello',
            Key: {
                'game_id': game_id,
                'start_stamp': start_stamp
            },
            UpdateExpression: "set turn = :t, board = :b",
            ExpressionAttributeValues: {
                ":t": new_turn,
                ":b": new_board,
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.log("Unable to update item: " + "\n" + JSON.stringify(err, undefined, 2));
                callback('error : could not update item');
            } else {
                console.log("UpdateItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
                callback(null, 'success');
            }
        });
    }
    
    var params = {
        TableName: 'Othello',
        Key: {
            'game_id': event.game_id,
            'start_stamp': event.start_stamp
        }
    };
    docClient.get(params, function(err, data) {
        if (err) {
            console.log("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
            callback('error : could not get item');
        } else {
            if (!data.hasOwnProperty('Item'))
            {
                callback('error : could not get data.Item');
                return;
            }
            if (!data.Item.hasOwnProperty('board'))
            {
                callback('error : could not get data.Item.board');
                return;
            }
            if (!data.Item.hasOwnProperty('turn'))
            {
                callback('error : could not get data.Item.turn');
                return;
            }
            if (data.Item.turn != event.player)
            {
                callback('error : incorrect player turn');
                return;
            }
            console.log("GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
            //console.log(data.Item.board);
            var board = [];
            for(var i=0; i<10; i++){
                board[i] = [];
                for(var j = 0; j<10; j++){
                    board[i][j] = data.Item.board[i][j];
                }
            }
            //var board = data.Item.board;
            var turn = data.Item.turn;
            var checkPiece = function (x, y, flip) {
                var ret = 0;
                for (var dx = -1; dx <= 1; dx++) {
                    for (var dy = -1; dy <= 1; dy++) {
                        if (dx == 0 && dy == 0) {
                            continue;
                        }
                        var nx = x + dx, ny = y + dy, n = 0;
                        while (board[nx][ny] == ((turn == 'W') ? 'B' : 'W')) {
                            n++;
                            nx += dx;
                            ny += dy;
                        }
                        if (n > 0 && board[nx][ny] == turn) {
                            ret += n;
                            if (flip) { // This logic should be part of the Lambda too
                                nx = x + dx;
                                ny = y + dy;
                                while (board[nx][ny] == ((turn == 'W') ? 'B' : 'W')) {
                                    board[nx][ny] = turn;
                                    nx += dx;
                                    ny += dy;
                                }
                                board[x][y] = turn;
                            }
                        }
                    }
                }
                return (ret>0);
            }
            var turnChange = function () {
                var x;
                var y;
                // step 1 : flip turn and check that new player has available options
                turn = ((turn == 'W') ? 'B' : 'W');
                for (x = 1; x <= 8; x++) {
                    for (y = 1; y <= 8; y++) {
                        if (board[x][y] == '0' && checkPiece(x, y, false)) {
                            //showBoard();
                            return; // returns with the flipped player
                        }
                    }
                }
                // conditional step 2 : IF the flipped player was blocked then revert and check if player has available moves
                turn = ((turn == 'W') ? 'B' : 'W');
                        
                for (x = 1; x <= 8; x++) {
                    for (y = 1; y <= 8; y++) {
                        if (board[x][y] == '0' && checkPiece(x, y, false)) {
                            //showBoard();
                            return; // return with the previous player
                        }
                    }
                }

                // conditional step 3 : both players are blocked, so end the game
                turn = 'E'; // E for End of game
                return;
            }
            
            if (!checkPiece(event.row, event.column, false)) {
                callback('error : inconsistent piece move');
                return;
            }
            else {
                checkPiece(event.row, event.column, true);
                turnChange();
                // export new game state
                var newboard = data.Item.board;
                for(i=0; i<10; i++){
                    for(j = 0; j<10; j++){
                        newboard[i] = setCharAt(newboard[i], j, board[i][j]);
                    }
                }
                updateItem(event.game_id, event.start_stamp, turn, newboard);
            }
        }
    });
};