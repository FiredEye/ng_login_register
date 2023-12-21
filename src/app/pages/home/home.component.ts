import { ChangeDetectorRef, Component, NgZone, inject } from '@angular/core';
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
  annyang: any;
  userList: User[] = [];
  filteredList: User[] = [];
  userService: UsersService = inject(UsersService);
  mikeOn = false;
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
      // Let's define our first command. First the text we expect, and then the function it should call

      var commands = {
        '*tag': (tag: any) => {
          this.filterSearch(tag);
          this.cdRef.detectChanges(); // Trigger change detection

          // Run the following code inside the Angular zone
          this.ngZone.run(() => {
            setTimeout(() => {
              annyang.abort();
              this.mikeOn = false;
            }, 0);
          });
        },
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      // Start listening. You can call this here, or attach this call to an event, button, etc.
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
}
