class MessageEvent {
  constructor(event) {
    this.event = event;
    this.replyToken = event.replyToken;
    this.source = event.source;
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
  }

  get getReplyText() {
    return this.replyText;
  }

  get getReplyOptions() {
    return this.replyOptions;
  }

  handle() {
    this.processingEvent();
    this.reply();
  }

  processingEvent() {
    //イベント処理クラス
    var sheet = this.ss.getActiveSheet();
    var range = sheet.getRange(2, 3);
    range.setValue("親クラスです");
  }

  setReplyText() {
    //リプライテキスト設定
    this.replyText = "hello! I'm Keruko!";
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

  reply() {
    //返信処理
    this.setReplyConfig();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyConfig() {
    this.setReplyText();
    this.setReplyOptions();
  }

}