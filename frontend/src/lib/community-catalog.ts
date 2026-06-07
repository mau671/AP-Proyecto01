export const communityLabels: Record<string, string> = {
  'escuela-computacion': 'Escuela de Ingeniería en Computación',
  'estudiantes-ca': 'Estudiantes CA',
  'computacion-cartago': 'Computación Cartago',
  'estudiantes-ic-cartago': 'Estudiantes IC Cartago',
  'estudiantes-nuevos-ic-cartago': 'Estudiantes Nuevos IC-Cartago',
  catedras: 'Cátedras',
  'catedra-estadistica': 'Cátedra de Estadística',
  estudiantes: 'Estudiantes',
  'campus-central-cartago': 'Campus Tecnológico Central Cartago',
}

export function getCommunityLabel(id: string) {
  return communityLabels[id] ?? id
}
