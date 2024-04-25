function formatDateTime(dateTimeString) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dateTime = new Date(dateTimeString);
  const dayOfWeek = days[dateTime.getDay()];
  const dayOfMonth = dateTime.getDate();
  const month = months[dateTime.getMonth()];
  const year = dateTime.getFullYear();
  const hour = dateTime.getHours().toString().padStart(2, '0');
  const minute = dateTime.getMinutes().toString().padStart(2, '0');

  return `${dayOfWeek} ${dayOfMonth} ${month} ${year} at ${hour}.${minute}`;
}

module.exports = formatDateTime;
