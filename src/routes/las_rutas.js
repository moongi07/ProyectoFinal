const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
//encriptar contraseñas
const bcrypt = require('bcryptjs');
//generar pdf
const PDFDocument = require('pdfkit');
//enviar correo
const nodemailer = require('nodemailer');
//para generar id unicos
const { v4: uuidv4 } = require("uuid");



const dbConnection = require('../config/dbConnection');
// realizamos una conexión a la base de datos
const connection = dbConnection();
//*********************************************************
//*********************************************************
//             controlador: INDEX request tipo->(GET "/")
//				vista: 'index' -> 
//*********************************************************
//*********************************************************
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        res.render('index');
    } else {    
        res.redirect('/login'); 
     }
});
//*********************************************************
//*********************************************************
//             controlador: LOGIN request tipo->(GET "/LOGIN")
//				vista: 'login' -> 
//*********************************************************
//*********************************************************
router.get('/login', (req, res) => {
    
    res.render('login', { mensaje: null });  
});

//*********************************************************
//*********************************************************
//        controlador: LOGIN request tipo->(POST "/LOGIN")
//				vista: 'login' -> 
//*********************************************************
//*********************************************************
router.post('/login', (req, res) => {
    const { tusuario, tpassword } = req.body;

    let sql = "SELECT id, username, password, nombre, apellidos, email, telefono FROM user WHERE username = ?";

    connection.query(sql, [tusuario], async function (err, results) {
        if (err) {
            req.session.error = "Error al procesar la solicitud.";
            return res.render('error', { errorMessage: req.session.error });
        }

        if (results.length > 0) {
            const user = results[0];
            
            // comparar la contraseña ingresada con la encriptada en la base de datos
            const passwordMatch = await bcrypt.compare(tpassword, user.password);
            
            //variables de sesion
            if (passwordMatch) {
                req.session.userId = user.id;
                req.session.user = user;
                req.session.save((err) => {
                    if (err) {
                        console.log(err);
                        return res.redirect('/login');
                        
                    }
                    return res.redirect('/');
                });
            } else {
                return res.render('login', { mensaje: "Credenciales erróneas !!" });
            }
        } else {
            return res.render('login', { mensaje: "Credenciales erróneas !!" });
        }
    });
});
//*********************************************************
//*********************************************************
//             controlador: REGISTRO request tipo->(GET "/REGISTRO")
//				vista: 'registro' -> 
//*********************************************************
//*********************************************************
router.get('/registro', (req, res) => {
    
    res.render('registro', { mensaje: null });  
});

router.post('/registro', async(req, res) =>
    {

        //console.log('inicio registro');
      
            //cogemos los datos del body
            const { tnombre, tapellidos, tusuario, temail,telefono, tpassword, tconfirmarpassword } = req.body;
              //confirmar que ambas contraseñas coincidan
            if (tpassword !== tconfirmarpassword) {
                return res.render('registro', { mensaje: "Las contraseñas no coinciden." });
            }
            try {
              //la encriptamos
                const hashedPassword = await bcrypt.hash(tpassword, 10); 
                
                // Creación del objeto usuario
                const user = {
                    nombre: tnombre,
                    apellidos: tapellidos,
                    username: tusuario,
                    email: temail,
                    telefono: telefono,
                    password: hashedPassword,
                };
                //console.log("Datos a insertar:", user);
    
                // Insertar en la base de datos
                connection.query('INSERT INTO user SET ?', user, (err, result) => {
                    if (err) {
                        console.error("Error al registrar el usuario:", err);
                        return res.render('registro', { mensaje: "Hubo un error al registrar tu cuenta." });
                    }
                    console.log("Usuario registrado correctamente.");
                    res.render('login', { mensaje: `Bienvenido!! ${user.username} Tu cuenta ha sido creada!!`});
                });
            } catch (error) {
                console.error("Error en el proceso de registro:", error);
                res.render('registro', { mensaje: "Error interno del servidor." });
            }
        
    });

    //vista de error, al final no la usamos
