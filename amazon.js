
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

    /*var client = new AWS.CognitoSyncManager();
    client.openOrCreateDataset('myDatasetName', function(err, dataset) {

        console.log('done')
        dataset.put('newRecord', 'newValue', function(err, record) {
            console.log(record);
        });

    });
    client.openOrCreateDataset('myDatasetName', function(err, dataset) {

        console.log('done');
        dataset.get('newRecord', function(err, value) {
            console.log('newRecord: ' + value);
        });

    });*/