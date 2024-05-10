import { Component } from '@angular/core';
import { MealApiService } from '../meal-api.service';
import { take } from 'rxjs';
import { RecipeDetail } from '../models';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent {
  constructor(private readonly mealApi: MealApiService, private readonly route: ActivatedRoute, private readonly _sanitizer: DomSanitizer,){}
  recipeDetails: RecipeDetail | null = null
  recipeId: string | null = ''
  recipeIngredients: {ingredient: string, measure: string}[] = []

  ngOnInit(){
    this.recipeId = this.route.snapshot.paramMap.get('id')
    if(this.recipeId) this.getRecipeDetail(this.recipeId)

  }

  getRecipeDetail(id: string){
    this.mealApi.getRecipeDetail(id).pipe(take(1)).subscribe({next: (data) => {
      let mappedData = data as {meals: RecipeDetail[]}
      let youtubeURL = mappedData.meals[0].strYoutube?.toString().replace('watch?v=', 'embed/')
      this.recipeDetails = {...mappedData.meals[0], strYoutube: youtubeURL}
      this.recipeDetails.strYoutube = this._sanitizer.bypassSecurityTrustResourceUrl(this.recipeDetails.strYoutube+'');
      this.recipeIngredients = this.mapIngredients()
    }})
  }

  //This method is used to map ingredients and measures due to meal api structure
  mapIngredients(){
    let ingredients = []
    for (let i = 1; i <= 20; i++) {
      if(this.recipeDetails?.[`strIngredient${i}` as keyof typeof this.recipeDetails] !== ''){
        ingredients.push({ingredient: this.recipeDetails?.[`strIngredient${i}` as keyof typeof this.recipeDetails] as string,
        measure: this.recipeDetails?.[`strMeasure${i}` as keyof typeof this.recipeDetails] as string})
      }
    }
    return ingredients
  }
}
