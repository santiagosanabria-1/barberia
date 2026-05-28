# App Android Black Crown Barber

La app Android está generada con Capacitor en `frontend/android`.

## Importante

Para Play Store, el backend no puede ser `localhost`. Debes publicar el backend en un servidor HTTPS y configurar:

```env
VITE_API_URL=https://api.tudominio.com/api
```

en `frontend/.env` antes de construir la app.

## Desarrollo local

Desde `frontend`:

```bash
npm.cmd run android:sync
npm.cmd run android:open
```

Eso abre Android Studio.

## Generar APK para probar en teléfono

En Android Studio:

1. Abre `frontend/android`.
2. Espera que Gradle sincronice.
3. Ve a `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
4. Instala el APK generado en tu teléfono.

## Generar AAB para Play Store

En Android Studio:

1. Ve a `Build > Generate Signed Bundle / APK`.
2. Selecciona `Android App Bundle`.
3. Crea o usa una keystore segura.
4. Genera el archivo `.aab`.
5. Sube el `.aab` a Google Play Console.

## Datos de la app

- Package ID: `com.blackcrown.barber`
- Nombre: `Black Crown Barber`
- Frontend web: React + Vite
- Contenedor móvil: Capacitor Android

## Comandos útiles

```bash
cd "C:\Barberia completa\frontend"
npm.cmd run build
npm.cmd run android:sync
npm.cmd run android:open
```
