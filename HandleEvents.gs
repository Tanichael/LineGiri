function handleGroupEvent(event) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  var me;
  //探す処理
  const groupId = event.source.groupId;
  var sessionId;

  const sheet = ss.getSheetByName("Sessions");
  
  var length = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

  var flag = 0; //グループ検索フラグ
  var state;

  for(var i = 0; i < length; i++) {
    var range = sheet.getRange(i+3, 2);
    if(range.getValue() == groupId) {
      range = sheet.getRange(i+3, 3);
      state = range.getValue();
      //終了しているゲームの時
      if(state == 4) continue;

      //募集時の時
      else if(state == 0) {
        flag = 1;
        sessionId = i;
        me = new GroupRecruitmentMessageEvent(event, sessionId);
        break;
      }

      //投稿待ちの時
      else if(state == 1) {
        flag = 1;
        sessionId = i;
        me = new GroupWaitMessageEvent(event);
        break;
      }

      //回答中の時
      else if(state == 2) {
        flag = 1;
        sessionId = i;
        me = GroupAnswerMessageEvent(event);
        break;
      }

      //答え合わせタイムの時
      else if(state == 3) {
        flag = 1;
        sessionId = i;
        me = GroupCheckMessageEvent(event);
        break;
      }
    }
  }

  //新しいゲームの時
  if(flag == 0) {
    //それ以外は無視
    me = new GroupStartMessageEvent(event);
    if(me.isStart == true) {
      //ステートの管理
      sessionId = length-2;
      var range;
      range = sheet.getRange(sessionId+3, 1);
      range.setValue(sessionId);
      range = sheet.getRange(sessionId+3, 2);
      range.setValue(groupId);
      range = sheet.getRange(sessionId+3, 3);
      range.setValue(0);
    }
  }

  return me;
}

function handleUserEvent(event) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  var me;
  if(event.type == "message") {
    if(event.message.type == "text") { //テキストメッセージだったときの処理
      me = new UserTextMessageEvent(event);
    } else if (event.message.type == "image") { //画像メッセージだったときの処理
      me = new UserImageMessageEvent(event);
    }
  }
  return me;
}