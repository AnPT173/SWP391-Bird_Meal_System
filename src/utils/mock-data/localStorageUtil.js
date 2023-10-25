// --------------PUT -------------------
export async function saveLocationData(data) {
  localStorage.setItem('locationData', JSON.stringify(data));
}

export async function saveCageData(data) {
  localStorage.setItem('cagesData', JSON.stringify(data));
}

export async function saveBirdData(data) {
  localStorage.setItem('birdData', JSON.stringify(data));
}

export async function saveFoodType(data) {
  localStorage.setItem('foodType', JSON.stringify(data));
}

export async function saveSchedule(data) {
  localStorage.setItem('schedule', JSON.stringify(data));
}

export async function saveCurrentLocation(data) {
  localStorage.setItem('currentLocation', JSON.stringify(data));
}


// --------- GET ---------------------
export async function getLocationData() {
  const data = JSON.parse(localStorage.getItem('locationData'));
  return data;
}

export async function getCageData() {
  const data = JSON.parse(localStorage.getItem('cagesData'));
  return data;
}

export async function getBirdData() {
  const data = JSON.parse(localStorage.getItem('birdData'));
  return data;
}

export async function getFoodType() {
  const data = JSON.parse(localStorage.getItem('foodType'));
  return data;
}

export async function getSchedule() {
  const data = JSON.parse(localStorage.getItem('schedule'));
  return data;
}

export async function getScheduleById(id) {
  const data = JSON.parse(localStorage.getItem('schedule'));
  return data.find(item => item.id === id);
}

export async function getCurrentLocation(){
  const data = JSON.parse(localStorage.getItem('currentLocation'));
  return data;
}