import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  todos: Todo[] = [];
  newTodo: Todo = { name: '', description: '', completed: false, image_url: null };
  selectedFile: File | null = null;
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('loginToken')}`
    });
    this.getTodos();
  }


  getTodos() {
    this.http.get('https://todo-app-iota-three-31.vercel.app/list-all-todo/', { headers: this.httpHeaders }).subscribe((res: any) => {
      this.todos = res;
    });
  }

  addTodo() {
    if (!this.newTodo.name || !this.newTodo.description) {
      alert('Name and description are required.');
      return;
    }
    this.http.post('https://todo-app-iota-three-31.vercel.app/create-todo/', this.newTodo, { headers: this.httpHeaders }).subscribe(() => {
      this.getTodos();
      this.newTodo = { name: '', description: '', completed: false, image_url: null };
    });
  }


  deleteTodo(id: string) {
    console.log(id);
    this.http.delete(`https://todo-app-iota-three-31.vercel.app/delete-todo/${id}`, { headers: this.httpHeaders }).subscribe(() => {
      this.getTodos();
    });
  }

  editTodo(todo: Todo) {
    todo.editMode = true;
  }

  updateTodos(todo: Todo) {
    delete todo.editMode;
    this.http.put(`https://todo-app-iota-three-31.vercel.app/update-todo/${todo.id}`, todo, { headers: this.httpHeaders }).subscribe(() => {
      this.getTodos();
    });
  }

  cancelEdit(todo: Todo) {
    delete todo.editMode;
    this.getTodos();
    
  }

  updateTodo(todo: Todo) {
    this.http.put(`https://todo-app-iota-three-31.vercel.app/update-todo/${todo.id}`, todo, { headers: this.httpHeaders }).subscribe(() => {
      this.getTodos();
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  completeTodo(todo: Todo) {
    if (todo.completed && !todo.image_url) {
      if (!this.selectedFile) {
        alert('You must upload an image to mark this todo as completed.');
        todo.completed = false; 
        return;
      }
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);
      this.http.post(`https://todo-app-iota-three-31.vercel.app/upload-image/${todo.id}`, formData, { headers: this.httpHeaders }).subscribe((res: any) => {
        todo.image_url = res.image_url;
        this.updateTodo(todo);
      });
    } else {
      this.updateTodo(todo);
    }
  }
}

interface Todo {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
  image_url: string | null;
  editMode?: boolean;
}

