import { Component, OnInit } from '@angular/core';
import { getCurrentJWT, parseJwt } from 'src/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isModerator = false;
  isAdmin = false;

  ngOnInit(): void {
    const jwtPayload = parseJwt(getCurrentJWT());
    if (jwtPayload.exp > Date.now()%100) {
      if (jwtPayload.role === "ADMIN") this.isAdmin = true;
    }
  }
}