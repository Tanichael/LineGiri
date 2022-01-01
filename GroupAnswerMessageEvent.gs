//回答募集時のメッセージイベント
class GroupAnswerMessageEvent extends MessageEvent {
  constructor(event, sessionId) {
    super(event);
    this.sessionId = sessionId;
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
      //答え合わせタイムに以降
    }
    this.text = this.event.message.text;

    var textLastChar = Utilities.getLastChar(this.text);

    var answer;
    var sheet = this.ss.getSheetByName("Record");
    var gameLength = sheet.getRange(this.sessionId+3, 1).getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn();
    range = sheet.getRange(this.sessionId+3, gameLength);
    answer = range.getValue();
    var answerLastChar = Utilities.getLastChar(answer);


    
  }

}
