import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MealApiService {
  basePath: string

  constructor(private http: HttpClient) {
    this.basePath = "https://www.themealdb.com/api/json/v1/1/"
  }

  public getRecipesByCategory (category:string) {
    return this.http.get(`${this.basePath}filter.php?c=${category}`)
  }
  public getRecipesCategories () {
    return this.http.get(`${this.basePath}categories.php`)
  }
  public getRecipeDetail (id: string) {
    return this.http.get(`${this.basePath}lookup.php?i=${id}`)
  }
  public searchRecipe (name: string) {
    return this.http.get(`${this.basePath}search.php?s=${name}`)
  }
}
