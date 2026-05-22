-- ============================================================
--  WOOD FURNITURE MANAGEMENT SYSTEM
--  Script 04 : VIEWS
--  DB        : WoodFurnitureDB
-- ============================================================

USE WoodFurnitureDB;
GO

-- ============================================================
--  VIEW 1 : vw_AllOrders
--  Full order info with customer name and created-by username
-- ============================================================
CREATE OR ALTER VIEW vw_AllOrders AS
SELECT
    O.OrderID,
    O.OrderType,
    O.OrderStatus,
    O.OrderDate,
    O.DeliveryDate,
    O.TotalAmount,
    O.Discount,
    O.FinalAmount,
    O.ShippingAddr,
    O.Notes,
    -- Customer info
    ISNULL(
        NULLIF(RTRIM(LTRIM(ISNULL(C.FirstName, '') + ' ' + ISNULL(C.LastName, ''))), ''),
        C.CompanyName
    ) AS CustomerName,
    C.CustomerType,
    C.Email  AS CustomerEmail,
    C.Phone  AS CustomerPhone,
    -- Created by
    U.Username AS CreatedByUser
FROM Orders O
INNER JOIN Customers C ON O.CustomerID = C.CustomerID
LEFT  JOIN Users     U ON O.CreatedBy  = U.UserID;
GO

-- ============================================================
--  VIEW 2 : vw_OrderDetails
--  Order + line items + product names (Stock orders)
-- ============================================================
CREATE OR ALTER VIEW vw_OrderDetails AS
SELECT
    O.OrderID,
    O.OrderType,
    O.OrderStatus,
    O.OrderDate,
    ISNULL(C.FirstName + ' ' + C.LastName, C.CompanyName) AS CustomerName,
    OI.OrderItemID,
    P.ProductName,
    P.SKU,
    OI.Quantity,
    OI.UnitPrice,
    OI.LineTotal
FROM Orders O
INNER JOIN Customers  C  ON O.OrderID   = C.CustomerID
INNER JOIN OrderItems OI ON O.OrderID   = OI.OrderID
INNER JOIN Products   P  ON OI.ProductID = P.ProductID;
GO

-- ============================================================
--  VIEW 3 : vw_CustomOrders
--  Custom orders with their specifications
-- ============================================================
CREATE OR ALTER VIEW vw_CustomOrders AS
SELECT
    O.OrderID,
    O.OrderStatus,
    O.OrderDate,
    O.FinalAmount,
    ISNULL(C.FirstName + ' ' + C.LastName, C.CompanyName) AS CustomerName,
    C.Email          AS CustomerEmail,
    CS.FurnitureType,
    CS.WoodType,
    CS.Finish,
    CS.Dimensions,
    CS.SpecialNotes,
    CS.QuotedPrice,
    U.Username       AS ApprovedBy
FROM Orders O
INNER JOIN Customers       C  ON O.CustomerID    = C.CustomerID
INNER JOIN CustomOrderSpecs CS ON O.OrderID      = CS.OrderID
LEFT  JOIN Users            U  ON CS.ApprovedByID = U.UserID
WHERE O.OrderType = 'Custom';
GO

-- ============================================================
--  VIEW 4 : vw_ProductStock
--  Product list with stock status (OK / Low / Out)
-- ============================================================
CREATE OR ALTER VIEW vw_ProductStock AS
SELECT
    P.ProductID,
    P.ProductName,
    P.SKU,
    PC.CategoryName,
    P.Material,
    P.BasePrice,
    P.StockQty,
    P.ReorderLevel,
    CASE
        WHEN P.StockQty = 0              THEN 'Out of Stock'
        WHEN P.StockQty <= P.ReorderLevel THEN 'Low Stock'
        ELSE                                  'In Stock'
    END AS StockStatus
FROM Products P
INNER JOIN ProductCategories PC ON P.CategoryID = PC.CategoryID
WHERE P.IsActive = 1;
GO

-- ============================================================
--  VIEW 5 : vw_RawMaterialStock
--  Raw materials with stock status
-- ============================================================
CREATE OR ALTER VIEW vw_RawMaterialStock AS
SELECT
    MaterialID,
    MaterialName,
    Unit,
    StockQty,
    ReorderLevel,
    CostPerUnit,
    Supplier,
    CASE
        WHEN StockQty = 0               THEN 'Out of Stock'
        WHEN StockQty <= ReorderLevel   THEN 'Low Stock'
        ELSE                                 'In Stock'
    END AS StockStatus
FROM RawMaterials;
GO

