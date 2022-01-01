//------------------------------------------------------------------------------------------
//
// 参考文献
//
// ひらがな判定
// url: https://javascript.programmer-reference.com/js-check-hiragana/
//
// カタカナ判定
// url: https://javascript.programmer-reference.com/js-check-zenkaku-katakana/
//
//------------------------------------------------------------------------------------------

class Utilities {
  static isKatakana(str) {
    str = (str==null)?"":str;
    if(str.match(/^[ァ-ヶー　]+$/)){
      return true;
    }else{
      return false;
    }
  }

  static isHiragana(str) {
    str = (str==null)?"":str;
    if(str.match(/^[ぁ-んー　]*$/)){    //"ー"の後ろの文字は全角スペースです。
      return true;
    }else{
      return false;
    }
  }

  static getLastChar(str) {
    str = (str==null)?"":str;
    var length = str.length;
    var lastChar = "";
    for(var i = 0; i < length; i++) {
      if(str.charAt(length-1-i) == "-" || str.charAt(length-1-i) == "ー" || str.charAt(length-1-i) == " " || str.charAt(length-1-i) == "　") {
        continue;
      }
      lastChar = str.charAt(length-1-i);
      break;
    }
    return lastChar;
  }
}
