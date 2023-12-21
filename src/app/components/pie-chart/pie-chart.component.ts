import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent implements OnInit {
  @Input() ageGroupCounts: any;
  echartsOptions: any;

  ngOnInit() {
    if (this.ageGroupCounts) {
      var chartDom = document.getElementById('pieChart');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: 'Age Group',
          // subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: 'Age group',
            type: 'pie',
            radius: '60%',
            data: this.ageGroupCounts,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    }
  }
}
