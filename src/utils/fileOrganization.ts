
export const organizeFilesInColumns = (files: File[]) => {
  const filesPerColumn = 5;
  const numColumns = Math.ceil(files.length / filesPerColumn);
  const columns = [];
  
  for (let col = 0; col < numColumns; col++) {
    const columnFiles = [];
    for (let row = 0; row < filesPerColumn; row++) {
      const fileIndex = col * filesPerColumn + row;
      if (fileIndex < files.length) {
        columnFiles.push(files[fileIndex]);
      }
    }
    columns.push(columnFiles);
  }
  
  return columns;
};
