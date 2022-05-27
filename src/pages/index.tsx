import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';


function timeToDate(time: number | string): string {
  return new Date(time).toLocaleString().split(' ')[0]
}

type Counter = { [index: string]: number }

export default () => {
  const [data, setData] = useState<{ Xaxis: string[], series: number[] }>(null)

  async function refresh() {
    const Xaxis: string[] = []
    const series: number[] = []
    const counter: Counter = {}
    const now = Date.now()

    for (let i = 0; i < 7; i++) {
      const date = timeToDate(now - i * 60 * 60 * 24 * 1000)
      counter[date] = 0
      Xaxis.unshift(date)
    }

    const res = await fetch('/api/order')
    const jsonRes = await res.json()
    for (const order of jsonRes) {
      const date = timeToDate(order.createdAt)
      if (counter[date] !== undefined) {
        counter[date] += 1
      }
    }
    for (const date of Xaxis) {
      series.push(counter[date])
    }

    setData({ Xaxis, series })
  }
  useEffect(() => { refresh() }, [])

  const domRef = useRef(null)
  const [chart, setChart] = useState<echarts.ECharts>()

  useEffect(() => {
    if (domRef.current) {
      setChart(echarts.init(domRef.current))
    }
  }, [])

  useEffect(() => {
    const resizeChart = () => { chart && chart.resize() }
    window.addEventListener('resize', resizeChart)
    return () => {
      window.removeEventListener('resize', resizeChart)
    }
  }, [chart])

  useEffect(() => {
    if (data) {
      chart && chart.hideLoading()
      chart && chart.setOption({
        title: {
          text: 'Last Week Statistics'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: data?.Xaxis
        },
        yAxis: {
          type: 'value',
          name: 'Order Created',
        },
        series: [
          {
            type: 'line',
            data: data?.series,
            smooth: true
          },
        ]
      });
    } else {
      chart && chart.showLoading({
        text: 'loading',
        color: '#4cbbff',
        textColor: '#4cbbff',
        maskColor: 'rgba(255, 255, 255, 0.9)',
      })
    }

  }, [chart, data])

  return (
    <div ref={domRef} className="h-screen max-h-96">
      test
    </div>
  );
}