let results = 0;
// Function to fetch the CSV and process the data
async function fetchCSV() {
  const response = await fetch('https://raw.githubusercontent.com/ArenaPlanning/ArenaPlanning.github.io/refs/heads/main/schedule.csv');
  const csvData = await response.text();

  const rows = csvData.trim().split('\n').map(row => row.split(','));


  const classData = {};
  rows.forEach(row => {
    const classCode = row[0];
    const periods = row[1].split(';');
    classData[classCode] = periods;
  
  });

  return classData;
}





// Function to generate all possible schedules
async function generateSchedules() {
  results = 0;
  document.getElementById('output').textContent = "generating...";                  
  let divb = document.querySelector(".bigdiv");
  if (divb) {
    divb.remove();
  }
  const classData = await fetchCSV();

  
  const selectedClasses = Array.from(document.querySelectorAll('input[name="class"]:checked'))
                                .map(input => input.value);
  
  if (selectedClasses.length === 0) {
    document.getElementById('output').textContent = 'Please select at least 5 classes.';
    return;
  }
  let u = 0;
  
  if (selectedClasses.length < 5){
    document.getElementById('output').textContent = "you have selected "+selectedClasses.length+ " classes please select at least 5.";
  } else {
  while(selectedClasses.length < 8){
    selectedClasses.push("8");
  }
  }
  const schedules = generateClassSchedules(selectedClasses, classData);

  
  //console.log(schedules);
  displaySchedules(schedules, classData);
  //console.log(res);
}





// Function to generate all possible combinations (permutations) of class schedules
function generateClassSchedules(selectedClasses, classData) {
  let schedules = [];
  let x = 0;
  const maxPermutations = 40320; // 8! for max 8 classes
  const permutedClasses = permutator(selectedClasses);
  const validSchedule = [];
  
  while (x < maxPermutations) {
    
    const validSchedule = [];
    if (check(permutedClasses, classData, x)) {
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
      schedules.push(permutedClasses[x])
      
    }

    x++;
  }
  
  return schedules;
}






// Function to display the generated schedules in HTML
function displaySchedules(schedules, classData) {
  const output = document.getElementById('output');
  output.innerHTML = '';
  //console.log("outputing now");
  const leat = ["A", "B", "C", "D", "E", "F", "G", "H"];
  output.textContent = ' ';
  if (schedules.length === 0) {
    output.textContent = 'No possible schedules found.';

  }
  //console.log(schedules);
  const bigdiv = document.createElement("div");
  bigdiv.classList = "bigdiv";
  bigdiv.style.display = "flex";
  document.body.appendChild(bigdiv);
  bigdiv.style.flexDirection = "row";
  bigdiv.style.flexWrap="wrap";

  for (y = 0; y < schedules.length; y++) {
      for(z=0; z<y;z++){
        if (arraysEqual(schedules[y],schedules[z])){
          schedules.splice(y,1);
        }
      }
      if (y >= schedules.length) {
        break;
      }
      let h=y+1;
      const newbox = document.createElement("div");
      const newpre = document.createElement("pre");
      
      const heder = document.createElement("strong");
      results++;
      newpre.classList="resultspre";
      newbox.classList = "results";
      newbox.id = "box:"+results;
      newpre.id = "pre:"+results;
      newbox.style.padding="10px"
      bigdiv.appendChild(newbox);
      newbox.appendChild(heder);
      newbox.appendChild(newpre);
      
      heder.textContent = "Option "+h+": ";
      for(z=0; z<8;z++){
      newpre.textContent = newpre.textContent + leat[z] +": "+ getCheckboxIdByValue(schedules[y][z])+"\n";
      }
      
      
  }
  
}

// arraysEqual function to compare two arrays
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
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




// Checks to see if the selected classes are in valid periods
function check(selectedClasses, classData, place) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
 
  for (let i = 0; i < selectedClasses[place].length; i++) {
    const classCode = selectedClasses[place];
    const period = letters[i];
    
    // Check if the current class is available in the current period
  
    if (!classData[classCode[i]].includes(period)) {
      //console.log("Conflict found");
      return false; // Conflict found
    }
  }
  //console.log("Conflict not found returning true");
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
    fieldset.classList.toggle('active'); 
  });
});

function listiners(){
  const checkboxes = document.querySelectorAll('input');
  checkboxes.forEach(boxes => {
    boxes.addEventListener("change",counter);
  });
  
}
function counter(){
  const selectedClasses = Array.from(document.querySelectorAll('input[name="class"]:checked')).map(input => input.id);
  const counter = document.getElementById("counter");
  counter.textContent = selectedClasses.length;
  makeselected(selectedClasses);
}
listiners();

function makeselected(selectedClasses){
  const container = document.getElementById("selectedclasses");
  container.innerHTML = '';
  let i = 0;
  selectedClasses.forEach(() => {
  const p = document.createElement("p");
  p.textContent = selectedClasses[i];
  p.className = "selclass";
  container.appendChild(p);
  i++;
  });
}
counter();