console.log('Loading event');
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    
    try {
        console.log(context.identity.cognitoIdentityId);
    }
    catch (err) {
        console.log('no context cognitoIdentityId');
    }
    try {
        console.log(context.identity.cognitoIdentityPoolId);
    }
    catch (err) {
        console.log('no context cognitoIdentityPoolId');
    }
    console.log(event.game_id);
    console.log(event.start_stamp);
    console.log(event.player_identity_id); // use the player to check consistency
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }
    
    function updateItem(game_id, start_stamp, new_turn, new_board) {
        var params = {
            TableName: 'OthelloGames',
            Key: {
                'game_id': game_id,
                //'start_stamp': start_stamp
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
        TableName: 'OthelloGames',
        Key: {
            'game_id': event.game_id,
            //'start_stamp': event.start_stamp
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
            /*if (data.Item.turn != event.player)
            {
                callback('error : incorrect player turn');
                return;
            }*/
            console.log("GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
            //console.log(data.Item.board);
            var board = [];
            for(var i=0; i<10; i++){
                board[i] = [];
                for(var j = 0; j<10; j++){
                    board[i][j] = '0';
                }
            }
            board[4][4] = 'B';
            board[4][5] = 'W';
            board[5][5] = 'B';
            board[5][4] = 'W';
            
            // export new game state
            var newboard = data.Item.board;
            for(i=0; i<10; i++){
                for(j = 0; j<10; j++){
                    newboard[i] = setCharAt(newboard[i], j, board[i][j]);
                }
            }
            updateItem(event.game_id, event.start_stamp, 'B', newboard);
        }
    });
};