import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'mailingprueba61@gmail.com',
      pass: 'bgrroqifncmvzxzk',
    },
  });
  
  export default transport;