-- ============================================================
--  VIEW 6 : vw_EmployeeDetails
--  Employee info joined with their user account and role
-- ============================================================
CREATE OR ALTER VIEW vw_EmployeeDetails AS
SELECT
    E.EmployeeID,
    E.FirstName,
    E.LastName,
    E.FirstName + ' ' + E.LastName AS FullName,
    E.NationalID,
    E.Phone,
    E.JobTitle,
    E.Department,
    E.HireDate,
    E.Salary,
    E.IsActive,
    U.Username,
    U.Email,
    R.RoleName
FROM Employees E
LEFT JOIN Users U ON E.UserID = U.UserID
LEFT JOIN Roles R ON U.RoleID = R.RoleID;
GO

-- ============================================================
--  VIEW 7 : vw_AttendanceSummary
--  Attendance records with employee full name
-- ============================================================
CREATE OR ALTER VIEW vw_AttendanceSummary AS
SELECT
    A.AttendanceID,
    E.EmployeeID,
    E.FirstName + ' ' + E.LastName AS EmployeeName,
    E.Department,
    E.JobTitle,
    A.WorkDate,
    A.CheckIn,
    A.CheckOut,
    A.Status,
    A.Notes
FROM Attendance A
INNER JOIN Employees E ON A.EmployeeID = E.EmployeeID;
GO

-- ============================================================
--  VIEW 8 : vw_ProductionBatches
--  Batch info with assigned employee and linked order
-- ============================================================
CREATE OR ALTER VIEW vw_ProductionBatches AS
SELECT
    PB.BatchID,
    PB.BatchName,
    PB.Status     AS BatchStatus,
    PB.StartDate,
    PB.EndDate,
    PB.Notes,
    -- Assigned supervisor
    E.FirstName + ' ' + E.LastName AS AssignedTo,
    E.JobTitle,
    -- Linked order
    O.OrderID,
    O.OrderType,
    O.OrderStatus,
    ISNULL(C.FirstName + ' ' + C.LastName, C.CompanyName) AS CustomerName
FROM ProductionBatches PB
LEFT JOIN Employees E  ON PB.AssignedTo = E.EmployeeID
LEFT JOIN Orders    O  ON PB.OrderID    = O.OrderID
LEFT JOIN Customers C  ON O.CustomerID  = C.CustomerID;
GO

-- ============================================================
--  VIEW 9 : vw_PaymentSummary
--  Payment records with order and customer info
-- ============================================================
CREATE OR ALTER VIEW vw_PaymentSummary AS
SELECT
    P.PaymentID,
    P.Amount,
    P.PaymentMethod,
    P.PaymentStatus,
    P.TransactionRef,
    P.PaidAt,
    O.OrderID,
    O.OrderType,
    O.FinalAmount  AS OrderTotal,
    ISNULL(C.FirstName + ' ' + C.LastName, C.CompanyName) AS CustomerName,
    C.Email        AS CustomerEmail
FROM Payments P
INNER JOIN Orders    O ON P.OrderID    = O.OrderID
INNER JOIN Customers C ON O.CustomerID = C.CustomerID;
GO

-- ============================================================
--  VIEW 10 : vw_DashboardSummary
--  Single-row summary for admin dashboard cards
-- ============================================================
CREATE OR ALTER VIEW vw_DashboardSummary AS
SELECT
    (SELECT COUNT(*)                  FROM Orders)                              AS TotalOrders,
    (SELECT COUNT(*)                  FROM Orders  WHERE OrderStatus = 'Pending')      AS PendingOrders,
    (SELECT COUNT(*)                  FROM Orders  WHERE OrderStatus = 'InProduction') AS InProductionOrders,
    (SELECT COUNT(*)                  FROM Orders  WHERE OrderStatus = 'Delivered')    AS DeliveredOrders,
    (SELECT ISNULL(SUM(FinalAmount),0)FROM Orders  WHERE OrderStatus = 'Delivered')    AS TotalRevenue,
    (SELECT COUNT(*)                  FROM Products WHERE IsActive = 1)                AS TotalProducts,
    (SELECT COUNT(*)                  FROM Products WHERE StockQty <= ReorderLevel AND IsActive = 1) AS LowStockProducts,
    (SELECT COUNT(*)                  FROM Employees WHERE IsActive = 1)               AS TotalEmployees,
    (SELECT COUNT(*)                  FROM Customers WHERE IsActive = 1)               AS TotalCustomers,
    (SELECT COUNT(*)                  FROM ProductionBatches WHERE Status IN ('Planned','InProgress','QC')) AS ActiveBatches;
GO

-- ============================================================
PRINT '================================================';
PRINT ' 04_Views.sql executed successfully.';
PRINT ' Total views created : 10';
PRINT '================================================';
GO