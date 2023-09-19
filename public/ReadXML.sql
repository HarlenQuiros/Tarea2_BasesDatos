DELETE FROM ClaseArticulo
DELETE FROM Usuario
DELETE FROM EventLog
DELETE FROM Articulo

DBCC CHECKIDENT('ClaseArticulo', RESEED, 0)
DBCC CHECKIDENT('Usuario', RESEED, 0)
DBCC CHECKIDENT('EventLog', RESEED, 0)
DBCC CHECKIDENT('Articulo', RESEED, 0)

SELECT * FROM ClaseArticulo
SELECT * FROM Usuario
SELECT * FROM EventLog
SELECT * FROM Articulo


DECLARE @xmlData XML;
DECLARE @IdClaseKey INT;

SET @xmlData = (
		SELECT *
		FROM OPENROWSET(BULK '/cloudclusters/files/datos.xml', SINGLE_BLOB) 
		AS xmlData
		);

INSERT INTO Usuario(UserName, Clave)
SELECT 
	T.Item.value('@Nombre', 'VARCHAR(16)'),
	T.Item.value('@Password', 'VARCHAR(16)')
FROM @xmlData.nodes('Usuarios/usuario') as T(Item)

INSERT INTO ClaseArticulo(Nombre)
SELECT 
	T.Item.value('@Nombre', 'VARCHAR(64)')
FROM @xmlData.nodes('ClasesdeArticulos/ClasesdeArticulos') as T(Item)




DECLARE @xmlData XML;
DECLARE @IdClaseKey INT;
DECLARE @ClaseNombre VARCHAR(64);

SET @xmlData = (
		SELECT *
		FROM OPENROWSET(BULK '/cloudclusters/files/datos.xml', SINGLE_BLOB) 
		AS xmlData
		);



SELECT @ClaseNombre = T.Item.value('@ClaseArticulo', 'VARCHAR(64)') FROM @xmlData.nodes('Articulos/Articulo') as T(Item)
SELECT @IdClaseKey = id FROM ClaseArticulo WHERE Nombre = @ClaseNombre
INSERT INTO Articulo(IdClaseArticulo, Codigo, Nombre, Precio)
SELECT 
	@IdClaseKey,
	T.Item.value('@Codigo', 'VARCHAR(32)'),
	T.Item.value('@Nombre', 'VARCHAR(128)'),
	T.Item.value('@Precio', 'MONEY')
FROM @xmlData.nodes('Articulos/Articulo') as T(Item)