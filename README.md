# serverless_othello_game
Serverless Othello board game using AWS


We want to implement an HTML+JS version of thr Othello board game where user actions are process through AWS Lambda :
* AWS Lambda will receive user action and update the state of the game
* AWS DynamoDB will store the state of the game
* AWS Cognito will handle user authentification
* AWS S3 will store the website files


Inspirations should be taken from these tutorials :

* https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-lambda-and-dynamodb-streams-part-1-217e2318ae17#.2ftwpseak
* https://www.twilio.com/blog/2015/11/sending-selfies-without-servers-how-to-use-twilio-mms-amazon-lamba-and-amazons-gateway.html
* http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/browser-invoke-lambda-function-example.html
* http://docs.aws.amazon.com/cognito/latest/developerguide/google.html