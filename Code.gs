function test() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  var range = sheet.getRange(1, 1);
  range.setValue("message");
}

function doPost(e) {
  const responseLine = e.postData.contents;
  const event = JSON.parse(responseLine).events[0];

  handleEvent(event);
}

function handleEvent(event) {
  var me;
  
  if(event.type == "message") {
    if(event.message.type == "text") { //テキストメッセージだったときの処理
      me = new TextMessageEvent(event);
    } else if (event.message.type == "image") { //画像メッセージだったときの処理
      me = new ImageMessageEvent(event);
    }
  }

  me.handle();

}