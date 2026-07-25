# Imagenes de eventos

Coloca aqui las fotos de cada competicion con estos nombres exactos
(el backend ya las referencia por esta ruta en `data.sql`):

- torredembarra-challenge-summer-2025.jpg
- vinyols-challenge-fall-2025.jpg
- ibjjf-master-european-2026.jpg
- vinyols-challenge-spring-2026.jpg
- polaris-barcelona-2026.jpg
- penedes-challenge-2026.jpg
- torredembarra-challenge-fall-2026.jpg

Formato recomendado: jpg u png, orientacion horizontal (la tarjeta de
evento recorta a 200-240px de alto con `object-fit: cover`, asi que
no hace falta recortar a mano, pero cuanto mas panoramica mejor encaja).

Si cambias un nombre de archivo, actualiza tambien el campo `image_url`
correspondiente en `shuttermats-backend/src/main/resources/data.sql`.
