class MessageReplyer {
  constructor(replyToken) {
    this.replyToken = replyToken;
  }

  reply(text) {
    this.setReplyConfig(text);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  replyBubble(bubbleMessage) {
    this.setReplyBubbleConfig(bubbleMessage);

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyBubbleOptions);
  }

  setReplyText(text) {
    this.replyText = text;
  }

  setReplyBubble(bubbleMessage) {
    this.replyBubble = bubbleMessage;
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

  setReplyBubbleOptions() {
    var LineMessageObject = [this.replyBubble];
    var replyHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    };
    var replyBody = {
      'replyToken': this.replyToken,
      'messages': LineMessageObject
    };
    var replyBubbleOptions = {
      'method': 'POST',
      'headers': replyHeaders,
      'payload': JSON.stringify(replyBody)
    };

    this.replyBubbleOptions = replyBubbleOptions;
  }

  setReplyConfig(text) {
    this.setReplyText(text);
    this.setReplyOptions();
  }

  setReplyBubbleConfig(bubbleMessage) {
    this.setReplyBubble(bubbleMessage);
    this.setReplyBubbleOptions();
  }
}