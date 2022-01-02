//答え合わせ時のグループのメッセージイベント
class GroupCheckMessageEvent extends MessageEvent {
  constructor(event, sessionId) {
    super(event);
    this.sessionId = sessionId;
    this.mr = new MessageReplyer(event.replyToken);
    this.mp = new MessagePusher(event.source.groupId);
  }

  //実行する処理をまとめる
  handle() {
    this.mp.push("正解者選択待ちです！");
    return;
  }

}
