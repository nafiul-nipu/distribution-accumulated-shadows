import { Component, AfterViewInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements AfterViewInit {

  width : any = 400;
  height : any = 200;
  margin: any = 25

  scales: any = [360,540,720]
  seasons:any = ['winter', 'spring', 'summer']

  winterScale: any = d3.scaleLinear()
                        .domain([0, this.scales[0]])
                        .range([0, 199])

  springScale: any = d3.scaleLinear()
          .domain([0, this.scales[1]])
          .range([0, 199])

 summerScale: any = d3.scaleLinear()
          .domain([0, this.scales[2]])
          .range([0, 199])

  constructor() { }

  ngAfterViewInit(): void {
    // console.log('Bar-svg')

    // Create chart
    d3.select('#chart')
      .append('svg')
      .attr('class', 'bar-svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('rect')
      .attr('class', 'bar-container')
      .attr('width', this.width)
      .attr('height', this.height)
      // .attr('x', 0)
      // .attr('y', 0)
      .style('fill', 'white')
      .style('opacity', 0.85)

  }

  updateValues(data: any) {
    // d3.select('svg').remove()
    d3.selectAll('g').remove()
    // console.log(data)

    var group = d3.select('.bar-svg')
      .selectAll('g')
      .data(this.seasons)
      .enter()
      .append('g')

    group.append('text')
      .attr('x', 5)
      .attr('y', (d: any,i:any) => {return 30 + i*70})
      .text((d:any) => {
        if(d === 'winter'){
          return "Winter: "
        }else if(d === "spring"){
          return "Spring/Fall: "
        }else{
          return "Summer: "
        }
      })
      
    group.append('rect')
      .attr("width", 200)
      .attr('height', (this.height / 3) - this.margin)
      .attr('x', 70)
      .attr('y', (d: any,i:any) => {return 10 + i*65})
      .style('fill', "none")
      .style('stroke-width', 3)
      .style('stroke', 'black')


    group.append('rect')
      .attr("width", ((d: any) => {
        if(d === 'winter'){
          return this.winterScale(data[this.seasons[0]])
        }else if(d === "spring"){
          return this.springScale(data[this.seasons[1]])
        }else{
          return this.summerScale(data[this.seasons[2]])
        }        
      }))
      .attr('height', (this.height / 3) - (this.margin + 1.5))
      .attr('x', 70.5)
      .attr('y', (d: any,i:any) => {return 11.5 + i*65})
      .style('fill', ((d: any) => {
        if(d === 'winter'){
          return "rgb(66,113,143)"
        }else if(d === "spring"){
          return "rgb(27,158,119)"
        }else{
          return "rgb(217,95,2)"
        }        
      }))

      group.append('text')
      .attr('x', 275)
      .attr('y', (d: any,i:any) => {return 30 + i*70})
      .text((d:any) => {
        // console.log(d)
        if(d === 'winter'){
          let perc = (data[this.seasons[0]] * 100) / this.scales[0];
          // console.log(data[this.seasons[0]], perc, this.scales[0])
          let min = d3.format('.2f')(data[this.seasons[0]])
          let percantage = d3.format('.1f')(perc)
          // return (min + " min." )
          return (min + " min. (" + percantage + "%)")
        }else if(d === "spring"){
          let perc = (data[this.seasons[1]] * 100) / this.scales[1];
          // console.log(data[this.seasons[1]], perc, this.scales[1])
          let min = d3.format('.2f')(data[this.seasons[1]])
          let percantage = d3.format('.1f')(perc)
          // return (min + " min." )
          return (min + " min. (" + percantage + "%)")
        }else if(d==='summer'){
          let perc = (data[this.seasons[2]] * 100) / this.scales[2];
          // console.log(data[this.seasons[2]], perc, this.scales[2])
          let min = d3.format('.2f')(data[this.seasons[2]])
          let percantage = d3.format('.1f')(perc)
          // return (min + " min." )
          return (min + " min. (" + percantage + "%)")
        } else{
          return 0
        }
        
      })

    // Update values
    // console.log(data.values)
    

  }

  

}
