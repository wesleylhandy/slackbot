var Slack = require('slack-node');
var express = require('express');
var url = require('url');
var app = express();
var request = require('request'); 


////////////// THE SETUP ///////////////////////////////////////////

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'))

app.get('/', function(request, response) {

    var urlObject = url.parse(request.url,true).query
    console.log(urlObject)
    newIdentity(urlObject);

    response.sendStatus(200);

}); //app.get


/////////////// THE SEND MESSAGE //////////////////////////////////////////

function newIdentity (urlObject){

    slack = new Slack();
    slack.setWebhook(urlObject.response_url);


    //   /mySlashCommand witnessprotection stores male or female
    var userCommand = urlObject.text.toLowerCase();

    if(userCommand !== "male" && userCommand !== "female") {
        //respond with error message
        slack.webhook({
            channel: urlObject.channel_name,
            text: "Please enter either male or female and try again."
        }, function(err, response) {
            if (err){
                console.log(err)
            }
        });

    }

    // API call
    request('http://uinames.com/api/?gender=' + userCommand, function (error, response, body) {

        var data = JSON.parse(body);

        slack.webhook({
         channel: urlObject.channel_name,
          text: "Your new identity is " + data.name + " " + data.surname +". And your new life awaits you in " + data.region + "." //  the response back to slack
        }, function(err, response) {
            if (err){
                console.log(err)
            }
        })//webhook

    })//request
}

/////////////////////////////////////////////////////////

