export const getFileName = (path?: string) => {
  if (!path) {
    return '';
  }
  try {
    const url = new URL(path);
    const decodedPathname = decodeURIComponent(url.pathname);
    return decodedPathname.split('/').pop() || 'File không rõ tên';
  } catch (e) {
    return path.split('/').pop() || 'File không rõ tên';
  }
};
