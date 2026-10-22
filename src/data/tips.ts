// ─── src/data/tips.ts ────────────────────────────────────────────────
// Base de conocimiento de consejos de ahorro energético

export interface EnergyTip {
  icon: string;
  title: string;
  tip: string;
  saving?: string;
}

const TIPS_DB: Record<string, EnergyTip[]> = {
  'Nevera/Refrigerador': [
    { icon: 'thermometer', title: 'Temperatura óptima', tip: 'Mantén el termostato entre 3°C y 5°C. Cada grado más frío aumenta el consumo un 5%.' },
    { icon: 'wind', title: 'Circulación', tip: 'Deja espacio detrás del refrigerador para la ventilación. No lo pegues a la pared.' },
    { icon: 'clock', title: 'Uso eficiente', tip: 'No metas comida caliente. Tapa los líquidos para evitar humedad y formación de hielo.' },
  ],
  'Televisor LED 32"': [
    { icon: 'sun', title: 'Brillo ajustable', tip: 'Reduce el brillo al 50%. En modo cine/noche consumes hasta 40% menos.' },
    { icon: 'power', title: 'Apagado total', tip: 'Apágalo completamente cuando no lo uses. El modo standby consume 5-10W.' },
  ],
  'Televisor LED 55"': [
    { icon: 'sun', title: 'Brillo ajustable', tip: 'Reduce el brillo al 50%. Una TV grande consume mucho más con brillo al máximo.' },
    { icon: 'power', title: 'Apagado total', tip: 'Usa una regleta con interruptor. El standby de TVs grandes puede consumir 15W.' },
  ],
  'Lavadora': [
    { icon: 'droplet', title: 'Carga completa', tip: 'Usa siempre la lavadora con carga completa. Medias cargas gastan casi la misma electricidad.' },
    { icon: 'thermometer', title: 'Agua fría', tip: 'Lavar en agua fría (30°C o menos) ahorra hasta el 80% de la energía del ciclo de lavado.' },
    { icon: 'tool', title: 'Mantenimiento', tip: 'Limpia el filtro cada 3 meses. Un filtro sucio hace que el motor trabaje más.' },
  ],
  'Microondas': [
    { icon: 'clock', title: 'Tiempos cortos', tip: 'Usa el microondas en vez del horno para porciones pequeñas. Ahorras hasta 60% de energía.' },
    { icon: 'zap', title: 'Desconectar', tip: 'Desenchúfalo cuando no lo uses. El reloj digital consume electricidad 24/7.' },
  ],
  'Aire Acondicionado 9000 BTU': [
    { icon: 'thermometer', title: 'Temperatura ideal', tip: 'Programa el termostato a 24°C. Cada grado menos aumenta el consumo un 8%.' },
    { icon: 'tool', title: 'Filtros limpios', tip: 'Limpia los filtros cada mes. Un filtro obstruido reduce la eficiencia hasta un 15%.' },
    { icon: 'clock', title: 'Usa el timer', tip: 'Programa el apagado automático para que no funcione toda la noche.' },
    { icon: 'sun', title: 'Aísla la habitación', tip: 'Cierra cortinas y ventanas mientras el AC está encendido para mantener el frío.' },
  ],
  'Aire Acondicionado 12000 BTU': [
    { icon: 'thermometer', title: 'Temperatura ideal', tip: 'Programa el termostato a 24°C. Cada grado menos aumenta el consumo un 8%.' },
    { icon: 'tool', title: 'Filtros limpios', tip: 'Limpia los filtros cada mes. Un filtro obstruido reduce la eficiencia hasta un 15%.' },
    { icon: 'clock', title: 'Usa el timer', tip: 'Programa el apagado automático para que no funcione toda la noche.' },
    { icon: 'sun', title: 'Aísla la habitación', tip: 'Usa cortinas blackout. El sol directo puede aumentar la carga térmica hasta 30%.' },
  ],
  'Ducha eléctrica': [
    { icon: 'droplet', title: 'Duchas cortas', tip: 'Reduce el tiempo de ducha a 5-7 minutos. Una ducha eléctrica de 3500W consume 3.5 kWh por hora.' },
    { icon: 'thermometer', title: 'Temperatura media', tip: 'Usa la posición "verano" o temperatura media. La diferencia de consumo entre posición "alta" y "media" es enorme.' },
    { icon: 'tool', title: 'Mantenimiento', tip: 'Revisa las resistencias cada 6 meses. Resistencias calcificadas consumen más y calientan menos.' },
  ],
  'Estufa eléctrica (1 fogón)': [
    { icon: 'clock', title: 'Tapa las ollas', tip: 'Cocinar con tapa reduce el tiempo de cocción y ahorra hasta 30% de energía.' },
    { icon: 'zap', title: 'Apaga antes', tip: 'Apaga la estufa 2-3 minutos antes de terminar. El calor residual termina la cocción.' },
  ],
  'Plancha de ropa': [
    { icon: 'clock', title: 'Plancha por lotes', tip: 'Junta toda la ropa y plancha de una sola vez. El mayor consumo está en el calentamiento inicial.' },
    { icon: 'zap', title: 'Aprovecha el calor', tip: 'Plancha primero las prendas que requieren menor temperatura y sube gradualmente.' },
  ],
  'Computador portátil': [
    { icon: 'sun', title: 'Brillo de pantalla', tip: 'Reduce el brillo al 50-60%. La pantalla es el mayor consumidor del portátil.' },
    { icon: 'zap', title: 'Modo ahorro', tip: 'Activa el modo de ahorro de energía. El portátil reduce el rendimiento pero extiende la batería.' },
    { icon: 'power', title: 'Desconecta al cargar', tip: 'Desenchufa el cargador cuando la batería esté al 100%. Los cargadores conectados sin carga consumen electricidad (vampiro).' },
  ],
  'Computador escritorio': [
    { icon: 'power', title: 'Apaga al terminar', tip: 'Apaga el computador si no lo usarás en las próximas 2 horas. Un monitor en reposo aún consume 2-5W.' },
    { icon: 'zap', title: 'Fuente eficiente', tip: 'Usa una fuente de poder 80 Plus certificada. La eficiencia puede ser 20% mayor que una genérica.' },
    { icon: 'sun', title: 'Monitor ajustado', tip: 'Reduce el brillo del monitor y configura que se apague tras 10 minutos de inactividad.' },
  ],
  'Horno eléctrico': [
    { icon: 'clock', title: 'Precalentamiento justo', tip: 'No precalientes más de 10-15 minutos. La mayoría de platos no necesitan precalentamiento largo.' },
    { icon: 'tool', title: 'Mantenimiento', tip: 'Limpia las resistencias regularmente. La grasa acumulada reduce la transferencia de calor.' },
  ],
  'Licuadora': [
    { icon: 'zap', title: 'Uso eficiente', tip: 'La licuadora es de bajo consumo. Usa la velocidad justa para cada preparación.' },
  ],
  'Bombilla LED': [
    { icon: 'sun', title: 'Ya eres eficiente', tip: 'Las bombillas LED ya son las más eficientes. Síguelas usando y apágalas cuando no estés en la habitación.' },
    { icon: 'clock', title: 'Apaga al salir', tip: 'Apagar las luces al salir de una habitación puede ahorrar hasta 50 kWh al año por hogar.' },
  ],
  'Ventilador': [
    { icon: 'zap', title: 'Bajo consumo', tip: 'El ventilador consume 10-30 veces menos que un aire acondicionado. Úsalo como alternativa cuando el clima lo permita.' },
    { icon: 'clock', title: 'Apágalo al salir', tip: 'Los ventiladores enfrían personas, no habitaciones. Apágalo cuando no haya nadie.' },
  ],
  'Calentador de agua': [
    { icon: 'thermometer', title: 'Temperatura moderada', tip: 'Ajusta el termostato a 50-55°C. Cada 10°C menos ahorra aproximadamente 15% de energía.' },
    { icon: 'tool', title: 'Aislamiento', tip: 'Aísla el tanque y las tuberías de agua caliente. Puedes ahorrar hasta 10% en pérdidas de calor.' },
  ],
  'Secadora de ropa': [
    { icon: 'droplet', title: 'Centrifugado previo', tip: 'Centrifuga la ropa a máxima velocidad antes de secar. Menos humedad = menos tiempo de secado.' },
    { icon: 'tool', title: 'Limpieza del filtro', tip: 'Limpia el filtro de pelusas después de cada carga. Un filtro obstruido duplica el consumo.' },
    { icon: 'sun', title: 'Secado al aire', tip: 'Cuando el clima lo permita, seca la ropa al aire. La secadora es uno de los electrodomésticos que más energía consume.' },
  ],
};

const GENERAL_TIPS: EnergyTip[] = [
  { icon: 'zap', title: 'Desconecta en standby', tip: 'Muchos electrodomésticos consumen energía en modo reposo ("consumo vampiro"). Usa regletas con interruptor.' },
  { icon: 'clock', title: 'Monitorea tu consumo', tip: 'Usa la app Zekvolt para rastrear tu consumo y detectar oportunidades de ahorro.' },
  { icon: 'tool', title: 'Mantenimiento regular', tip: 'Un electrodoméstico bien mantenido consume menos y dura más.' },
];

export function getTipsForAppliance(applianceName: string): EnergyTip[] {
  return TIPS_DB[applianceName] ?? GENERAL_TIPS;
}

export function getGeneralTips(): EnergyTip[] {
  return GENERAL_TIPS;
}