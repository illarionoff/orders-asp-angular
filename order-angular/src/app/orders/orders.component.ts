import { Component, OnInit } from "@angular/core";
import { OrderService } from "../shared/order.service";
import { Order } from "./../shared/order.model";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.css"],
})
export class OrdersComponent implements OnInit {
  orderList;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toasrt: ToastrService
  ) {}

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.orderService.getOrderList().then((res) => (this.orderList = res));
  }

  openForEdit(orderID) {
    this.router.navigate([`/order/edit/${orderID}`]);
  }

  onOrderDelete(orderID) {
    this.orderService.deleteOrder(orderID).then(() => {
      this.refreshList();
    });
    this.toasrt.warning("Removed successfully", "Restaurant App");
  }
}
