-- ==========================================
-- EBMS DATABASE CREATION SCRIPT
-- ==========================================

-- 1. Create the Database
CREATE DATABASE EBMS_DB;
GO

-- Switch to the new database
USE EBMS_DB;
GO

-- ==========================================
-- HR MODULE
-- ==========================================
CREATE TABLE DEPARTMENT (
    DeptID INT IDENTITY(1,1) PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL
);

CREATE TABLE EMPLOYEE (
    EmpID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    EmpType VARCHAR(50) NOT NULL CHECK (EmpType IN ('Intern', 'Permanent')), -- OOP Polymorphism mapping
    DeptID INT FOREIGN KEY REFERENCES DEPARTMENT(DeptID)
);

CREATE TABLE ATTENDANCE (
    AttID INT IDENTITY(1,1) PRIMARY KEY,
    EmpID INT FOREIGN KEY REFERENCES EMPLOYEE(EmpID),
    LogDate DATE DEFAULT GETDATE(),
    Status VARCHAR(20) CHECK (Status IN ('Present', 'Absent', 'Leave'))
);

CREATE TABLE PAYROLL (
    PayrollID INT IDENTITY(1,1) PRIMARY KEY,
    EmpID INT FOREIGN KEY REFERENCES EMPLOYEE(EmpID),
    PayMonth VARCHAR(20) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount >= 0) -- Cannot pay negative salary
);

-- ==========================================
-- SUPPLY CHAIN & RAW MATERIALS MODULE
-- ==========================================
CREATE TABLE SUPPLIER (
    SupID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName VARCHAR(150) NOT NULL,
    ContactPhone VARCHAR(20)
);

CREATE TABLE RAW_MATERIAL (
    RM_ID INT IDENTITY(1,1) PRIMARY KEY,
    MaterialName VARCHAR(100) NOT NULL,
    StockQty INT DEFAULT 0 CHECK (StockQty >= 0) -- Data Integrity: No negative stock
);

CREATE TABLE PURCHASE_ORDER (
    PO_ID INT IDENTITY(1,1) PRIMARY KEY,
    SupID INT FOREIGN KEY REFERENCES SUPPLIER(SupID),
    OrderDate DATE DEFAULT GETDATE()
);

CREATE TABLE PO_DETAILS (
    POD_ID INT IDENTITY(1,1) PRIMARY KEY,
    PO_ID INT FOREIGN KEY REFERENCES PURCHASE_ORDER(PO_ID),
    RM_ID INT FOREIGN KEY REFERENCES RAW_MATERIAL(RM_ID),
    Qty INT NOT NULL CHECK (Qty > 0)
);

-- ==========================================
-- PRODUCTION & INVENTORY MODULE
-- ==========================================
CREATE TABLE FINISHED_GOOD (
    FG_ID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    StockQty INT DEFAULT 0 CHECK (StockQty >= 0),
    SellingPrice DECIMAL(10,2) NOT NULL CHECK (SellingPrice > 0)
);

CREATE TABLE PRODUCTION_BATCH (
    BatchID INT IDENTITY(1,1) PRIMARY KEY,
    FG_ID INT FOREIGN KEY REFERENCES FINISHED_GOOD(FG_ID),
    RM_ID INT FOREIGN KEY REFERENCES RAW_MATERIAL(RM_ID),
    FG_Produced INT NOT NULL CHECK (FG_Produced > 0),
    RM_Consumed INT NOT NULL CHECK (RM_Consumed > 0),
    BatchDate DATE DEFAULT GETDATE()
);

-- ==========================================
-- SALES & LOGISTICS MODULE
-- ==========================================
CREATE TABLE CLIENT (
    ClientID INT IDENTITY(1,1) PRIMARY KEY,
    OutletName VARCHAR(150) NOT NULL,
    Address VARCHAR(255)
);

CREATE TABLE SALES_ORDER (
    SO_ID INT IDENTITY(1,1) PRIMARY KEY,
    ClientID INT FOREIGN KEY REFERENCES CLIENT(ClientID),
    OrderDate DATE DEFAULT GETDATE(),
    Status VARCHAR(50) DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Processing', 'Dispatched', 'Delivered'))
);

CREATE TABLE SO_DETAILS (
    SOD_ID INT IDENTITY(1,1) PRIMARY KEY,
    SO_ID INT FOREIGN KEY REFERENCES SALES_ORDER(SO_ID),
    FG_ID INT FOREIGN KEY REFERENCES FINISHED_GOOD(FG_ID),
    Qty INT NOT NULL CHECK (Qty > 0),
    SubTotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE LOGISTICS (
    TrackID INT IDENTITY(1,1) PRIMARY KEY,
    SO_ID INT FOREIGN KEY REFERENCES SALES_ORDER(SO_ID),
    DeliveryStatus VARCHAR(50) NOT NULL,
    UpdateDate DATETIME DEFAULT GETDATE()
);

-- ==========================================
-- FINANCE MODULE
-- ==========================================
CREATE TABLE EXPENSE_LEDGER (
    ExpID INT IDENTITY(1,1) PRIMARY KEY,
    Description VARCHAR(255) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL CHECK (Amount > 0),
    ExpenseDate DATE DEFAULT GETDATE()
);

CREATE TABLE FINANCE_REPORT (
    RepID INT IDENTITY(1,1) PRIMARY KEY,
    ReportMonth VARCHAR(20) NOT NULL,
    TotalRevenue DECIMAL(15,2) DEFAULT 0,
    TotalExpense DECIMAL(15,2) DEFAULT 0,
    NetProfit AS (TotalRevenue - TotalExpense) -- Computed Column (DB Teachers love this!)
);
GO

PRINT 'EBMS Database and all 16 tables created successfully!';