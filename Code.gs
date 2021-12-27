//UserID
const userId = "Uce9cb261c09d08072e5fcb45c25b187c";

//チャンネルアクセストークン
const TOKEN = "MOoaEu/BNnMDA1JWVH85iuIBEKqRfaj/KvxPWbuo4ZdR5ri71F2svEemIoxwD+ljTwufQG1iqTxrbaufUrCVlW7AstVKi/FkOIv+wmBSN7bZf2qAycVoMDAcApGznCw65USw+cRQnmAN+28i6pRFvgdB04t89/1O/w1cDnyilFU=";

function test() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  var range = sheet.getRange(1, 1);
  range.setValue("message");
}
 
function doPost(e) {
  const responseLine = e.postData.contents;
  const event = JSON.parse(responseLine).events[0];

  const replyToken = event.replyToken;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  var type;
  var theme;
  if(event.type == "message") {
    if(event.message.type == "text") {
      type = "text";
      var range = sheet.getRange(1, 1);
      range.setValue(event.message.text);
      theme = event.message.text;
    } else if (event.message.type == "image") {
      type = "image";
      var contentId = event.message.id;
      var range = sheet.getRange(1, 2);
      range.setValue("hello");
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      };
      const options = {
        'method': 'GET',
        'headers': headers,
      };
      var binary = UrlFetchApp.fetch("https://api-data.line.me/v2/bot/message/" + contentId +"/content", options);
      var range = sheet.getRange(1, 3);
      range.setValue(binary);
    }
  }
 
  var replyText = "";
  if(type == "text") {
    replyText = theme + "ですね！では絵を描いてください！";
  }
  if(type == "image") {
    replyText = "Exellent!ではグループトークに戻ってください！";
  }

  const LineMessageObject = [{
    'type': 'text',
    'text': replyText
  }];
  const replyHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + TOKEN
  };
  const replyBody = {
    'replyToken': replyToken,
    'messages': LineMessageObject
  };
  const replyOptions = {
    'method': 'POST',
    'headers': replyHeaders,
    'payload': JSON.stringify(replyBody)
  };
  
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', replyOptions);
}