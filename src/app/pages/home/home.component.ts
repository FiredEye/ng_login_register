import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  inject,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// import * as annyang from 'annyang';

import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
declare const annyang: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild('filter') filterInput!: ElementRef<HTMLInputElement>; // Declare ViewChild
  user = JSON.parse(sessionStorage.getItem('user') ?? '{}');

  annyang: any;
  userList: User[] = [];
  filteredList: User[] = [];
  userService: UsersService = inject(UsersService);
  mikeOn = false;
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.userService.getAllUsers().subscribe({
      next: (userList: User[]) => {
        this.userList = userList;
        this.filteredList = userList;
      },
      error: (e) => console.error(e),
    });
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
  handleMike() {
    this.mikeOn = !this.mikeOn;
    if (this.mikeOn) {
      var commands = {
        hello: function () {
          alert('Hi There!');
        },
        '*tag': (tag: any) => {
          this.filterSearch(tag);
          this.cdRef.detectChanges();
          this.ngZone.run(() => {
            setTimeout(() => {
              annyang.abort();
              this.mikeOn = false;
              this.setSpeechValue(tag);
            }, 0);
          });
        },
      };

      annyang.addCommands(commands);

      annyang.start();
    } else {
      annyang.abort();
    }
  }
  filterSearch(text: string) {
    if (!text) this.filteredList = this.userList;
    else {
      this.filteredList = this.userList.filter(
        (filteredUser) =>
          filteredUser?.email.toLowerCase().includes(text.toLowerCase()) ||
          filteredUser?.userName.toLowerCase().includes(text.toLowerCase()) ||
          filteredUser?.address.toLowerCase().includes(text.toLowerCase())
      );
    }
  }
  setSpeechValue(value: string) {
    if (this.filterInput && this.filterInput.nativeElement) {
      this.filterInput.nativeElement.value = value;
    }
  }
  sortBy(column: keyof User) {
    // Check if the column is already the active column for sorting
    if (this.sortColumn === column) {
      // Toggle the sorting order
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column for sorting and reset the order to ascending
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.filteredList.sort((a, b) => {
      const aValue = a[column] as string | number;
      const bValue = b[column] as string | number;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // For string comparison, use localeCompare for case-insensitive sorting
        return this.sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        const compareResult = aValue
          .toString()
          .localeCompare(bValue.toString());

        return this.sortOrder === 'asc' ? compareResult : -compareResult;
      }
    });
  }
}
