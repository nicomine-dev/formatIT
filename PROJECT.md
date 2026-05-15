# formatIT

Generador de CVs sencillo y orientado a superar los filtros **ATS** (Applicant Tracking Systems) que usan las empresas para cribar candidaturas antes de que un humano las lea.

## Qué es

Una aplicación web que permite a cualquier persona crear un currículum profesional rellenando una **plantilla guiada**. El resultado es un CV en formato compatible con ATS — texto seleccionable, estructura limpia, sin elementos gráficos que rompan el parseo automático — listo para enviar a portales de empleo.

## Por qué

La mayoría de plantillas de CV bonitas (columnas, iconos, gráficos, tablas anidadas) **fallan al pasar por un ATS**: el sistema no extrae correctamente la información y la candidatura queda descartada antes de ser revisada. formatIT resuelve ese problema priorizando estructura sobre estética: el CV se ve profesional pero, sobre todo, el ATS lo entiende.

## Para quién

- Personas buscando empleo que envían CVs a portales (LinkedIn, InfoJobs, Workday, Greenhouse, Lever, etc.).
- Profesionales que quieren un CV correcto sin pelearse con Word ni con diseñadores.
- Usuarios sin conocimientos técnicos: la plantilla guía paso a paso qué incluir y cómo redactarlo.

## Funcionalidades previstas

- **Formulario por secciones** — datos personales, experiencia, educación, habilidades, idiomas, proyectos.
- **Plantilla ATS-friendly** — fuente estándar, una sola columna, encabezados claros, sin imágenes ni tablas complejas.
- **Sugerencias de redacción** — verbos de acción, formato de fechas, longitud recomendada por sección.
- **Detección de palabras clave** — comparar el CV con una oferta de trabajo y resaltar términos a incluir.
- **Exportación a PDF** — el formato que aceptan la mayoría de los ATS.
- **Guardado local** — los datos no salen del navegador (privacidad por defecto).
- **Previsualización en vivo** — ver el CV mientras se edita.

## Principios de diseño

1. **ATS primero, estética después** — si una decisión visual compromete el parseo, gana la legibilidad para máquinas.
2. **Cero fricción** — un usuario debería poder generar un CV decente en menos de 15 minutos.
3. **Sin cuenta obligatoria** — empezar a usarlo no requiere registro.
4. **Plantilla única bien hecha** — mejor una plantilla que funciona en todos los ATS que diez plantillas mediocres.

## Stack técnico

Next.js 16 (App Router), React 19, Tailwind CSS v4, JavaScript. Tests con Vitest. Más detalles en `.claude/CLAUDE.md`.

## Estado

En desarrollo inicial — proyecto recién scaffoldado.
