# serverless_othello_game
Serverless Othello board game using AWS


We want to implement an HTML+JS version of thr Othello board game where user actions are process through AWS Lambda :
* AWS Lambda will receive user action and update the state of the game - DONE
* AWS DynamoDB will store the state of the game - DONE
* AWS DynamoDB will store the list of players - TO DO
* AWS Cognito will handle user authentification - TO COMPLETE WITH FACEBOOK BUTTON
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


*NOTE*
When testing it is best to emulate a server rather than directly opening the html files in the browser.
For example launch the site from the console with :
python -m SimpleHTTPServer