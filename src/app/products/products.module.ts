import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EffectsModule } from "@ngrx/effects";
import { ProductsRoutingModule } from "./products-routing.module";
import { ProductsPageContainer } from "./containers/products-page.container";
import { ProductsTableComponent } from "./components/products-table.component";

@NgModule({
  //import standalone component, effects and reducers
  imports: [
    CommonModule,
    EffectsModule,
    ProductsRoutingModule,
    ProductsPageContainer,
    ProductsTableComponent
  ]
})

export class ProductsModule{}
