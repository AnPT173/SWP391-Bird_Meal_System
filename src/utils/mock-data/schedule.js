

const cageIds = ['CA001', 'CA002', 'CA003', 'CA004', 'CA005'];
const foodTypes = ['Product 1', 'Product 2', 'Product 3'];


function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const scheduleData = [];

for (let i = 0; i < 10; i++) {
  const cageId = cageIds[Math.floor(Math.random() * cageIds.length)];
  const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
  const startDate = randomDate(new Date(2023, 0, 1), new Date(2023, 11, 31));
  const startHour = randomNumber(0, 23);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + randomNumber(1, 7)); 
  const endHour = randomNumber(0, 23);
  const foodQuantity = randomNumber(1, 10); 

  scheduleData.push({
    taskTitle: `Feed birds in ${cageId}`,
    foodType,
    startDate,
    startHour,
    endDate,
    endHour,
    foodQuantity,
  });
}


console.log(scheduleData);
