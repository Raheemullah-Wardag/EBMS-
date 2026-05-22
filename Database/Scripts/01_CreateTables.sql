-- =====================================================================
-- PART 1: CREATE TABLES (Ordered by dependencies to prevent FK errors)
-- =====================================================================
CREATE TABLE ProductImages (
    ImageID     INT           IDENTITY(1,1) PRIMARY KEY,
    ProductID   INT           NOT NULL,
    ImagePath   NVARCHAR(500) NOT NULL,
    AltText     NVARCHAR(200) NULL,        -- e.g. "King Bed Front View"
    IsMain      BIT           NOT NULL DEFAULT 0,  -- main display image
    SortOrder   INT           NOT NULL DEFAULT 0,  -- controls display order
    CreatedAt   DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
-- TABLE 1: Roles
CREATE TABLE Roles (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255) NULL
);
GO

-- TABLE 2: Users
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(512) NOT NULL,
    RoleID INT NOT NULL FOREIGN KEY REFERENCES Roles(RoleID),
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- TABLE 3: Customers
CREATE TABLE Customers (
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NULL FOREIGN KEY REFERENCES Users(UserID),
    CustomerType NVARCHAR(3) NOT NULL DEFAULT 'B2C' CHECK (CustomerType IN ('B2B','B2C')),
    FirstName NVARCHAR(100) NULL,
    LastName NVARCHAR(100) NULL,
    CompanyName NVARCHAR(200) NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NULL,
    Address NVARCHAR(500) NULL,
    City NVARCHAR(100) NULL,
    Country NVARCHAR(100) NOT NULL DEFAULT 'Pakistan',
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CHK_Cust_Type CHECK (
        (CustomerType = 'B2C' AND FirstName IS NOT NULL) OR 
        (CustomerType = 'B2B' AND CompanyName IS NOT NULL)
    )
);
GO

-- TABLE 4: Employees
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NULL FOREIGN KEY REFERENCES Users(UserID),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    NationalID NVARCHAR(50) NULL UNIQUE,
    Phone NVARCHAR(20) NULL,
    JobTitle NVARCHAR(100) NULL,
    Department NVARCHAR(100) NULL,
    HireDate DATE NOT NULL,
    Salary DECIMAL(12,2) NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- TABLE 5: Attendance
CREATE TABLE Attendance (
    AttendanceID INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeID INT NOT NULL FOREIGN KEY REFERENCES Employees(EmployeeID),
    WorkDate DATE NOT NULL,
    CheckIn TIME NULL,
    CheckOut TIME NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Present' CHECK (Status IN ('Present','Absent','Leave','HalfDay')),
    Notes NVARCHAR(500) NULL,
    CONSTRAINT UQ_Employee_WorkDate UNIQUE (EmployeeID, WorkDate)
);
GO

-- TABLE 6: ProductCategories
CREATE TABLE ProductCategories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    ParentID INT NULL FOREIGN KEY REFERENCES ProductCategories(CategoryID)
);
GO

-- TABLE 7: Products
CREATE TABLE Products (
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryID INT NOT NULL FOREIGN KEY REFERENCES ProductCategories(CategoryID),
    ProductName NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(1000) NULL,
    Material NVARCHAR(200) NULL,
    Dimensions NVARCHAR(200) NULL,
    WeightKG DECIMAL(8,2) NULL,
    BasePrice DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (BasePrice >= 0),
    StockQty INT NOT NULL DEFAULT 0 CHECK (StockQty >= 0),
    ReorderLevel INT NOT NULL DEFAULT 5,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- TABLE 8: RawMaterials
CREATE TABLE RawMaterials (
    MaterialID INT IDENTITY(1,1) PRIMARY KEY,
    MaterialName NVARCHAR(200) NOT NULL UNIQUE,
    Unit NVARCHAR(20) NOT NULL,
    StockQty DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (StockQty >= 0),
    ReorderLevel DECIMAL(12,2) NOT NULL DEFAULT 10,
    CostPerUnit DECIMAL(12,2) NOT NULL DEFAULT 0,
    Supplier NVARCHAR(200) NULL,
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- TABLE 9: Orders (FIXED: Moved Discount CHECK to Table-Level)
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    CustomerID INT NOT NULL FOREIGN KEY REFERENCES Customers(CustomerID),
    OrderType NVARCHAR(6) NOT NULL CHECK (OrderType IN ('Stock','Custom')),
    OrderStatus NVARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (OrderStatus IN ('Pending','Confirmed','InProduction','Ready','Shipped','Delivered','Cancelled')),
    OrderDate DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    DeliveryDate DATE NULL,
    ShippingAddr NVARCHAR(500) NULL,
    TotalAmount DECIMAL(14,2) NOT NULL DEFAULT 0,
    Discount DECIMAL(14,2) NOT NULL DEFAULT 0,
    FinalAmount AS (TotalAmount - Discount) PERSISTED,
    Notes NVARCHAR(1000) NULL,
    CreatedBy INT NULL FOREIGN KEY REFERENCES Users(UserID),
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CHK_Order_Discount CHECK (Discount >= 0 AND Discount <= TotalAmount)
);
GO

-- TABLE 10: OrderItems
CREATE TABLE OrderItems (
    OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderID),
    ProductID INT NOT NULL FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL DEFAULT 1 CHECK (Quantity > 0),
    UnitPrice DECIMAL(12,2) NOT NULL CHECK (UnitPrice >= 0),
    LineTotal AS (Quantity * UnitPrice) PERSISTED
);
GO

