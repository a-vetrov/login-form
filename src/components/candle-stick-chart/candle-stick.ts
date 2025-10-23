import {
  CandlestickSeries,
  createChart,
  ColorType,
  type ISeriesApi,
  type Time,
  type IChartApi, type MouseEventParams, type SeriesDataItemTypeMap
} from 'lightweight-charts'
import { type TrianglePrimitive } from './triangle-privitive.ts'

interface TooltipData {
  x: number
  y: number
  orderId: string
}

export class CandleStickChart {
  public container: HTMLElement
  public chart: IChartApi
  public candlestickSeries: ISeriesApi<'Candlestick', Time>
  public primitives: Record<string, TrianglePrimitive> = {}
  public tooltip: TooltipData | null

  public constructor (container: HTMLElement) {
    this.container = container

    this.chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'white'
      },
      grid: {
        vertLines: { color: '#444' },
        horzLines: { color: '#444' }
      },
      height: 400,
      autoSize: true,
      localization: {
        timeFormatter: (time) => {
          // Custom time formatting logic here
          return new Date(time * 1000).toLocaleTimeString()
        }
      }
    })

    this.candlestickSeries = this.chart.addSeries(CandlestickSeries, { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350' })
    this.chart.subscribeClick(this.handleClick)
    this.chart.timeScale().subscribeSizeChange(this.removeTooltip)
    this.chart.timeScale().subscribeVisibleTimeRangeChange(this.removeTooltip)
  }

  public handleClick = (param: MouseEventParams): void => {
    const { x, y } = param.point
    let minD = 1000
    let minP: TrianglePrimitive

    Object.values(this.primitives).forEach((item) => {
      const d = item.getDistanceToPoint(x as number, y as number)
      if (d !== null && d < 100 && d < minD) {
        minD = d
        minP = item
      }
    })

    if (minP && minP.orderId !== this.tooltip?.orderId) {
      this.tooltip = { x, y, orderId: minP.orderId, containerWidth: this.container.clientWidth }
    } else {
      this.tooltip = null
    }
  }

  public removeTooltip = (): void => {
    this.tooltip = null
  }

  public setData = (data: Array<SeriesDataItemTypeMap<Time>['Candlestick']>): void => {
    this.candlestickSeries.setData(data)
  }
}
