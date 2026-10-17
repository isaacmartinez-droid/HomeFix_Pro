# Evidencias de entrega — HomeFix Pro

Este archivo separa lo que puede demostrarse desde el repositorio de lo que requiere una captura o fuente externa. No sustituye la evidencia visual: sirve como índice reproducible para el informe final.

## Alcance implementado y comprobable

| Elemento | Evidencia reproducible |
| --- | --- |
| Módulo Empresa | `backend/src/routes/companies.routes.js` y `frontend/src/pages/company/CompanyDashboard.jsx`: perfil, empleados, verificación requerida, asignación y avance de trabajos. |
| Verificación técnica | `backend/src/routes/verification.routes.js`: carga de cédula y antecedentes, aprobación/rechazo administrativo, cambio de estado y notificación. `requests.routes.js` bloquea la aceptación si el técnico no está `VERIFICADO`. |
| Búsqueda de proveedores | `GET /api/services/technicians?category=PLOMERIA&location=Altamira`; devuelve exclusivamente técnicos activos y verificados. La pantalla Cliente → Técnicos incluye ambos filtros. |
| Categorías | La semilla define Electricidad, Plomería, Aire Acondicionado y Mantenimiento General. |
| Integridad | Prisma establece unicidad para cita y reseña por solicitud; las transiciones de solicitudes se validan en `policy.transition`. Las asignaciones usan `updateMany` condicionado para evitar doble aceptación. |

## Pruebas automatizadas

Ejecutar desde `backend`:

```powershell
npm test
```

El conjunto actual contiene 16 pruebas unitarias de reglas de validación y transición. Su alcance es deliberadamente específico: no afirma cubrir los flujos HTTP, carga de archivos ni la interfaz. Para la entrega, pegar la salida de este comando (fecha, versión de Node y resultado) en el informe.

## Evidencia manual que debe capturarse

1. Iniciar backend y frontend con variables de entorno configuradas; registrar una cuenta por rol.
2. Como técnico, subir ambos documentos; como administrador, aprobar y mostrar que puede aceptar una solicitud. Repetir con técnico pendiente/rechazado y capturar el bloqueo.
3. Como cliente, abrir **Técnicos**, aplicar categoría y ubicación, y capturar los resultados filtrados.
4. Como empresa verificada, añadir técnico verificado, asignar una solicitud y actualizarla a `EN_PROGRESO` y `FINALIZADO`.
5. Crear una cita, reprogramarla y cancelarla; capturar agenda y notificaciones.
6. Abrir `/api-docs` autenticando los endpoints protegidos según Swagger y capturar una respuesta correcta y una respuesta 401/403.

## Elementos que no pueden certificarse solo con este repositorio

- Capturas de Figma: deben venir del proyecto Figma real, con enlace o exportación verificable.
- Contribución individual: el historial actual contiene autores/commits, pero la asignación de trabajo de cada integrante debe validarse con el repositorio remoto y los integrantes.
- Validación con usuarios: el proyecto no contiene entrevistas, encuestas ni resultados de pruebas de usabilidad.
- Pagos y comisiones reales: no están implementados; no deben declararse como funcionalidad terminada.

## Git

Generar el anexo actualizado de historial con:

```powershell
node tools/generate-git-documentation-pdf.js
```

El documento generado contiene ramas, remoto, historial y archivos versionados al momento de ejecutarse.