-- TABLE 11: CustomOrderSpecs
CREATE TABLE CustomOrderSpecs (
    SpecID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL UNIQUE FOREIGN KEY REFERENCES Orders(OrderID),
    FurnitureType NVARCHAR(200) NOT NULL,
    WoodType NVARCHAR(100) NULL,
    Finish NVARCHAR(100) NULL,
    Dimensions NVARCHAR(200) NULL,
    SpecialNotes NVARCHAR(2000) NULL,
    AttachmentPath NVARCHAR(500) NULL,
    QuotedPrice DECIMAL(12,2) NULL,
    ApprovedByID INT NULL FOREIGN KEY REFERENCES Users(UserID)
);
GO

-- TABLE 12: ProductionBatches
CREATE TABLE ProductionBatches (
    BatchID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NULL FOREIGN KEY REFERENCES Orders(OrderID),
    BatchName NVARCHAR(200) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Planned' CHECK (Status IN ('Planned','InProgress','QC','Completed','Cancelled')),
    StartDate DATE NULL,
    EndDate DATE NULL,
    AssignedTo INT NULL FOREIGN KEY REFERENCES Employees(EmployeeID),
    Notes NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CHK_Dates CHECK (EndDate IS NULL OR StartDate IS NULL OR EndDate >= StartDate)
);
GO

-- TABLE 13: ProductionBatchItems
CREATE TABLE ProductionBatchItems (
    BatchItemID INT IDENTITY(1,1) PRIMARY KEY,
    BatchID INT NOT NULL FOREIGN KEY REFERENCES ProductionBatches(BatchID),
    ProductID INT NULL FOREIGN KEY REFERENCES Products(ProductID),
    SpecID INT NULL FOREIGN KEY REFERENCES CustomOrderSpecs(SpecID),
    QuantityPlanned INT NOT NULL DEFAULT 1,
    QuantityMade INT NOT NULL DEFAULT 0,
    CONSTRAINT CHK_QtyMade CHECK (QuantityMade <= QuantityPlanned)
);
GO

-- TABLE 14: MaterialUsage
CREATE TABLE MaterialUsage (
    UsageID INT IDENTITY(1,1) PRIMARY KEY,
    BatchID INT NOT NULL FOREIGN KEY REFERENCES ProductionBatches(BatchID),
    MaterialID INT NOT NULL FOREIGN KEY REFERENCES RawMaterials(MaterialID),
    QtyUsed DECIMAL(12,2) NOT NULL CHECK (QtyUsed > 0),
    UsageDate DATE NOT NULL DEFAULT CAST(SYSUTCDATETIME() AS DATE),
    RecordedBy INT NULL FOREIGN KEY REFERENCES Employees(EmployeeID)
);
GO

-- TABLE 15: Payments
CREATE TABLE Payments (
    PaymentID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderID),
    Amount DECIMAL(14,2) NOT NULL CHECK (Amount > 0),
    PaymentMethod NVARCHAR(20) NOT NULL CHECK (PaymentMethod IN ('Cash','BankTransfer','Card','Cheque')),
    PaymentStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (PaymentStatus IN ('Pending','Completed','Failed','Refunded')),
    TransactionRef NVARCHAR(200) NULL,
    PaidAt DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

-- TABLE 16: AuditLog
CREATE TABLE AuditLog (
    LogID BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NULL FOREIGN KEY REFERENCES Users(UserID),
    TableName NVARCHAR(100) NOT NULL,
    Action NVARCHAR(10) NOT NULL CHECK (Action IN ('INSERT','UPDATE','DELETE')),
    RecordID INT NULL,
    OldValues NVARCHAR(MAX) NULL,
    NewValues NVARCHAR(MAX) NULL,
    LoggedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
