const AWS_Config = require('aws-sdk');
var ses = new AWS_Config.SES({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
    console.log("SNS>"+JSON.stringify(event));
    function sendEmail() {
        var send_to = JSON.parse(event.Records[0].Sns.Message).EmailAddress;
        var token = JSON.parse(event.Records[0].Sns.Message).AccessToken;
        var encoded = encodeURIComponent(send_to)
        var sender = "admin@prod.naveenkumarbuddhala.me"

        return new Promise(function (resolve, reject) {
            var eParams = {
                Destination: {
                    ToAddresses: [send_to]
                },
                Message: {
                    Body: {
                        Html: {
                            Data: '<html><head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> <title>' + "Verify Email" + '</title>' +
                                '</head><body> Please verify this account in 5 minutes. Click the below link. <br><br>' +
                                "<a href=\"http://" + "prod.naveenkumarbuddhala.me" + "/v1/verifyUserEmail?email=" + encoded + "&token=" + token + "\">" +
                                "http://" + "prod.naveenkumarbuddhala.me" + "/v1/verifyUserEmail?email=" + encoded + "&token=" + token + "</a>"
                                +'</body></html>'
                        }
                    },
                    Subject: {
                        Data: "Account Verification"
                    }
                },
                Source: sender
            };
            ses.sendEmail(eParams, function (err, data2) {
                if (err) {
                    reject(new Error(err));
                } else {
                    context.succeed(event);
                    resolve(data2);
                }
            });
        });
    }
    async function mainFunction() {
        sendEmail()
    }
    mainFunction();
}