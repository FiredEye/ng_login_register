import { Component, OnInit, inject } from '@angular/core';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { DonutChartComponent } from '../../components/donut-chart/donut-chart.component';
interface GenderCount {
  [key: string]: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PieChartComponent,
    BarChartComponent,
    DonutChartComponent,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userService: UsersService = inject(UsersService);
  userList: User[] = [];
  ageGroupCounts: { value: number; name: string }[] = [];
  logCountData: { value: number; name: string }[] = [];
  genderData: { title: string[]; count: number[] } = { title: [], count: [] };
  ageGroups = [
    { min: 15, max: 25, name: '15-25' },
    { min: 26, max: 35, name: '26-35' },
    { min: 36, max: 45, name: '36-45' },
    { min: 46, max: 55, name: '46-55' },
    { min: 56, max: 100, name: '56+' },
  ];
  constructor() {}
  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (userList: User[]) => {
        this.userList = userList;

        this.ageGroupCounts = this.ageGroups.map((group) => ({
          value: 0,
          name: group.name,
        }));
        const genderCounts: GenderCount = userList.reduce(
          (count: GenderCount, user) => {
            count[user.gender] = (count[user.gender] || 0) + 1;
            return count;
          },
          {}
        );
        this.genderData.title = Object.keys(genderCounts);
        this.genderData.count = Object.values(genderCounts);
        this.logCountData = userList.map((user) => ({
          value: user.loggedInCount,
          name: user.userName,
        }));
        userList.forEach((user) => {
          const userAge = user.age;
          const matchingGroup = this.ageGroups.find(
            (group) => userAge >= group.min && userAge <= group.max
          );
          if (matchingGroup) {
            const index = this.ageGroupCounts.findIndex(
              (group) => group.name === matchingGroup.name
            );
            this.ageGroupCounts[index].value++;
          }
        });
      },
      error: (e) => console.error(e),
    });
  }
}
