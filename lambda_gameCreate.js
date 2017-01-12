console.log('Loading event');
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    // TODO implement
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?*-+";
        for(var i=0; i<12; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    
    var game_id = makeid();
    
    var start_stamp = Date.now();
    console.log(start_stamp);
    
    var output = {
        game_id: game_id,
        start_stamp: start_stamp
    };
    
    // board is 10x10 for padding reasons
    var board = [   '0000000000',// padding
                    '0000000000',
                    '0000000000',
                    '0000000000',
                    '0000BW0000',
                    '0000WB0000',
                    '0000000000',
                    '0000000000',
                    '0000000000',
                    '0000000000']; //padding
    
    var black_id, white_id;
    if (Math.random()>0.5) {
        black_id = event.player_identity_id;
        white_id = "guest"; 
    }
    else {
        black_id = "guest";
        white_id = event.player_identity_id;
    }
    
    var params = {
        TableName :'OthelloGames',
        Item:{
            'game_id': game_id,
            'start_stamp': start_stamp,
            'board': board,
            'turn': 'B',
            'black_player_identity_id': black_id,
            'white_player_identity_id': white_id
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
        } else {
            console.log("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
        }
    });
    
    callback(null, output);
};