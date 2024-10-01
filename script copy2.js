// Function to fetch the CSV and process the data
async function fetchCSV() {
  const response = await fetch('https://raw.githubusercontent.com/ArenaPlanning/ArenaPlanning.github.io/refs/heads/main/schedule.csv'); // Update with your CSV file's location
  const csvData = await response.text();

  // Split the CSV data into rows and columns
  const rows = csvData.trim().split('\n').map(row => row.split(','));

  // Convert rows into a more usable object
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
  const classData = await fetchCSV();
  
  // Get the selected classes from the form
  const selectedClasses = Array.from(document.querySelectorAll('input[name="class"]:checked'))
                                .map(input => input.value);
  
  if (selectedClasses.length === 0) {
    document.getElementById('output').textContent = 'Please select at least one class.';
    return;
  }

  // Generate all permutations of class periods
  const schedules = generateClassSchedules(selectedClasses, classData);

  // Display the generated schedules
  displaySchedules(schedules);
}

// Function to generate all possible combinations (permutations) of class schedules
function generateClassSchedules(selectedClasses, classData) {
  let schedules = [[]]; // Start with an empty schedule
  let x = 0;

  // There are 8! = 40320 possible permutations for 8 classes (if selected)
  while (x < 40320) {
    selectedClasses = nextPermutation(selectedClasses);

    if (check(selectedClasses, classData)) {
      // Generate a valid schedule with the current permutation
      let validSchedule = [];
      selectedClasses.forEach(classCode => {
        const availablePeriods = classData[classCode];
        // Add the first available non-conflicting period
        validSchedule.push({ classCode, period: availablePeriods[0] });
      });
      schedules.push(validSchedule);
    }

    x++;
  }

  return schedules;
}

// Function to display the generated schedules in HTML
function displaySchedules(schedules) {
  const output = document.getElementById('output');
  output.innerHTML = '';

  if (schedules.length === 0) {
    output.textContent = 'No possible schedules found due to conflicts.';
    return;
  }

  schedules.forEach(schedule => {
    const scheduleText = schedule.map(entry => `${entry.classCode}: Period ${entry.period}`).join(', ');
    const scheduleElement = document.createElement('p');
    scheduleElement.textContent = scheduleText;
    output.appendChild(scheduleElement);
  });
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
function check(selectedClasses, classData) {
  const periodTracker = new Set();

  for (let i = 0; i < selectedClasses.length; i++) {
    const classCode = selectedClasses[i];
    const periods = classData[classCode];

    // Check if the class has a period that is already taken (conflict)
    for (let j = 0; j < periods.length; j++) {
      const period = periods[j];

      if (periodTracker.has(period)) {
        return false; // Conflict detected
      }
    }

    // If no conflict, add the period to the tracker
    periodTracker.add(periods[0]); // Use the first available period for simplicity
  }

  return true; // No conflicts
}
