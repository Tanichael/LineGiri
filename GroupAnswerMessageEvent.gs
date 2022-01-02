//回答募集時のメッセージイベント
class GroupAnswerMessageEvent extends MessageEvent {
  constructor(event, sessionId) {
    super(event);
    this.sessionId = sessionId;
    this.groupId = event.source.groupId;
    this.mr = new MessageReplyer(event.replyToken);
    this.mp = new MessagePusher(event.source.groupId);
    this.ug = new UserInfoGetter();
  }

  //実行する処理をまとめる
  handle() {
    if(this.event.message.type != "text") {
      var mr = new MessageReplyer(this.replyToken);
      mr.reply("メッセージを投稿してください！");
    }
    this.processingEvent();
  }

  //回答の処理
  processingEvent() {
    if(this.event.message.text == "@end") {
      //終了のメッセージを投稿
      //答え合わせタイムに移行する
      var sheet = this.ss.getSheetByName("Sessions");

      //回答締め切りメッセージと正解者選択メッセージを送信
      var populationRange = sheet.getRange(this.sessionId+3, 4);
      var population = populationRange.getValue();

      var answerBubbleMessage = ANSWER_BUBBLE_MESSAGE_BASE;

      for(var i = 0; i < population; i++) {
        var userIdRange = sheet.getRange(this.sessionId+3, 5+i);
        var userId = userIdRange.getValue();
        var button = ANSWER_BUTTON_BASE;
        var name;

        this.ug.getInfo(userId);
        name = this.ug.userInfo.displayName;

        button.action.label = name;
        button.action.data = userId;
        
        answerBubbleMessage.contents.body.contents.push(button);
      }


      this.mp.push("回答を締め切ります！絵を描いた人は正解者を選んでください！！");
      this.mp.pushBubble(answerBubbleMessage);

      //ステートの管理
      var stateRange = sheet.getRange(this.sessionId+3, 3);
      stateRange.setValue(3);

    }
    
  }

}
