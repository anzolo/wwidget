const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//определение схемы
let WidgetSchema = new Schema(
  {
    align: { type: String, required: true },
    city: { type: String, required: true },
    days: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);

// установить параметр createdAt равным текущему времени
WidgetSchema.pre('save', next => {
  now = new Date();
  if(!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

//Экспорт модели для последующего использования.
module.exports = mongoose.model('widget', WidgetSchema);