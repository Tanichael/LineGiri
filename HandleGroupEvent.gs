function handleGroupEvent(event) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  var me;
  //探す処理
  const groupId = event.source.groupId;
  var sessionId;

  const sheet = ss.getSheetByName("Sessions");
  
  var length = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow();

  var flag = 0; //グループ検索フラグ
  var state;

  for(var i = 0; i < length - 2; i++) {
    var range = sheet.getRange(i+3, 2);
    if(range.getValue() == groupId) {
      range = sheet.getRange(i+3, 3);
      state = range.getValue();
      //終了しているゲームの時
      if(state == 4) continue;
      
      if(state == 0) {
        //募集時の時
        flag = 1;
        sessionId = i;
        me = new GroupRecruitmentMessageEvent(event, sessionId);
        break;
      } else if(state == 1) {
        //投稿待ち
        flag = 1;
        sessionId = i;
        me = new GroupWaitMessageEvent(event);
        break;
      } else if(state == 2) {
        //回答中の時
        flag = 1;
        sessionId = i;
        me = new GroupAnswerMessageEvent(event, sessionId);
        break;
      } else if(state == 3) {
        //答え合わせタイムの時
        flag = 1;
        sessionId = i;
        me = new GroupCheckMessageEvent(event, sessionId);
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

