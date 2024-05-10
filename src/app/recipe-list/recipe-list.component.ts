import { Component, ElementRef, ViewChild } from '@angular/core';
import { MealApiService } from '../meal-api.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, take, throttleTime } from 'rxjs';
import { RecipeCard, Category  } from '../models';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent {

  constructor(private readonly mealApi: MealApiService, private readonly route: ActivatedRoute){
    this.searchChanged.pipe(throttleTime(200), distinctUntilChanged()).subscribe((value: string) => {
      if(value === ""){
        this.getRecipesByCategory(this.selectedCategory.strCategory)
      }else{
        this.searchRecipe(value)
      }
    })
  }

  recipeList: RecipeCard[] = []
  categories: Category[] = []
  loading= true
  selectedCategory: Category = {strCategory: 'Dessert', strCategoryThumb: ''}
  searchChanged: Subject<string> = new Subject<string>()
  @ViewChild('searchinput') private searchInput!: ElementRef<HTMLInputElement>;

  ngOnInit(){
    this.getRecipesByCategory(this.selectedCategory.strCategory)
    this.getRecipesCategories()
  }

  getRecipesByCategory(category: string){
    this.mealApi.getRecipesByCategory(category).pipe(take(1)).subscribe({next: (data) => {
      let mappedData = data as {meals: RecipeCard[]}
      this.recipeList = mappedData.meals
      this.searchInput.nativeElement.value = ""
      this.loading = false
  }})
}

  getRecipesCategories(){
    this.mealApi.getRecipesCategories().pipe(take(1)).subscribe({next: (data) => {
      let mappedData = data as {categories: Category[]}
      this.categories = mappedData.categories
      this.selectedCategory = this.categories.find( el => el.strCategory = 'Dessert') || this.selectedCategory
      this.setSelectedCategory(this.selectedCategory)
    }})
  }

  setSelectedCategory(category: Category) {
    this.selectedCategory = category
    this.getRecipesByCategory(this.selectedCategory.strCategory)
  }

  searchRecipe(name: string){
    this.mealApi.searchRecipe(name).pipe(take(1)).subscribe({next: (data) => {
      console.log(data)
      let mappedData = data as {meals: RecipeCard[]}
      this.recipeList = mappedData.meals
      this.loading = false
    }})
  }

}
