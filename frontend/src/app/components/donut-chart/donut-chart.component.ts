import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.css',
})
export class DonutChartComponent implements OnInit {
  @Input() logCountData: any;
  echartsOptions: any;

  ngOnInit() {
    if (this.logCountData) {
      var chartDom = document.getElementById('donutChart');
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: 'User LoggedIn Data',
          // subtext: 'Fake Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left',
        // },
        graphic: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: `Total Users: ${this.logCountData.length}`,
              textAlign: 'center',
              fill: '#333',
              fontSize: 16,
              fontWeight: 600,
            },
          },
        ],
        series: [
          {
            name: 'Total LogIn Count',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            // label: {
            //   show: false,
            //   position: 'center',
            // },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            // labelLine: {
            //   show: false,
            // },
            data: this.logCountData,
          },
        ],
      };

      option && myChart.setOption(option);
    }
  }
}
