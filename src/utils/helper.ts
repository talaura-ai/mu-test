import moment from "moment";

export const getExpiredIn = (startDate: any, endDate: any) => {
  var startInDate = moment(startDate);
  var endInDate = moment(endDate);
  var duration = moment.duration(endInDate?.diff(startInDate));
  var days = duration.days();
  var hours = duration.hours();
  var minutes = duration.minutes();
  var formattedDuration = `${days}D:${hours}H:${minutes}M`;
  return formattedDuration
}