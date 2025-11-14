import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductsPageContainer } from "./containers/products-page.container";

const routes: Routes = [
  {path: '', component: ProductsPageContainer}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule{}
