class MessagePusher {
  constructor(id) {
    this.id = id;
  }

  push(text) {
    this.setPushConfig(text);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', this.pushOptions);
  }

  pushImage(url) {
    this.setPushImageConfig(url);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', this.pushOptions);
  }

  pushBubble(bubbleMessage) {
    this.setPushBubbleConfig(bubbleMessage);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', this.pushOptions);
  }

  setPushText(text) {
    this.pushText = text;
  }

  setPushImageId(pushId) {
    this.pushId = pushId;
  }

  setPushBubble(bubbleMessage) {
    this.pushBubble = bubbleMessage;
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

  setPushImageOptions() {
    var LineMessageObject = [{
      'type': 'image',
      'originalContentUrl': 'https://drive.google.com/uc?id=' + this.pushId,
      'previewImageUrl': 'https://drive.google.com/uc?id=' + this.pushId
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

  setPushBubbleOptions() {
    var LineMessageObject = [this.pushBubble];
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

  setPushImageConfig(pushId) {
    this.setPushImageId(pushId);
    this.setPushImageOptions();
  }

  setPushBubbleConfig(bubbleMessage) {
    this.setPushBubble(bubbleMessage);
    this.setPushBubbleOptions();
  }
}