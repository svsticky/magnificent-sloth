const { globalShortcut } = require('electron');
const { CardOn, ClearBasket } = require('./handle_state');

module.exports.HandleAuthDev = async (win) => {
  globalShortcut.register('Ctrl+1', () => {
    CardOn(win, process.env.TEST_UUID);
  });

  globalShortcut.register('Ctrl+2', () => {
    ClearBasket();
    win.loadFile('src/views/idle/idle.html')
  });

  globalShortcut.register('Ctrl+3', () => {
    ClearBasket();
    win.loadFile('src/views/register/register.html')
  });
};
