
        function show() {
        
        let y = document.getElement("Geometry Intensified").value;
        document.getElementById('plz').textContent = y;
        
        }
         
        function checkCheckboxes() {
        
        
        let checkboxes = document.querySelectorAll(".checkboxes");
        
        
        let checkedValues = [];
        
        
        checkboxes.forEach(function(checkbox) {
          if (checkbox.checked) {
            checkedValues.push(checkbox.value);  
          }
        });
        
        // Display the checked values
        document.getElementById('plz').textContent = "Selected: " + checkedValues.join(", ");
      }
  