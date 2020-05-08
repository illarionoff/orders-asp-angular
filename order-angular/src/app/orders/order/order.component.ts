import { Component, OnInit } from "@angular/core";
import { OrderService } from "./../../shared/order.service";
import { NgForm } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { OrderItemsComponent } from "./../order-items/order-items.component";
import { CustomerService } from "src/app/shared/customer.service";
import { Customer } from "src/app/shared/customer.model";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  isValid: boolean = true;

  constructor(
    public orderService: OrderService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let orderID = this.currentRoute.snapshot.paramMap.get("id");
    if (orderID == null) {
      this.resetForm();
    } else {
      this.orderService.getOrderById(parseInt(orderID)).then((res) => {
        this.orderService.formData = res.order;
        this.orderService.orderItems = res.orderDetails;
      });
    }

    this.customerService
      .getCustomerList()
      .then((res) => (this.customerList = res as Customer[]));
  }

  resetForm(form?: NgForm) {
    if ((form = null)) {
      form.resetForm();
    }
    this.orderService.formData = {
      OrderID: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID: 0,
      PMMethod: "",
      GTotal: 0,
      DeletedOrederItemIDs: "",
    };
    this.orderService.orderItems = [];
  }

  addOrEditItem(orderItemIndex, OrderID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {
      orderItemIndex,
      OrderID,
    };
    this.dialog
      .open(OrderItemsComponent, dialogConfig)
      .afterClosed()
      .subscribe(() => {
        this.updateGrandTotal();
      });
  }

  onDeleteOrderItem(orderItemId: number, index: number) {
    if (orderItemId != null) {
      this.orderService.formData.DeletedOrederItemIDs += orderItemId + ",";
    }
    this.orderService.orderItems.splice(index, 1);
    this.updateGrandTotal();
  }

  updateGrandTotal() {
    this.orderService.formData.GTotal = this.orderService.orderItems.reduce(
      (prev, current) => {
        return prev + current.Total;
      },
      0
    );
    this.orderService.formData.GTotal = parseFloat(
      this.orderService.formData.GTotal.toFixed(2)
    );
  }

  validateForm() {
    this.isValid = true;
    if (this.orderService.formData.CustomerID == 0) {
      this.isValid = false;
    } else if (this.orderService.orderItems.length == 0) {
      this.isValid = false;
    }

    return this.isValid;
  }

  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.orderService.saveOrUpdateOrder().subscribe(() => {
        this.resetForm();
        this.toastr.success("Submitted successfully", "Restaurant App");
        this.router.navigate(["/orders"]);
      });
    }
  }
}
