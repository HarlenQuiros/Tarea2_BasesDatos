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

with a as (
	SELECT
		T.Item.value('@ClaseArticulo', 'VARCHAR(32)') as claseArticulo,
		T.Item.value('@Codigo', 'VARCHAR(32)') as codigo,
		T.Item.value('@Nombre', 'VARCHAR(128)') as nombre,
		T.Item.value('@Precio', 'MONEY') as precio
		FROM @xmlData.nodes('Articulos/Articulo') as T(Item)
),
b as (
SELECT * FROM ClaseArticulo 
)
INSERT INTO Articulo(IdClaseArticulo, Codigo, Nombre, Precio)
select
	b.id,
	a.codigo,
	a.nombre,
	a.precio	
from a inner join b on a.claseArticulo=b.Nombre


select
Articulo.Codigo,
Articulo.Nombre as nombreProducto,
Articulo.Precio,
ClaseArticulo.Nombre as nombreClase
from Articulo inner join ClaseArticulo on Articulo.IdClaseArticulo = ClaseArticulo.id