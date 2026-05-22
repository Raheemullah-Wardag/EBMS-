
-- =====================================================================
-- PART 2: INSERT SAMPLE DATA
-- =====================================================================

-- 1. Roles
INSERT INTO Roles (RoleName, Description) VALUES
('Admin', 'Full system access'),
('Manager', 'Manages production, orders, staff'),
('Employee', 'Factory floor access'),
('Customer', 'Online store only');
GO

-- 2. Users 
INSERT INTO Users (Username, Email, RoleID, PasswordHash) VALUES
('admin1', 'admin@wood.com', 1, '$2a$12$dummyHash...'),
('manager1', 'manager@wood.com', 2, '$2a$12$dummyHash...'),
('emp1', 'emp1@wood.com', 3, '$2a$12$dummyHash...'),
('emp2', 'emp2@wood.com', 3, '$2a$12$dummyHash...'),
('customer1', 'customer@wood.com', 4, '$2a$12$dummyHash...');
GO

-- 3. Customers 
INSERT INTO Customers (CustomerType, FirstName, LastName, CompanyName, Email, UserID) VALUES
('B2C', 'Ali', 'Hassan', NULL, 'ali@gmail.com', 7),

GO

-- 4. Employees 
INSERT INTO Employees (FirstName, LastName, NationalID, JobTitle, Department, HireDate, UserID) VALUES
('Ahmed', 'Raza', 'NID-001', 'Carpenter', 'Production', '2022-01-10', 3),
('Bilal', 'Umar', 'NID-002', 'Polisher', 'Production', '2021-06-15', 4),
('Zara', 'Malik', 'NID-003', 'Supervisor', 'Management', '2020-03-01', 2);
GO

-- 5. ProductCategories 
INSERT INTO ProductCategories (CategoryName, ParentID) VALUES
('Bedroom Furniture', NULL),
('Living Room', NULL);

INSERT INTO ProductCategories (CategoryName, ParentID) VALUES
('Beds', 1),   
('Sofas', 2);  
GO

-- 6. Products
INSERT INTO Products (ProductName, SKU, CategoryID, BasePrice, StockQty) VALUES
('King Bed', 'BED-001', 3, 45000, 10),
('Single Bed', 'BED-002', 3, 25000, 15),
('3-Seater Sofa', 'SOF-001', 4, 60000, 8),
('Corner Sofa', 'SOF-002', 4, 85000, 4);
GO

-- 7. RawMaterials
INSERT INTO RawMaterials (MaterialName, Unit, StockQty, ReorderLevel) VALUES
('Sheesham Wood', 'm3', 50, 10),
('Teak Wood', 'm3', 30, 8),
('Wood Polish', 'litre', 100, 20),
('Screws & Bolts', 'pcs', 5000, 500);
GO

-- 8. Orders
INSERT INTO Orders (CustomerID, OrderType, OrderStatus, TotalAmount) VALUES
(1, 'Stock', 'Delivered', 45000),      
(2, 'Stock', 'Pending', 60000),        
(3, 'Custom', 'InProduction', 120000); 
GO

-- 9. OrderItems
INSERT INTO OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES
(1, 1, 1, 45000),  
(2, 3, 1, 60000);  
GO

-- 10. CustomOrderSpecs 
INSERT INTO CustomOrderSpecs (OrderID, FurnitureType, WoodType, Finish, Dimensions, QuotedPrice) VALUES
(3, 'Dining Table', 'Sheesham', 'Walnut Stain', '180cm x 90cm x 75cm', 120000);
GO

-- 11. ProductionBatches
INSERT INTO ProductionBatches (BatchName, OrderID, Status, AssignedTo) VALUES
('Batch-Custom-001', 3, 'InProgress', 1),    
('Batch-Stock-Restock', NULL, 'Planned', 2); 
GO

-- 12. Payments
INSERT INTO Payments (OrderID, Amount, PaymentMethod, PaymentStatus) VALUES
(1, 45000, 'Cash', 'Completed'),
(2, 60000, 'BankTransfer', 'Pending');
GO

-- 13. Attendance 
INSERT INTO Attendance (EmployeeID, WorkDate, CheckIn, CheckOut, Status) VALUES
(1, CAST(SYSUTCDATETIME() AS DATE), '08:00', '17:00', 'Present'), 
(2, CAST(SYSUTCDATETIME() AS DATE), '08:10', '17:00', 'Present'), 
(3, CAST(SYSUTCDATETIME() AS DATE), NULL, NULL, 'Absent');

