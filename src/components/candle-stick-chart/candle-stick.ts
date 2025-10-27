import {
  CandlestickSeries,
  createChart,
  ColorType,
  type ISeriesApi,
  type Time,
  type IChartApi, type MouseEventParams, type SeriesDataItemTypeMap, type CreatePriceLineOptions
} from 'lightweight-charts'
import { TRIANGLE_DIRECTION, TrianglePrimitive } from './triangle-privitive.ts'
import { mergeCandles } from '../../utils/array.ts'
import type { IntervalBotStepParams, OrderDataType } from '../../services/bots.ts'
import { getPriceMultiplier } from './utils.ts'

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
  public updateTooltip?: (tooltip: TooltipData | null) => void

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
    if (this.updateTooltip) {
      this.updateTooltip(this.tooltip)
    }
  }

  public removeTooltip = (): void => {
    this.tooltip = null
  }

  public updateData = (data: Array<SeriesDataItemTypeMap<Time>['Candlestick']>): void => {
    this.candlestickSeries.setData(mergeCandles(this.candlestickSeries.data(), data))
  }

  public clearData = (): void => {
    this.candlestickSeries.setData([])
  }

  public setSteps = (steps: IntervalBotStepParams[]): void => {
    this.candlestickSeries.priceLines().forEach((priceLine) => {
      this.candlestickSeries.removePriceLine(priceLine)
    })

    steps.forEach((step, index) => {
      const priceLine = {
        price: step.min,
        color: '#FFFF0066',
        lineWidth: 1,
        lineStyle: 2, // LineStyle.Dashed
        axisLabelVisible: false,
        title: ''
      } as CreatePriceLineOptions

      if (index === 0) {
        priceLine.axisLabelVisible = true
        priceLine.title = 'min'
      } else if (index === steps.length - 1) {
        priceLine.axisLabelVisible = true
        priceLine.title = 'max'
      }

      this.candlestickSeries.createPriceLine(priceLine)
    })
  }

  public updateOrders = (orders: OrderDataType[]): void => {
    orders.forEach(({ executionDate, averagePositionPrice, direction, product, orderId }) => {
      if (this.primitives[orderId]) {
        return
      }

      const primitive = new TrianglePrimitive(
        this.chart,
        this.candlestickSeries,
        new Date(executionDate).getTime() / 1000 as Time,
        averagePositionPrice * getPriceMultiplier(product),
        direction === 1 ? TRIANGLE_DIRECTION.up : TRIANGLE_DIRECTION.down,
        orderId
      )
      this.candlestickSeries.attachPrimitive(primitive)
      this.primitives[orderId] = primitive
    })
  }
}
