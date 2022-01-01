class MessageReplyer {
  constructor(replyToken) {
    this.replyToken = replyToken;
  }

  reply(text) {
    this.setReplyConfig(text);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText(text) {
    this.replyText = text;
  }

  setReplyOptions() {
    var LineMessageObject = [{
      'type': 'text',
      'text': this.replyText
    }];
    var replyHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    };
    var replyBody = {
      'replyToken': this.replyToken,
      'messages': LineMessageObject
    };
    var replyOptions = {
      'method': 'POST',
      'headers': replyHeaders,
      'payload': JSON.stringify(replyBody)
    };

    this.replyOptions = replyOptions;
  }

  setReplyConfig(text) {
    this.setReplyText(text);
    this.setReplyOptions();
  }
}