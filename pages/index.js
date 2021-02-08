import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isBetween from 'dayjs/plugin/isBetween'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import axios from 'axios'
dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(isBetween)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

export default function Home() {
  const [weekData, setWeekData] = useState([])
  const [weekRecords, setWeekRecords] = useState([])
  const [currentWeekNumber, setCurrentWeekNumber] = useState(1)

  const weeksInAYear = 52
  const year = dayjs().format('YYYY')

  const getWeekData = () => {
    const ret = []
    for (let index = 0; index < weeksInAYear; index++) {
      const firstDayOfWeek = dayjs(year).add(index, 'weeks').startOf('week').add(1, 'day')
      const lastDayOfWeek = dayjs(year).add(index, 'weeks').endOf('week').add(1, 'day')
      ret.push({
        weekNumber: firstDayOfWeek.add(2, 'day').isoWeek(),
        startOfWeek: firstDayOfWeek,
        startOfWeekFormatted: firstDayOfWeek.format('DD.MM.YYYY'),
        endOfWeek: lastDayOfWeek,
        endOfWeekFormatted: lastDayOfWeek.format('DD.MM.YYYY'),
      })
    }
    return ret
  }

  const getWeekRecords = async (weekObject) => {
    try {
      const resp = await axios({
        method: 'GET',
        url: '/api/weekTimes',
        params: {
          from: weekObject.startOfWeek.format('YYYY-MM-DD'),
          to: weekObject.endOfWeek.format('YYYY-MM-DD'),
        },
      })
      console.log(resp.data)
      setWeekRecords(resp.data)
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  useEffect(() => {
    setWeekData(getWeekData())
    setCurrentWeekNumber(dayjs().isoWeek())
  }, [])

  useEffect(() => {
    const arrayIndex = weekData.findIndex((weekData) => weekData.weekNumber === currentWeekNumber)
    if (weekData[arrayIndex] !== null && weekData[arrayIndex] !== undefined) {
      setWeekRecords(getWeekRecords(weekData[arrayIndex]))
    }
  }, [currentWeekNumber, weekData])

  return (
    <div className="">
      <Head>
        <title>Harvest to Personio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">Harvest to Personio</h1>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  <a
                    href="/"
                    className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <header>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
            </div>
          </header>
          <main>
            <div className="container mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="grid grid-cols-7 gap-4">
                  <div className="col-span-3">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setCurrentWeekNumber(currentWeekNumber - 1)}
                    >
                      Prev
                    </button>
                  </div>
                  <div className="col-span-3">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setCurrentWeekNumber(currentWeekNumber + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {weekRecords !== undefined &&
                    weekRecords.length > 0 &&
                    weekRecords.reverse().map((day) => {
                      return (
                        <div className="bg-white rounded-xl shadow-lg" key={day.date}>
                          <div className="px-4 py-2">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{day.day}</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                              {dayjs(day.date, 'YYYY-MM-DD').format('DD.MM.YYYY')}
                            </p>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-2 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                              <div className="px-4 py-4">
                                <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{day.startTime}</dd>
                              </div>
                              <div className="px-4 py-4">
                                <dt className="text-sm font-medium text-gray-500">End Time</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{day.endTime}</dd>
                              </div>
                              <div className="px-4 py-4">
                                <dt className="text-sm font-medium text-gray-500">Break Start</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">12:00</dd>
                              </div>
                              <div className="px-4 py-4">
                                <dt className="text-sm font-medium text-gray-500">Break End</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  {day.lunchBreakEnd}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
