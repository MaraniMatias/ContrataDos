# ContrataDos

## Doc resumen

- Pensaria como uber
- Encontrar personal capacitado que ofrezca los servicios a domicilio del tipo técnico/oficio.
- Poder evaluar la calidad de los trabajadores ofrecidos
- Conocer la disponibilidad en días y horarios de los trabajadores.
- Poder registrarse en el sitio con un correo y una clave (google)
- Registrar y gestionar datos personales (los tipico y zona de trabajo), ~~direcciones, tarjetas de crédito~~ y preferencias del sitio (notification).
- Permitir reservar un turno con el trabajador (o envuar uno cercano) y ~~abonar el mínimo por su asistencia (mercadopago) anticipado o al asistir el mismo~~ (pagado como google ad si te contratan)
- ~~Permitir abonar por anticipado o al asistir el trabajador gastos de cotización.~~
- Recibir una confirmación de parte del trabajador de la asistencia al turno reservado
- Recibir un recordatorio de la asistencia del trabajador al menos una hora antes de la cita concretada (tanto el cliente como el trabajador). (email)
- Poder valorar al trabajador y a los trabajos realizados mediante un sistema de puntuación y/o comentarios controlado (de modo que no se vea perjudicada ninguna de las partes). (Como uber o ML)
- ~~Obtener recomendaciones, ofertas y/o descuentos basados en las búsquedas realizadas y/o trabajos contratados.~~ (Optener localidad automaticamente ?? )

### Funcionales

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
<https://github.com/AlekseyPleshkov/nuxt-social-meta>
<https://github.com/nuxt-community/awesome-nuxt>
<https://github.com/mynameiswhm/brotli-webpack-plugin>

### Backend

<https://github.com/sindresorhus/awesome-nodejs>
<https://github.com/goldbergyoni/nodebestpractices>
<https://github.com/goldbergyoni/javascript-testing-best-practices>

**Extructura de carpestas**
controles
router
model
utilities
i18n

Nodejs
Expressjs
mongoose
MongoDB
<https://github.com/rajikaimal/awesome-express>
<https://github.com/expressjs/serve-favicon>
<https://github.com/goldbergyoni/nodebestpractices>
<https://github.com/expressjs/compression>
<https://github.com/animir/node-rate-limiter-flexible>
<https://www.npmjs.com/package/bcrypt>

#### Validations

<https://express-validator.github.io/docs/>
<https://github.com/validatorjs/validator.js#validators>
<https://github.com/epoberezkin/ajv>

#### Status

<https://github.com/RafalWilinski/express-status-monitor>
<https://github.com/lirantal/express-version-route>

#### Mongoose options scheme

<https://mongoosejs.com/docs/guide.html#options>

#### MongoDB

<https://mlab.com/> (500mb free)

#### Framework

<https://feathersjs.com> (using express :D)
<https://github.com/feathersjs/awesome-feathersjs#examples>

<https://graphql.org/learn/queries/>
<https://loopback.io/doc/index.html> (TS only ???)

#### Documentation

https://medium.com/@art_deco/how-to-ditch-typescript-for-jsdoc-212ff1978542
https://github.com/artdecocode/typal/blob/master/README.md
https://github.com/artdecocode/documentary/blob/master/README.md

### Modelo MongoDB

- Persona

  - roles : [CLIENTE,PROFESIONAL]
  - servicios : [Habilidades]
  - email
  - nombre
  - apellido
  - usuario
  - google_account
  - puntuación
  - localidad
  - zona_trabajo: [Localidad]
  - cantidad_trabajos

- Habilidades

  - Nombre
  - Description

- Provincia

  - Nombre
  - localidades
    - Nombre
    - codo_postal
    - coordenadas : { lng, lat }

- Trabajo

  - cliente : Persona
  - profesional : Persona
  - localidad
  - servicios : Habilidades
  - puntuación
  - foto
  - descripción
  - tipo : PUBLICO | PRIVADO
  - agenda : [Agenda] // La reprogramación se cancela una y crea otra

- Agenda (Eventos)
  - cliente : Persona
  - profesional : Persona
  - trabajo : Trabajo
  - estado : PENDIENTE_CONFIRMACIÓN | PENDIENTE_REALIZACIÓN | CANCELADA | EN_PROGRESO | TERMINADA
  - fecha_inicio
  - fecha_fin

### Flujo del sistema

Ver etapa 1

- La fechas siponibles la comfirma el trabajador y con lo que ya tiene ocupado segun db, no tiene
  sentido perdir la fechas ya que puede tener trabajos desde otro medio o esta ocupado esos dias

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# Notas

- Localidades trabajos si es vacía trabaja a distancia
- Localidad por oficio ? Por ahora no

Menú

- Agenda
- trabajos
  - pendientes (confinar, reprogramar?)
  - realizados (puede subir o editar, hacer público o no)
- perfil

Usuario suba descripción y foto del trabajo requerido, fechas sugeridas ?
