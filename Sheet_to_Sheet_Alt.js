// Dependant on: https://github.com/preactive/GAS-Helper-Function/blob/master/gco_.js
// Dependant on: https://github.com/preactive/GAS-Helper-Function/blob/master/isEmpty_.js

/* ===[Examples Sheets]
Form response:
| Warehouse # | SN #1 | SN #2 | SN #3 | Process |
| 1234        | fftt1 | gghh7 | bbxx1 |         |
| 4321        | sdfaw | ngh5c | 4g3qz |    x    |


Inventory before:
| Whse        | SN 1  |    | SN 2  |    | SN 3  |    |
| 4321        | sdfaw |  x | ngh5c |  x | 4g3qz |  x |
| 1234        | fftt1 |    | d2h26 |    | bbxx1 |    |

Inventory after:
| Whse        | SN 1  |    | SN 2  |    | SN 3  |    |
| 4321        | sdfaw |  x | 4g3qz |  x | ngh5c |  x |
| 1234        | fftt1 |  x | d2h26 |    | bbxx1 |  x |
*/
// Checking multiple columns to multiple columns across sheets


function Checker() 
{
  var ss           = SpreadsheetApp.getActiveSpreadsheet();
  var Fsheet        = ss.getSheetByName("Form Responses");
  var ResponseData = Fsheet.getDataRange().getValues();

  var FormResponseObj = {}
  
  var ColumnsRef   = ['SN #1','SN #2','SN #3','SN #4','SN #5','SN #6','SN #7','SN #8','SN #9','SN #10'];
  var OtherColumns = ['Process','Warehouse #'];
  
  var Cols          =  gco_(ColumnsRef,Fsheet);
  var OtherCols     =  gco_(OtherColumns,Fsheet);

  for (var i = 1, sL=ResponseData.length; i<sL; i++)
  {
    if(isEmpty_(ResponseData[i][OtherCols['Warehouse #']])){continue;}
    if(ResponseData[i][Process] == "x"){continue;}
    
    var forInColArr = [];
    for(FSNs in Cols){forInColArr.push(ResponseData[i][Cols[FSNs]]);
    
    FormResponseObj[ResponseData[i][OtherCols['Warehouse #']]] = forInColArr
    
    Fsheet.getRange(i+1,Process+1).setValue("x")
    
  }
  
  var Rsheet        = ss.getSheetByName("Inventory");
  var RecieveData   = Rsheet.getDataRange().getValues();

  var RWhseNum     =  gco_('Whse',Rsheet);
  var RSN1         =  gco_('SN 1',Rsheet);
  var RSN2         =  gco_('SN 2',Rsheet);
  var RSN3         =  gco_('SN 3',Rsheet);

  for (var l = 1, rdL=RecieveData.length; l<rdL; l++)
  {
    if(RecieveData[l][RWhseNum] in FormResponseObj)
    {
      for(var o = 1; o<3;o++)
      {
        if(FormResponseObj[RecieveData[l][RWhseNum]].indexOf(RecieveData[l][eval("RSN" + o)]) > -1) 
        { 
          if(isEmpty_(RecieveData[l][eval("RSN" + o)])){continue;}
          Rsheet.getRange(1 + l, 2 + eval("RSN"+o)).setValue("X") 
        }
      }
    } 
  }
}