router.get('/error', (req, res) => {
    
    res.render('error', { errorMessage: req.session.error });
    
    delete req.session.error;
});


//*********************************************************
//*********************************************************
//         controlador: MENU request tipo->(GET "/menu")
//				vista: 'menu' -> 
//*********************************************************
//*********************************************************
router.get('/menu', (req, res) => {
  const sql = "SELECT producto_id, nombre, precio, descripcion FROM producto";

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("❌ Error al obtener productos:", err);
          return res.status(500).send("Error al obtener los productos");
      }

      //metemos los datos en un map
      let productos = results.map(producto => ({
          id: producto.producto_id,
          nombre: producto.nombre,
          precio: producto.precio,
          descripcion: producto.descripcion
      }));
      //mandamos los productos
      res.render('menu', { productos }); 
  });
});
//*********************************************************
//*********************************************************
//         controlador: MASCARRITO request tipo->(POST "/mascarrito")
//				vista: 'carrito' -> 
//*********************************************************
//*********************************************************
router.post('/mascarrito', (req, res) => {
  //nos aseguramos de que haya iniciado sesión, si no se le redirige al login
  if (!req.session.user) {
    console.log("Usuario no autenticado. Redirigiendo a /login");
    return res.redirect('/login'); 
  }
  //cogemos el id del productop
  const productoId = req.body.producto_id;

  //nos aseguramos de que sea valido
  if (!productoId || isNaN(productoId)) {
      return res.status(400).json({ mensaje: 'No se ha seleccionado un producto válido' });
  }
//cogemos los datos del producto
  const sql = 'SELECT * FROM producto WHERE producto_id = ?';

  connection.query(sql, [productoId], (err, results) => {
      if (err) {
          console.error('❌ Error al obtener el producto:', err);
          return res.status(500).json({ mensaje: 'Error al añadir el producto al carrito' });
      }
      //si existe lo guardamos en producto
      if (results.length > 0) {
          const producto = results[0];
        //si no existe la variable de sesion con los productos del carrito la creamos, es decir, en el caso de que 
        //sea el primero producto que añadimos al carrito
          if (!req.session.productos) {
              req.session.productos = [];
          }
          //si ya existe añadimos 1 a la cantidad
          const productoExistente = req.session.productos.find(p => p.producto_id === producto.producto_id);

          if (productoExistente) {
              productoExistente.cantidad += 1;
          } else {
            //si no existe todavia lo metemos en la variable de sesion con 1 como cantidad
              req.session.productos.push({
                  producto_id: producto.producto_id,
                  nombre: producto.nombre,
                  precio: producto.precio,
                  descripcion: producto.descripcion,
                  cantidad: 1
              });
          }

          return res.status(200).json({ mensaje: 'Producto añadido al carrito', productos: req.session.productos });
      } else {
          return res.status(404).json({ mensaje: 'Producto no encontrado' });
      }
  });
});


//*********************************************************
//*********************************************************
//             controlador: CARRITO request tipo->(GET "/carrito")
//				vista: 'carrito' -> 
//*********************************************************
//*********************************************************
router.get('/carrito', (req, res) => {
    //si hay algo en el carrito los mostramos, si no mandamos el mensaje que el carrito está vacío
    if (req.session.productos && req.session.productos.length > 0) {
        res.render('carrito', { productos: req.session.productos });
    } else {
        res.render('carrito', { productos: [], mensaje: 'Tu carrito está vacío.' });
    }
});

//*********************************************************
//*********************************************************
//             controlador: ELIMINAR DEL CARRITO 
//          request tipo->(POST "/eliminarproducto")
//				vista: 'carrito' -> 
//*********************************************************
//*********************************************************
router.post('/eliminarproducto', (req, res) => {
    //cogemos el id del producto
    const { producto_id } = req.body;
    //cogemos el indice del producto en la variable de sesion
    const index = req.session.productos.findIndex(p => String(p.producto_id) === String(producto_id));
  //si existe lo quitamos y redirigimos al carrito
    if (index > -1) {
        req.session.productos.splice(index, 1);
        res.redirect('/carrito');
    } else {
        res.status(404).send('Producto no encontrado en el carrito');
    }
});

