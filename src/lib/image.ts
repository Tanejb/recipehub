// Fotografijo pred nalaganjem zmanjšamo in pretvorimo v WebP, da je stran hitra
// (telefonska fotografija ima pogosto 4–8 MB, po obdelavi okoli 100 KB).

export const MAX_UPLOAD_MB = 10
const MAX_WIDTH = 1200
const RATIO = 4 / 3

/** Obreže na razmerje 4:3 (kot ostale fotografije) in pomanjša na največ 1200 px širine. */
export async function prepareImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  let sw = bitmap.width
  let sh = bitmap.height
  if (sw / sh > RATIO) sw = Math.round(sh * RATIO)
  else sh = Math.round(sw / RATIO)
  const sx = Math.round((bitmap.width - sw) / 2)
  const sy = Math.round((bitmap.height - sh) / 2)

  const width = Math.min(MAX_WIDTH, sw)
  const height = Math.round(width / RATIO)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height)
  bitmap.close()

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Pretvorba slike ni uspela'))), 'image/webp', 0.8),
  )
}
