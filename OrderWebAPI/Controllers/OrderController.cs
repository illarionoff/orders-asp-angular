using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using OrderWebAPI;

namespace OrderWebAPI.Controllers
{
    public class OrderController : ApiController
    {
        private RestaurantDBEntities db = new RestaurantDBEntities();

        // GET: api/Order
        public System.Object GetOrders()
        {

            var result = (from a in db.Orders
                join b in db.Customers on a.CustomerID equals b.CustomerID
                select new
                {
                    a.OrderID,
                    a.OrderNo,
                    Customer = b.Name,
                    a.PMMethod,
                    a.GTotal,
                    DeletedOrederItemIDs = ""
                }).ToList();

  
                
            return result;
        }

        // GET: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult GetOrder(long id)
        {
            var order = db.Orders.Where(item => item.OrderID == id).Select(value => new
            {
                value.OrderID,
                value.OrderNo,
                value.CustomerID,
                value.PMMethod,
                value.GTotal,
                DeletedOrederItemIDs = ""
            }).FirstOrDefault();

            var orderDetails = (from a in db.OrderItems
                join b in db.Items on a.ItemID equals b.ItemID
                where a.OrderID == id
                select new
                {
                    a.OrderID,
                    a.OrderItemID,
                    a.ItemID,
                    ItemName = b.Name,
                    b.Price,
                    a.Quantity,
                    Total = a.Quantity * b.Price
                }).ToList();

            return Ok(new
            {
                order,
                orderDetails
            }); 
        }

        // POST: api/Order
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {
            try
            {

                if (order.OrderID == 0)
                {
                    db.Orders.Add(order);
                }
                else
                {
                    db.Entry(order).State = EntityState.Modified;
                }
                

                foreach (var orderItem in order.OrderItems)
                {
                    if (orderItem.OrderItemID == 0)
                    {
                        db.OrderItems.Add(orderItem);
                    }
                    else
                    {
                        db.Entry(orderItem).State = EntityState.Modified;
                    }
                    
                }

                foreach (var id in order.DeletedOrederItemIDs.Split(',').Where(x=>x != ""))
                {
                    OrderItems x = db.OrderItems.Find(Convert.ToInt64(id));
                    db.OrderItems.Remove(x);
                }

                db.SaveChanges();

                return Ok(); 

            }
            catch (Exception e)
            {
                throw e;
            }

        }

        // DELETE: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult DeleteOrder(int id)
        {
            Order order = db.Orders.Include(x => x.OrderItems).SingleOrDefault(x => x.OrderID == id);

            foreach (var item in order.OrderItems.ToList())
            {
                db.OrderItems.Remove(item);
            }
         
            db.Orders.Remove(order);
            db.SaveChanges();

            return Ok(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(long id)
        {
            return db.Orders.Count(e => e.OrderID == id) > 0;
        }
    }
}