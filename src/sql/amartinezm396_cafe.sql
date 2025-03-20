CREATE DATABASE IF NOT EXISTS nefelibata02_cafe;
USE nefelibata02_cafe;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `logro` (
  `id` int(11) NOT NULL,
  `nombre` varchar(500) NOT NULL,
  `recompensa` varchar(500) NOT NULL,
  `descripcion` varchar(10000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `logro` (`id`, `nombre`, `recompensa`, `descripcion`) VALUES
(1, 'Experto en Lattes', 'Café gratis', 'Has consumido 10 lattes'),
(2, 'Amante del Espresso', 'Descuento del 20%', 'Has consumido 10 espressos'),
(3, 'Maestro del Capuchino', 'Capuchino gratis', 'Has consumido 10 capuchinos'),
(4, 'Fan del Té verde', 'Té gratis', 'Has consumido 10 tés'),
(5, 'Dulce Tentación', 'Postre gratis', 'Has comprado 10 bizcochos'),
(6, 'Maestro del Americano', 'Café Americano gratis', 'Has consumido 10 cafés americanos'),
(7, 'Fan del Mocaccino', 'Mocaccino gratis', 'Has consumido 10 mocaccinos'),
(8, 'Experto en Té Verde', 'Té Verde gratis', 'Has consumido 10 tés verdes'),
(9, 'Experto en Té Chai', 'Té Chai gratis', 'Has consumido 10 tés chai'),
(10, 'Rey del Croissant', 'Croissant gratis', 'Has comprado 10 croissants'),
(11, 'Chocoadicto', 'Pastel de Chocolate gratis', 'Has comprado 10 pasteles de chocolate'),
(12, 'Amante del Brownie', 'Brownie gratis', 'Has comprado 10 brownies de chocolate'),
(13, 'Aventurero del Bizcocho', 'Bizcocho gratis', 'Has comprado 10 bizcochos caseros'),
(14, 'Galletero/a', 'Galletas gratis', 'Has comprado 10 galletas de avena'),
(15, 'Tostadas con Tomate Fan', 'Tostada con tomate gratis', 'Has comprado 10 tostadas con tomate'),
(16, 'Tostadas con Aguacate Fan', 'Tostada con aguacate gratis', 'Has comprado 10 tostadas con aguacate'),
(17, 'Zumo Adicto', 'Zumo de naranja gratis', 'Has comprado 10 zumos de naranja'),
(18, 'Fan de los Batidos', 'Batido de fresa gratis', 'Has comprado 10 batidos de fresa');


CREATE TABLE `obtiene` (
  `id_usuario` int(11) NOT NULL,
  `id_logro` int(11) NOT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp(),
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `pedido` (`id_pedido`, `id_usuario`, `producto_id`, `fecha`, `cantidad`) VALUES
(64, 5, 4, '2025-03-17 16:51:27', 1),
(65, 5, 2, '2025-03-17 16:51:27', 2),
(66, 5, 1, '2025-03-17 16:51:27', 6),
(67, 5, 1, '2025-03-17 17:08:41', 4),
(68, 5, 2, '2025-03-17 17:08:41', 1),
(69, 5, 3, '2025-03-17 17:08:41', 1),
(70, 5, 4, '2025-03-17 17:08:41', 1),
(71, 5, 5, '2025-03-17 17:08:41', 1),
(72, 5, 1, '2025-03-19 18:11:00', 2),
(73, 5, 3, '2025-03-19 18:13:19', 1),
(74, 5, 4, '2025-03-19 18:13:19', 1),
(75, 5, 2, '2025-03-19 18:13:19', 1),
(76, 5, 1, '2025-03-19 18:13:19', 1),
(77, 5, 3, '2025-03-19 18:15:22', 1),
(78, 5, 2, '2025-03-19 18:15:22', 1),
(79, 5, 1, '2025-03-19 18:15:22', 1),
(80, 5, 4, '2025-03-19 18:15:22', 1),
(81, 5, 3, '2025-03-19 18:17:57', 1),
(82, 5, 2, '2025-03-19 18:17:57', 1),
(83, 5, 4, '2025-03-19 18:17:57', 1),
(84, 5, 2, '2025-03-19 18:21:57', 1),
(85, 5, 1, '2025-03-19 18:21:57', 1),
(86, 5, 3, '2025-03-19 18:21:57', 1),
(87, 5, 2, '2025-03-19 18:26:02', 1),
(88, 5, 1, '2025-03-19 18:26:02', 1),
(89, 5, 3, '2025-03-19 18:26:02', 1),
(90, 5, 4, '2025-03-19 18:26:02', 1),
(91, 5, 4, '2025-03-19 18:28:41', 1),
(92, 5, 3, '2025-03-19 18:28:41', 1),
(93, 5, 2, '2025-03-19 18:28:41', 1),
(94, 5, 1, '2025-03-20 08:29:53', 2),
(95, 5, 2, '2025-03-20 08:29:53', 2),
(96, 5, 3, '2025-03-20 08:29:53', 2),
(97, 5, 1, '2025-03-20 09:14:59', 1),
(98, 5, 2, '2025-03-20 09:14:59', 1),
(99, 5, 3, '2025-03-20 09:14:59', 1),
(100, 5, 2, '2025-03-20 15:43:06', 2),
(101, 5, 3, '2025-03-20 15:43:07', 1),
(102, 5, 4, '2025-03-20 15:43:09', 2);


CREATE TABLE `producto` (
  `producto_id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descripcion` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `producto` (`producto_id`, `nombre`, `precio`, `descripcion`) VALUES
(1, 'latte', 10.00, 'Espresso suave con leche deliciosamente espumosa.'),
(2, 'Café Espresso', 8.00, 'Un shot de espresso intenso y delicioso.'),
(3, 'Croissant', 6.00, 'Perfectamente dorado, ideal para acompañar tu café.'),
(4, 'Pastel de Chocolate', 7.00, 'Delicioso y suave, para los amantes del chocolate.'),
(5, 'Capuchino', 2.00, 'Café con leche espumosa y delicioso cacao.'),
(6, 'Té Verde', 1.80, 'Té suave con propiedades antioxidantes.'),
(7, 'Té Chai', 2.20, 'Té especiado con canela, jengibre y cardamomo.'),
(8, 'Mocaccino', 2.50, 'Café con chocolate y leche espumosa.'),
(9, 'Café Americano', 1.80, 'Café largo y suave con extra de agua caliente.'),
(10, 'Tostada con tomate', 2.50, 'Pan tostado con tomate y aceite de oliva.'),
(11, 'Tostada con aguacate', 3.00, 'Pan tostado con aguacate, sal y limón.'),
(12, 'Bizcocho casero', 2.00, 'Bizcocho esponjoso con aroma de vainilla.'),
(13, 'Galletas de avena', 1.50, 'Galletas caseras con avena y trozos de chocolate.'),
(14, 'Brownie de chocolate', 2.80, 'Brownie casero con nueces y chocolate negro.'),
(15, 'Zumo de naranja', 2.00, 'Zumo de naranja natural recién exprimido.'),
(16, 'Batido de fresa', 2.50, 'Batido cremoso con fresas naturales y leche.');


CREATE TABLE `tiene` (
  `producto_id` int(11) NOT NULL,
  `logro_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tiene` (`producto_id`, `logro_id`, `cantidad`) VALUES
(1, 1, 10),
(2, 2, 15),
(3, 10, 10),
(4, 11, 10),
(5, 3, 12),
(6, 8, 10),
(7, 9, 10),
(8, 7, 10),
(9, 6, 10),
(10, 15, 10),
(11, 16, 10),
(12, 13, 10),
(13, 14, 10),
(14, 12, 10),
(15, 17, 10),
(16, 18, 10);


CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `nombre` char(50) NOT NULL,
  `apellidos` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `telefono` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



INSERT INTO `user` (`id`, `username`, `password`, `nombre`, `apellidos`, `email`, `telefono`) VALUES
(1, 'pepa', 'pepa', 'pepuchi', 'pepona', 'pepa@pepa.com', '123456789'),
(5, 'jorge', '$2b$10$cdlAt07OFXS7LDn5GI.SfuG3dE.JFDKVNLpeQAvgsfBKBZeg8klJq', 'jorge', 'jorge', 'andreamartinezmoreno@hotmail.com', '11111111');


ALTER TABLE `logro`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `obtiene`
  ADD PRIMARY KEY (`id_usuario`,`id_logro`),
  ADD KEY `id_logro` (`id_logro`);


ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `producto_id` (`producto_id`);


ALTER TABLE `producto`
  ADD PRIMARY KEY (`producto_id`);

ALTER TABLE `tiene`
  ADD PRIMARY KEY (`producto_id`,`logro_id`),
  ADD KEY `logro_id` (`logro_id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);


ALTER TABLE `logro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

ALTER TABLE `producto`
  MODIFY `producto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `obtiene`
  ADD CONSTRAINT `obtiene_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `obtiene_ibfk_2` FOREIGN KEY (`id_logro`) REFERENCES `logro` (`id`) ON DELETE CASCADE;

ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`producto_id`) ON DELETE CASCADE;

ALTER TABLE `tiene`
  ADD CONSTRAINT `tiene_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`producto_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tiene_ibfk_2` FOREIGN KEY (`logro_id`) REFERENCES `logro` (`id`) ON DELETE CASCADE;
COMMIT;
