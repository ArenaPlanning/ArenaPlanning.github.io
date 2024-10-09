// Function to fetch the CSV and process the data
async function fetchCSV() {
  const response = await fetch('https://raw.githubusercontent.com/ArenaPlanning/ArenaPlanning.github.io/refs/heads/main/schedule.csv');
  const csvData = await response.text();

  // Split the CSV data into rows and columns
  const rows = csvData.trim().split('\n').map(row => row.split(','));

  // Convert rows into a more usable object
  const classData = {};
  rows.forEach(row => {
    const classCode = row[0];
    const periods = row[1].split(';');
    classData[classCode] = periods;
    console.log(" hello ");
  });

  return classData;
}





// Function to generate all possible schedules
async function generateSchedules() {
  console.clear();
  console.log("start code");
  const classData = await fetchCSV();
  console.log(classData);
  // Get the selected classes from the form
  const selectedClasses = Array.from(document.querySelectorAll('input[name="class"]:checked'))
                                .map(input => input.value);
  
  if (selectedClasses.length === 0) {
    document.getElementById('output').textContent = 'Please select at least one class.';
    return;
  }

  // Generate all possible permutations of class periods
  const schedules = generateClassSchedules(selectedClasses, classData);

  // Display the generated schedules
  console.log(schedules);
  displaySchedules(schedules, classData);
}





// Function to generate all possible combinations (permutations) of class schedules
function generateClassSchedules(selectedClasses, classData) {
  let schedules = [];
  let x = 0;
  const maxPermutations = 40320; // 8! for max 8 classes
  const permutedClasses = permutator(selectedClasses);
  const validSchedule = [];
  
  while (x < maxPermutations) {
    console.log("in loop");
    const validSchedule = [];
    if (check(permutedClasses, classData, x)) {
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
      // permutedClasses.forEach((classCode, index) => {
      //   schedules.push({ classCode, period: letters[index] });
      //   console.log({ classCode, period: letters[index] });
        
      // });
      
      schedules.push(permutedClasses[x])
      console.log(permutedClasses[x])
      //schedules.push(validSchedule); // Add valid schedule
      
    }

    x++;
  }
  console.log(schedules);
  return schedules;
}






// Function to display the generated schedules in HTML
function displaySchedules(schedules, classData) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  console.log("outputing now");
  const leat = ["A", "B", "C", "D", "E", "F", "G", "H"];
  if (schedules.length === 0) {
    output.textContent = 'No possible schedules found due to bad code.';
    
  }
  console.log(schedules);
  
  for (y = 0; y < schedules.length; y++) {
      console.log(schedules[y]);
      console.log(schedules[y][1]);
      let te = output.textContent;
      let h=y+1;
      output.textContent = te +"\nOption "+h+": \n";
      for(z=0; z<8;z++){
      let te = output.textContent;
      
      output.textContent = te + leat[z] +": "+ getCheckboxIdByValue(schedules[y][z])+"\n";
      
      }
      
      
  }
  console.log("end code");
}


//function for finding id from value
function getCheckboxIdByValue(value) {
        const checkbox = Array.from(document.querySelectorAll('input[type=checkbox]'))
            .find(checkbox => checkbox.value === value);
        return checkbox ? checkbox.id : null;
}




// Function to generate the next lexicographical permutation of an array
function nextPermutation(arr) {
  let i = arr.length - 2;

  // Step 1: Find the first element that is smaller than the element to its right
  while (i >= 0 && arr[i] >= arr[i + 1]) {
    i--;
  }

  if (i >= 0) {
    // Step 2: Find the next largest element to swap with
    let j = arr.length - 1;
    while (arr[j] <= arr[i]) {
      j--;
    }
    // Step 3: Swap elements at i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Step 4: Reverse the subarray after index i
  let left = i + 1, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}




// Checks to see if the selected classes are in valid periods (no time conflicts)
function check(selectedClasses, classData, place) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  console.log("running check")
  console.log("palce:"+place);
  console.log("schudle array:"+selectedClasses[place]);
  for (let i = 0; i < selectedClasses[place].length; i++) {
    console.log("block:"+i);
    console.log("curent class:"+selectedClasses[place][i]);
    const classCode = selectedClasses[place];
    const period = letters[i];
    
    // Check if the current class is available in the current period
    console.log("period:"+period);
    console.log("class code"+classCode[i]);
    console.log("offered blocks:"+classData[classCode[i]]);
    console.log("conflicts "+!classData[classCode[i]].includes(period));
    if (!classData[classCode[i]].includes(period)) {
      console.log("Conflict found");
      return false; // Conflict found
    }
  }
  console.log("Conflict not found returning true");
  return true; // No conflicts
}
  
  function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}



document.querySelectorAll('h3').forEach(function(legend) {
  legend.addEventListener('click', function() {
    var fieldset = this.parentElement;
    fieldset.classList.toggle('active'); // Toggle the 'active' class to show/hide checkboxes
  });
});
