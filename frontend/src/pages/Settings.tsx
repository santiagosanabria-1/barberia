import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { settingsApi } from '../services/api';

const days = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export function Settings() {
  const [settings, setSettings] = useState({
    shopName: '',
    address: '',
    timezone: 'America/Bogota',
    openTime: '09:00',
    closeTime: '21:00',
    slotDuration: 45,
    openDays: [1, 2, 3, 4, 5, 6],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem('token');

  if (token) {
    loadSettings();
  }
}, []);

  async function loadSettings() {
    try {
      const data = await settingsApi.get();
      setSettings(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveSettings() {
    try {
      setLoading(true);
      await settingsApi.update(settings);
      alert('Configuración guardada');
    } catch (error) {
      console.error(error);
      alert('Error guardando configuración');
    } finally {
      setLoading(false);
    }
  }

  function toggleDay(day: number) {
    setSettings((prev) => ({
      ...prev,
      openDays: prev.openDays.includes(day)
        ? prev.openDays.filter((d) => d !== day)
        : [...prev.openDays, day],
    }));
  }

  return (
    <div className="page grid gap-6 lg:grid-cols-2">

      <Card>
        <h2 className="text-2xl font-black">
          Configuración operativa
        </h2>

        <div className="mt-6 grid gap-4">

          <input
            value={settings.shopName}
            onChange={(e) =>
              setSettings({
                ...settings,
                shopName: e.target.value,
              })
            }
            placeholder="Nombre barbería"
          />

          <input
            value={settings.address}
            onChange={(e) =>
              setSettings({
                ...settings,
                address: e.target.value,
              })
            }
            placeholder="Dirección"
          />

          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({
                ...settings,
                timezone: e.target.value,
              })
            }
          >
            <option value="America/Bogota">
              America/Bogota
            </option>
          </select>

        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-black">
          Reglas de agenda
        </h2>

        <div className="mt-6 grid gap-4">

          <label>Hora apertura</label>

          <input
            type="time"
            value={settings.openTime}
            onChange={(e) =>
              setSettings({
                ...settings,
                openTime: e.target.value,
              })
            }
          />

          <label>Hora cierre</label>

          <input
            type="time"
            value={settings.closeTime}
            onChange={(e) =>
              setSettings({
                ...settings,
                closeTime: e.target.value,
              })
            }
          />

          <label>Duración cita (minutos)</label>

          <input
            type="number"
            value={settings.slotDuration}
            onChange={(e) =>
              setSettings({
                ...settings,
                slotDuration: Number(e.target.value),
              })
            }
          />

          <div>
            <h3 className="font-bold mb-2">
              Días abiertos
            </h3>

            <div className="grid grid-cols-2 gap-2">

              {days.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={settings.openDays.includes(day.value)}
                    onChange={() => toggleDay(day.value)}
                  />

                  {day.label}
                </label>
              ))}

            </div>
          </div>

          <button
            onClick={saveSettings}
            disabled={loading}
            className="bg-black text-white p-3 rounded-xl"
          >
            {loading ? 'Guardando...' : 'Guardar configuración'}
          </button>

        </div>
      </Card>
    </div>
  );
}