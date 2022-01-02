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
    if(this.event.type != "postback") {
      this.mp.push("正解者を選択してください！");
      return;
    }
    this.processingEvent();
  }

  setSessionId() {
    var sheet = this.ss.getSheetByName("GameData");
    var range = sheet.getRange(this.id+3, 2);
    this.sessionId = range.getValue();
  }

  processingEvent() {
    this.setSessionId();

    var userId = this.source.userId;

    var isDrawer = this.isDrawer(userId);
    this.mp.push(isDrawer);

    if(isDrawer == true) {
      this.mp.push("あなたは絵を描いた人です！");
    } else {
      this.mp.push("絵を描いた人が正解者を選択してください！");
    }
    
  }

  isDrawer(userId) {
    var isDrawer = false;

    var sheet = this.ss.getSheetByName("Sessions");
    var range;
    range = sheet.getRange(this.sessionId+3, 18);
    var turn = range.getValue();
    range = sheet.getRange(this.sessionId+3, 4);
    var population = range.getValue();
    var idx = turn % population;

    var drawerId;
    range = sheet.getRange(this.sessoinId+3, 5+idx);
    drawerId = range.getValue();
    range = sheet.getRange(4, 1);
    range.setValue(drawerId);

    if(userId == drawerId) {
      isDrawer = true;
    }

    return isDrawer;
  }

}
