//個人からの画像投稿まちの時のメッセージイベント
class GroupWaitMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
  }

  //実行する処理をまとめる
  handle() {
    this.processingEvent();
    this.reply();
  }

  //themeを記録
  processingEvent() {
    
  }

  reply() {
    //返信処理
    this.setReplyConfig();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText() {
    var replyText = "お題待ちです！";
    this.replyText = replyText;
  }

  setReplyConfig() {
    this.setReplyText();
    this.setReplyOptions();
  }
}
