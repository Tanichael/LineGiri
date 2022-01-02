//個人からの画像投稿まちの時のメッセージイベント
class UserWaitMessageEvent extends MessageEvent {
  constructor(event, id) {
    super(event);
    this.id = id;
  }

  //実行する処理をまとめる
  handle() {
    this.processingEvent();
  }

  //themeを記録
  processingEvent() {
    var mr = new MessageReplyer(this.replyToken);
    mr.reply("回答待ちです！");
  }

}

