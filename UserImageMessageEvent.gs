class UserImageMessageEvent extends MessageEvent {
  constructor(event, id) {
    super(event);
    this.contentId = event.message.id;
    this.id = id;
  }

  handle() {
    var mr = new MessageReplyer(this.replyToken);

    if(this.event.message.type != "image") {
      mr.reply("画像を投稿してください！");
      return;
    }

    this.setSessionId();
    this.getBlob();

    if(this.imageId) {
      var sheet = this.ss.getSheetByName("GameData");
      var range = sheet.getRange(this.id+3, 7);
      range.setValue(this.imageId);

      mr.reply("Excellent!ではグループに戻ってください！！");

      //グループへの画像送信処理
      var groupId;
      groupId = this.getGroupId();
      var mp = new MessagePusher(groupId);
      mp.pushImage(this.imageId);

      sheet = this.ss.getSheetByName("Sessions");
      range = sheet.getRange(this.sessionId+3, 17);
      var lastWords = range.getValue();
      var lastChar = Utilities.getLastChar(lastWords);

      mp.push("画像はこちらです！では回答を始めてください！！\n回答を締め切るときは「@end」と発言してください！");
      mp.push("答えは「" + lastChar + "」から始まる単語です！");

      //ステート管理
      this.manageState();

    } else {
      mr.reply("すみません！保存に失敗したのでもう一度送ってください！");
    }

  }

  getGroupId() {
    var sheet = this.ss.getSheetByName("Sessions");
    var range = sheet.getRange(this.sessionId+3, 2);
    var groupId = range.getValue();

    return groupId;
  }

  setSessionId() {
    var sheet = this.ss.getSheetByName("GameData");
    var range = sheet.getRange(this.id+3, 2);
    this.sessionId = range.getValue();
  }

  manageState() {
    var sheet = this.ss.getSheetByName("GameData");
    var range = sheet.getRange(this.id+3, 5);
    range.setValue(3);

    sheet = this.ss.getSheetByName("Sessions");
    range = sheet.getRange(this.sessionId+3, 3);
    range.setValue(2);
  }

  getBlob() {
    //画像データの取得
    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    };
    var options = {
      'method': 'GET',
      'headers': headers,
    };
    var binary;
    binary = UrlFetchApp.fetch("https://api-data.line.me/v2/bot/message/" + this.contentId +"/content", options);

    var blob = binary.getBlob().getAs('image/png').setName(Number(new Date()) + '.png');

    this.saveBlob(blob);
  }

  saveBlob(blob) {
    try{
      var folder = DriveApp.getFolderById(FOLDER_ID);
      var file = folder.createFile(blob);
      this.imageId = file.getId();
    }catch(e){
      this.imageId = false;
    }
  }

}