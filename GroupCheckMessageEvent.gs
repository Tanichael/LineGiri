//答え合わせ時のメッセージイベント
class GroupCheckMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
    this.mr = new MessageReplyer(event.replyToken);
  }

  //実行する処理をまとめる
  handle() {
    if(this.event.type != "postback") {
      this.mr.reply("正解者を選んでください！");
      return;
    }
    this.processingEvent();
  }

  //themeを記録
  processingEvent() {
    
  }

}
