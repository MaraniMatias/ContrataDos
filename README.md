# ContrataDos
## Doc resumen

- Pensaria como uber
- Encontrar personal capacitado que ofrezca los servicios a domicilio del tipo técnico/oficio.
- Poder evaluar la calidad de los trabajadores ofrecidos
- Conocer la disponibilidad en días y horarios de los trabajadores.
- Poder registrarse en el sitio con un correo y una clave (google)
- Registrar y gestionar datos personales (los tipico y zona de trabajo), ~~direcciones, tarjetas de crédito~~  y preferencias del sitio (notification).
- Permitir reservar un turno con el trabajador (o envuar uno cercano) y ~~abonar el mínimo por su asistencia (mercadopago) anticipado o al asistir el mismo~~ (pagado como google ad si te contratan)
- ~~Permitir abonar por anticipado o al asistir el trabajador gastos de cotización.~~
- Recibir una confirmación de parte del trabajador de la asistencia al turno reservado
- Recibir un recordatorio de la asistencia del trabajador al menos una hora antes de la cita concretada (tanto el cliente como el trabajador). (email)
- Poder valorar al trabajador y a los trabajos realizados mediante un sistema de puntuación y/o comentarios controlado (de modo que no se vea perjudicada ninguna de las partes). (Como uber o ML)
- ~~Obtener recomendaciones, ofertas y/o descuentos basados en las búsquedas realizadas y/o trabajos contratados.~~ (Optener localidad automaticamente ?? )

### Funcionales:
- Las personas podrán registrarse en el sistema como usuarios, ya sea como trabajadores (contratados), contratantes o ámbos.
- Las personas deberán registrarse con sus datos reales pero podrán tener un sobrenombre ficticio.
- La registración debe poder hacerse con la cuenta de google, ~~facebook~~ o linkedin.
- Los usuarios contratantes podrán contar con un historial de trabajadores por trabajo contratado y un perfil de usuario.
- Los usuarios contratantes deberán poder buscar a profesionales según profesión y/o zona de trabajo.
- Los usuarios contratantes deberán poder ver con facilidad la calificación de los profesionales ofertados y puntuar por el trabajo realizado.
- Los usuarios contratantes podrán recibir recomendaciones de profesionales de acuerdo a los datos ingresados en su perfil. (Domicilio)
- Los usuarios contratados podrán contar con, un perfil personal, un lugar donde cargar su disponibilidad horaria, diaria y zona de trabajo.
- Los usuarios contratados podrán subir fotos de los trabajos realizados y puntuar a los contratantes.
- Sitema de puntuación como uber

### No Funcionales
- Mongo Backup

## Programacion

### Frontend
[Nuxt](https://nuxtjs.org/)
[Ant Design of Vue](https://antdv.com/docs/vue/introduce/) it have calendar
https://github.com/AlekseyPleshkov/nuxt-social-meta
https://github.com/nuxt-community/analytics-module
https://github.com/nuxt-community/awesome-nuxt

https://github.com/mynameiswhm/brotli-webpack-plugin

### Backend
https://github.com/sindresorhus/awesome-nodejs
https://github.com/goldbergyoni/nodebestpractices
https://github.com/goldbergyoni/javascript-testing-best-practices


controles
router
model
utilities
i18n

Nodejs
Expressjs
mongoose
MongoDB
https://github.com/rajikaimal/awesome-express
https://github.com/expressjs/serve-favicon
https://github.com/goldbergyoni/nodebestpractices
https://github.com/expressjs/compression
https://github.com/animir/node-rate-limiter-flexible
https://www.npmjs.com/package/bcrypt

#### Validations
https://express-validator.github.io/docs/
https://github.com/validatorjs/validator.js#validators
https://github.com/epoberezkin/ajv

#### Status
https://github.com/RafalWilinski/express-status-monitor
https://github.com/lirantal/express-version-route

#### Mongoose options scheme
https://mongoosejs.com/docs/guide.html#options

#### MongoDB
https://mlab.com/ (500mb free)

#### Framework
https://feathersjs.com (using express :D)
https://github.com/feathersjs/awesome-feathersjs#examples

https://graphql.org/learn/queries/
https://loopback.io/doc/index.html (TS only ???)

### Modelo MongoDB

- Persona
  - roles : [CLIENTE,PROFESIONAL]
  - servicios : [Habilidades]
  - email
  - nombre
  - apellido
  - usuario
  - google_account
  - fechas_disponibles : [{ dia, hora_inicio, hora_fin }]
  - puntuación
  - cantidad_trabajos

- Habilidades
  - Nombre
  - Description

- Trabajo
  - cliente : Persona
  - profesional : Persona
  - servicio
  - puntuación
  - foto
  - descripción
  - tipo : PUBLICO | PRIVADO
  - agenda : Agenda

- Agenda (Eventos)
  - cliente : Persona
  - profesional : Persona
  - trabajo : Trabajo
  - estado : PENDIENTE_CONFIRMACIÓN | PENDIENTE_REALIZACIÓN | CANCELADA | EN_PROGRESO | TERMINADA
  - fecha_inicio
  - fecha_fin

### Flujo del sistema
Ver etapa 1
