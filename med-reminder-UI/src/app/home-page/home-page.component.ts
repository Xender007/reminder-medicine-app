import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  public medicine : any = [
    {name: "Dolo", power: "500mg", reminderEnabled: "yes"},
    {name: "Calpol", power: "700mg", reminderEnabled: "yes"},
    {name: "ABC", power: "1500mg", reminderEnabled: "yes"},
    {name: "XYZ", power: "300mg", reminderEnabled: "no"}
  ];
  constructor(
    private route : Router
  ) {}

  
}
