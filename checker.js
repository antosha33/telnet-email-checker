const EmailChecker = require('./index');
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const emailScheme = new Schema({
  email: String,
  isExist: { type: Boolean, default: false },
}, { strict: false })

const Email = model('Emails', emailScheme);


mongoose.connect('mongodb+srv://brokkoly:brokkoly1122@cluster0.v46qi.gcp.mongodb.net/courses?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  },
  async () => {

    let docs = await Email.find({});
    const emailChecker = new EmailChecker(['gmail.com', 'mail.ru', 'yandex.ru']);

    const filteredDocs = docs.filter((doc) => {
      console.log(doc);
      return doc.isCHecked
    });

    console.log(filteredDocs);

    // for (let doc of docs) {

    //   const email = doc.email;

    //   let res = await emailChecker.checkEmail({ email: `${email}@gmail.com` });

    //   if (res) {
    //     await Email.findByIdAndUpdate(
    //       doc._id,
    //       {
    //         email: `${email}@gmail.com`,
    //         isExist: true,
    //         isCHecked: true
    //       }
    //     )
    //     continue;
    //   }

    //   res = await emailChecker.checkEmail({ email: `${email}@mail.ru` });

    //   if (res) {
    //     await Email.findByIdAndUpdate(
    //       doc._id,
    //       {
    //         email: `${email}@mail.ru`,
    //         isExist: true,
    //         isCHecked: true
    //       }
    //     )
    //     continue;
    //   }

    //   res = await emailChecker.checkEmail({ email: `${email}@yandex.ru` });

    //   if (res) {
    //     await Email.findByIdAndUpdate(
    //       doc._id,
    //       {
    //         email: `${email}@yandex.ru`,
    //         isExist: true,
    //         isCHecked: true
    //       }
    //     )
    //     continue;
    //   }

    //   await Email.findByIdAndUpdate(
    //     doc._id,
    //     {
    //       email: email,
    //       isExist: false,
    //       isCHecked: true
    //     })
    // }
  })