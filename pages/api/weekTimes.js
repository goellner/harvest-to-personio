// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import duration from 'dayjs/plugin/duration'
dayjs.extend(minMax)
dayjs.extend(duration)

const groupBy = (collection, property) => {
  var i = 0,
    val,
    index,
    values = [],
    result = []
  for (; i < collection.length; i++) {
    val = collection[i][property]
    index = values.indexOf(val)
    if (index > -1) result[index].push(collection[i])
    else {
      values.push(val)
      result.push([collection[i]])
    }
  }
  return result
}

export default async (req, res) => {
  try {
    const resp = await axios({
      method: 'GET',
      url: 'https://api.harvestapp.com/api/v2/time_entries',
      params: {
        user_id: `${process.env.HARVEST_USER_ID}`,
        client_id: `${process.env.HARVEST_CLIENT_ID}`,
        from: req.query.from,
        to: req.query.to,
      },
      headers: {
        'Harvest-Account-Id': '1111763',
        Authorization: `Bearer ${process.env.HARVEST_TOKEN}`,
        'User-Agent': 'Harvest API Example',
      },
    })
    let ret = []
    const groupedByDay = groupBy(resp.data.time_entries, 'spent_date')

    groupedByDay.forEach((day) => {
      const todayString = dayjs().format('YYYY-MM-DD')
      let startTimeDayJs
      let startTime
      let endTimeDayJs
      let endTime
      let hoursTracked = 0
      let timerRunning = []
      const startTimes = []
      const endTimes = []
      let currentDate
      day.forEach((timeEntry) => {
        // 2021 - 02 - 07
        startTimes.push(dayjs(`${timeEntry.spent_date} ${timeEntry.started_time}`, 'YYYY-MM-DD HH:mm:ss'))
        endTimes.push(dayjs(`${timeEntry.spent_date} ${timeEntry.ended_time}`, 'YYYY-MM-DD HH:mm:ss'))
        hoursTracked = hoursTracked + timeEntry.hours
        currentDate = timeEntry.spent_date
        timerRunning.push(timeEntry.is_running)
      })
      startTimeDayJs = dayjs.min(startTimes)
      startTime = startTimeDayJs.unix()
      endTimeDayJs = dayjs.max(endTimes)
      endTime = endTimeDayJs.unix()
      const hoursBetweenStartAndEnd = dayjs.duration(endTime - startTime, 'seconds').asHours()
      const breakDuration = hoursBetweenStartAndEnd - hoursTracked
      const breakDurationFormatted = dayjs.duration(breakDuration, 'hours').format('HH:mm')
      const lunchBreakEnd = dayjs(`${todayString} 12:00:00`, 'YYYY-MM-DD HH:mm:ss')
        .add(breakDuration, 'hours')
        .format('HH:mm')
      ret.push({
        date: currentDate,
        startTime: startTimeDayJs.format('HH:mm'),
        endTime: endTimeDayJs.format('HH:mm'),
        lunchBreakEnd: lunchBreakEnd,
        breakDuration: breakDurationFormatted,
        day: startTimeDayJs.format('dddd'),
        isRunning: timerRunning.includes(true),
        isFuture: false,
      })
    })
    if (ret.length < 5 && ret[0] !== undefined) {
      const lastDate = dayjs(ret[0].date, 'YYYY-MM-DD')
      for (let i = 1; i < 5; i++) {
        if (ret.length < 5) {
          ret.unshift({
            date: lastDate.add(i, 'day').format('YYYY-MM-DD'),
            day: lastDate.add(i, 'day').format('dddd'),
            isFuture: true,
          })
        }
      }
    }
    // ret.reverse()
    res.status(200).json(ret.reverse())
  } catch (err) {
    // Handle Error Here
    console.error(err)
    res.status(500).json(err)
  }
}
