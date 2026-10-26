# Linsy — Plan por etapas

El mensaje llegó cortado al final (sección 20, "Si alguna funcionalidad requiere demasiado..."). El plan asume que esa frase pide dividir el trabajo en etapas.

## Revisión del proyecto actual
El proyecto está vacío: solo tiene la plantilla base y una página de inicio de muestra. No hay datos, cuentas ni funciones que se puedan romper. Lo construiremos desde cero, en etapas que se puedan revisar una por una.

## Etapa 1 (esta entrega): Diseño, inicio y navegación
- Identidad visual de Linsy: colores pastel (rosa, lila, durazno, menta), un color de acento coral más intenso, tipografía Fraunces + Plus Jakarta Sans, tarjetas suaves. Pensado primero para celular.
- Componentes reutilizables: botones, tarjetas, etiquetas, alertas, estados de carga y estados vacíos.
- Menú superior y menú para celular, con submenú de categorías: Inicio, Explorar, Categorías, Comunas, Favoritos, Publicar mi negocio, Iniciar sesión, Registrarse.
- Página de inicio: portada con el buscador (servicio, comuna, "Cerca de mí" con explicación previa), categorías con imágenes generadas, profesionales destacados (vacío y bien diseñado hasta que haya perfiles aprobados reales), cómo funciona, beneficios, opiniones (vacío informativo), preguntas frecuentes, llamado final y pie de página.
- Páginas base: Explorar, Categorías, Comunas, Privacidad y Términos (los textos legales son borradores y deben revisarse con un abogado; no garantizan cumplir la Ley 21.719).
- Para las páginas que aún no están listas, como Favoritos, Publicar e Iniciar sesión, habrá una página que lo dice claramente. No habrá botones que no hagan nada.

## Etapa 2: Base de datos y seguridad (Lovable Cloud)
- Tablas: profiles, user_roles (tabla aparte para los roles), businesses, categories, services, business_images, favorites, search_synonyms, profile_reviews, analytics_events, reports y communes.
- Reglas de acceso en cada tabla: el público solo ve negocios aprobados; los dueños ven sus borradores; solo los administradores pueden aprobar.
- Carga inicial de las 11 categorías, las comunas de la Región de Valparaíso y los sinónimos de ejemplo. No habrá negocios inventados.

## Etapa 3: Cuentas
Registro, inicio de sesión, verificación de correo, recuperación de contraseña y tipos de cuenta (cliente o profesional). El rol de administrador solo se asigna de forma manual.

## Etapa 4: Buscador real
Filtros por servicio, comuna, precio y modalidad. La búsqueda ignora tildes y mayúsculas y usa sinónimos. Muestra los resultados por páginas, los filtros activos y sugerencias cuando no hay resultados.

## Etapa 5: Perfil público y WhatsApp
Perfil con galería, servicios y precios ("Desde $X" o "Consultar precio"), y enlaces de WhatsApp con mensaje prellenado, también para pedir cotización.

## Etapa 6: Panel del profesional
Datos del negocio, servicios y fotos. Flujo: borrador, vista previa privada, envío a revisión y luego aprobado o rechazado (con motivo). Los cambios importantes en un perfil ya aprobado vuelven a revisión.

## Etapa 7: Panel de administración
Revisión de perfiles, suspensiones, categorías, comunas, sinónimos, destacados, reportes y registro de cada acción.

## Etapa 8: Favoritos, ubicación y "cerca de mí"
Distancia aproximada que respeta la privacidad: si el profesional oculta su dirección, nunca se muestran sus coordenadas exactas.

## Etapa 9: Métricas, páginas por comuna y servicio, sitemap y pruebas
- Métricas: visitas, clics en WhatsApp y búsquedas.
- Páginas como "Manicure en Quilpué", que solo se publican cuando tienen profesionales.

## Riesgos
- La etapa 2 crea las reglas de seguridad. Las etapas siguientes no deben empezar hasta revisarlas.
- Los mapas de la etapa 8 necesitan elegir un proveedor y, posiblemente, una clave de acceso.

## Detalle técnico
- TanStack Start, con una página por ruta y metadatos para buscadores.
- Diseño definido en src/styles.css usando colores oklch.
- Íconos Lucide (ya instalados).
- La validación de formularios usará zod.
