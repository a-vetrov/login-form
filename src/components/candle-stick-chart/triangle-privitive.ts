import {
  type ISeriesPrimitive,
  type Coordinate,
  type IPrimitivePaneView,
  type IChartApi,
  type Time,
  type ISeriesApi, type SeriesOptionsMap, type IPrimitivePaneRenderer
} from 'lightweight-charts'
import { type CanvasRenderingTarget2D } from 'fancy-canvas'
import { timeToCoordinate } from './utils.ts'

export enum TRIANGLE_DIRECTION {
  'up' = 'up',
  'down' = 'down'
}

export class TrianglePrimitive implements ISeriesPrimitive {
  private readonly _paneViews: TrianglePaneView[]
  private _time: Time
  private _price: number
  private readonly _size: number = 4
  private _direction: TRIANGLE_DIRECTION

  private readonly _chart: IChartApi
  private readonly _series: ISeriesApi<keyof SeriesOptionsMap>
  private readonly _orderId: string

  constructor (
    chart: IChartApi,
    series: ISeriesApi<keyof SeriesOptionsMap>,
    time: Time,
    price: number,
    direction: TRIANGLE_DIRECTION = TRIANGLE_DIRECTION.up,
    orderId: string
  ) {
    this._time = time
    this._price = price
    this._direction = direction
    this._orderId = orderId
    this._paneViews = [new TrianglePaneView(this)]
    this._chart = chart
    this._series = series
  }

  updateAllViews (): void {
    this._paneViews.forEach(pw => { pw.update() })
  }

  paneViews (): TrianglePaneView[] {
    return this._paneViews
  }

  // Getters for the pane view to access
  get time (): Time { return this._time }
  get price (): number { return this._price }
  get size (): number { return this._size }
  get direction (): TRIANGLE_DIRECTION { return this._direction }
  get chart (): IChartApi { return this._chart }
  get series (): ISeriesApi<keyof SeriesOptionsMap> { return this._series }

  // Setters to update the triangle position and properties
  setPosition (time: Time, price: number): void {
    this._time = time
    this._price = price
    this.updateAllViews()
  }

  setDirection (direction: TRIANGLE_DIRECTION): void {
    this._direction = direction
    this.updateAllViews()
  }
}

class TrianglePaneView implements IPrimitivePaneView {
  _source: TrianglePrimitive
  _x: Coordinate | null = null
  _y: Coordinate | null = null

  constructor (source: TrianglePrimitive) {
    this._source = source
  }

  update (): void {
    this._x = timeToCoordinate(this._source.time, this._source.chart.timeScale())
    this._y = this._source.series.priceToCoordinate(this._source.price)
  }

  renderer (): IPrimitivePaneRenderer {
    return new TriangleRenderer(this._x, this._y, this._source.direction, this._source.size)
  }
}

class TriangleRenderer implements IPrimitivePaneRenderer {
  x: Coordinate | null = null
  y: Coordinate | null = null
  private readonly direction: TRIANGLE_DIRECTION = TRIANGLE_DIRECTION.up
  private readonly size: number

  constructor (x: Coordinate | null, y: Coordinate | null, direction: TRIANGLE_DIRECTION, size: number) {
    this.direction = direction
    this.size = size
    this.x = x
    this.y = y
  }

  get color (): string { return this.direction === 'up' ? '#00FF00' : '#FF0000' }

  draw (target: CanvasRenderingTarget2D): void {
    if (this.x === null || this.y === null) return
    target.useBitmapCoordinateSpace(scope => {
      const ctx = scope.context
      if (this.x === null || this.y === null) return
      ctx.beginPath()
      if (this.direction === 'up') {
        // Pointing up triangle
        ctx.moveTo(this.x, this.y - this.size)
        ctx.lineTo(this.x - this.size, this.y + this.size)
        ctx.lineTo(this.x + this.size, this.y + this.size)
      } else {
        // Pointing down triangle
        ctx.moveTo(this.x, this.y + this.size)
        ctx.lineTo(this.x - this.size, this.y - this.size)
        ctx.lineTo(this.x + this.size, this.y - this.size)
      }

      ctx.closePath()
      ctx.fillStyle = this.color
      ctx.fill()
    })
  }
}
