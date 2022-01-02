//答え合わせ時のメッセージイベント
class UserCheckMessageEvent extends MessageEvent {
  constructor(event, id) {
    super(event);
    this.id = id;
    this.mr = new MessageReplyer(event.replyToken);
    this.mp = new MessagePusher(event.source.userId);
    this.ug = new UserInfoGetter();
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
        pushMessage += "\nです！\nグループに戻ってください！";
      }

      this.mp.push(pushMessage);

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
    stateRange = sheet.getRange(this.sessionId+3, 3);
    stateRange.setValue(4);
  }

}
