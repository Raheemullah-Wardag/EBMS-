CREATE TRIGGER TRG_Products_UpdateTimestamp
ON Products
AFTER UPDATE
AS
BEGIN
    -- Prevent trigger from firing if no rows were actually updated
    IF NOT UPDATE(UpdatedAt) 
    BEGIN
        UPDATE Products
        SET UpdatedAt = SYSUTCDATETIME()
        FROM Products p
        INNER JOIN inserted i ON p.ProductID = i.ProductID;
    END
END;
go

CREATE TRIGGER TRG_OrderItems_CalculateTotal
ON OrderItems
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- We need to get all affected OrderIDs from both inserted (new) and deleted (old) rows
    WITH AffectedOrders AS (
        SELECT OrderID FROM inserted
        UNION
        SELECT OrderID FROM deleted
    )
    UPDATE o
    SET o.TotalAmount = ISNULL((
        SELECT SUM(LineTotal)
        FROM OrderItems oi
        WHERE oi.OrderID = o.OrderID
    ), 0)
    FROM Orders o
    INNER JOIN AffectedOrders a ON o.OrderID = a.OrderID;
END;
GO

CREATE TRIGGER TRG_MaterialUsage_DeductInventory
ON MaterialUsage
AFTER INSERT
AS
BEGIN
    UPDATE rm
    SET rm.StockQty = rm.StockQty - i.QtyUsed
    FROM RawMaterials rm
    INNER JOIN (
        -- Sum up quantities just in case multiple usages for the same material are inserted at once
        SELECT MaterialID, SUM(QtyUsed) as QtyUsed 
        FROM inserted 
        GROUP BY MaterialID
    ) i ON rm.MaterialID = i.MaterialID;
END;
GO

CREATE TRIGGER TRG_Orders_AuditLog
ON Orders
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    DECLARE @Action NVARCHAR(10);
    DECLARE @UserID INT = CAST(SESSION_CONTEXT(N'UserID') AS INT); -- Grabs the UserID from .NET

    -- Determine what action happened
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
        SET @Action = 'UPDATE';
    ELSE IF EXISTS (SELECT * FROM inserted)
        SET @Action = 'INSERT';
    ELSE
        SET @Action = 'DELETE';

    -- Log INSERTS
    IF @Action = 'INSERT'
    BEGIN
        INSERT INTO AuditLog (UserID, TableName, Action, RecordID, OldValues, NewValues)
        SELECT 
            @UserID, 'Orders', @Action, i.OrderID, NULL, 
            (SELECT * FROM inserted i2 WHERE i2.OrderID = i.OrderID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM inserted i;
    END

    -- Log UPDATES
    IF @Action = 'UPDATE'
    BEGIN
        INSERT INTO AuditLog (UserID, TableName, Action, RecordID, OldValues, NewValues)
        SELECT 
            @UserID, 'Orders', @Action, i.OrderID, 
            (SELECT * FROM deleted d2 WHERE d2.OrderID = i.OrderID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
            (SELECT * FROM inserted i2 WHERE i2.OrderID = i.OrderID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
        FROM inserted i;
    END

    -- Log DELETES
    IF @Action = 'DELETE'
    BEGIN
        INSERT INTO AuditLog (UserID, TableName, Action, RecordID, OldValues, NewValues)
        SELECT 
            @UserID, 'Orders', @Action, d.OrderID, 
            (SELECT * FROM deleted d2 WHERE d2.OrderID = d.OrderID FOR JSON PATH, WITHOUT_ARRAY_WRAPPER), 
            NULL
        FROM deleted d;
    END
END;
GO