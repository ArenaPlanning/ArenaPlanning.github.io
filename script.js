fetch('https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/pub?output=csv')
.then(response => response.text())
.then(csv => {
  const rows = csv.split('\n').map(row => row.split(','));
  console.log(rows); // Now you have the data as an array of rows
  // Process the rows for your class combination logic here
})
.catch(error => console.error('Error fetching the CSV:', error));

function findRowByValue(array, value) {
  
  for (let i = 0; i < array.length; i++) {
    
    if (array[i][0] === value) {
      return array[i];  
    }
  }
  return null;  
}

function checkclasses(arrr, ){
  
  
  
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
  document.getElementById('plz').textContent = checkedValues.join("  ");
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