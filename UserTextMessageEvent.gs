class UserTextMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
    this.theme = event.message.text;
  }

  //実行する処理をまとめる
  handle() {
    this.processingEvent();
    this.reply();
  }

  //themeを記録
  processingEvent() {
    //お題の設定
    var sheet = this.ss.getActiveSheet();
    var range = sheet.getRange(2, 1);
    range.setValue(this.theme);
  }

  reply() {
    //返信処理
    this.setReplyConfig();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText() {
    var replyText = this.theme + "ですね！では絵を描いてください！";
    this.replyText = replyText;
  }

  setReplyConfig() {
    this.setReplyText();
    this.setReplyOptions();
  }
}