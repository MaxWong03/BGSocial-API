import moment from 'moment';
const formatDateWithTime = function (date) {
  return moment(date).format('ddd, MMM DD [at] hh:mm A');
}
const formatTime = function (time) {
  if (!time) {
    return '';
  }
  const [hour, minute] = time.split(':').map(i => Number(i));
  let timeString = '';
  if (hour) {
    timeString += `${hour}h`;
  }
  if (minute) {
    timeString += ` ${minute}m`;
  }
  return timeString.trim();
}
const arrayToObject = function (objectsArray, key) { // key === 'id'
  const object = {};
  objectsArray.forEach(item => {
    object[item[key]] = item;
  });
  return object;
}
const getEventMainImage = function (event) {
  return event.event_games[0].game.image;
}
const getEventChosenEventDate = function (event) {
  return event.event_dates.find(eventDate => eventDate.is_chosen === true);
}
function getConfirmedAttendants(event) {
  return event.event_attendants.filter(attendant => attendant.is_confirmed === true && attendant.is_not_assisting === false)
};
export {
  formatDateWithTime,
  formatTime,
  arrayToObject,
  getEventChosenEventDate,
  getEventMainImage,
  getConfirmedAttendants,
};