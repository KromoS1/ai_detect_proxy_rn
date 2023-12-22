export const destination = (req, _, cb) => {
  cb(null, `./assets/template/${req.query.tmpl}`); // Путь для сохранения файлов
};

export const filename = (_, file, cb) => {
  cb(null, file.originalname);
};

export const fileFilter = (_, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png']; // Разрешенные MIME-типы файлов
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый формат файла'), false);
  }
};
