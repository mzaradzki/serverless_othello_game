console.log('Loading event');
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    console.log(event.facebook_id);
    console.log(event.player_identity_id);
    console.log(event.facebook_name);
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    var params = {
        TableName :'OthelloPlayers',
        Item:{
            'facebook_id': event.facebook_id,
            //'creation_stamp': start_stamp,
            'player_identity_id': event.player_identity_id,
            //'email': response.email,
            'name': event.facebook_name
        }
    };
    docClient.put(params, function(err, data) {
        if (err) {
            console.log("Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2));
            callback('error');
        } else {
            console.log(data);
            console.log("PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2));
            callback(null, 'success');
        }
    });
    
    
};