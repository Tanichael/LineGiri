function doPost(e) {
  const responseLine = e.postData.contents;
  const event = JSON.parse(responseLine).events[0];

  //一気に他のグループからもきたらここで弾く
  //lock 排他制御の処理

  handleEvent(event);
}

//eventを場合分けして適切なインスタンスを生成する関数
//eventの状況によってセッションおよびゲームのstateを管理する
//必要なイベントはsource, ステートごとに存在する
//不適切なイベントは各クラス内で対処する
function handleEvent(event) {
  var me;

  //グループチャットだった場合
  if(event.source.type == "group") {
    me = handleGroupEvent(event);
  }

  //ユーザーとの個人チャットだった場合
  if(event.source.type == "user") {
    me = handleUserEvent(event);
  }
  
  me.handle();
}