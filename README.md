# Linsy Beauty Guide

PROYECTO LINSY — PROMPT MAESTRO DE DESARROLLO



1. Rol y objetivo



Actúa como desarrollador full-stack senior, arquitecto de software, diseñador UX/UI y especialista en seguridad web.



Quiero desarrollar Linsy, una plataforma web para descubrir profesionales y emprendimientos de belleza y cuidado personal en la Región de Valparaíso, Chile.



La plataforma permitirá que las personas encuentren profesionales según servicio, comuna, presupuesto y modalidad de atención. Cada profesional podrá publicar su negocio, presentar sus servicios y recibir consultas directamente por WhatsApp.



Linsy debe ser una plataforma moderna, confiable, accesible, rápida, adaptable a dispositivos móviles y preparada para crecer a otras regiones de Chile.



Reglas fundamentales de desarrollo



- Antes de modificar un proyecto existente, revisa su estructura, tecnologías, dependencias, rutas, componentes, tablas y funciones actuales.

- Explica qué archivos modificarás, qué cambios realizarás y qué riesgos podrían existir antes de aplicarlos.

- No elimines, reemplaces ni rompas funciones existentes sin autorización.

- Si existe código previo, reutiliza los componentes y patrones que estén bien implementados.

- No reconstruyas toda la aplicación innecesariamente.

- No inventes datos, profesionales, negocios, opiniones, fotografías reales ni estadísticas.

- Utiliza datos de demostración claramente identificados cuando sea necesario.

- No simules funcionalidades como si estuvieran conectadas a una base de datos real.

- Si una integración necesita credenciales, permisos o configuración externa, explica cómo configurarla.

- Trabaja por etapas pequeñas, verificables y reversibles.

- No avances a una etapa que pueda afectar la seguridad o los datos sin comprobar primero la anterior.



2. Tecnologías



Utiliza las siguientes tecnologías:



- Frontend: React + TypeScript.

- Estilos: Tailwind CSS, si es compatible con el proyecto existente.

- Backend y base de datos: Supabase.

- Autenticación: Supabase Auth.

- Base de datos: PostgreSQL.

- Seguridad: Row Level Security (RLS).

- Almacenamiento de imágenes: Supabase Storage.

- Geolocalización: coordenadas geográficas y PostGIS, si está habilitado y resulta compatible con el proyecto.

- Mapas: integración con un proveedor compatible, utilizando sus claves únicamente donde corresponda.

- Iconos: Lucide React o la biblioteca ya instalada.

- Formularios: validación de datos tanto en frontend como en backend.



Antes de instalar dependencias, comprueba cuáles ya existen y si realmente son necesarias.



No expongas claves privadas, claves de servicio de Supabase ni credenciales en el frontend. Utiliza variables de entorno y las políticas de seguridad correspondientes.



3. Identidad visual y experiencia de usuario



Diseña una identidad visual propia para Linsy.



Estilo



- Moderno, elegante, femenino y acogedor, sin excluir a profesionales ni clientes de ningún género.

- Colores pastel: rosa, lila, durazno y menta.

- Color de acento más intenso para botones y llamadas a la acción.

- Tipografía moderna, legible y amable.

- Tarjetas con bordes suaves, sombras discretas y fotografías protagonistas.

- Iconografía coherente.

- Diseño mobile-first, adaptable a teléfonos, tablets y computadores.

- Interfaz en español, con moneda chilena CLP y comunas de Chile.

- Fechas, precios y mensajes adaptados al contexto chileno.



Evita una apariencia excesivamente infantil, recargada o genérica.



Crea componentes reutilizables para botones, tarjetas, formularios, filtros, etiquetas, menús, ventanas modales, alertas y estados de carga.



Implementa accesibilidad básica: contraste adecuado, navegación por teclado, etiquetas de formularios, textos alternativos y mensajes de error comprensibles.



4. Estructura de navegación



Crea una navegación clara con:



- Inicio.

- Explorar profesionales.

- Categorías.

- Comunas.

- Favoritos.

- Publicar mi negocio.

- Iniciar sesión.

- Registrarse.



Cuando el usuario haya iniciado sesión, muestra las opciones correspondientes a su tipo de cuenta.



Incluye un menú adaptable a móviles y submenús por categoría.



No permitas que un usuario común acceda a las funciones administrativas ni a los datos privados de otros profesionales.



5. Página de inicio



Hero principal



Incluye un encabezado atractivo con el mensaje:



«Encuentra tu próximo momento de cuidado con Linsy».



Agrega un buscador principal con:



- Campo de servicio.

- Selector de comuna.

- Opción «Cerca de mí», previa autorización de ubicación.

- Botón «Buscar profesionales».

- Botón «Publica tu negocio».



La búsqueda debe llevar a resultados reales y aplicar los filtros seleccionados.



Categorías



Presenta tarjetas con iconos e imágenes para:



- Peluquería.

- Cosmetología y tratamientos faciales.

- Pestañas y lashistas.

- Barbería.

- Manicure y uñas.

- Maquillaje.

- Diseño de cejas.

- Depilación.

- Masajes.

- Tratamientos corporales.

- Novias y eventos.

- Otras categorías configurables desde administración.



Cada categoría debe conducir a una página de resultados filtrados.



Profesionales destacados



Muestra perfiles aprobados con información real:



- Fotografía o imagen de portada.

- Nombre del negocio.

- Categoría principal.

- Comuna o sector.

- Modalidad de atención.

- Precio mínimo disponible, con etiqueta «Desde $X».

- Servicios destacados.

- Botón «Ver perfil».

- Botón «Consultar por WhatsApp».



No muestres precios ficticios. Si no existe un precio publicado, muestra «Consultar precio».



Los perfiles destacados deben seleccionarse desde datos reales o mediante una configuración administrativa.



Otras secciones



Incluye:



- Cómo funciona Linsy para clientes.

- Cómo funciona Linsy para profesionales.

- Beneficios de publicar un negocio.

- Opiniones reales, solo cuando existan y puedan verificarse.

- Si no existen opiniones, muestra una sección informativa o un estado vacío claramente diseñado.

- Preguntas frecuentes.

- Llamado final: «Publica tu negocio en Linsy».

- Footer con enlaces legales, contacto y redes sociales cuando estén configuradas.



6. Buscador y resultados



Construye un buscador funcional, no solamente visual.



Filtros del MVP



- Servicio o categoría.

- Comuna.

- Cercanía geográfica cuando el usuario otorgue permiso.

- Rango de precios.

- Modalidad de atención.

- Servicios disponibles en domicilio.

- Ordenar por relevancia, precio o cercanía cuando existan los datos necesarios.



Modalidades:



- Local comercial.

- Atención a domicilio.

- Estudio en casa.



Cada resultado debe mostrar claramente su modalidad.



Búsqueda inteligente



Permite asociar sinónimos y nombres alternativos a cada servicio.



Ejemplos:



- «Volumen ruso» → extensiones de pestañas.

- «Lifting» → lifting de pestañas, según el servicio seleccionado.

- «Degradado» → barbería o coloración, según el contexto.

- «Kapping» → servicios de uñas.

- «Limpieza facial» → cosmetología y tratamientos faciales.



Implementa un catálogo de sinónimos configurable, evitando coincidencias incorrectas entre servicios diferentes.



La búsqueda debe admitir diferencias razonables de mayúsculas, tildes y espacios.



Incluye:



- Indicador de resultados encontrados.

- Filtros activos que puedan eliminarse.

- Opción para limpiar filtros.

- Paginación o carga progresiva.

- Estados de carga.

- Mensaje útil cuando no haya resultados.

- Sugerencias de categorías o comunas alternativas.



Los filtros deben combinarse correctamente y consultar la base de datos, evitando cargar todos los perfiles innecesariamente.



7. Páginas por comuna y servicio



Crea páginas indexables para búsquedas específicas, por ejemplo:



- Manicure en Quilpué.

- Cosmetología en Viña del Mar.

- Lashistas en Villa Alemana.

- Peluquerías en Valparaíso.

- Masajes en Concón.

- Maquillaje para novias en la Región de Valparaíso.



Cada página debe incluir:



- Título y descripción específicos.

- Listado de profesionales aprobados.

- Filtros aplicables.

- Vista de mapa cuando corresponda.

- Enlaces a categorías y comunas relacionadas.

- Estados vacíos útiles.



Implementa una estrategia SEO técnica compatible con React: títulos, metadescripciones, URLs legibles, sitemap, robots.txt y datos estructurados cuando corresponda.



No generes miles de páginas vacías ni publiques información privada para intentar mejorar el SEO.



8. Perfil público del profesional



Cada profesional aprobado tendrá una página pública propia.



Incluye:



- Nombre del negocio o profesional.

