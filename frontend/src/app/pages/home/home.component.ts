import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import * as annyang from 'annyang';

import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { StoreUserService } from '../../services/store-user.service';
declare const annyang: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('filter') filterInput!: ElementRef<HTMLInputElement>; // Declare ViewChild

  annyang: any;
  page = Number(this.activatedRoute.snapshot.queryParams['page']) || 1;
  totalPages = 1;
  actTotlPage = 1;
  userList: User[] = [];
  filteredList: User[] = [];
  userService: UsersService = inject(UsersService);
  storeUserService: StoreUserService = inject(StoreUserService);
  user = this.storeUserService.getUser();
  mikeOn = false;
  sortColumn: string | null = null;
  sortOrder: 'asc' | 'desc' = 'asc';
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.page = Number(this.activatedRoute.snapshot.queryParams['page']) || 1;

    this.fetchUsers();
  }

  fetchUsers() {
    this.userService
      .getAllUsers(this.storeUserService.getUser()?.token, this.page)
      .subscribe({
        next: ({ data: users, totalPages }) => {
          this.userList = users;
          this.filteredList = users;
          this.totalPages = totalPages;
          this.actTotlPage = totalPages;
        },
        error: (e) => console.error(e),
      });
  }
  logout() {
    this.storeUserService.clearUser();
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
    if (!text) {
      this.filteredList = this.userList;
      this.totalPages = this.actTotlPage;
    } else {
      this.userService
        .searchUsers(text, this.storeUserService.getUser()?.token, this.page)
        .subscribe({
          next: ({ data: users, totalPages }) => {
            this.ngZone.run(() => {
              this.filteredList = users;
              this.totalPages = totalPages;
            });
          },
          error: (err) => {
            console.log(err.error.error);
          },
        });
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
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { page: newPage },
        queryParamsHandling: 'merge',
      });
      this.fetchUsers();
    }
  }
}
