import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Copy, Loader } from 'react-feather'
import { ToastContainer, toast, Flip } from 'react-toastify'

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

import 'react-toastify/dist/ReactToastify.css'
import 'animate.css/animate.css'

export default function Home() {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [weekData, setWeekData] = useState(undefined)
  const [weekRecords, setWeekRecords] = useState(undefined)
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
    setLoading(true)
    try {
      const resp = await axios({
        method: 'GET',
        url: '/api/weekTimes',
        params: {
          from: weekObject.startOfWeek.format('YYYY-MM-DD'),
          to: weekObject.endOfWeek.format('YYYY-MM-DD'),
        },
      })
      // console.log(resp.data)
      setLoading(false)
      setWeekRecords(resp.data)
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  const handlePrev = () => {
    if (currentWeekNumber - 1 > 0) {
      setCurrentWeekNumber(currentWeekNumber - 1)
    }
  }
  const handleNext = () => {
    if (currentWeekNumber + 1 < weekData.length) {
      setCurrentWeekNumber(currentWeekNumber + 1)
    }
  }

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value)
    toast(`🦄 Copied: ${value}`, {
      position: 'bottom-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }

  useEffect(() => {
    setWeekData(getWeekData())
    setCurrentWeekNumber(dayjs().isoWeek())
  }, [])

  useEffect(() => {
    if (weekData !== undefined && weekData.length > 0) {
      const arrayIndex = weekData.findIndex((weekData) => weekData.weekNumber === currentWeekNumber)
      setTitle(
        `${weekData[currentWeekNumber].startOfWeekFormatted} - ${weekData[currentWeekNumber].endOfWeekFormatted}`
      )
      if (weekData[arrayIndex] !== null && weekData[arrayIndex] !== undefined) {
        setWeekRecords(getWeekRecords(weekData[arrayIndex]))
      }
    }
  }, [currentWeekNumber, weekData])

  return (
    <div className="">
      <Head>
        <title>Harvest to Personio</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#19181d" />
        <meta name="apple-mobile-web-app-title" content="Elektro" />
        <meta name="application-name" content="Elektro" />
        <meta name="msapplication-TileColor" content="#19181d" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Flip}
      />
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">Harvest to Personio</h1>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-2">
          <main>
            <div className="container mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="md:grid grid-cols-12 gap-4">
                  <div className="col-span-3 flex items-center">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handlePrev}
                    >
                      Prev
                    </button>
                  </div>
                  <div className="col-span-6 text-center">
                    <div className="text-lg font-bold leading-6 font-medium text-indigo-600">
                      Week {currentWeekNumber}
                    </div>
                    <div className="text-lg leading-6 font-medium text-gray-500">{title}</div>
                  </div>

                  <div className="col-span-3 flex items-center justify-end">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="md:grid grid-cols-5 gap-2 mt-16">
                  {loading && (
                    <div className="flex items-center justify-center col-span-5">
                      <Loader color="#5146e4" className="animate-spin" size="32" />
                    </div>
                  )}
                  {!loading && weekRecords !== undefined && weekRecords.length < 1 && (
                    <div className="flex items-center justify-center col-span-5">
                      <img src="/future-2.gif" alt="Welcome to the future" />
                    </div>
                  )}
                  {!loading &&
                    weekRecords !== undefined &&
                    weekRecords.length > 0 &&
                    weekRecords.map((day, index) => {
                      if (index > 4) return null
                      return (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden" key={day.date}>
                          <div className="px-4 py-2 bg-indigo-600">
                            <h3 className="text-lg leading-6 font-medium text-white">{day.day}</h3>
                            <p className="mt-1 max-w-2xl text-base text-indigo-50">
                              {dayjs(day.date, 'YYYY-MM-DD').format('DD.MM.YYYY')}
                            </p>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-2 sm:p-0 h-full">
                            {day.isFuture && (
                              <div className="flex items-center justify-center h-72 text-gray-400">
                                That's the future
                              </div>
                            )}
                            {day.isRunning && (
                              <div className="flex items-center justify-center h-72 text-gray-400">
                                Your timer is still running
                              </div>
                            )}
                            {!day.isRunning && !day.isFuture && (
                              <div className="sm:divide-y sm:divide-gray-200">
                                <div className="px-4 py-4 flex justify-between items-center">
                                  <div>
                                    <span className="text-base font-medium text-gray-500">Start Time</span>
                                    <div className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
                                      {day.startTime}
                                    </div>
                                  </div>
                                  <button
                                    className="active:outline-none focus:outline-none hover:bg-gray-100 p-2 rounded-md"
                                    onClick={() => copyToClipboard(day.startTime)}
                                  >
                                    <Copy color="#2d323b" />
                                  </button>
                                </div>
                                <div className="px-4 py-4 flex justify-between items-center">
                                  <div>
                                    <span className="text-base font-medium text-gray-500">End Time</span>
                                    <div className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
                                      {day.endTime}
                                    </div>
                                  </div>
                                  <button
                                    className="active:outline-none focus:outline-none hover:bg-gray-100 p-2 rounded-md"
                                    onClick={() => copyToClipboard(day.endTime)}
                                  >
                                    <Copy color="#2d323b" />
                                  </button>
                                </div>
                                <div className="px-4 py-4 flex justify-between items-center">
                                  <div>
                                    <span className="text-base font-medium text-gray-500">Break Start</span>
                                    <div className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">12:00</div>
                                  </div>
                                  <button
                                    className="active:outline-none focus:outline-none hover:bg-gray-100 p-2 rounded-md"
                                    onClick={() => copyToClipboard('12:00')}
                                  >
                                    <Copy color="#2d323b" />
                                  </button>
                                </div>
                                <div className="px-4 py-4 flex justify-between items-center">
                                  <div>
                                    <span className="text-base font-medium text-gray-500">Break End</span>
                                    <div className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
                                      {day.lunchBreakEnd}
                                    </div>
                                  </div>
                                  <button
                                    className="active:outline-none focus:outline-none hover:bg-gray-100 p-2 rounded-md"
                                    onClick={() => copyToClipboard(day.lunchBreakEnd)}
                                  >
                                    <Copy color="#2d323b" />
                                  </button>
                                </div>
                              </div>
                            )}
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
