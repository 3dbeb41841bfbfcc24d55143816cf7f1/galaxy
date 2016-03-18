'use strict';

/**
 * Generate 60 days of dates starting with startDate
 * but not including Saturdays and Sundays.
**/
function makeDates(startDate) {
  let days = [];
  for (let d=0, cnt=0; cnt<60; d++) {
    let day = new Date(startDate);
    day.setDate(startDate.getDate() + d);
    let dayOfWeek = day.getDay();
    // skip Saturdays and Sundays
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }
    cnt = cnt + 1;
    days.push(new Date(day));
  }
  return days;
}

let dates = makeDates(new Date(2016, 2, 21));
console.log('dates:', dates);
console.log('dates.length:', dates.length);
