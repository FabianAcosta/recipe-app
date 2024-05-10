import { Component, Input } from '@angular/core';
import { RecipeCard } from 'src/app/models'

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent {

  @Input() recipe: RecipeCard | null = null
}
