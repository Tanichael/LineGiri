//答え合わせ時のメッセージイベント
class UserCheckMessageEvent extends MessageEvent {
  constructor(event, id) {
    super(event);
    this.id = id;
    this.mr = new MessageReplyer(event.replyToken);
    this.mp = new MessagePusher(event.source.userId);
  }

  //実行する処理をまとめる
  handle() {
    if(this.event.type == "postback") {
      this.processingEvent();
    }
    
  }

  setSessionId() {
    var sheet = this.ss.getSheetByName("GameData");
    var range = sheet.getRange(this.id+3, 2);
    this.sessionId = range.getValue();
  }

  processingEvent() {
    this.setSessionId();
    this.mp.push("正解者選択を検知");
    
  }

}
