using System.Linq;
using System.Web.Http;

namespace OrderWebAPI.Controllers
{
    public class ItemController : ApiController
    {
        private readonly RestaurantDBEntities db = new RestaurantDBEntities();

        // GET: api/Item
        public IQueryable<Item> GetItems()
        {
            return db.Items;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing) db.Dispose();
            base.Dispose(disposing);
        }
    }
}