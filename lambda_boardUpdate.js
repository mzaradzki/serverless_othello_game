console.log('Loading event');
var AWS = require('aws-sdk');
//var dynamodb = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log(event.game_id);
    console.log(event.start_stamp);
    console.log(event.player);
    console.log(event.row);
    console.log(event.column);
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    // This function should be in Lambda, not in the browser
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }
    
    function updateItem(game_id, start_stamp, new_board) {
        var params = {
            TableName: 'Othello',
            Key: {
                'game_id': game_id,
                'start_stamp': start_stamp
            },
            UpdateExpression: "set turn = :t, board = :b",
            ExpressionAttributeValues: {
                ":t": 'W',
                ":b": new_board,
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.log("Unable to update item: " + "\n" + JSON.stringify(err, undefined, 2));
            } else {
                console.log("UpdateItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
            }
        });
    }
    //updateItem(event.game_id, event.start_stamp);
    // example : readItem('11', 1);
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
        } else {
            console.log("GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
            //console.log(data.Item.board);
            var newboard = data.Item.board;
            newboard[event.row-1] = setCharAt(newboard[event.row-1], event.column-1, event.player);
            //console.log(newboard);
            updateItem(event.game_id, event.start_stamp, newboard);
        }
    });
    callback(null, 'Done!');
};