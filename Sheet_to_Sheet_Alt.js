// Dependant on: https://github.com/preactive/GAS-Helper-Function/blob/master/gco_.js
// Dependant on: https://github.com/preactive/GAS-Helper-Function/blob/master/isEmpty_.js

/* ===[Examples Sheets]
Form response:
| Warehouse # | SN #1 | SN #2 | SN #3 | Process |
| 1234        | fftt1 | gghh7 | bbxx1 |         |
| 4321        | sdfaw | ngh5c | 4g3qz |    x    |


Inventory before:
| Whse        | SN 1  | SN 1 x | SN 2  | SN 2 x | SN 3  | SN 3 x |
| 4321        | sdfaw |    x   | ngh5c |    x   | 4g3qz |    x   |
| 1234        | fftt1 |        | d2h26 |        | bbxx1 |        |

Inventory after:
| Whse        | SN 1  | SN 1 x | SN 2  | SN 2 x | SN 3  | SN 3 x |
| 4321        | sdfaw |    x   | 4g3qz |    x   | ngh5c |    x   |
| 1234        | fftt1 |    x   | d2h26 |        | bbxx1 |    x   |
*/
// Checking multiple columns to multiple columns across sheets
// gco_ allows you to find columns by title on a defined row which default to zero if not defined.
// if a user moved column 'SN 3' to Column A it nothing would change in the code as it is still labeled correctly.


function Checker() 
{
  var ss            = SpreadsheetApp.getActiveSpreadsheet();
  var Fsheet        = ss.getSheetByName("Form Responses");
  var ResponseData  = Fsheet.getDataRange().getValues();

  var FormResponseObj = {}
  
  var FColumnsRef   = ['SN #1','SN #2','SN #3','SN #4','SN #5','SN #6','SN #7','SN #8','SN #9','SN #10'];
  var FOtherColumns = ['Process','Warehouse #'];
  
  var FCols          =  gco_(FColumnsRef,Fsheet);
  var FOCols         =  gco_(FOtherColumns,Fsheet);

  for (var i = 1, sL=ResponseData.length; i<sL; i++)
  {
    if(isEmpty_(ResponseData[i][FOCols['Warehouse #']])){continue;}
    if(ResponseData[i][FOCols['Process']] == "Processed"){continue;}
    
    var forInColArr = [];
    for(FSNs in FCols){forInColArr.push(ResponseData[i][FCols[FSNs]]);
    FormResponseObj[ResponseData[i][FOCols['Warehouse #']]] = forInColArr
    
    Fsheet.getRange(i+1,FOCols['Process']+1).setValue("Processed")
    
  }
  
  var Rsheet        = ss.getSheetByName("Inventory");
  var RecieveData   = Rsheet.getDataRange().getValues();

  
  var RColumnsRef   = ['SN 1','SN 2','SN 3','SN 4','SN 5','SN 6','SN 7','SN 8','SN 9','SN 10'];
  var RColumnsRefX   = ['SN 1 x','SN 2 x','SN 3 x','SN 4 x','SN 5 x','SN 6 x','SN 7 x','SN 8 x','SN 9 x','SN 10 x'];

  var ROtherColuns  = ['Whse'];
  
  var RCols      =  gco_(RColumnsRef,Rsheet);
  var RColsX     =  gco_(RColumnsRefX,Rsheet);
    
  var ROCols     =  gco_(ROtherColuns,Rsheet);
    
    
  for (var l = 1, rdL=RecieveData.length; l<rdL; l++)
  {
    if(RecieveData[l][ROCols['Whse']] in FormResponseObj)
    {
      for(var o = 1, oL = RColumnsRef.length; o<oL; o++)
      {
        if(FormResponseObj[RecieveData[l][ROCols['Whse']]].indexOf(RecieveData[l][RCols['SN ' + o]]) > -1) 
        { 
          if(isEmpty_(RecieveData[l][RCols['SN ' + o]])){continue;}
          Rsheet.getRange(l+1, RColsX['SN ' + o + " x"]+ 1).setValue("Found") 
        }
      }
    } 
  }
}
