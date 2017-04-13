//Query or lookup data from spreadsheet and build a form drop down
function updateForm(e) {
  // Grabbing Whse Data from Master Location Spreadsheet Col A:E and returning it to a variable
  var Locations = importRange_('1r7p7zRKW8zKthtQGXcvYPjpilyUOPpL8...........','All Locations!A:E','return','y')

  // Vlookup to return to the lookup variable only the whse that are open which is defined as the "O" key in column A and returning Column D which is the warehouse number
  var lookup = Lookup_("O",Locations,0,[3],"return","y","n","y");

  var existingForm = FormApp.openById('19jelORHExXYHBxqiL_krixg2XAhr7YA............');

  var allItems = existingForm.getItems();
  for (i=0;i<allItems.length;i+=1) 
  {
    var thisItem = allItems[i];
    var thisItemType = thisItem.getType();
    
    if (thisItemType===FormApp.ItemType.LIST) 
    {
      myCheckBoxItem = thisItem.asListItem();
      myCheckBoxItem.setChoiceValues(lookup)
    }
  }
}
