//個人からの画像投稿まちの時のメッセージイベント
class GroupWaitMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
  }

  //実行する処理をまとめる
  handle() {
    this.processingEvent();
  }

  //themeを記録
  processingEvent() {
    var mr = new MessageReplyer(this.replyToken);
    mr.reply("お題待ちです！");
  }

}
