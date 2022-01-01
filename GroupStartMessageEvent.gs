//ゲームスタート時のメッセージイベント
class GroupStartMessageEvent extends MessageEvent {
  constructor(event) {
    super(event);
    if(event.type == "message" && event.message.text == "@start") {
      this.isStart = true;
    } else {
      this.isStart = false;
    }
  }

  //実行する処理をまとめる
  handle() {
    this.reply();
  }

  reply() {
    //返信処理
    this.setReplyConfig();

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', this.replyOptions);
  }

  setReplyText() {
    if(this.isStart == true) {
      //バブルメッセージの生成
      var replyText = "メンバー募集メッセージを送信します";
      this.replyText = replyText;
    } else {
      var replyText = "ゲームを始める際は「@start」と発言してください！";
      this.replyText = replyText;
    }
  }

  setReplyOptions() {
    var LineMessageObject;

    if(this.isStart == true) {
      LineMessageObject = [RECRUIT_BUBBLE_MESSAGE];
    } else {
      LineMessageObject = [{
        'type': 'text',
        'text': this.replyText
      }];
    }

    var replyHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    };
    var replyBody = {
      'replyToken': this.replyToken,
      'messages': LineMessageObject
    };
    var replyOptions = {
      'method': 'POST',
      'headers': replyHeaders,
      'payload': JSON.stringify(replyBody)
    };

    this.replyOptions = replyOptions;
  }

  setReplyConfig() {
    this.setReplyText();
    this.setReplyOptions();
  }
}