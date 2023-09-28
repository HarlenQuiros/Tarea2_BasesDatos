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

SET @xmlData = (
		SELECT *
		FROM OPENROWSET(BULK '/cloudclusters/files/DatosDe@daTarea232.xml', SINGLE_BLOB) 
		AS xmlData
		);

INSERT INTO Usuario(UserName, Clave)
SELECT 
	T.Item.value('@Nombre', 'VARCHAR(16)'),
	T.Item.value('@Password', 'VARCHAR(16)')
FROM @xmlData.nodes('root/Usuarios/usuario') as T(Item)

INSERT INTO ClaseArticulo(Nombre)
SELECT 
	T.Item.value('@Nombre', 'VARCHAR(64)')
FROM @xmlData.nodes('root/ClasesdeArticulos/ClasedeArticulos') as T(Item);

WITH a AS (
	SELECT
		T.Item.value('@ClasedeArticulos', 'VARCHAR(32)') as claseArticulo,
		T.Item.value('@Codigo', 'VARCHAR(32)') as codigo,
		T.Item.value('@Nombre', 'VARCHAR(128)') as nombre,
		T.Item.value('@Precio', 'MONEY') as precio
		FROM @xmlData.nodes('root/Articulos/Articulo') as T(Item)
),
b AS (
SELECT * FROM ClaseArticulo 
)
INSERT INTO Articulo(IdClaseArticulo, Codigo, Nombre, Precio)
SELECT
	b.id,
	a.codigo,
	a.nombre,
	a.precio	
FROM a inner join b ON a.claseArticulo=b.Nombre
