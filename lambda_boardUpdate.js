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
    //var docClient = dynamodb.DocumentClient();
    var docClient = new AWS.DynamoDB.DocumentClient();
    // This function should be in Lambda, not in the browser
    // example : updateItem('11', 1);
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substr(0,index) + chr + str.substr(index+1);
    }
    var newboard = ['00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000'];
    var newrow = newboard[event.row];
    newboard[event.row] = setCharAt(newboard[event.row], event.column, event.player);
    //newrow[event.column] = event.player;
    //newboard[event.row] = newrow;
    
    function updateItem(game_id, start_stamp) {
        var params = {
            TableName: 'Othello',
            Key: {
                'game_id': game_id,
                'start_stamp': start_stamp
            },
            UpdateExpression: "set turn = :t, board = :b",
            ExpressionAttributeValues: {
                ":t": 'W',
                ":b": newboard,
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
    updateItem(event.game_id, event.start_stamp)
    callback(null, 'Hello from Lambda');
};