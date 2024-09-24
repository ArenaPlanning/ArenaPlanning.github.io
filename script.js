
function checkCheckboxes() {
  
  let checkboxes = document.querySelectorAll(".checkboxes");
  
  
  let checkedValues = [];

  checkboxes.forEach(function(checkbox) {
    
    if (checkbox.checked) {
      checkedValues.push(checkbox.value); 
    }
  });
  
  // Display the checked values
  document.getElementById('plz').textContent = checkedValues.length > 0 ? 
    "Selected: " + checkedValues.join(", ") : "No classes selected";
}