import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";

import { AppComponent } from "./app.component";
import { OrdersComponent } from "./orders/orders.component";
import { OrderComponent } from "./orders/order/order.component";
import { OrderItemsComponent } from "./orders/order-items/order-items.component";

import { OrderService } from "./shared/order.service";

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    OrderComponent,
    OrderItemsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [OrderItemsComponent],
  providers: [OrderService],
  bootstrap: [AppComponent],
})
export class AppModule {}
