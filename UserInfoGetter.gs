class UserInfoGetter {
  constructor() {

  }

  getInfo(userId) {
    this.setOptions();

    var userInfoJson = UrlFetchApp.fetch('https://api.line.me/v2/bot/profile/' + userId, this.options).getContentText();

    const userInfo = JSON.parse(userInfoJson);
    this.userInfo = userInfo;
  }

  setOptions() {
    var headers = {
      'Authorization': 'Bearer ' + TOKEN
    };

    var options = {
      'method': 'GET',
      'headers': headers,
    };
    this.options = options;
  }

}