//*********************************************************
//*********************************************************
//             controlador: GRACIAS
//          request tipo->(GET "/gracias")
//				vista: 'gracias' -> 
//*********************************************************
//*********************************************************
router.get('/gracias', (req, res) => {
//vista a la que redirigimos cuando el usuario haya efectuado la compra y se le haya mandado el correo con la factura
   res.render('gracias');
});

//*********************************************************
//*********************************************************
//        controlador: GENERAR PDF Y MANDAR CORREO
//        request tipo->(GET "/pago")
//				vista: 'carrito' -> 
//*********************************************************
//*********************************************************
router.get("/pago", async (req, res) => {
    //configuracion para mandar el email, las variables están en el .env
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
      },
      secure: true, // Usar SSL
      tls: {
        rejectUnauthorized: false, // ayuda con algunos problemas de certificados
      },
    })
  
    // Verificamos la conexion, esto ya no haría falta, eran pruebas para solucionar errores
    transporter.verify((error, success) => {
      if (error) {
        console.log("Error de configuración del servidor de correo:", error)
      } else {
        console.log("Servidor de correo listo para enviar mensajes")
      }
    })
  
    //si el usuario no ha iniciado sesion mandamos el error
    if (!req.session.user) {
      return res.status(401).json({ error: "Usuario no autenticado" })
    }
    //cogemos las variables de sesion del id del usuario, los productos del carrito y el email del usuario
    const productos = req.session.productos || []
    const id_usuario = req.session.user.id
    const userEmail = req.session.user.email 
  
    //nombre de factura y ruta
    //almacenamos el pdf temporalmente para poder enviarlo
    const tempFileName = `factura_${uuidv4()}.pdf`
    const tempFilePath = path.join(__dirname, "..", "temp", tempFileName)
    const tempDir = path.join(__dirname, "..", "temp")
    //si no existe creamos el directorio
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
  
    //crear pdf
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      bufferPages: true,
    })
  
    //lo guardamos como fichero temporal
    const writeStream = fs.createWriteStream(tempFilePath)
    doc.pipe(writeStream)
  
    const primaryColor = "#4F2C1D"
    const accentColor = "#D4B996"
  
    //header y logo, si no encuentra el logo ponemos simplemente la palabrá café
    const logoPath = path.join(__dirname, "..", "public", "assets", "logo.png")
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 })
    } else {
      doc.rect(50, 45, 100, 50).fill(accentColor)
      doc.fillColor(primaryColor).fontSize(20).text("CAFÉ", 75, 60)
    }
  
    //información inventada de la tienda
    doc.font("Helvetica-Bold").fontSize(18).fillColor(primaryColor).text("Café Aroma", 200, 50, { align: "right" })
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(primaryColor)
      .text("Calle del Café, 123", 200, 70, { align: "right" })
      .text("02006 Albacete, España", 200, 85, { align: "right" })
      .text("Tel: +34 91 123 45 67", 200, 100, { align: "right" })
      .text("info@cafearoma.com", 200, 115, { align: "right" })
  
    //linea
    doc.moveTo(50, 140).lineTo(550, 140).strokeColor(accentColor).lineWidth(2).stroke()
  
    //titulo y fecha
    doc.font("Helvetica-Bold").fontSize(24).fillColor(primaryColor).text("FACTURA", 50, 170)
  
    const today = new Date()
    //también ponemos el id del cliente y su nombre. Si no lo encuentra ponemos solo cliente
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(primaryColor)
      .text(`Fecha: ${today.toLocaleDateString()}`, 50, 200)
      .text(`Cliente: ${req.session.user.nombre || "Cliente"}`, 50, 215)
      .text(`ID Cliente: ${id_usuario}`, 50, 230)
  
    // código de factura
    const invoiceNumber = `INV-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today.getDate().toString().padStart(2, "0")}-${Math.floor(
      Math.random() * 1000,
    )
      .toString()
      .padStart(3, "0")}`
    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(primaryColor)
      .text(`Nº Factura: ${invoiceNumber}`, 300, 200, { align: "right" })
  
    //listamos los productos en una tabla
    //header de tabla
    doc.rect(50, 260, 500, 30).fill(primaryColor)
    doc
      .fillColor("white")
      .fontSize(12)
      .text("PRODUCTO", 100, 270)
      .text("PRECIO", 350, 270, { width: 70, align: "right" })
      .text("CANTIDAD", 420, 270, { width: 70, align: "right" })
      .text("TOTAL", 490, 270, { width: 60, align: "right" })
  
    let y = 300
    let isEvenRow = false
    //productos
    for (const producto of productos) {
      if (isEvenRow) {
        doc.rect(50, y - 10, 500, 30).fill("#F5F5F5")
      }
      isEvenRow = !isEvenRow
  
      doc
        .fillColor(primaryColor)
        .fontSize(12)
        .text(producto.nombre, 100, y, { width: 240 })
        .text(`${producto.precio.toFixed(2)}€`, 350, y, { width: 70, align: "right" })
        .text(`${producto.cantidad}`, 420, y, { width: 70, align: "right" })
      //calculamos el precio por la cantidad
      const lineTotal = producto.precio * producto.cantidad
      doc
        .fillColor(primaryColor)
        .fontSize(12)
        .text(`${lineTotal.toFixed(2)}€`, 490, y, { width: 60, align: "right" })
  
      y += 30
      //añadimos otra página si se pasa de espacio
      if (y > 700) {
        doc.addPage()
        y = 50
        doc.font("Helvetica-Bold").fontSize(14).fillColor(primaryColor).text("FACTURA (continuación)", 50, y)
        y += 30
      }
    }
  
    //total y total con el IVA
    const subtotal = productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0)
    const tax = subtotal * 0.21
    const total = subtotal + tax
    
    doc.moveTo(50, y).lineTo(550, y).strokeColor(accentColor).lineWidth(1).stroke()
    y += 20
  
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(primaryColor)
      .text("Subtotal:", 350, y, { width: 100, align: "right" })
      .text(`${subtotal.toFixed(2)}€`, 490, y, { width: 60, align: "right" })
  
    y += 20
    doc
      .text("IVA (21%):", 350, y, { width: 100, align: "right" })
      .text(`${tax.toFixed(2)}€`, 490, y, { width: 60, align: "right" })
  
    y += 30
    doc.rect(350, y - 5, 200, 25).fill(primaryColor)
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("white")
      .text("TOTAL:", 350, y, { width: 100, align: "right" })
      .text(`${total.toFixed(2)}€`, 490, y, { width: 60, align: "right" })
  
    //footer, ponemos también el número de página
    const pageCount = doc.bufferedPageCount
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i)
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(primaryColor)
        .text(`Página ${i + 1} de ${pageCount}`, 50, 800, { align: "center", width: 500 })
  
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(primaryColor)
        .text("Gracias por su compra. ¡Esperamos verle pronto!", 50, 780, { align: "center", width: 500 })
    }
  
    doc.end()
  
    //nos aseguramos de que el fichero se haya terminado de escribir correctamente
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve)
      writeStream.on("error", reject)
    })
  
    try {
      for (const producto of productos) {
        const productoId = Number.parseInt(producto.producto_id, 10)
  
        //console.log(`Procesando producto: ${producto.nombre} (ID: ${productoId}), Cantidad: ${producto.cantidad}`)
  
        //insertamos el pedido en la bbdd
        const sqlInsert = "INSERT INTO pedido (id_usuario, producto_id, fecha, cantidad) VALUES (?, ?, NOW(), ?)"
        await connection.query(sqlInsert, [id_usuario, productoId, producto.cantidad])
  
        //console.log(`Pedido insertado para producto ${productoId}`)
      }
  
      //vaciamos el carrito
      req.session.productos = []
      //console.log("Carrito procesado correctamente")
  
      //enviamos el email con el pdf adjunto
      if (userEmail) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: `Aquí tiene el pdf de su pedido ` + req.session.user.username,
          text: `Estimado/a ${req.session.user.nombre || "Cliente"},
          
                  Gracias por su compra en Café Aroma. Adjunto encontrará la factura de su pedido reciente.
                  
                  Número de factura: ${invoiceNumber}
                  Fecha: ${today.toLocaleDateString()}
                  Total: ${total.toFixed(2)}€
                  
                  ...`,
          attachments: [
            {
              filename: "factura_cafe.pdf",
              path: tempFilePath, // archivo temporal
            },
          ],
        }
  
        //envia correo
        await transporter.sendMail(mailOptions)
        //console.log("Correo enviado correctamente")
      }
  
      //por si también queremos mandarlo por http para que se descargue automáticamente
      if (req.query.download === "true") {
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", 'attachment; filename="factura_cafe.pdf"')
        res.sendFile(tempFilePath)
      } else {
        //eliminamos el archivo temporal
        setTimeout(() => {
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath)
              //console.log(`Archivo temporal ${tempFilePath} eliminado`)
            }
          } catch (err) {
            console.error("Error al eliminar archivo temporal:", err)
          }
        }, 60000) // eliminar después de 1 minuto para asegurarnos de que todo haya terminado
        //redirigimos a la vista gracias
        res.redirect("/gracias")
      }
    } catch (error) {
      console.error("Error procesando pedido:", error)
  
      // en caso de error eliminamos el archivo temporal
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath)
        }
      } catch (err) {
        console.error("Error al eliminar archivo temporal:", err)
      }
  
      res.status(500).json({ error: "Error procesando el pedido" })
    }
     //Aquí deberiamos contar la cantidad de productos que ha consumido el usuario de cada uno de ellos
     //Comparar la cantidad con la de los logros de la tabla tiene
     //En el caso de que alguna de las cantidades coincidan o sean mayores esta se almacenará en la tabla obtiene
     //de esa tabla es de la que se hará el listado en logros
     //No he podido terminar esa funcionalidad porque interrumpía la creación del pdf y correo, la haré más adelante
  });

 

