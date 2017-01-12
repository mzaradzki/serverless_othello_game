# serverless_othello_game
Serverless Othello board game using AWS


We want to implement an HTML+JS version of thr Othello board game where user actions are process through AWS Lambda :
* AWS Lambda will receive user action and update the state of the game - DONE
* AWS DynamoDB will store the state of the game - DONE
* AWS DynamoDB will store the list of players - TO DO
* AWS Cognito Dataset to store Facebook friends - TO DO
* AWS Cognito will handle user authentification - DONE
* AWS CognitoSyncManager to synchronize across dvices - OPTIONAL TO DO
* AWS SNS to notify users when its their turn - TO DO
* AWS S3 will store the website files - TO DO
* AWS CloudFormation configuration template - OPTIONAL TO DO


Inspirations should be taken from these tutorials :
* https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-lambda-and-dynamodb-streams-part-1-217e2318ae17#.2ftwpseak
* https://www.twilio.com/blog/2015/11/sending-selfies-without-servers-how-to-use-twilio-mms-amazon-lamba-and-amazons-gateway.html
* http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/browser-invoke-lambda-function-example.html
* http://docs.aws.amazon.com/cognito/latest/developerguide/google.html


To save all the AWS configurations one can use a template file such as ChessGameCloudFormationTemplate.template in this project :
* Documentation : https://aws.amazon.com/fr/blogs/mobile/build-cross-platform-mobile-games-with-the-aws-mobile-sdk-for-unity/
* GitHub : https://github.com/awslabs/aws-sdk-unity-samples/tree/master/Chess%20Game%20Example%20Project


**NOTE**
To use Cognito Sync Manager in the browser we need to host a copy of this package :
https://github.com/aws/amazon-cognito-js


**NOTE**
When testing it is best to emulate a server rather than directly opening the html files in the browser.
For example launch the site from the console with :
python -m SimpleHTTPServer


**Misc.**
* When creating a game needs to pass identityId to Lambda function to record the 2 game owners
* When loading a game needs to pass identityId to Lambda to check against game owners
* When logging-off needs to delete credentials and to reset UI
* A user should not be able to create a new fresh game (unknown game partner) if he already has one in the DB
* A user should not be able to have more than 1 game open against a given game partner
* Display a listing of open/closed games for a given user - DONE