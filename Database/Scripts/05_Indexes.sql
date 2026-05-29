-- ---------------------------------------------------
-- 1. CUSTOMERS (Searched by Support/Sales often)
-- ---------------------------------------------------
-- Highly selective lookups
CREATE NONCLUSTERED INDEX IX_Customers_Email ON Customers(Email);
CREATE NONCLUSTERED INDEX IX_Customers_Phone ON Customers(Phone);

-- Composite index for searching by Name (Useful for Admin dashboards)
CREATE NONCLUSTERED INDEX IX_Customers_Name ON Customers(LastName, FirstName);


-- ---------------------------------------------------
-- 2. EMPLOYEES (Directory searches & filtering)
-- ---------------------------------------------------
-- Commonly searched by HR or Managers
CREATE NONCLUSTERED INDEX IX_Employees_Name ON Employees(LastName, FirstName);
CREATE NONCLUSTERED INDEX IX_Employees_Department ON Employees(Department);


-- ---------------------------------------------------
-- 3. PRODUCTS (E-commerce storefront searches)
-- ---------------------------------------------------
-- Crucial for storefront navigation (e.g., "Show me all Beds")
CREATE NONCLUSTERED INDEX IX_Products_CategoryID ON Products(CategoryID);

-- Crucial for search bars (e.g., user types "Oak Dining Table")
CREATE NONCLUSTERED INDEX IX_Products_ProductName ON Products(ProductName);


-- ---------------------------------------------------
-- 4. ORDERS & ORDER ITEMS (Most heavily queried tables)
-- ---------------------------------------------------
-- Crucial for viewing a specific customer's order history
CREATE NONCLUSTERED INDEX IX_Orders_CustomerID ON Orders(CustomerID);

-- Composite index for Admin Dashboards (e.g., "Show me all 'Pending' orders from this week")
CREATE NONCLUSTERED INDEX IX_Orders_Status_Date ON Orders(OrderStatus, OrderDate DESC);

-- CRITICAL: Without this, loading an order's items will scan the entire OrderItems table
CREATE NONCLUSTERED INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);


-- ---------------------------------------------------
-- 5. PRODUCTION & INVENTORY (Factory floor dashboards)
-- ---------------------------------------------------
-- Factory dashboard filtering (e.g., "Show 'InProgress' batches")
CREATE NONCLUSTERED INDEX IX_ProductionBatches_Status ON ProductionBatches(Status);

-- Link back to the Order to see what is being produced
CREATE NONCLUSTERED INDEX IX_ProductionBatches_OrderID ON ProductionBatches(OrderID);

-- ---------------------------------------------------
-- 6. PRODUCT IMAGES
-- ---------------------------------------------------
-- Web pages will constantly query this to load product images
CREATE NONCLUSTERED INDEX IX_ProductImages_ProductID ON ProductImages(ProductID);
GO