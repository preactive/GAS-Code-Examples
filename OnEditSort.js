function onEdit()
{
  //Scope Limits------------
  var sheetToSort = ["Sheet8","Sheet13"]; // replace this with "Form Responses 1" or whichever sheet you want to sort automatically
  var rangeToSort = "A2:AB";
  var sortOrder = [{column: 1, ascending: true}];//, // column A = 1, B = 2, etc
  //=======================
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheetToSort.indexOf(sheet.getName()) == -1){return;}
  
  var editedColumn = sheet.getActiveCell().getColumn();
  if(sortOrder[i].column == editedColumn)
  {
    sortSheet(sheetToSort,rangeToSort,sortOrder);
  }
}

function sortSheet(sheetToSort,rangeToSort,sortOrder)
{
  for(var i = 0, iL = sheetToSort.length; i<iL; i++)
  {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetToSort[i]);
  var range = sheet.getRange(rangeToSort);
  range.sort(sortOrder);
  }
}
