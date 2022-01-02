function handleUserEvent(event) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  var me;
  const sheet = ss.getSheetByName("GameData");
  const userId = event.source.userId;
  var id;

  var range;
  var length = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

  var flag = 0;
  var state;

  for(var i = 0; i < length - 2; i++) {
    range = sheet.getRange(i+3, 4);
    if(range.getValue() == userId) {
      range = sheet.getRange(i+3, 5);
      state = range.getValue();

      //すでに処理終了しているデータ
      if(state == 5) continue;

      if(state == 1) {
        flag = 1;
        id = i;
        me = new UserTextMessageEvent(event, id);
        break;
      }

      if(state == 2) {
        flag = 1;
        id = i;
        me = new UserImageMessageEvent(event, id);
        break;
      }

      if(state == 3) {
        flag = 1;
        id = i;
        me = new UserWaitMessageEvent(event, id);
        break;
      }

      if(state == 4) {
        flag = 1;
        id = i;
        me = new UserCheckMessageEvent(event, id);
        break;
      }
    }
  
  }

  if(flag == 0) {
    //ゲーム中じゃない時の処理
    var mr = new MessageReplyer(event.replyToken);
    mr.reply("今はゲーム中じゃないか、回答者かのどっちかです！！");
  }


  return me;
}
