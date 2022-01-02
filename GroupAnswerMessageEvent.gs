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

      var turnRange = sheet.getRange(this.sessionId+3, 18);
      var turn = turnRange.getValue();

      var idx = turn % population;

      var answerBubbleMessage = ANSWER_BUBBLE_MESSAGE_BASE;

      for(var i = 0; i < population; i++) {
        // if(i == idx) continue; //テストの時は一人なので...
        var userIdRange = sheet.getRange(this.sessionId+3, 5+i);
        var userId = userIdRange.getValue();
        var button = ANSWER_BUTTON_BASE;
        var name;

        this.ug.getInfo(userId);
        name = this.ug.userInfo.displayName;

        button.action.label = name;
        button.action.data = userId;
        button.action.text = "選択しました";
        
        answerBubbleMessage.contents.body.contents.push(button);
      }

      this.mp.push("回答を締め切ります！絵を描いた人は個人チャットで正解者を選んでください！！");

      var drawerId = this.getDrawerId();

      var mpUser = new MessagePusher(drawerId);
      mpUser.push("正解者を選んでください！");
      mpUser.pushBubble(answerBubbleMessage);

      this.manageState();

    }
  }

  getDrawerId() {
    var drawerId;

    var sheet = this.ss.getSheetByName("Sessions");
    var range;

    range = sheet.getRange(this.sessionId+3, 18);
    var turn = range.getValue();

    range = sheet.getRange(this.sessionId+3, 4);
    var population = range.getValue();

    var idx = turn % population;

    range = sheet.getRange(this.sessionId+3, 5+idx);
    drawerId = range.getValue();

    return drawerId;
  }

  manageState() {
    var sheet = this.ss.getSheetByName("Sessions");
    //ステートの管理
    var stateRange = sheet.getRange(this.sessionId+3, 3);
    stateRange.setValue(3);

    //sessionIdが一緒でstateが3のゲームデータを探して、stateを4にする
    var gameDataSheet = this.ss.getSheetByName("GameData");
    var gameDataLength = gameDataSheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();
    for(var i = 0; i < gameDataLength; i++) {
      var range = gameDataSheet.getRange(i+3, 2);
      var sessionId = range.getValue();
      if(this.sessionId == sessionId) {
        var gameDataStateRange = gameDataSheet.getRange(i+3, 5);
        var state = gameDataStateRange.getValue();
        if(state == 3) {
          gameDataStateRange.setValue(4);
          break;
        }
      }
    }

  }

}
