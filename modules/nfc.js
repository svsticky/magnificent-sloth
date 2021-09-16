const { NFC } = require('nfc-pcsc');
const player = require('play-sound')(opts = {})
const { CardOn, ClearBasket } = require('./handle_state');

module.exports.HandleAuthNFC = async (win) => {
  const nfc = new NFC();
  nfc.on('reader', reader => {
    reader.autoProcessing = false;
    reader.on('card', async card => {
      const apdu = 'FFCA000000';
      const data = Buffer.from(apdu, "hex");
      let uuid = null;

      try {
        const uid = await reader.transmit(data, 12);
        uuid = uid.toString("hex").substring(0, 8).toUpperCase();
      }
      catch (err) {
        console.error(err);
        return;
      }

      player.play('../src/static/audio/hello.mp3', function (err) {
        if (err) throw err
      });

      CardOn(win, uuid);
    });

    reader.on('card.off', card => {
      win.loadFile('src/views/idle/idle.html');
      player.play('src/static/audio/goodbye.mp3', function (err) {
        if (err) throw err
      });
    });

    reader.on('error', err => {
      console.error('reader error', err);
      ClearBasket();
      win.loadFile('src/views/idle/idle.html');
    });

    reader.on('end', () => {
      console.log(reader.name + ' reader disconnected.');
      ClearBasket();
      win.loadFile('src/views/idle/idle.html');
    });
  });

  nfc.on('error', err => {
    console.error(err);
    win.loadFile('src/views/idle/idle.html');
    ClearBasket();
  });
}
