type HandleDownloadProps = {
  file?: Buffer;
  fileName: string;
};

export function isOverflowing(element: HTMLElement, dimension: 'height' | 'width' = 'height') {
  if (dimension === 'height') {
    return element.scrollHeight > element.offsetHeight;
  } else {
    return element.scrollWidth > element.offsetWidth;
  }
}

export function getDownloadFile({ file, fileName }: HandleDownloadProps) {
  if (!file) return;
  const urlBlob = window.URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = urlBlob;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
