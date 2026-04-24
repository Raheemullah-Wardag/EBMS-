using EBMS_WebApp.DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace EBMS_WebApp.Controllers
{
    public class HRController : Controller
    {
        private readonly HRDataAccess _hrData;

        // Constructor asks for our Database Access logic
        public HRController(HRDataAccess hrData)
        {
            _hrData = hrData;
        }

        public IActionResult Index()
        {
            // 1. Get the OOP Objects from the Database
            var employees = _hrData.GetAllEmployees();

            // 2. Send them to the HTML Web Page
            return View(employees);
        }
    }
}