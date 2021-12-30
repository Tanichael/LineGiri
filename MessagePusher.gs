class MessagePusher {
  constructor(id) {
    this.id = id;
  }

  push(text) {
    this.setPushConfig(text);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', this.pushOptions);
  }

  setPushText(text) {
    this.pushText = text;
  }

  setPushOptions() {
    var LineMessageObject = [{
      'type': 'text',
      'text': this.pushText
    }];
    var pushHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    };
    var pushBody = {
      'to': this.id,
      'messages': LineMessageObject
    };
    var pushOptions = {
      'method': 'POST',
      'headers': pushHeaders,
      'payload': JSON.stringify(pushBody)
    };

    this.pushOptions = pushOptions;
  }

  setPushConfig(text) {
    this.setPushText(text);
    this.setPushOptions();
  }
}