export const fileSizeFormat = size => {
  if (size >= 0 && size < 1024) {
    return size + 'B'
  } else if (size >= 1024 && size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + 'KB'
  } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(1) + 'MB'
  } else if (size >= 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(1) + 'GB'
  } else if (size >= 1024 * 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(1) + 'TB'
  } else {
    return size
  }
}