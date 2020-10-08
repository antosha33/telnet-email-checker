const { Resolver } = require('dns').promises;
const resolver = new Resolver();
const Telnet = require('telnet-client');
const fs = require('fs');
module.exports = class EmailChecker {

  constructor(mailServers) {
    this.servers = mailServers;
    this.mailHosts = {};
    this.getMailHosts();
    this.telnet = new Telnet();
  }

  getMailHosts() {
    this.servers.forEach((mailServer) => {
      this.mailHosts[mailServer] = async () => await resolver.resolveMx(mailServer);
    })
    return this.mailHosts;
  }

  async checkEmail({
    email,
    host,
    port = 25
  }) {

    const regExp = new RegExp(`(?<=@).*`);
    const domain = email.match(regExp)[0];


    if (!host) {
      const res = await this.mailHosts[domain]();
      host = res[0].exchange;
    }

    try {
      await this.telnet.connect({
        host,
        port,
        shellPrompt: /.+/,
        timeout: 1500
      })
    } catch (e) {
      console.log(e);
      return e;
    }

    try {
      let res;
      res = await this.telnet.send('helo example.com')
      res = await this.telnet.send(`mail from: <me@${domain}>`);
      res = await this.telnet.send(`rcpt to: <${email}>`);
      switch (domain) {
        case 'mail.ru':
          res = await this.telnet.send('data');
          res = await this.telnet.send('.')
          if (res.search('invalid mailbox') !== -1) {
            this.telnet.end();
            return false;
          } else {
            this.telnet.end();
            return true;
          }
        case 'yandex.ru':
          if (res.search('550') !== -1) {
            await this.telnet.end();
            return false;
          } else {
            await this.telnet.end();
            return true;
          }
        case 'gmail.com':
          if (res.search('550') !== -1) {
            await this.telnet.end();
            return false;
          } else {
            await this.telnet.end();
            return true;
          }
      }
    } catch (e) {
      return e;
    }
  }
}