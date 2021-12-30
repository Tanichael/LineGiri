//答え合わせ時のメッセージイベント
class GroupCheckMessageEvent extends MessageEvent {
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
    if(this.isStart == true) {
      //バブルメッセージの生成
      var replyText = "メンバー募集メッセージを送信します";
      this.replyText = replyText;
    } else {
      var replyText = "ゲームを始める際は「@start」と発言してください！";
      this.replyText = replyText;
    }
  }

  setReplyConfig() {
    this.setReplyText();
    this.setReplyOptions();
  }
}