//*********************************************************
//*********************************************************
//         controlador: LOGROS request tipo->(GET "/logros")
//				vista: 'logros' -> 
//*********************************************************
//*********************************************************
router.get('/logros', (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login');  
  }

  //en vez de listar los logros concretos del usuario de la tabla obtiene solo listamos los logros en general
  const sql = `SELECT id, nombre, recompensa, descripcion FROM logro`;

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("❌ Error al obtener logros:", err);
          return res.status(500).send("Error al obtener los logros");
      }

      //los metemos en un map y los mandamos a la vista logros
      const logros = results.map(row => ({
          id: row.id,
          nombre: row.nombre,
          recompensa: row.recompensa,
          descripcion: row.descripcion
      }));

      res.render('logros', { logros });
  });
});



//*********************************************************
//*********************************************************
//         controlador: USER request tipo->(GET "/user")
//				vista: 'user' -> 
//*********************************************************
//*********************************************************
router.get('/user',(req,res)=>
{
    if (!req.session.user) {
        res.redirect('/login');
    }
  //cogemos los datos del usuario una vez nos hemos asegurado de que ha iniciado sesión y los mandamos a la vista user
	let sql = "SELECT id, username, nombre, apellidos, email, telefono FROM user WHERE id = ?";


        connection.query(sql,[req.session.user.id], function (err, results) {
            if (err) {
                console.log("algo ha salido mal"+ err)
            }

      if (results.length > 0 )
			{
        let id = results[0].id;
				let username= results[0].username;
				let nombre= results[0].nombre;
				let apellidos= results[0].apellidos;
				let email= results[0].email;
				let telefono= results[0].telefono;
				res.render('user', {id, username, nombre, apellidos, email, telefono});
			}
		});
});