- Fotografía de portada.

- Galería de imágenes.

- Descripción.

- Categorías.

- Servicios y precios.

- Comuna y sector.

- Modalidad de atención.

- Dirección exacta únicamente si el profesional decide publicarla.

- Horarios informativos, si han sido proporcionados.

- WhatsApp.

- Redes sociales.

- Botón para solicitar una hora por WhatsApp.

- Botón para pedir cotización.

- Opción para guardar en favoritos.

- Galería de antes y después, si existe contenido autorizado.



WhatsApp



Genera un enlace con un mensaje prellenado que incluya, cuando corresponda:



«Hola, encontré tu perfil en Linsy. Me interesa consultar por [servicio] en [comuna]. ¿Podrías entregarme más información?».



El enlace debe construirse de forma segura, codificando correctamente el mensaje y validando el número de teléfono.



No implementes reservas internas ni confirmaciones automáticas de horas en esta etapa.



9. Registro y acceso



Implementa registro e inicio de sesión mediante Supabase Auth.



Contempla:



- Registro con correo electrónico y contraseña.

- Inicio y cierre de sesión.

- Verificación de correo.

- Recuperación de contraseña.

- Manejo seguro de sesiones.

- Mensajes de error comprensibles.

- Estados de carga y prevención de envíos duplicados.



Define los tipos de cuenta:



1. Visitante: puede buscar y consultar perfiles públicos.

2. Cliente registrado: puede gestionar sus favoritos y preferencias.

3. Profesional: puede administrar su propio negocio y servicios.

4. Administrador: puede revisar publicaciones y administrar la plataforma.



El rol de administrador no debe poder asignarse desde un formulario público ni confiar únicamente en información modificable desde el navegador.



Permite que una persona explore los perfiles sin crear una cuenta. Solicita registro solo cuando una función realmente lo requiera.



10. Panel de profesionales



Crea un panel privado, sencillo y adaptable a móviles.



Datos del negocio



El profesional podrá registrar y editar:



- Nombre comercial.

- Nombre público.

- Descripción.

- Categorías.

- Comuna.

- Sector o barrio.

- Dirección.

- Modalidad de atención.

- Teléfono y WhatsApp.

- Redes sociales.

- Horarios informativos.

- Imágenes.

- Servicios.



Gestión de servicios



Cada servicio debe permitir:



- Nombre.

- Descripción.

- Categoría.

- Precio.

- Indicador de precio fijo, desde un valor o a consultar.

- Duración estimada, opcional.

- Fotografías.

- Estado activo o inactivo.



Valida que los precios sean valores válidos y no negativos.



Gestión del perfil



Implementa:



- Guardado de borradores.

- Edición de información.

- Vista previa del perfil público.

- Validación de campos obligatorios.

- Envío a revisión.

- Visualización del estado de aprobación.

- Notificaciones de cambios de estado.

- Motivo de rechazo y posibilidad de corregir y reenviar.



Flujo de publicación:



Borrador → Vista previa → Enviado a revisión → Aprobado o Rechazado.



Si un profesional modifica información importante de un perfil ya aprobado, define una política de revisión para evitar que cambios sensibles se publiquen sin control.



La vista previa debe ser privada y no debe aparecer en los resultados públicos ni en buscadores.



11. Ubicación y geolocalización



Implementa una solución que proteja la privacidad.



- Permite seleccionar la comuna y el sector.

- Permite registrar una dirección para calcular coordenadas cuando sea necesario.

- Guarda latitud y longitud en PostgreSQL.

- Utiliza PostGIS si está disponible y aporta valor a la búsqueda por distancia.

- Permite mostrar solo la comuna o ubicación aproximada.

- No expongas las coordenadas exactas de perfiles que hayan elegido ocultar su dirección.

- No solicites geolocalización al usuario sin explicar para qué se utilizará.

- La búsqueda «Cerca de mí» debe funcionar solo con autorización expresa.



El mapa y los resultados por cercanía deben respetar la configuración de privacidad del profesional.



No hagas llamadas a servicios de geocodificación desde cada renderizado. Evita solicitudes repetidas y protege las claves de los proveedores.



12. Galería y fotografías



Implementa la carga y administración de imágenes mediante Supabase Storage.



- Fotografía de perfil o negocio.

- Portada.

- Galería de trabajos.

- Fotografías asociadas a servicios.

- Antes y después, cuando corresponda.



