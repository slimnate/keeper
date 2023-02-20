const moment = require("moment");

function createProgressNotifier(itemCount, notifyFunc) {
  let currentCount = 1;
  let lastItemTime = moment();
  let times = [];

  function averageTime () {
    const totalTime = times.reduce((total, t) => total + t, 0);
    return totalTime / times.length;
  }

  function remainingTime () {
    const itemsRemaining = itemCount - currentCount;
    const average = averageTime();
    const timeRemaining = itemsRemaining * average;
    return timeRemaining;
  }

  function start() {
    lastItemTime = moment();
  }

  function next() {
    currentCount++;
    const timeSinceLastItem = moment().diff(lastItemTime);
    times.push(timeSinceLastItem);
    lastItemTime = moment();
  }
  
  function notify (message) {
    const remaining = remainingTime();

    const data = {
      message,
      total: itemCount,
      current: currentCount,
      remaining: moment.duration(remaining).humanize({s: 60, ss: 3})
    };

    notifyFunc(data);
  }

  return {
    start,
    next,
    notify,
  };
};

module.exports = {
  createProgressNotifier
};