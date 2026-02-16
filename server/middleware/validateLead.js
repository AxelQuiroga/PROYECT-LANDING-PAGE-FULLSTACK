import validator from "validator";

const validateLead = (req, res, next) => {
  let { name, email, consulta } = req.body;

  if (!name || !email || !consulta) {
    return res.status(400).json({
      success: false,
      message: "Nombre, email y consulta son obligatorios",
    });
  }

  // Sanitización
  name = validator.escape(name.trim());
  email = validator.normalizeEmail(email.trim());
  consulta = validator.escape(consulta.trim());

  // Validación formato nombre
  if (!validator.matches(name, /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)) {
    return res.status(400).json({
      success: false,
      message: "El nombre solo debe contener letras",
    });
  }

  // Validación email
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email inválido",
    });
  }

  // Validación longitud consulta
  if (!validator.isLength(consulta, { min: 10, max: 500 })) {
    return res.status(400).json({
      success: false,
      message: "La consulta debe tener entre 10 y 500 caracteres",
    });
  }

  // Validación caracteres permitidos
  if (
    !validator.matches(
      consulta,
      /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,¿?¡!()\-\s]+$/
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "La consulta contiene caracteres no permitidos",
    });
  }

  // Bloqueo de palabras sospechosas
  const bannedWords = ["http", "www", "script"];
  const lowerConsulta = consulta.toLowerCase();

  const found = bannedWords.some(word =>
    lowerConsulta.includes(word)
  );

  if (found) {
    return res.status(400).json({
      success: false,
      message: "Contenido no permitido en la consulta",
    });
  }

  // Reasignar datos sanitizados
  req.body.name = name;
  req.body.email = email;
  req.body.consulta = consulta;

  next();
};

export default validateLead;
