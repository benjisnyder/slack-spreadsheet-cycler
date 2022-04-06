function getNextOrganizer() {
  
  const sheet = SpreadsheetApp.getActive();
  let data = sheet.getRange("A1:B50").getValues();
  let payload = buildData(data, sheet);
  sendMessage(payload);
}

function buildData(data, sheet) {
  var rowIndex = 1;
  var token = "next";
  var payload;
  var nextColA;
  var nextColB;
  var nextColC;

  data.forEach(function(d) {
    var currentColA = sheet.getRange("A" + rowIndex); // user name
    var currentColB = sheet.getRange("B" + rowIndex); // if user is next, this column will have "next" in it
    var currentColC = sheet.getRange("C" + rowIndex); // user ID

    var currentColAVal = currentColA.getValue();
    var currentColBVal = currentColB.getValue();
    var currentColCVal = currentColC.getValue();

    var nextColAVal;
    var nextColCVal;

    var additionalMessage = `
      \n\n *Workshop Hosting Instructions:*
        1. Monday morning send out a message in <#GMMGAD9S4> with <https://docs.google.com/document/d/16uAe0U4fxnaH8T6tciws8218Kh0gij6j3XyZrj2mJuo/edit?usp=sharing|link> to sign up
        2. Get teammates excited to share latest stuffs or workshop to use collective brain for ideas
        3. MC the meeting
    \n To change the order or presenters, go to <https://docs.google.com/spreadsheets/d/1MwQyiNqVo7W0YJ0Jm7zwDHSnd-oafbqQyjmDbclXpv8/edit?usp=sharing|this spreadsheet> and add "next" to who\'s next or rearrange people.
    `;

    if (currentColBVal === token && typeof payload === 'undefined') {
      currentColB.setValue(''); // set the current person as blank

      nextColA = sheet.getRange("A" + (rowIndex+1));
      nextColB = sheet.getRange("B" + (rowIndex+1));
      nextColC = sheet.getRange("C" + (rowIndex+1));

      if (nextColA.getValue() === '') {
        // if we're at the end of the rows, set the next row as row 1
        nextColA = sheet.getRange("A1");
        nextColB = sheet.getRange("B1");
        nextColC = sheet.getRange("C1");
      }

      nextColAVal = nextColA.getValue();
      nextColCVal = nextColC.getValue();

      payload = {
        "text":
        "Heads up! The workshop host for today is <@" + currentColCVal + "> (next week it\'s <@" + nextColCVal + ">)." + additionalMessage
      };
    } else {
      // if we haven't found the next person, keep going
      rowIndex++;
    }
  });

  if (typeof nextColB !== 'undefined') {
    nextColB.setValue(token);
  } else {
    payload = {"text":"No one is up next. Add \"next\" to who\'s up now in the spreadsheet bookmarked at the top of this channel."};
  }

  return payload;
}

function sendMessage(payload) {
    const webhook = ""; // add a slack web hook url here

    var options = {
      "method": "post", 
      "contentType": "application/json", 
      "muteHttpExceptions": true, 
      "payload": JSON.stringify(payload) 
    };
    
    try {
      UrlFetchApp.fetch(webhook, options);
    } catch(e) {
      Logger.log(e);
    }
};
