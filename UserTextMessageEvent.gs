//isSafe
//0 -> OK
//1 -> ひらがな、カタカナ以外の文字が含まれている
//2 -> 語頭が不適切
//3 -> 「ん」で終わっている
//4 -> 単語が既出

class UserTextMessageEvent extends MessageEvent {
  constructor(event, id) {
    super(event);
    this.theme = event.message.text;
    this.id = id;
    this.isSafe = 0;
  }

  //実行する処理をまとめる
  handle() {
    this.processingEvent();
  }

  setSessionId() {
    var sheet = this.ss.getSheetByName("GameData");
    var range = sheet.getRange(this.id+3, 2);
    this.sessionId = range.getValue();
  }

  //適切にthemeを設定できたら画像待ち状態にしておく
  manageState() {
    var sheet = this.ss.getSheetByName("GameData");
    var range = sheet.getRange(this.id+3, 5);
    range.setValue(2);
  }

  //themeを記録
  processingEvent() {
    if(this.event.message.type != "text") {
      var mr = new MessageReplyer(this.replyToken);
      mr.reply("メッセージを送信してください！");
      return;
    }

    this.setSessionId();
    this.checkSafe();

    if(this.isSafe == 0) {
      //お題の設定
      var sheet = this.ss.getSheetByName("GameData");
      var range = sheet.getRange(this.id+3, 6);
      range.setValue(this.theme);

      //lastWordsの更新
      sheet = this.ss.getSheetByName("Sessions");
      range = sheet.getRange(this.sessionId+3, 17);
      range.setValue(this.theme);

      //recordの更新
      sheet = this.ss.getSheetByName("Record");
      var gameLength = sheet.getRange(this.sessionId+3, 1).getNextDataCell(SpreadsheetApp.Direction.NEXT).getColumn();
      range = sheet.getRange(this.sessionId+3, gameLength+1);
      range.setValue(this.theme);

      this.manageState();

      var replyMessage = this.theme + "ですね！では絵を描いてください！！";
      var mr = new MessageReplyer(this.replyToken);
      mr.reply(replyMessage);

    } else if(this.isSafe == 1) {
      //ひらがな、カタカナ以外の文字が含まれていた時の処理
      var mr = new MessageReplyer(this.replyToken);
      mr.reply("ひらがな、カタカナ以外の文字が含まれています！");

    } else if(this.isSafe == 2) {
      //語頭が不適切
      var lastWords;
      sheet = this.ss.getSheetByName("Sessions");
      range = sheet.getRange(this.sessionId+3, 17);
      lastWords = range.getValue();
      var lastChar = Utilities.getLastChar(lastWords);

      var mr = new MessageReplyer(this.replyToken);
      mr.reply(lastChar + "から始まる単語にしてください！");

    } else if(this.isSafe == 3) {
      var mr = new MessageReplyer(this.replyToken);
      mr.reply("その単語は「ん」で終わっています！");
    } else if(this.isSafe == 4) {
      var mr = new MessageReplyer(this.replyToken);
      mr.reply("その単語は既出です！");
    }

  }

  checkSafe() {
    var sheet;
    var range;

    var isHira = true;
    var isKata = true;
    isHira = Utilities.isHiragana(this.theme);
    isKata = Utilities.isKatakana(this.theme);
    if(isHira == false && isKata == false) {
      this.isSafe = 1;
      return;
    }

    var lastWords;
    sheet = this.ss.getSheetByName("Sessions");
    range = sheet.getRange(this.sessionId+3, 17);
    lastWords = range.getValue();
    var lastLastChar = Utilities.getLastChar(lastWords);
    var firstChar = this.theme.charAt(0);

    if(lastLastChar != firstChar) {
      this.isSafe = 2;
      return;
    }

    var lastChar = Utilities.getLastChar(this.theme);
    if(lastChar == "ん" || lastChar == "ン") {
      this.isSafe = 3;
      return;
    }

    var maxWordsNum = POPULATION_LIMIT * TURN_LIMIT;
    sheet = this.ss.getSheetByName("Record");
    for(var i = 0; i < maxWordsNum; i++) {
      range = sheet.getRange(this.sessionId+3, i+2);
      var words = range.getValue();
      if(words == this.theme) {
        this.isSafe = 4;
        return;
      }
    }

    //どのケースでもない時は正常
    this.isSafe = 0;

  }

}