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
    this.setReplyText();
    this.setReplyOptions();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

}

class TextMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
    this.theme = event.message.text;
  }

  handle() {
    this.processingEvent();
    this.reply();
  }

  processingEvent() {
    //お題の設定
    var sheet = this.ss.getActiveSheet();
    var range = sheet.getRange(2, 1);
    range.setValue(this.theme);
  }

  reply() {
    //返信処理
    this.setReplyText();
    this.setReplyOptions();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText() {
    var replyText = this.theme + "ですね！では絵を描いてください！";
    this.replyText = replyText;
  }
}

class ImageMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
    this.contentId = event.message.id;
  }

  handle() {
    this.reply();
    //色々終わってから画像保存などする 非同期ができないので
    this.getBlob();

    if(this.url) {
      var sheet = this.ss.getActiveSheet();
      var range = sheet.getRange(2, 2);
      range.setValue(this.url);
    }
  }

  getBlob() {
    //画像データの取得
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    };
    var options = {
      'method': 'GET',
      'headers': headers,
    };
    var binary;
    binary = UrlFetchApp.fetch("https://api-data.line.me/v2/bot/message/" + this.contentId +"/content", options);

    var blob = binary.getBlob().getAs('image/png').setName(Number(new Date()) + '.png');

    this.saveBlob(blob);
  }

  saveBlob(blob) {
    try{
      var folder = DriveApp.getFolderById(FOLDER_ID);
      var file = folder.createFile(blob);
      this.url = file.getUrl();
    }catch(e){
      this.url = false;
    }
  }

  reply() {
    //返信処理
    this.setReplyText();
    this.setReplyOptions();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText() {
    var replyText = "Exellent!ではグループトークに戻ってください！";
    this.replyText = replyText;
  }
}
