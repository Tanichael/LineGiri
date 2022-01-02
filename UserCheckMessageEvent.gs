//答え合わせ時のメッセージイベント
class UserCheckMessageEvent extends MessageEvent {
  constructor(event, id) {
    super(event);
    this.id = id;
    this.mr = new MessageReplyer(event.replyToken);
    this.mp = new MessagePusher(event.source.userId);
    this.ug = new UserInfoGetter();
    this.sessionsSheet = this.ss.getSheetByName("Sessions");
    this.gameDataSheet = this.ss.getSheetByName("GameData");
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
    var data = this.event.postback.data;
    var pushMessage;

    var correctNum;
    var sheet = this.ss.getSheetByName("GameData");
    var correctNumRange = sheet.getRange(this.id+3, 8);
    correctNum = correctNumRange.getValue();

    if(data == "end") {
      if(correctNum == 0) {
        pushMessage = "正解者はいませんでした！";
      } else {
        pushMessage = "正解者は\n\n";
        for(var i = 0; i < correctNum; i++) {
          var userIdRange = sheet.getRange(this.id+3, 9+i);
          var userId = userIdRange.getValue();
          this.ug.getInfo(userId);
          var userName = this.ug.userInfo.displayName;
          pushMessage += userName + "\n";
        }
        pushMessage += "\nです！";
      }

      this.mp.push(pushMessage + "\nグループに戻ってください！");

      this.calculatePoints();
      var pointsMessage = this.createPointsMessage();

      var sessionsSheet = this.ss.getSheetByName("Sessions");
      var groupIdRange = sessionsSheet.getRange(this.sessionId+3, 2);
      var groupId = groupIdRange.getValue();
      var mpGroup = new MessagePusher(groupId);
      this.mpGroup = mpGroup;
      mpGroup.push(pushMessage);
      mpGroup.push(pointsMessage);

      //ステートの管理
      this.manageState();
    } else {
      //すでに追加していたら削除
      var flag = 0;
      for(var i = 0; i < correctNum; i++) {
        var userIdRange;
        var userId;

        if(flag == 1) {
          //前にずらしていく
          userIdRange = sheet.getRange(this.id+3, 9+i);
          userId = userIdRange.getValue();
          var newUserIdRange = sheet.getRange(this.id+3, 9+i-1);
          newUserIdRange.setValue(userId);
          continue;
        }

        userIdRange = sheet.getRange(this.id+3, 9+i);
        userId = userIdRange.getValue();
        if(data == userId) { 
          userIdRange.setValue("");
          flag = 1;
        }
      }

      if(flag == 1) {
        //いれば一人減らす
        correctNumRange.setValue(correctNum-1);

        this.ug.getInfo(data);
        var userName = this.ug.userInfo.displayName;
        pushMessage = userName + "を削除しました";

      } else {
        //いなければ追加する
        var userIdRange = sheet.getRange(this.id+3, 9+correctNum);
        userIdRange.setValue(data);
        correctNumRange.setValue(correctNum+1);
        this.ug.getInfo(data);
        var userName = this.ug.userInfo.displayName;
        pushMessage = userName + "を追加しました";
      }

      this.mp.push(pushMessage);

    }
    
  }

  manageState() {
    var sheet = this.ss.getSheetByName("GameData");
    var stateRange = sheet.getRange(this.id+3, 5);
    stateRange.setValue(5);

    sheet = this.ss.getSheetByName("Sessions");
    var turnRange = sheet.getRange(this.sessionId+3, 18);
    var turn = turnRange.getValue();

    var populationRange = sheet.getRange(this.sessionId+3, 4);
    var population = populationRange.getValue();

    stateRange = sheet.getRange(this.sessionId+3, 3);

    if(turn >= population * CYCLE_LIMIT - 1) {
      this.mpGroup.push("ゲームはこれで終わりです！プレイしてくれてありがとう！！");
      stateRange.setValue(5);
    } else {
      this.mpGroup.push("次のお題に行くときは「@next」と発言してください！");
      stateRange.setValue(4);
    }
  }

  calculatePoints() {
    var correctNumRange = this.gameDataSheet.getRange(this.id+3, 8);
    var correctNum = correctNumRange.getValue();
    for(var i = 0; i < correctNum; i++) {
      var correctUserId;
      var correctUserIdRange = this.gameDataSheet.getRange(this.id+3, 9+i);
      correctUserId = correctUserIdRange.getValue();

      var populationRange = this.sessionsSheet.getRange(this.sessionId+3, 4);
      var population = populationRange.getValue();
      for(var j = 0; j < population; j++) {
        var userId;
        var userIdRange = this.sessionsSheet.getRange(this.sessionId+3, 5+j);
        userId = userIdRange.getValue();
        
        if(userId == correctUserId) {
          var pointsRange = this.sessionsSheet.getRange(this.sessionId+3, 11+j);
          var points = pointsRange.getValue();

          //ここは一旦適当に
          points += 10;
          pointsRange.setValue(points);
        }
      }
    }
  }

  createPointsMessage() {
    var pointsMessage = "現在の得点\n";

    var populationRange = this.sessionsSheet.getRange(this.sessionId+3, 4);
    var population = populationRange.getValue();

    for(var i = 0; i < population; i++) {
      var userId;
      var userIdRange = this.sessionsSheet.getRange(this.sessionId+3, 5+i);
      userId = userIdRange.getValue();

      this.ug.getInfo(userId);
      var userName = this.ug.userInfo.displayName;
      
      var pointsRange = this.sessionsSheet.getRange(this.sessionId+3, 11+i);
      var points = pointsRange.getValue();

      pointsMessage = pointsMessage + userName + ": " + points;

      if(i != population - 1) {
        pointsMessage += "\n";
      }

    }

    return pointsMessage;
  }

}