Incluye validación del tipo y tamaño de archivo, límites de carga, eliminación de imágenes y permisos de acceso.



Las imágenes privadas de borradores no deben ser accesibles públicamente hasta que corresponda.



Las fotografías de antes y después deben contar con autorización de las personas identificables y no deben inducir a error sobre los resultados.



Utiliza imágenes de demostración claramente identificadas durante el desarrollo.



13. Favoritos y solicitudes de cotización



Favoritos



Permite que los clientes registrados guarden profesionales y consulten su lista personal.



Cada cliente solo podrá ver y administrar sus propios favoritos.



Cotizaciones



Incluye una opción para consultar por servicios personalizados, especialmente para:



- Novias.

- Matrimonios.

- Maquillaje para eventos.

- Servicios grupales.

- Paquetes de belleza.

- Eventos especiales.



En la primera versión, la solicitud de cotización debe iniciar una conversación por WhatsApp con un mensaje prellenado.



No construyas todavía un sistema interno de mensajería, pagos ni gestión de reservas.



14. Métricas básicas



Mide interacciones útiles para profesionales y para la administración:



- Visualizaciones de perfiles.

- Clics en WhatsApp.

- Clics en servicios.

- Búsquedas realizadas.

- Categorías y comunas más consultadas.



Implementa los eventos con controles para evitar duplicaciones excesivas y no registrar información personal innecesaria.



Los clics en WhatsApp deben registrarse antes de abrir el enlace, mediante una operación que no impida la navegación si la medición falla.



En el panel profesional, muestra estadísticas básicas y comprensibles.



No presentes los clics como conversaciones confirmadas ni como reservas realizadas.



15. Panel de administración



Este módulo es fundamental para gestionar Linsy.



Crea un panel privado para usuarios con permisos administrativos.



Debe permitir:



- Ver perfiles pendientes de revisión.

- Consultar la información del negocio.

- Aprobar o rechazar publicaciones.

- Registrar motivos de rechazo.

- Suspender perfiles que incumplan las reglas.

- Gestionar categorías y subcategorías.

- Administrar comunas disponibles.

- Gestionar sinónimos de búsqueda.

- Marcar profesionales destacados.

- Consultar reportes de contenido.

- Revisar métricas generales.



Toda acción administrativa importante debe quedar registrada cuando corresponda.



La autorización administrativa debe comprobarse en el servidor y mediante políticas de base de datos adecuadas. Ocultar botones en el frontend no constituye seguridad.



16. Modelo de datos en Supabase



Diseña un esquema relacional claro y documentado.



Considera, como mínimo, las siguientes entidades:



- profiles: datos de cuenta y rol.

- businesses: negocios y perfiles profesionales.

- categories: categorías y subcategorías.

- services: servicios ofrecidos.

- business_images: fotografías y su relación con negocios o servicios.

- favorites: relación entre clientes y profesionales favoritos.

- search_synonyms: términos alternativos de búsqueda.

- profile_reviews: decisiones de revisión y sus motivos.

- analytics_events: eventos de uso permitidos.

- reports: reportes de contenido, si se implementan.



Define claves primarias, claves foráneas, restricciones, índices y fechas de creación y actualización.



Evita almacenar varias entidades independientes en un único campo de texto o duplicar datos innecesariamente.



Considera las relaciones entre profesionales, negocios y servicios para permitir que un mismo usuario pueda administrar más de un negocio en el futuro, si se necesita.



Implementa migraciones SQL versionadas. No modifiques el esquema de producción sin revisar el impacto y contar con una estrategia de recuperación.



17. Seguridad y privacidad



La seguridad debe implementarse desde el inicio.



- Activa RLS en las tablas expuestas que lo requieran.

- Cada profesional solo podrá editar los negocios y servicios que tenga autorizados.

- Cada cliente solo podrá administrar sus favoritos.

- Los visitantes solo podrán consultar perfiles y servicios aprobados y públicos.

- Los borradores y perfiles pendientes no deben exponerse públicamente.

- Solo los administradores autorizados podrán aprobar o suspender publicaciones.

- Aplica políticas de acceso a Supabase Storage.

- Valida entradas tanto en el cliente como en el servidor o base de datos.

- Utiliza consultas parametrizadas y evita construir SQL inseguro.

- No confíes en roles, precios, propietarios ni estados enviados libremente desde el navegador.

- Protege formularios frente a abuso y envíos automatizados.

- Minimiza los datos personales que se recopilan.

