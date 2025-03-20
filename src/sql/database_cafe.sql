CREATE DATABASE IF NOT EXISTS cafe;
USE cafe;

-- Tabla de Usuarios
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,	
    nombre CHAR(50) NOT NULL,
    apellidos VARCHAR(250) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    telefono VARCHAR(15) NOT NULL
);

-- Tabla de Productos
CREATE TABLE PRODUCTO (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
);

-- Tabla de Pedidos (relación N:M entre User y PRODUCTO)
CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    producto_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES PRODUCTO(producto_id) ON DELETE CASCADE
);

-- Tabla de Logros
CREATE TABLE LOGRO (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(500) NOT NULL,
    recompensa VARCHAR(500) NOT NULL
);

-- Tabla de relación entre User y LOGRO (N:M)
CREATE TABLE obtiene (
    id_usuario INT NOT NULL,
    id_logro INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_logro),
    FOREIGN KEY (id_usuario) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (id_logro) REFERENCES LOGRO(id) ON DELETE CASCADE
);

