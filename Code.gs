function test() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  var range = sheet.getRange(1, 1);
  range.setValue("message");
}

function doPost(e) {
  const responseLine = e.postData.contents;
  const event = JSON.parse(responseLine).events[0];

  //一気に他のグループからもきたらここで弾く

  handleEvent(event);
}

//eventを場合分けして適切なインスタンスを生成する関数
//必要なイベントはsource, ステートごとに存在する
//不適切なイベントは各クラス内で対処する
function handleEvent(event) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  var state;
  var me;

  //グループチャットだった場合
  if(event.source.type == "group") {
    const sheet = ss.getSheetByName("Sessions");

  }

  //ユーザーとの個人チャットだった場合
  if(event.source.type == "user") {
    if(event.type == "message") {
      if(event.message.type == "text") { //テキストメッセージだったときの処理
        me = new UserTextMessageEvent(event);
      } else if (event.message.type == "image") { //画像メッセージだったときの処理
        me = new UserImageMessageEvent(event);
      }
    }
  }

  me.handle();

}