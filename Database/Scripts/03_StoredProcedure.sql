-- ============================================================
--  WOOD FURNITURE MANAGEMENT SYSTEM
--  Script 03 : STORED PROCEDURES
--  DB        : WoodFurnitureDB
-- ============================================================

USE WoodFurnitureDB;
GO

-- ============================================================
--  SP 1 : sp_Login
--  Fetch user info by username for JWT generation in C#
-- ============================================================
CREATE OR ALTER PROCEDURE sp_Login
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        U.UserID,
        U.Username,
        U.Email,
        U.PasswordHash,
        R.RoleName
    FROM Users U
    INNER JOIN Roles R ON U.RoleID = R.RoleID
    WHERE U.Username = @Username
      AND U.IsActive  = 1;
END
GO

-- ============================================================
--  SP 2 : sp_PlaceStockOrder
--  Insert Order + OrderItem + Deduct Stock (ACID Transaction)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_PlaceStockOrder
    @CustomerID    INT,
    @ProductID     INT,
    @Quantity      INT,
    @UnitPrice     DECIMAL(12,2),
    @Discount      DECIMAL(14,2),
    @ShippingAddr  NVARCHAR(500),
    @CreatedBy     INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderID    INT;
    DECLARE @TotalAmount DECIMAL(14,2) = @Quantity * @UnitPrice;
    DECLARE @CurrentStock INT;

    BEGIN TRANSACTION;
    BEGIN TRY

        -- Check stock availability
        SELECT @CurrentStock = StockQty 
        FROM Products 
        WHERE ProductID = @ProductID;

        IF @CurrentStock < @Quantity
        BEGIN
            RAISERROR('Insufficient stock for this product.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insert Order
        INSERT INTO Orders 
            (CustomerID, OrderType, OrderStatus, TotalAmount, Discount, ShippingAddr, CreatedBy)
        VALUES 
            (@CustomerID, 'Stock', 'Pending', @TotalAmount, @Discount, @ShippingAddr, @CreatedBy);

        SET @OrderID = SCOPE_IDENTITY();

        -- Insert Order Item
        INSERT INTO OrderItems 
            (OrderID, ProductID, Quantity, UnitPrice)
        VALUES 
            (@OrderID, @ProductID, @Quantity, @UnitPrice);

        -- Deduct Stock
        UPDATE Products 
        SET StockQty  = StockQty - @Quantity,
            UpdatedAt = SYSUTCDATETIME()
        WHERE ProductID = @ProductID;

        COMMIT TRANSACTION;

        -- Return new OrderID to C#
        SELECT @OrderID AS NewOrderID;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(500) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

-- ============================================================
--  SP 3 : sp_PlaceCustomOrder
--  Insert Order + CustomOrderSpecs (ACID Transaction)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_PlaceCustomOrder
    @CustomerID    INT,
    @Discount      DECIMAL(14,2),
    @ShippingAddr  NVARCHAR(500),
    @CreatedBy     INT,
    @FurnitureType NVARCHAR(200),
    @WoodType      NVARCHAR(100),
    @Finish        NVARCHAR(100),
    @Dimensions    NVARCHAR(200),
    @SpecialNotes  NVARCHAR(2000),
    @QuotedPrice   DECIMAL(12,2)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OrderID INT;

    BEGIN TRANSACTION;
    BEGIN TRY

        -- Insert Order
        INSERT INTO Orders 
            (CustomerID, OrderType, OrderStatus, TotalAmount, Discount, ShippingAddr, CreatedBy)
        VALUES 
            (@CustomerID, 'Custom', 'Pending', @QuotedPrice, @Discount, @ShippingAddr, @CreatedBy);

        SET @OrderID = SCOPE_IDENTITY();

        -- Insert Custom Specs
        INSERT INTO CustomOrderSpecs 
            (OrderID, FurnitureType, WoodType, Finish, Dimensions, SpecialNotes, QuotedPrice)
        VALUES 
            (@OrderID, @FurnitureType, @WoodType, @Finish, @Dimensions, @SpecialNotes, @QuotedPrice);

        COMMIT TRANSACTION;

        SELECT @OrderID AS NewOrderID;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(500) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

-- ============================================================
--  SP 4 : sp_UpdateOrderStatus
--  Update order status + write to AuditLog
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateOrderStatus
    @OrderID    INT,
    @NewStatus  NVARCHAR(30),
    @UpdatedBy  INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @OldStatus NVARCHAR(30);

    SELECT @OldStatus = OrderStatus 
    FROM Orders 
    WHERE OrderID = @OrderID;

    UPDATE Orders 
    SET OrderStatus = @NewStatus,
        UpdatedAt   = SYSUTCDATETIME()
    WHERE OrderID = @OrderID;

    -- Audit
    INSERT INTO AuditLog (UserID, TableName, Action, RecordID, OldValues, NewValues)
    VALUES (
        @UpdatedBy,
        'Orders',
        'UPDATE',
        @OrderID,
        '{"OrderStatus":"' + @OldStatus  + '"}',
        '{"OrderStatus":"' + @NewStatus  + '"}'
    );
END
GO

-- ============================================================
--  SP 5 : sp_MarkAttendance
--  Insert new attendance or update if record already exists
-- ============================================================
CREATE OR ALTER PROCEDURE sp_MarkAttendance
    @EmployeeID INT,
    @WorkDate   DATE,
    @CheckIn    TIME,
    @CheckOut   TIME,
    @Status     NVARCHAR(20),
    @Notes      NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 FROM Attendance 
        WHERE EmployeeID = @EmployeeID AND WorkDate = @WorkDate
    )
    BEGIN
        -- Update existing record
        UPDATE Attendance
        SET CheckIn  = @CheckIn,
            CheckOut = @CheckOut,
            Status   = @Status,
            Notes    = @Notes
        WHERE EmployeeID = @EmployeeID 
          AND WorkDate   = @WorkDate;
    END
    ELSE
    BEGIN
        -- Insert new record
        INSERT INTO Attendance 
            (EmployeeID, WorkDate, CheckIn, CheckOut, Status, Notes)
        VALUES 
            (@EmployeeID, @WorkDate, @CheckIn, @CheckOut, @Status, @Notes);
    END
