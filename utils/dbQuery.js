const gtfs = require('gtfs');
const mongoose = require('mongoose');
const moment = require('moment');
const uniq = require('lodash/uniq');
const keys = require('lodash/keys');
const pickBy = require('lodash/pickBy');
const capitalize = require('lodash/capitalize');
const mapValues = require('lodash/mapValues');
const groupBy = require('lodash/groupBy');
const sortBy = require('lodash/sortBy');
const find = require('lodash/find');
const pick = require('lodash/pick');
const omit = require('lodash/omit');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost:27017/gtfs',
  { useMongoClient: true },
);

const getRoutes = async () => {
  const routes = await gtfs.getRoutes({
   agency_key: 'metrolink',
  });
  return routes;
};

const getSchedules = async (route_id) => {
  const currentMoment = moment();
  const currentDay = currentMoment.format('YYYYMMDD');
  const calendars = await gtfs.getCalendars({
    agency_key: 'metrolink',
    route_id,
    start_date: { $lte: +currentDay },
    end_date: { $gte: +currentDay },
  })
  const servicesForToday = calendars.filter(calendar => {
    const dayString = currentMoment.format('dddd').toLowerCase();
    return calendar[dayString] === 1;
  });
  const serviceIds = servicesForToday.map(service => service.service_id);
  const trips = await gtfs.getTrips({
    agency_key: 'metrolink',
    route_id,
    service_id: { $in: serviceIds },
  });
  const tripIds = trips.map(trip => trip.trip_id);
  const stopTimes = await gtfs.getStoptimes({
    agency_key: 'metrolink',
    trip_id: { $in: tripIds },
  });
  const stopIds = stopTimes.map(stopTime => stopTime.stop_id);
  const stops = await gtfs.getStops({
    agency_key: 'metrolink',
    stop_id: { $in: stopIds },
  });

  const destinations = uniq(
    trips.map(trip => trip.trip_headsign)
  );
  const dayTypes = servicesForToday.map(service => {
    const validDays = pickBy(service, value => value === 1)
     const days = keys(validDays);
     return days
       .reduce((acc, next) => acc.slice(0, 1).concat(next), [])
       .map(day => capitalize(day)).join(' - ');
  });

  const stopTimesWithStopInfo = stopTimes.map(stopTime => omit({
    ...stopTime,
    ...stops.find(stop => stop.stop_id === stopTime.stop_id),
  }, ['agency_key']));

  stopTimesWithStopInfo

  const stopTimesByTrip = groupBy(
    stopTimesWithStopInfo, stopTime => stopTime.trip_id,
  );
  const sortedStopTimesByTrip = mapValues(
    stopTimesByTrip,
    stopTimes => sortBy(
      stopTimes,
      stopTime => stopTime.stop_sequence,
    ),
  );
  
  const scheduleInfo = ['route_id', 'trip_headsign', 'trip_short_name', 'destination', 'table'];
  const schedules = trips.map(trip => pick({
    ...trip,
    table: sortedStopTimesByTrip[trip.trip_id],
  }, scheduleInfo));
  const result = {
    destinations,
    dayTypes,
    schedules,
  };
  return result;
};

module.exports = {
  getRoutes,
  getSchedules,
};
