const useTimeFormatter = () => {
  // formats date to yyyy-mm-dd  local time
  // for setting&submitting date
  function dateSubmitFormat(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hr = String(d.getHours()).padStart(2, "0"),
      min = String(d.getMinutes()).padStart(2, "0");

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-") + `T${hr}:${min}:00Z`;
  }

  // formats date to dd-mm-yyyy utc
  // for displaying
  function formatDateToLocaleString(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hr = String(d.getHours()).padStart(2, "0"),
      min = String(d.getMinutes()).padStart(2, "0");

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/") + ` ${hr}:${min}`;
  }

  // return date in human readable format (eg. 5days || 11h 30min)
  function formatDuration(date) {
    const currentDate = new Date();
    const targetDate = new Date(date);
    const differenceInMilliseconds =
      targetDate.getTime() - currentDate.getTime();
    const minutes = Math.floor(differenceInMilliseconds / (1000 * 60));

    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const remainingMinutes = minutes % 60;

    let duration = "";

    if (days > 0) {
      duration += days + (days === 1 ? "d " : "d ");
    }

    if (hours > 0) {
      duration += hours + "h ";
    }

    if (remainingMinutes > 0) {
      if (days <= 0) {
        duration += remainingMinutes + "min ";
      }
    }

    return duration.trim();
  }

  return {
    dateSubmitFormat,
    formatDateToLocaleString,
    formatDuration,
  };
};

export default useTimeFormatter;
