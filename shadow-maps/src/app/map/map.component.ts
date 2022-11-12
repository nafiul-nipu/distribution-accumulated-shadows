import { environment } from '../../environments/environment.prod';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {Map, View} from 'ol';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import {transform, toLonLat} from 'ol/proj';
import RasterSource from 'ol/source/Raster';
import {createXYZ} from 'ol/tilegrid';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import * as d3 from 'd3'


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  

  seasons: any = ['winter', 'spring', 'summer']

  selectedLevel: any = this.seasons[0]

  summerLayer:any;
  winterLayer: any;
  springLayer: any;

  winter: any = {
    'name': "winter",
    'path' : 'chicago-shadows/chi-dec-21/{z}/{x}/{y}.png',
    'max': 360
  }

  spring: any = {
    'name': "spring",
    'path' : 'chicago-shadows/chi-jun-21/{z}/{x}/{y}.png',
    'max': 540
  }

  summer: any = {
    'name': "summer",
    'path' : 'chicago-shadows/chi-sep-22/{z}/{x}/{y}.png',
    'max': 720
  }
  // element: any[] = [360,540,720];
  map: any;

  mousePosition: any;

  values:any = {}

  @Output() childToParent = new EventEmitter();

  constructor() { }

  ngAfterViewInit(): void {

    // console.log("map")

    // Create map
    this.map = new Map({
      target: 'map',
      view: new View({
        center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15
      })
    })

    let mapLayer = new TileLayer({
      className: 'mapLayer',
      source: new OSM(),
      zIndex: 1,
      opacity: 0.8
    })

    this.map.on('pointermove', (evt:any) => {
      this.mousePosition = evt.pixel;
      this.map.render()
    });

    this.map.addLayer(mapLayer)

    let winterSource = new RasterSource({
      sources: [
        new XYZ({
          url: 'https://raw.githubusercontent.com/nafiul-nipu/distribution-accumulated-shadows/main/docs/'+environment.filesurl + this.winter.path,
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
          crossOrigin: 'anonymous'
        })
      ],
      operation: function(pixels: any, data: any): any {
        // console.log(data)
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=66*val;
        pixel[1]=113*val;
        pixel[2]=143*val;
        pixel[3]=255*val;
          
        return pixel;
      },
    });

    this.winterLayer = new ImageLayer({
      source: winterSource,
      className: 'winterLayer',
      // zIndex: 2,
    })

    this.winterLayer.on('postrender', (event: any) => {
      var ctx = event.context;
      // console.log(ctx);
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        // console.log(data)
        var value = (data[3] /255) * this.winter.max;
        this.values[this.winter.name] = value;
        this.updateValues();
       }
    });

    


    let springSource = new RasterSource({
      sources: [
        new XYZ({
          url: 'https://raw.githubusercontent.com/nafiul-nipu/distribution-accumulated-shadows/main/docs/'+environment.filesurl + this.spring.path,
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
          crossOrigin: 'anonymous'
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=27*val;
        pixel[1]=158*val;
        pixel[2]=119*val;
        pixel[3]=255*val;
          
        return pixel;
      },
    });


    this.springLayer = new ImageLayer({
      source: springSource,
      className: 'springLayer',
      // zIndex: 0
    })

    this.springLayer.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        // console.log(data)
        var value = (data[3] /255) * this.spring.max;
        this.values[this.spring.name] = value;
        this.updateValues();
       }
    });

    



    let summerSource = new RasterSource({
      sources: [
        new XYZ({
          url: 'https://raw.githubusercontent.com/nafiul-nipu/distribution-accumulated-shadows/main/docs/'+environment.filesurl + this.summer.path,
          tileGrid: createXYZ({tileSize: 256, minZoom: 15, maxZoom: 15}),
          crossOrigin: 'anonymous'
        })
      ],
      operation: function(pixels: any, data: any): any {
        var pixel = [0,0,0,0];
        var val = pixels[0][3]/255.0;
        pixel[0]=217*val;
        pixel[1]=95*val;
        pixel[2]=2*val;
        pixel[3]=255*val;
          
        return pixel;
      },
    });


    this.summerLayer = new ImageLayer({
      source: summerSource,
      className: 'summerLayer',
      // zIndex: 0
    })

    this.summerLayer.on('postrender', (event: any) => {
      var ctx = event.context;
      var pixelRatio = event.frameState.pixelRatio;
      if (this.mousePosition) {
        var x = this.mousePosition[0] * pixelRatio;
        var y = this.mousePosition[1] * pixelRatio;
        var data = ctx.getImageData(x, y, 1, 1).data;
        // console.log(data)
        var value = (data[3] /255) * this.summer.max;
        this.values[this.summer.name] = value;
        this.updateValues();
       }
    });

    // const layers = [];
    // layers.push(this)

    this.winterLayer.setZIndex(parseInt("2", 10))
    this.summerLayer.setZIndex(parseInt("0", 10))
    this.springLayer.setZIndex(parseInt("0", 10))


    this.map.addLayer(this.springLayer);
    this.map.addLayer(this.summerLayer);
    this.map.addLayer(this.winterLayer);



  }

  updateValues() {
    // Emit new values to chart component
    
    this.childToParent.emit(this.values)

  }

  selected(){
    console.log(this.selectedLevel)
    if(this.selectedLevel === 'spring'){

      this.winterLayer.setZIndex(parseInt("0", 10))
      this.summerLayer.setZIndex(parseInt("0", 10))
      this.springLayer.setZIndex(parseInt("2", 10))

    }else if(this.selectedLevel === 'summer'){
    
      this.winterLayer.setZIndex(parseInt("0", 10))
      this.summerLayer.setZIndex(parseInt("2", 10))
      this.springLayer.setZIndex(parseInt("0", 10))


    }else if (this.selectedLevel === 'winter'){
     
      this.winterLayer.setZIndex(parseInt("2", 10))
      this.summerLayer.setZIndex(parseInt("0", 10))
      this.springLayer.setZIndex(parseInt("0", 10))
    }
  }

}