END
GO

-- ============================================================
--  SP 6 : sp_CreateProductionBatch
--  Create batch + batch item + set order to InProduction (ACID)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_CreateProductionBatch
    @OrderID         INT,
    @BatchName       NVARCHAR(200),
    @StartDate       DATE,
    @EndDate         DATE,
    @AssignedTo      INT,
    @ProductID       INT,
    @SpecID          INT,
    @QuantityPlanned INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @BatchID INT;

    BEGIN TRANSACTION;
    BEGIN TRY

        -- Insert Batch
        INSERT INTO ProductionBatches 
            (OrderID, BatchName, Status, StartDate, EndDate, AssignedTo)
        VALUES 
            (@OrderID, @BatchName, 'Planned', @StartDate, @EndDate, @AssignedTo);

        SET @BatchID = SCOPE_IDENTITY();

        -- Insert Batch Item
        INSERT INTO ProductionBatchItems 
            (BatchID, ProductID, SpecID, QuantityPlanned, QuantityMade)
        VALUES 
            (@BatchID, @ProductID, @SpecID, @QuantityPlanned, 0);

        -- Update Order status to InProduction
        IF @OrderID IS NOT NULL
        BEGIN
            UPDATE Orders 
            SET OrderStatus = 'InProduction',
                UpdatedAt   = SYSUTCDATETIME()
            WHERE OrderID = @OrderID;
        END

        COMMIT TRANSACTION;

        SELECT @BatchID AS NewBatchID;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(500) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

-- ============================================================
--  SP 7 : sp_UpdateBatchStatus
--  Update batch status + quantity made + restock if completed
-- ============================================================
CREATE OR ALTER PROCEDURE sp_UpdateBatchStatus
    @BatchID       INT,
    @NewStatus     NVARCHAR(20),
    @QuantityMade  INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ProductID INT;

    -- Get ProductID from batch items
    SELECT @ProductID = ProductID 
    FROM ProductionBatchItems 
    WHERE BatchID = @BatchID;

    -- Update Batch
    UPDATE ProductionBatches 
    SET Status    = @NewStatus,
        UpdatedAt = SYSUTCDATETIME()
    WHERE BatchID = @BatchID;

    -- Update Quantity Made
    UPDATE ProductionBatchItems 
    SET QuantityMade = @QuantityMade
    WHERE BatchID = @BatchID;

    -- If completed and linked to a stock product, add to stock
    IF @NewStatus = 'Completed' AND @ProductID IS NOT NULL
    BEGIN
        UPDATE Products 
        SET StockQty  = StockQty + @QuantityMade,
            UpdatedAt = SYSUTCDATETIME()
        WHERE ProductID = @ProductID;
    END
