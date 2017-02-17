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
  
  var FWhseNum      =  gco_('Warehouse #',Fsheet);

  var FSN01         =  gco_('SN #1',Fsheet);
  var FSN02         =  gco_('SN #2',Fsheet);
  var FSN03         =  gco_('SN #3',Fsheet);

  var Process       =  gco_('Process',Fsheet);

  // Loops through Form Response Tab
  for (var i = 1, sL=ResponseData.length; i<sL; i++)
  {
    // If there is no location number in the column then it will skip the row
    if(isEmpty_(ResponseData[i][FWhseNum])){continue;}
    
    // If there is an x in the process column then it can be skipped
    if(ResponseData[i][Process] == "x"){continue;}
    
    // Puts location Number as the key in the object and the value is an array of values for later check.
    FormResponseObj[ResponseData[i][FWhseNum]] = [ResponseData[i][FSN01],ResponseData[i][FSN02], ResponseData[i][FSN03]]
    
    // Sense both above conditions were not met it will process the row and mark it as processes
    Fsheet.getRange(i+1,Process+1).setValue("x")
    
  }
  
  var Rsheet        = ss.getSheetByName("Inventory");
  var RecieveData   = Rsheet.getDataRange().getValues();

  var RWhseNum     =  gco_('Whse',Rsheet);
  var RSN1         =  gco_('SN 1',Rsheet);
  var RSN2         =  gco_('SN 2',Rsheet);
  var RSN3         =  gco_('SN 3',Rsheet);

  // Loops through Inventory Tab where known data is to be checked against
  for (var l = 1, rdL=RecieveData.length; l<rdL; l++)
  {
  
    // If the value of the current row and location column offset value is in the set of keys in FormResponseObj
    // This is to save processing if current value is not in FormResponseObj it will skip the row for checking.
    if(RecieveData[l][RWhseNum] in FormResponseObj)
    {
    
      // Loop for the number of items to are checking against.  In this example there are three
      for(var o = 1; o<3;o++)
      {
      
        // Magic! Checking if the current columns Serial Number(which is the eval bit) by index against the array which
        // is found in the value of the current locations FormResponseObj key.
        //
        // The first loop eval("RSN" + o) will result in the contents of the variable RSN1 and that could be column 5
        // now your are getting the value of RecieveData[Row][Column]
        // That value is being checked via indexOf against FormResponseObj's current warehouse number array value then process
        if(FormResponseObj[RecieveData[l][RWhseNum]].indexOf(RecieveData[l][eval("RSN" + o)]) > -1) 
        { 
        
          // If there is currently no value on the current Columns Serial Number then it will skip this loop
          if(isEmpty_(RecieveData[l][eval("RSN" + o)])){continue;}
          
          // If it passes the last check above it has found a SN from from FormResponseObj data and will put an x in the
          // in the column next to it.  Further gco_() could used to assign a column programmattically
          Rsheet.getRange(1 + l, 2 + eval("RSN"+o)).setValue("X") 
        }
      }
    } 
  }
}
