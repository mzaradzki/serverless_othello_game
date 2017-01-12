
// Configure AWS SDK for JavaScript
AWS.config.update({region: 'eu-west-1'});
AWS.config.credentials = new AWS.CognitoIdentityCredentials(
    {
        IdentityPoolId: 'eu-west-1:8fd4aff6-c2e8-42f8-858c-21080b3a9a4b'
    }
);

// to create, read, update a DB record :
// http://docs.aws.amazon.com/amazondynamodb/latest/gettingstartedguide/GettingStarted.Js.03.html#GettingStarted.Js.03.01
var docClient = new AWS.DynamoDB.DocumentClient();

// Lambda calls from Javascript documented here :
// http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/browser-invoke-lambda-function-example.html

// Prepare to call Lambda function
var lambda = new AWS.Lambda({region: 'eu-west-1', apiVersion: '2015-03-31'});


// SEE DOCUMENTATION : https://github.com/aws/amazon-cognito-js
var cognitoSyncManager = new AWS.CognitoSyncManager();
/*
// DEMO USAGE
cognitoSyncManager.openOrCreateDataset('myDatasetName', function(err, dataset) {

    console.log('done')
    dataset.put('newRecord', 'newValue', function(err, record) {
        console.log(record);
    });
    dataset.synchronize(congnitoSyncPolicy);
});
cognitoSyncManager.openOrCreateDataset('myDatasetName', function(err, dataset) {

    console.log('done');
    dataset.get('newRecord', function(err, value) {
        console.log('newRecord: ' + value);
    });

});*/
var congnitoSyncPolicy = {
  	onSuccess: function(dataset, newRecords) {
     	console.log('sync success');
  	},
  	onFailure: function(err) {
    	console.log('sync failure');
  	},
  	onConflict: function(dataset, conflicts, callback) {

     	var resolved = [];

     	for (var i=0; i<conflicts.length; i++) {

	        // Take remote version.
	        resolved.push(conflicts[i].resolveWithRemoteRecord());

	        // Or... take local version.
	        // resolved.push(conflicts[i].resolveWithLocalRecord());

	        // Or... use custom logic.
	        // var newValue = conflicts[i].getRemoteRecord().getValue() + conflicts[i].getLocalRecord().getValue();
	        // resolved.push(conflicts[i].resolveWithValue(newValue);

     	}

     	dataset.resolve(resolved, function() {
        	return callback(true);
     	});

     	// Or... callback false to stop the synchronization process.
     	// return callback(false);

  	},
  	onDatasetDeleted: function(dataset, datasetName, callback) {

     	// Return true to delete the local copy of the dataset.
     	// Return false to handle deleted datasets outsid ethe synchronization callback.

     	return callback(true);

  	},
  	onDatasetsMerged: function(dataset, datasetNames, callback) {

     	// Return true to continue the synchronization process.
     	// Return false to handle dataset merges outside the synchroniziation callback.

     	return callback(false);

  	}
}