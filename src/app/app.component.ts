import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Person {
  name: string;
  tasks: Task[];
}

interface Task {
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  people: string[] = [];
  persons: Person[] = [];
  task= {} as Task;
  tasks: Task[] = [];
  personInputText = '';
  taskInputText = '';
  searchInputText = '';
  imageUrl: string = '';
  assignedTasks:Task[][] = [];
  numberOfPeople: number = 0;
  errorMessagePerson = '';
  errorMessageTask = '';
  errorMessageSearch = '';
  errorMessageAssign = '';
  title: any;

  constructor(private http: HttpClient) {}

  onPersonInput(value: string) {
    this.personInputText = value;
    this.numberOfPeople++;
  }

  onTaskInput(value: string) {
    this.taskInputText = value;
  }

  onSearchInput(value: string) {
    this.searchInputText = value;
  }

  onSearch() {
    if (!this.searchInputText.length) {
      this.errorMessageSearch = "Please input a search query";
      return;
    }

    this.http.get(`https://api.unsplash.com/search/photos?query=${this.searchInputText}&client_id=O3kmDD7k0On7Y6yx-fBImEQpxRhf5yRXhSBfhBa0dMg`)
      .subscribe((response: any) => {
        if (response && response.results && response.results.length > 0) {
          this.imageUrl = response.results[0].urls.small;
        } else {
          this.errorMessageSearch = "Could not find an image. Please try again";
        return;
        }
      });

      this.searchInputText = '';
      this.errorMessageTask = '';
      this.errorMessageSearch = '';
  }
  
  onClickPerson() {
    if (!this.personInputText.length) {
      this.errorMessagePerson = "Please input a person's name";
      return;
    }
  
    this.errorMessagePerson = '';
    this.people.push(this.personInputText);
    this.personInputText = '';
    this.assignedTasks = []
    this.persons = []
    this.numberOfPeople--; // Decrement numberOfPeople here
  }
  

  onClickTask() {
    if (!this.taskInputText.length) {
      this.errorMessageTask = "Please input a task";
      return;
    }

    const newTask: Task = {
      name: this.taskInputText,
      imageUrl: this.imageUrl
    };
    this.errorMessageTask = '';
    this.errorMessageSearch = '';
    this.tasks.push(newTask);
    this.taskInputText = '';
    this.searchInputText = '';
    this.imageUrl = '';
    this.assignedTasks = []
    this.persons = []
  }

  assignTasks() {

    if (!this.people.length && !this.tasks.length) {
      this.errorMessageAssign = "Please input some tasks and people that should receive them";
      return;
    }
    else if (!this.people.length) {
      this.errorMessageAssign = "There are no people to receive these tasks";
      return;
    }
    else if (!this.tasks.length) {
      this.errorMessageAssign = "There are no tasks";
      return;
    }

    this.assignedTasks = [];
    const allTasks = [...this.tasks];

    while (allTasks.length) {
      for (let i = 0; i < this.numberOfPeople; i++) {
        const randomIndex = Math.floor(Math.random() * allTasks.length);
        const task = allTasks.splice(randomIndex, 1)[0];
        if (this.assignedTasks[i]) {
          this.assignedTasks[i].push(task);
        } else {
          this.assignedTasks[i] = [task];
        }
      }
    }

    for (let i = 0; i < this.assignedTasks.length; i++) {
        this.persons[i] = {name:this.people[i], tasks:this.assignedTasks[i]}
      }

    this.people = [];
    this.tasks = [];
    this.numberOfPeople = 0;
    this.errorMessageAssign = '';
    
  }
}