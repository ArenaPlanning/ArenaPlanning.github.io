
function checkCheckboxes() {
  
  let checkboxes = document.querySelectorAll(".checkboxes");
  
  
  let checkedValues = [];

  checkboxes.forEach(function(checkbox) {
    
    if (checkbox.checked) {
      checkedValues.push(checkbox.value); 
    }
  });
  
  // Display the checked values
  let yeast = checkedValues.join(" ");
  document.getElementById('plz').textContent = + yeast;
}

function generatePermutations(arr) {
  if (arr.length <= 1) {
    return [arr];
  }

  let result = [];

  
  for (let i = 0; i < arr.length; i++) {
    let current = arr[i];
    let remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    let remainingPerms = generatePermutations(remaining);
  }
}