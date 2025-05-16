import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Food } from '../../models/food.model';
import { EditableFood } from '../../models/editable-food.model';


@Component({
  selector: 'app-naplo-food',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './naplo-food.component.html',
  styleUrls: ['./naplo-food.component.scss']
})
export class NaploFoodComponent {
  @Input() food!: Food;
  @Input() editMode: boolean = false;
  @Input() unit: 'metric' | 'imperial' = 'metric';
  
  @Output() editStart = new EventEmitter<Food>();
  @Output() editSave = new EventEmitter<EditableFood>();
  @Output() editCancel = new EventEmitter<void>();
  @Output() deleteItem = new EventEmitter<string>();
  
  editedFood: EditableFood = {};
  
  startEdit(): void {
    this.editedFood = { ...this.food };
    this.editStart.emit(this.food);
  }
  
  saveEdit(): void {
    this.editSave.emit(this.editedFood);
  }
  
  cancelEdit(): void {
    this.editCancel.emit();
  }
  
  deleteFood(): void {
    if (this.food.id) {
      this.deleteItem.emit(this.food.id);
    }
  }
  
  getWeightUnit(): string {
    return this.unit === 'metric' ? 'g' : 'oz';
  }
}