- No publiques correos personales, direcciones privadas ni coordenadas ocultas.

- Proporciona mecanismos para actualizar o solicitar la eliminación de datos personales.



Considera la normativa chilena aplicable de protección de datos personales, incluida la Ley 21.719, verificando su entrada en vigor y los requisitos aplicables a la fecha de lanzamiento.



Prepara textos claros de privacidad, consentimiento y condiciones de uso. Solicita consentimiento cuando corresponda y no uses una casilla premarcada para sustituirlo.



No afirmes que la plataforma cumple legalmente solo porque tiene una política de privacidad.



18. Estados y experiencia de usuario



Todas las páginas deben contemplar:



- Carga inicial.

- Carga de datos.

- Error de conexión.

- Sesión vencida.

- Formulario inválido.

- Guardado exitoso.

- Ausencia de resultados.

- Perfil pendiente de aprobación.

- Perfil rechazado.

- Imagen no disponible.

- Usuario sin permisos.



Utiliza mensajes en español que expliquen qué sucedió y cómo continuar.



Evita botones que no hagan nada, enlaces vacíos y componentes visuales que aparenten funcionalidades inexistentes.



19. Funcionalidades posteriores: no implementar todavía



Deja la arquitectura preparada para incorporar, en futuras versiones:



- Reservas internas y calendario de disponibilidad.

- Confirmación, modificación y cancelación de horas.

- Recordatorios automáticos.

- Pagos en línea y comisiones.

- Planes de suscripción para profesionales.

- Sello de profesional verificado.

- Verificación de identidad o redes sociales.

- Etiquetas de disponibilidad manual: «Atiende hoy», «Fines de semana» y «Horario nocturno».

- Opiniones y valoraciones verificadas.

- Notificaciones.

- Ampliación a otras regiones de Chile.



No construyas estas funciones ahora ni simules que están disponibles. Evita complejidad innecesaria en la primera versión.



20. Alcance del MVP



La primera versión debe permitir que una persona encuentre un profesional y se comunique con él, y que un profesional publique su negocio de manera controlada.



Prioridades de lanzamiento:



1. Página de inicio y diseño adaptable.

2. Categorías, comunas y buscador funcional.

3. Listado de profesionales aprobados.

4. Perfiles públicos y servicios.

5. Registro y autenticación.

6. Panel del profesional.

7. Carga de fotografías.

8. Borrador, vista previa y aprobación.

9. Panel administrativo.

10. WhatsApp con mensajes prellenados.

11. Filtros de precio y modalidad.

12. Geolocalización y búsqueda por cercanía.

13. Favoritos.

14. Cotizaciones mediante WhatsApp.

15. Páginas SEO por comuna y servicio.

16. Métricas básicas.

17. Seguridad, pruebas y documentación.



Si alguna funcionalidad requiere demasiado

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/68866b57-e805-4245-af3d-a3e08afeb9df).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Activar el flujo de publicación con Neon

- Vincula Neon con Auth habilitado al proyecto Linsy en Vercel. Configura
  `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `VITE_NEON_AUTH_URL` y un
  `NEON_AUTH_COOKIE_SECRET` aleatorio de al menos 32 caracteres. Mantén la
  cadena de conexión y el secreto solo en el servidor.
- En Neon Auth, habilita la verificación por correo y agrega el origen de
  Linsy a los dominios autorizados. Los enlaces regresan a `/ingresar`
  y `/recuperar-contrasena`. Para habilitar el acceso con Google, configura
  Google como proveedor social en Neon Auth y registra allí las credenciales
  OAuth y los dominios/URL de retorno autorizados.
- Vercel aplica la migración versionada al compilar. Para probar con otra
  base, configura sus variables y ejecuta `node scripts/migrate-neon.mjs`
  antes de iniciar el servidor.
- Crea y verifica una cuenta administradora. Desde el editor SQL, asigna
  el rol con su ID de usuario de Neon Auth:

  ```sql
  insert into linsy.user_roles (user_id, role)
  values ('ID_DE_LA_CUENTA', 'admin')
  on conflict (user_id) do update set role = excluded.role;
  ```

Cualquier cuenta con correo verificado puede preparar un negocio. Solo
administración puede aprobarlo. Las fotos se almacenan en Neon con un
máximo de 3 MiB por foto y seis fotos por revisión. El servidor autoriza
cada descarga. Una edición pendiente conserva visible la revisión aprobada.
