

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

  selectedClasses.forEach(classCode => {
    const periods = classData[classCode];

    // Generate all possible combinations with the current class
    const newSchedules = [];
    schedules.forEach(schedule => {
      periods.forEach(period => {
        if (!schedule.includes(period)) { // Check for conflicting periods
          newSchedules.push([...schedule, { classCode, period }]);
        }
      });
    });

    schedules = newSchedules;
  });

  return schedules;
}




// Function to display the generated schedules in HTML as tables
function displaySchedules(schedules) {
  const output = document.getElementById('output');
  output.innerHTML = ''; // Clear previous output

  if (schedules.length === 0) {
    output.textContent = 'No possible schedules found due to conflicts.';
    return;
  }

  // Define the periods (A to H)
  const periods = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  schedules.forEach(schedule => {
    // Create a table element
    const table = document.createElement('table');
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';
    table.style.marginBottom = '20px';

    // Create a header row for the table
    const headerRow = document.createElement('tr');
    const periodHeader = document.createElement('th');
    periodHeader.textContent = 'Period';
    periodHeader.style.border = '1px solid black';
    const classHeader = document.createElement('th');
    classHeader.textContent = 'Class';
    classHeader.style.border = '1px solid black';
    headerRow.appendChild(periodHeader);
    headerRow.appendChild(classHeader);
    table.appendChild(headerRow);

    // Create a row for each period (A to H)
    periods.forEach(period => {
      const row = document.createElement('tr');
      const periodCell = document.createElement('td');
      const classCell = document.createElement('td');

      periodCell.textContent = period;
      periodCell.style.border = '1px solid black';

      // Find the class for this period, or mark it as a free block
      const classEntry = schedule.find(entry => entry.period === period);
      classCell.textContent = classEntry ? classEntry.classCode : 'Free Block';
      classCell.style.border = '1px solid black';

      row.appendChild(periodCell);
      row.appendChild(classCell);
      table.appendChild(row);
    });

    // Append the table for the current schedule
    output.appendChild(table);
  });
}

