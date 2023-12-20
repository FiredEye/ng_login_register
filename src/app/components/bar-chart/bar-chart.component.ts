import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css',
})
export class BarChartComponent implements OnInit {
  @Input() genderData: any;
  echartsOptions: any;

  ngOnInit() {
    var chartDom = document.getElementById('barChart');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: 'Bar Diagram for Gender',
      },
      tooltip: {},
      legend: {},
      xAxis: {
        data: this.genderData.title,
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: this.genderData.count,
        },
      ],
    };

    option && myChart.setOption(option);
  }
}
