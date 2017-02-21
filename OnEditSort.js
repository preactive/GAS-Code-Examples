var sheetToSort = "МОНТАЖ 2017"; // replace this with "Form Responses 1" or whichever sheet you want to sort automatically
var rangeToSort = "A3:AB30";
var sortOrder = [{column: 1, ascending: true}];//, // column A = 1, B = 2, etc.
                 //{column: 3, ascending: true}, // for each column, use true for ascending and false for descending order
                 //{column: 4, ascending: true},
                 //{column: 5, ascending: true}];


function onEdit() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() != sheetToSort) return;
  var editedColumn = sheet.getActiveCell().getColumn();
  for (var i = 0, numSortColumns = sortOrder.length; i < numSortColumns; i++) {
    if (sortOrder[i].column == editedColumn) {
      sortSheet();
      break;
    }
  }
}

function sortSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetToSort);
  var range = sheet.getRange(rangeToSort);
  range.sort(sortOrder);
}
