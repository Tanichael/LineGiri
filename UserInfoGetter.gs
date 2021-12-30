// class UserInfoGetter {
//   constructor(userId) {
//     this.userId = userId;
//   }

//   getInfo() {
//     this.setOptions();

//     userInfoJson = UrlFetchApp.fetch('https://api.line.me/v2/bot/profile/' + this.userId, this.options);

//     const userInfo = JSON.parse(userInfoJson);
//     this.userInfo = userInfo;
//   }

//   setOptions() {
//     var headers = {
//       'Authorization': 'Bearer ' + TOKEN
//     };

//     var options = {
//       'method': 'GET',
//       'headers': headers,
//     };
//   }
// }