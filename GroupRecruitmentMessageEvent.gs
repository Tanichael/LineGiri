//募集時のメッセージイベント
class GroupRecruitmentMessageEvent extends MessageEvent {
  constructor(event, sessionId) {
    super(event);
    this.sessionId = sessionId;
    this.isLimit = false;
    this.isEnd = false;
    this.isNoMember = false;
    this.mr = new MessageReplyer(event.replyToken);
    this.ug = new UserInfoGetter();
  }

  //実行する処理をまとめる
  handle() {
    this.processingEvent();
  }

  processingEvent() {
    if(this.event.type == "message") {
      if(this.event.message.text == "参加します") {
        //メンバー登録処理
        const sheet = this.ss.getSheetByName("Sessions");
        var range;
        var replyText;

        range = sheet.getRange(this.sessionId+3, 4);
        var population = range.getValue();

        for(var i = 0; i < population; i++) {
          var member;
          range = sheet.getRange(this.sessionId+3, i+5);
          member = range.getValue();
          if(this.source.userId == member) {
            replyText = "あなたはもう参加しています！";
            this.mr.reply(replyText);
            return;
          }
        }

        if(population == POPULATION_LIMIT) {
          this.isLimit = true;
          this.mr.reply("これ以上は参加できません！");
          return;
        }

        population = population + 1;
        range.setValue(population);

        range = sheet.getRange(this.sessionId+3, population+4);
        range.setValue(this.source.userId);

        replyText = "現在の参加者:\n";
        for(var i = 0; i < population; i++) {
          var member;
          range = sheet.getRange(this.sessionId+3, i+5);
          var memberId = range.getValue();
          
          this.ug.getInfo(memberId);
          member = this.ug.userInfo.displayName;
          replyText = replyText + member;
          if(i != population - 1) {
            replyText += "\n";
          }
        }

        this.mr.reply(replyText);
        
      } else if(this.event.message.text == "確定します") {
        const sheet = this.ss.getSheetByName("Sessions");
        var range;
        range = sheet.getRange(this.sessionId+3, 4);
        var population = range.getValue();
        if(population == 0) {
          this.isNoMember = true;
          this.mr.reply("メンバーがいません！"); 
          return;
        }
        
        //メンバー確定
        this.isEnd = true;
        
        //ステートの変更
        range = sheet.getRange(this.sessionId+3, 3);
        range.setValue(1);

        //最初のユーザーを決定してpushmessegeを送信
        var replyText = "参加者:\n";
        for(var i = 0; i < population; i++) {
          var member;
          range = sheet.getRange(this.sessionId+3, i+5);
          var memberId = range.getValue();
          
          this.ug.getInfo(memberId);
          member = this.ug.userInfo.displayName;
          replyText = replyText + member;
          if(i != population - 1) {
            replyText += "\n";
          }
        }

        range = sheet.getRange(this.sessionId+3, 5);
        var userId = range.getValue();

        //GameDataデータベースに場所を確保する
        const gameDataSheet = this.ss.getSheetByName("GameData");
        var gameDataRange;
        
        var length = gameDataSheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

        //id指定
        gameDataRange = gameDataSheet.getRange(length+1, 1);
        gameDataRange.setValue(length-2);

        //sessionId指定
        gameDataRange = gameDataSheet.getRange(length+1, 2);
        gameDataRange.setValue(this.sessionId);

        //ターン数指定
        gameDataRange = gameDataSheet.getRange(length+1, 3);
        gameDataRange.setValue(0);

        //userId指定
        gameDataRange = gameDataSheet.getRange(length+1, 4);
        gameDataRange.setValue(userId);

        //state指定
        gameDataRange = gameDataSheet.getRange(length+1, 5);
        gameDataRange.setValue(1);

        this.ug.getInfo(userId);
        replyText += "\n\n" + "ゲームを開始します！\n" + this.ug.userInfo.displayName + "さんは個人チャットでお題と絵を送信してください！";
        this.mr.reply(replyText);

        var mp = new MessagePusher(userId);
        mp.push("「り」から始まるお題を返信してください！");

      }
    }
  }

}

function test() {
  const ss = SpreadsheetApp.openById("1V7m1po_DhToXgcNLs4H3RQa2uKhldGITC1kJaQAUmvQ");
  const gameDataSheet = ss.getSheetByName("GameData");
  var gameDataRange;
  
  var length = gameDataSheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

  //id指定
  gameDataRange = gameDataSheet.getRange(length+1, 1);
  gameDataRange.setValue(length-2);
}