END
GO

-- ============================================================
--  SP 8 : sp_RecordMaterialUsage
--  Log material used in batch + deduct from RawMaterials (ACID)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_RecordMaterialUsage
    @BatchID     INT,
    @MaterialID  INT,
    @QtyUsed     DECIMAL(12,2),
    @RecordedBy  INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @CurrentStock DECIMAL(12,2);

    BEGIN TRANSACTION;
    BEGIN TRY

        -- Check available stock
        SELECT @CurrentStock = StockQty 
        FROM RawMaterials 
        WHERE MaterialID = @MaterialID;

        IF @CurrentStock < @QtyUsed
        BEGIN
            RAISERROR('Insufficient raw material stock.', 16, 1);
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Insert usage record
        INSERT INTO MaterialUsage 
            (BatchID, MaterialID, QtyUsed, RecordedBy)
        VALUES 
            (@BatchID, @MaterialID, @QtyUsed, @RecordedBy);

        -- Deduct from raw material stock
        UPDATE RawMaterials 
        SET StockQty  = StockQty - @QtyUsed,
            UpdatedAt = SYSUTCDATETIME()
        WHERE MaterialID = @MaterialID;

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(500) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

-- ============================================================
--  SP 9 : sp_ProcessPayment
--  Record payment + auto-confirm order if fully paid (ACID)
-- ============================================================
CREATE OR ALTER PROCEDURE sp_ProcessPayment
    @OrderID        INT,
    @Amount         DECIMAL(14,2),
    @PaymentMethod  NVARCHAR(20),
    @TransactionRef NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FinalAmount  DECIMAL(14,2);
    DECLARE @TotalPaid    DECIMAL(14,2);

    BEGIN TRANSACTION;
    BEGIN TRY

        -- Insert payment
        INSERT INTO Payments 
            (OrderID, Amount, PaymentMethod, PaymentStatus, TransactionRef, PaidAt)
        VALUES 
            (@OrderID, @Amount, @PaymentMethod, 'Completed', @TransactionRef, SYSUTCDATETIME());

        -- Get order final amount
        SELECT @FinalAmount = FinalAmount 
        FROM Orders 
        WHERE OrderID = @OrderID;

        -- Sum all completed payments for this order
        SELECT @TotalPaid = ISNULL(SUM(Amount), 0)
        FROM Payments
        WHERE OrderID = @OrderID AND PaymentStatus = 'Completed';

        -- Auto-confirm if fully paid
        IF @TotalPaid >= @FinalAmount
        BEGIN
            UPDATE Orders 
            SET OrderStatus = 'Confirmed',
                UpdatedAt   = SYSUTCDATETIME()
            WHERE OrderID = @OrderID 
              AND OrderStatus = 'Pending';
        END

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(500) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END
GO

-- ============================================================
--  SP 10 : sp_GetDashboardStats
--  Return all admin dashboard summary stats in one call
-- ============================================================
CREATE OR ALTER PROCEDURE sp_GetDashboardStats
AS
BEGIN
    SET NOCOUNT ON;

    -- Total Orders
    SELECT COUNT(*) AS TotalOrders FROM Orders;

    -- Orders by Status
    SELECT OrderStatus, COUNT(*) AS Count
    FROM Orders
    GROUP BY OrderStatus;

    -- Total Revenue (Delivered orders only)
    SELECT ISNULL(SUM(FinalAmount), 0) AS TotalRevenue
    FROM Orders
    WHERE OrderStatus = 'Delivered';

    -- Products summary
    SELECT 
        COUNT(*) AS TotalProducts,
        SUM(CASE WHEN StockQty <= ReorderLevel THEN 1 ELSE 0 END) AS LowStockCount
    FROM Products
    WHERE IsActive = 1;

    -- Total Employees
    SELECT COUNT(*) AS TotalEmployees 
    FROM Employees 
    WHERE IsActive = 1;

    -- Total Customers
    SELECT COUNT(*) AS TotalCustomers 
    FROM Customers 
    WHERE IsActive = 1;

    -- Active Production Batches
    SELECT COUNT(*) AS ActiveBatches 
    FROM ProductionBatches 
    WHERE Status IN ('Planned', 'InProgress', 'QC');

END
GO

-- ============================================================
PRINT '================================================';
PRINT ' 03_StoredProcedures.sql executed successfully.';
PRINT ' Total procedures created : 10';
PRINT '================================================';
GO