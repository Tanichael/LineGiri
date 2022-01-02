//個人からの画像投稿まちの時のメッセージイベント
class GroupTalkMessageEvent extends MessageEvent {
  constructor(event, sessionId) {
    super(event);
    this.sessionId = sessionId;
    this.mp = new MessagePusher(event.source.groupId);
    this.ug = new UserInfoGetter();
  }

  //実行する処理をまとめる
  handle() {
    if(this.event.type != "message") {
      this.mp.push("次のお題に行くときは@nextと発言してください！");
    }
    this.processingEvent();
  }

  processingEvent() {
    if(this.event.message.text == "@next") {
      //ターン処理

      //GameDataデータベースに場所を確保する
      const gameDataSheet = this.ss.getSheetByName("GameData");
      const sessionsSheet = this.ss.getSheetByName("Sessions");
      var gameDataRange;
      
      var length = gameDataSheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

      //id指定
      gameDataRange = gameDataSheet.getRange(length+1, 1);
      gameDataRange.setValue(length-2);

      //sessionId指定
      gameDataRange = gameDataSheet.getRange(length+1, 2);
      gameDataRange.setValue(this.sessionId);

      //ターン数関連処理
      var turn;
      var turnRange = sessionsSheet.getRange(this.sessionId+3, 18);
      turn = turnRange.getValue();
      turn += 1;
      turnRange.setValue(turn);

      gameDataRange = gameDataSheet.getRange(length+1, 3);
      gameDataRange.setValue(turn);

      //次のお題を決めるuserId指定
      var userId;
      var population;
      var populationRange = sessionsSheet.getRange(this.sessionId+3, 4);
      population = populationRange.getValue();

      var idx = turn % population;

      var userIdRange = sessionsSheet.getRange(this.sessionId+3, 5+idx);
      userId = userIdRange.getValue();

      gameDataRange = gameDataSheet.getRange(length+1, 4);
      gameDataRange.setValue(userId);

      //state指定
      gameDataRange = gameDataSheet.getRange(length+1, 5);
      gameDataRange.setValue(1);

      //lastWordsの更新
      var lastWords;
      var recordSheet = this.ss.getSheetByName("Record");
      var gameLength = recordSheet.getRange(this.sessionId+3, 1).getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn();
      var lastWordsRange = recordSheet.getRange(this.sessionId+3, gameLength);
      lastWords = lastWordsRange.getValue();
      var sessionsLastWordsRange = sessionsSheet.getRange(this.sessionId+3, 17);
      sessionsLastWordsRange.setValue(lastWords);
      var lastChar = Utilities.getLastChar(lastWords);

      this.ug.getInfo(userId);
      var pushText = "次のお題に移ります！\n" + this.ug.userInfo.displayName + "さんは個人チャットでお題と絵を送信してください！";
      this.mp.push(pushText);

      var mpUser = new MessagePusher(userId);

      mpUser.push("「" + lastChar +"」から始まるお題を返信してください！");

      this.manageState();

    }
  }

  manageState() {
    var sheet = this.ss.getSheetByName("Sessions");
    var stateRange = sheet.getRange(this.sessionId+3, 3);
    stateRange.setValue(1);
  }

}
