using System.Linq;
using System.Web.Http;

namespace OrderWebAPI.Controllers
{
    public class CustomerController : ApiController
    {
        private readonly RestaurantDBEntities db = new RestaurantDBEntities();

        // GET: api/Customer
        public IQueryable<Customer> GetCustomers()
        {
            return db.Customers;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}