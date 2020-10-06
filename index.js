// const dns = require('dns');

// dns.resolveMx('gmail.com', (err, mess) => {
//   console.log(err, mess);
// })

const Telnet  = require('telnet-client');

async function run() {
  let connection = new Telnet()

  // these parameters are just examples and most probably won't work for your use-case.
  let params = {
    host: 'gmail-smtp-in.l.google.com',
    port: 25,
    shellPrompt: / .+/, // or negotiationMandatory: false
    timeout: 1500
  }

  try {
    await connection.connect(params)
  } catch(error) {
    // handle the throw (timeout)
  }

  let res = await connection.send('helo test.com')
  res = await connection.send('mail from: <me@example.com>')
  res = await connection.send('rcpt to: <123yegoroff33@gmail.com>')
  console.log('async result:', res)
}

run()