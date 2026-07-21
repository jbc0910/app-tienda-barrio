import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';

/**
 * Exporta la lista de productos como Excel (.xlsx) y lanza el diálogo de compartir.
 */
export async function exportarProductosExcel(productos) {
  const data = productos.map(p => ({
    Nombre: p.nombre || '',
    Precio: p.precio || 0,
    Stock: p.stock || 0,
    'Precio Oferta': p.precio_oferta || '',
    Categoria: p.categoria?.nombre || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");

  // Convertimos a base64 usando la librería (asíncrono para no bloquear UI)
  const base64Data = await new Promise(resolve => {
    setTimeout(() => {
      resolve(XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' }));
    }, 0);
  });
  const path = `${FileSystem.cacheDirectory}productos_export.xlsx`;
  
  await FileSystem.writeAsStringAsync(path, base64Data, { encoding: FileSystem.EncodingType.Base64 });

  const puedeCompartir = await Sharing.isAvailableAsync();
  if (!puedeCompartir) {
    throw new Error('Compartir no está disponible en este dispositivo.');
  }

  await Sharing.shareAsync(path, {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Exportar Excel de productos',
    UTI: 'com.microsoft.excel.xls',
  });
}

/**
 * Abre el selector de documentos para importar un Excel y devuelve los registros parseados.
 * Columnas esperadas: Nombre, Precio, Stock, Precio Oferta
 */
export async function leerExcelDeProductos() {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '*/*'],
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.length) return null;

  const uri = result.assets[0].uri;
  // Leemos el archivo a base64 nativamente con expo
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

  const json = await new Promise(resolve => {
    setTimeout(() => {
      const wb = XLSX.read(b64, { type: 'base64' });
      const firstSheetName = wb.SheetNames[0];
      const ws = wb.Sheets[firstSheetName];
      resolve(XLSX.utils.sheet_to_json(ws));
    }, 0);
  });
  if (!json || json.length === 0) throw new Error('El archivo Excel está vacío.');

  const registros = [];
  for (const row of json) {
    const nombre = (row.Nombre || row.nombre)?.toString().trim();
    const precio = parseFloat(row.Precio || row.precio);
    const stock = parseInt(row.Stock || row.stock, 10);
    const precio_ofertaStr = row['Precio Oferta'] || row.precio_oferta;
    const precio_oferta = precio_ofertaStr ? parseFloat(precio_ofertaStr) : null;

    // Saltar filas sin el formato adecuado
    if (!nombre || isNaN(precio) || isNaN(stock)) continue;

    registros.push({ nombre, precio, stock, precio_oferta });
  }

  return registros;
}
