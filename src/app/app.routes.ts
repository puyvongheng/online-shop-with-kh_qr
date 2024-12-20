import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MyCartComponent } from './my-cart/my-cart.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { NgModule } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
    { path: 'home', component: HomeComponent },
    { path: 'my-cart', component: MyCartComponent },
    { path: 'my-orders', component: MyOrdersComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes),], // Set up routes
    exports: [RouterModule] // Export RouterModule
})
export class AppRoutingModule { }
