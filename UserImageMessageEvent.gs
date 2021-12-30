class UserImageMessageEvent extends MessageEvent {
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
    this.setReplyConfig();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText() {
    var replyText = "Exellent!ではグループトークに戻ってください！";
    this.replyText = replyText;
  }

  setReplyConfig() {
    this.setReplyText();
    this.setReplyOptions();
  }
}