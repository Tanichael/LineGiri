//UserID
const LINE_USER_ID = "Uce9cb261c09d08072e5fcb45c25b187c";

//チャンネルアクセストークン
const TOKEN = "MOoaEu/BNnMDA1JWVH85iuIBEKqRfaj/KvxPWbuo4ZdR5ri71F2svEemIoxwD+ljTwufQG1iqTxrbaufUrCVlW7AstVKi/FkOIv+wmBSN7bZf2qAycVoMDAcApGznCw65USw+cRQnmAN+28i6pRFvgdB04t89/1O/w1cDnyilFU=";

const SPREADSHEET_ID = "1V7m1po_DhToXgcNLs4H3RQa2uKhldGITC1kJaQAUmvQ";

const FOLDER_ID = "1r0gl9DOnpvj4OAA_qd4SO1LuU5CsTlnU";

const POPULATION_LIMIT = 6;

const TURN_LIMIT = 3;

const RECRUIT_BUBBLE_MESSAGE = 
{
  "type": "flex",
  "altText": "This is a Flex Message",
  "contents": {
    "type": "bubble",
    "direction": "ltr",
    "header": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "参加方法",
          "weight": "bold",
          "size": "xl",
          "color": "#000000FF",
          "align": "center",
          "contents": []
        }
      ]
    },
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "①まずはギリしりbotを友達追加します",
          "align": "center",
          "contents": []
        },
        {
          "type": "text",
          "text": "②あとは下の参加ボタンを押すだけ",
          "align": "start",
          "contents": []
        },
        {
          "type": "text",
          "text": "うえーい",
          "color": "#FFFFFFFF",
          "contents": []
        },
        {
          "type": "text",
          "text": "全員が参加したら確定を押してね！",
          "contents": []
        },
        {
          "type": "text",
          "text": "hello, world",
          "size": "xs",
          "color": "#FFFFFFFF",
          "contents": []
        },
        {
          "type": "text",
          "text": "※キャンセルの場合はギリしりの個人トークで",
          "size": "xs",
          "contents": []
        },
        {
          "type": "text",
          "text": "「@キャンセル」と送ってください．",
          "size": "xs",
          "contents": []
        }
      ]
    },
    "footer": {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "確定",
            "text": "確定します"
          }
        },
        {
          "type": "button",
          "action": {
            "type": "message",
            "label": "参加",
            "text": "参加します"
          }
        }
      ]
    }
  }
}