//*********************************************************
//*********************************************************
//        controlador: EDITAR request tipo->(GET "/editar")
//				vista: 'editar' -> 
//*********************************************************
//*********************************************************	
router.get('/editar/:id', (req, res) => {
    //cogemos el id del usuario
    const userId = req.params.id;

    //si el usuario no coincide con el de la variable de sesión destruimos la sesion y lo volvemos a mandar al login
    if (req.session.userId != userId) {
      req.session.destroy(function(err)
			{
				res.redirect("/");
			});
    }

    //obtenemos los datos del usuario de la base de datos para mandarlos a editar y que el usuario puea modificarlos
    const sql = 'SELECT nombre, apellidos, username, email, telefono FROM user WHERE id = ?';
    
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener los datos del usuario:', err);
            return res.status(500).send("Error al obtener los datos del usuario");
        }
        
        if (results.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }

        //mandamos los datos
        const user = results[0];
        res.render('editar', {
            nombre: user.nombre,
            apellidos: user.apellidos,
            username: user.username,
            email: user.email,
            telefono: user.telefono,
            id: userId
        });
    });
});


//*********************************************************
//*********************************************************
//         controlador: EDITAR request tipo->(POST "/editar")
//				vista: 'editar' -> 
//*********************************************************
//*********************************************************	
router.post('/editar', (req, res) => {
    //cogemos los datos del formulario y hacemos el update
    const { nombre, apellidos, username, email, telefono, id } = req.body; 

    //verificamos otra vez que la variable de sesion del id del usuario coincide con el id pasado
    if (req.session.userId != id) {
      req.session.destroy(function(err)
			{
				res.redirect("/");
			});
    }

    //hacemos el update de los datos del usuario
    const sql = `UPDATE user
                 SET nombre = ?, apellidos = ?, username = ?, email = ?, telefono = ? 
                 WHERE id = ?`;

    connection.query(sql, [nombre, apellidos, username, email, telefono, id], (err, result) => {
        if (err) {
            console.error('❌ Error al actualizar el usuario:', err);
            return res.status(500).send("Error al actualizar el usuario");
        }
        
        //actualizamos las variables de sesion con los nuevos datos
        req.session.user.nombre = nombre;
        req.session.user.apellidos = apellidos;
        req.session.user.username = username;
        req.session.user.email = email;
        req.session.user.telefono = telefono;

        //guardamos la sesión
        req.session.save(err => {
            if (err) {
                console.error('❌ Error al guardar la sesión:', err);
                return res.status(500).send("Error al actualizar la sesión.");
            }

            //console.log('✅ Usuario actualizado correctamente:', result);
            //redirigimos a la vista user
            res.redirect('/user');  
        });
    });
});


//*********************************************************
//*********************************************************
//         controlador: FOCUS request tipo->(GET "/focus")
//				vista: 'focus' -> 
//*********************************************************
//*********************************************************
router.get('/focus',(req,res)=>
	{
  //en un futuro se almacenarán las tareas en variables de sesión, de momento solo tiene funcionalidades
  //sencillas de tareas y pomodoro en cliente
	res.render('focus');
	});

//*********************************************************
//*********************************************************
//         controlador: CONTACTO request tipo->(GET "/contacto")
//				vista: 'contacto' -> 
//*********************************************************
//*********************************************************

router.get('/contacto',(req,res)=>
	{
	res.render('contacto');
	});



//*********************************************************
//*********************************************************
//         controlador: LOGOUT request tipo->(GET "/logout")
//				  vista: 'user' -> mandamos a vista /login
//*********************************************************
//*********************************************************
router.get('/logout', (req, res) =>
	{
			// cerramos la sesión
			req.session.destroy(function(err)
			{
				res.redirect("/");
			});
	});

//********************************************
//********************************************	
//							MUY IMPORTANTE !!
//	las rutas tienen que ser visibles en todo el proyecto
//********************************************
// para exportar las rutas a otros módulos
module.exports = router;
//********************************************
//********************************************


